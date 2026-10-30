-- ==============================================================================
-- PHARMORA — Phase 1 Initial Database Schema & Security Policies
-- ==============================================================================

-- 1. Custom Types & Enums
CREATE TYPE public.app_role AS ENUM (
  'CUSTOMER',
  'PHARMACY_OWNER',
  'DELIVERY_PARTNER',
  'ADMIN'
);

CREATE TYPE public.account_status AS ENUM (
  'ACTIVE',
  'PENDING_VERIFICATION',
  'SUSPENDED',
  'REJECTED'
);

-- 2. Profiles Table (Linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'CUSTOMER'::public.app_role,
  full_name TEXT NOT NULL,
  phone TEXT,
  status public.account_status NOT NULL DEFAULT 'ACTIVE'::public.account_status,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_status ON public.profiles(status);

-- 3. Pharmacies Table (Phase 1 Baseline for Onboarding & Management)
CREATE TABLE public.pharmacies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  licence_number TEXT NOT NULL,
  gst_number TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_pharmacies_owner ON public.pharmacies(owner_id);
CREATE INDEX idx_pharmacies_city ON public.pharmacies(city);
CREATE INDEX idx_pharmacies_verification ON public.pharmacies(is_verified, is_active);

-- 4. Delivery Partners Table (Phase 1 Baseline)
CREATE TABLE public.delivery_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  vehicle_type TEXT NOT NULL DEFAULT 'TWO_WHEELER', -- 'BICYCLE', 'TWO_WHEELER', 'EV'
  vehicle_number TEXT,
  driving_licence_number TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_available BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_delivery_partners_user ON public.delivery_partners(user_id);
CREATE INDEX idx_delivery_partners_status ON public.delivery_partners(is_verified, is_available);

-- 5. Audit Logs Table (Administrative & Security Events)
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_audit_logs_actor ON public.audit_logs(actor_id);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- ==============================================================================
-- 6. Helper Functions & Security Triggers
-- ==============================================================================

-- Helper: Retrieve authenticated user's application role safely
CREATE OR REPLACE FUNCTION public.get_current_role()
RETURNS public.app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Helper: Check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'ADMIN'::public.app_role
  );
$$;

-- Security Guard: Prevent non-admin users from elevating their role or changing verification status
CREATE OR REPLACE FUNCTION public.prevent_self_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- If current user is not an admin, they cannot change their role or status
  IF (OLD.role IS DISTINCT FROM NEW.role) OR (OLD.status IS DISTINCT FROM NEW.status) THEN
    IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'Unauthorized: Only system administrators can modify user roles or account statuses.';
    END IF;
  END IF;

  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_prevent_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_self_role_escalation();

-- Trigger: Automatically create public.profiles upon auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role public.app_role;
  v_full_name TEXT;
  v_phone TEXT;
BEGIN
  -- Extract metadata provided during signup
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'Pharmora User');
  v_phone := NEW.raw_user_meta_data->>'phone';

  -- Safely assign role: public signup can never grant ADMIN.
  -- Only CUSTOMER, PHARMACY_OWNER, DELIVERY_PARTNER may be requested at signup.
  IF NEW.raw_user_meta_data->>'role' = 'PHARMACY_OWNER' THEN
    v_role := 'PHARMACY_OWNER'::public.app_role;
  ELSIF NEW.raw_user_meta_data->>'role' = 'DELIVERY_PARTNER' THEN
    v_role := 'DELIVERY_PARTNER'::public.app_role;
  ELSE
    v_role := 'CUSTOMER'::public.app_role;
  END IF;

  INSERT INTO public.profiles (id, role, full_name, phone, status)
  VALUES (
    NEW.id,
    v_role,
    v_full_name,
    v_phone,
    CASE 
      WHEN v_role = 'CUSTOMER' THEN 'ACTIVE'::public.account_status
      ELSE 'PENDING_VERIFICATION'::public.account_status
    END
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 7. Row Level Security (RLS) Policies
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- --- PROFILES POLICIES ---
-- Users can view their own profile, or admins can view all profiles
CREATE POLICY "Profiles readable by owner or admin"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

-- Users can update only their own profile details (escalation prevented by trigger)
CREATE POLICY "Profiles updatable by owner or admin"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id OR public.is_admin());

-- --- PHARMACIES POLICIES ---
-- Verified pharmacies are visible to everyone (for medicine discovery); owners & admins see all
CREATE POLICY "Pharmacies visible to public if verified or if owner or admin"
  ON public.pharmacies
  FOR SELECT
  USING (
    (is_verified = true AND is_active = true)
    OR auth.uid() = owner_id
    OR public.is_admin()
  );

-- Pharmacy owners can insert their pharmacy registration
CREATE POLICY "Pharmacy owners can create their pharmacy"
  ON public.pharmacies
  FOR INSERT
  WITH CHECK (
    auth.uid() = owner_id
    AND (public.get_current_role() = 'PHARMACY_OWNER'::public.app_role OR public.is_admin())
  );

-- Pharmacy owners can update store details, but cannot self-verify (guarded by check / admin policy)
CREATE POLICY "Pharmacy owners can update own pharmacy"
  ON public.pharmacies
  FOR UPDATE
  USING (auth.uid() = owner_id OR public.is_admin())
  WITH CHECK (
    public.is_admin()
    OR (
      -- If regular owner, they cannot alter verification flags
      is_verified = (SELECT p.is_verified FROM public.pharmacies p WHERE p.id = id)
      AND is_active = (SELECT p.is_active FROM public.pharmacies p WHERE p.id = id)
    )
  );

-- --- DELIVERY PARTNERS POLICIES ---
-- Delivery partners can view their own record; Admins view all
CREATE POLICY "Delivery partner record readable by owner or admin"
  ON public.delivery_partners
  FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- Delivery partners can insert their onboarding profile
CREATE POLICY "Delivery partners can register themselves"
  ON public.delivery_partners
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND (public.get_current_role() = 'DELIVERY_PARTNER'::public.app_role OR public.is_admin())
  );

-- Delivery partners can toggle availability or update vehicle, but cannot self-verify
CREATE POLICY "Delivery partners can update own availability"
  ON public.delivery_partners
  FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (
    public.is_admin()
    OR (
      is_verified = (SELECT dp.is_verified FROM public.delivery_partners dp WHERE dp.id = id)
    )
  );

-- --- AUDIT LOGS POLICIES ---
-- Only administrators can view audit logs
CREATE POLICY "Audit logs readable by admins only"
  ON public.audit_logs
  FOR SELECT
  USING (public.is_admin());

-- System or admins can insert audit logs
CREATE POLICY "Audit logs insertable by authenticated users"
  ON public.audit_logs
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
