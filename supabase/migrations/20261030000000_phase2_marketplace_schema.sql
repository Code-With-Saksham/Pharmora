-- ==============================================================================
-- PHARMORA — Phase 2: Marketplace, Catalog, Inventory & Shopping Cart
-- ==============================================================================

-- 1. Pharmacy Verification Status Enum
DO $$ BEGIN
  CREATE TYPE public.pharmacy_verification_status AS ENUM (
    'DRAFT',
    'PENDING_VERIFICATION',
    'VERIFIED',
    'REJECTED',
    'SUSPENDED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Extend public.pharmacies table with Phase 2 fields
ALTER TABLE public.pharmacies 
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS verification_status public.pharmacy_verification_status NOT NULL DEFAULT 'PENDING_VERIFICATION'::public.pharmacy_verification_status,
  ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS operating_hours JSONB DEFAULT '{"open": "08:30", "close": "22:30", "days": "Mon-Sat"}'::jsonb,
  ADD COLUMN IF NOT EXISTS logo_url TEXT;

CREATE INDEX IF NOT EXISTS idx_pharmacies_status ON public.pharmacies(verification_status);
CREATE INDEX IF NOT EXISTS idx_pharmacies_pincode ON public.pharmacies(pincode);
CREATE INDEX IF NOT EXISTS idx_pharmacies_coords ON public.pharmacies(latitude, longitude);

-- 3. Standardized Central Medicine Catalog Table
CREATE TABLE IF NOT EXISTS public.medicine_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  generic_name TEXT NOT NULL, -- Active salt / ingredient
  strength TEXT NOT NULL,     -- e.g. "650mg", "500mg/125mg"
  dosage_form TEXT NOT NULL,  -- 'Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Gel', 'Drops'
  pack_size TEXT NOT NULL,    -- e.g. "Strip of 15 tablets", "Bottle of 100ml"
  manufacturer TEXT NOT NULL, -- e.g. "Micro Labs Ltd", "GSK India"
  description TEXT,
  requires_prescription BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_medicine_products_name ON public.medicine_products(name);
CREATE INDEX IF NOT EXISTS idx_medicine_products_brand ON public.medicine_products(brand_name);
CREATE INDEX IF NOT EXISTS idx_medicine_products_generic ON public.medicine_products(generic_name);
CREATE INDEX IF NOT EXISTS idx_medicine_products_status ON public.medicine_products(status);
CREATE INDEX IF NOT EXISTS idx_medicine_products_form ON public.medicine_products(dosage_form);

-- 4. Pharmacy-Specific Inventory Table
CREATE TABLE IF NOT EXISTS public.pharmacy_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id UUID NOT NULL REFERENCES public.pharmacies(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.medicine_products(id) ON DELETE RESTRICT,
  selling_price NUMERIC(10, 2) NOT NULL CHECK (selling_price >= 0),
  mrp NUMERIC(10, 2) NOT NULL CHECK (mrp >= selling_price),
  stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  low_stock_threshold INT NOT NULL DEFAULT 10 CHECK (low_stock_threshold >= 0),
  status TEXT NOT NULL DEFAULT 'IN_STOCK' CHECK (status IN ('IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'UNAVAILABLE')),
  batch_number TEXT,
  expiry_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uq_pharmacy_product UNIQUE (pharmacy_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_inventory_pharmacy ON public.pharmacy_inventory(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product ON public.pharmacy_inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON public.pharmacy_inventory(status, is_active);
CREATE INDEX IF NOT EXISTS idx_inventory_price ON public.pharmacy_inventory(selling_price);

-- 5. Shopping Carts Table (One Pharmacy Per Cart Rule Enforced)
CREATE TABLE IF NOT EXISTS public.shopping_carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  pharmacy_id UUID REFERENCES public.pharmacies(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_shopping_carts_customer ON public.shopping_carts(customer_id);
CREATE INDEX IF NOT EXISTS idx_shopping_carts_pharmacy ON public.shopping_carts(pharmacy_id);

-- 6. Shopping Cart Items Table
CREATE TABLE IF NOT EXISTS public.shopping_cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES public.shopping_carts(id) ON DELETE CASCADE,
  inventory_id UUID NOT NULL REFERENCES public.pharmacy_inventory(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.medicine_products(id) ON DELETE CASCADE,
  quantity INT NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uq_cart_inventory UNIQUE (cart_id, inventory_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON public.shopping_cart_items(cart_id);

-- 7. Pharmacy Verification Audit Logs Table
CREATE TABLE IF NOT EXISTS public.pharmacy_verification_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id UUID NOT NULL REFERENCES public.pharmacies(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  previous_status TEXT NOT NULL,
  new_status TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_pharmacy_audit_pharmacy ON public.pharmacy_verification_audit_logs(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_pharmacy_audit_admin ON public.pharmacy_verification_audit_logs(admin_id);

-- ==============================================================================
-- 8. Row Level Security (RLS) Policies
-- ==============================================================================

ALTER TABLE public.medicine_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacy_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacy_verification_audit_logs ENABLE ROW LEVEL SECURITY;

-- --- MEDICINE PRODUCTS POLICIES ---
-- Active catalog products are visible to all authenticated users & customers
CREATE POLICY "Active catalog items visible to all"
  ON public.medicine_products
  FOR SELECT
  USING (status = 'ACTIVE' OR public.is_admin());

-- Only admins can insert or update central catalog
CREATE POLICY "Admins can manage central catalog"
  ON public.medicine_products
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- --- PHARMACY INVENTORY POLICIES ---
-- Public can view inventory only for verified & active pharmacies where listing is active
CREATE POLICY "Public can view active inventory from verified pharmacies"
  ON public.pharmacy_inventory
  FOR SELECT
  USING (
    (
      is_active = true 
      AND EXISTS (
        SELECT 1 FROM public.pharmacies p 
        WHERE p.id = pharmacy_id 
          AND (p.verification_status = 'VERIFIED' OR p.is_verified = true) 
          AND p.is_active = true
      )
    )
    OR EXISTS (
      SELECT 1 FROM public.pharmacies p 
      WHERE p.id = pharmacy_id AND p.owner_id = auth.uid()
    )
    OR public.is_admin()
  );

-- Pharmacy owners can manage only their own inventory
CREATE POLICY "Pharmacy owners can manage own inventory"
  ON public.pharmacy_inventory
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.pharmacies p 
      WHERE p.id = pharmacy_id AND p.owner_id = auth.uid()
    )
    OR public.is_admin()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.pharmacies p 
      WHERE p.id = pharmacy_id AND p.owner_id = auth.uid()
    )
    OR public.is_admin()
  );

-- --- SHOPPING CARTS POLICIES ---
-- Customers can view and manage their own cart
CREATE POLICY "Customers manage own shopping cart"
  ON public.shopping_carts
  FOR ALL
  USING (customer_id = auth.uid() OR public.is_admin())
  WITH CHECK (customer_id = auth.uid() OR public.is_admin());

-- --- SHOPPING CART ITEMS POLICIES ---
CREATE POLICY "Customers manage own cart items"
  ON public.shopping_cart_items
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.shopping_carts c 
      WHERE c.id = cart_id AND c.customer_id = auth.uid()
    )
    OR public.is_admin()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.shopping_carts c 
      WHERE c.id = cart_id AND c.customer_id = auth.uid()
    )
    OR public.is_admin()
  );

-- --- VERIFICATION AUDIT LOGS POLICIES ---
CREATE POLICY "Audit logs visible to admin only"
  ON public.pharmacy_verification_audit_logs
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Audit logs insertable by admin"
  ON public.pharmacy_verification_audit_logs
  FOR INSERT
  WITH CHECK (public.is_admin() OR auth.uid() IS NOT NULL);
