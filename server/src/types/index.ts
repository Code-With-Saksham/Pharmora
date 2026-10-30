export type UserRole = 'CUSTOMER' | 'PHARMACY_OWNER' | 'DELIVERY_PARTNER' | 'ADMIN';

export type AccountStatus = 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED' | 'REJECTED';

export type PharmacyVerificationStatus =
  | 'DRAFT'
  | 'PENDING_VERIFICATION'
  | 'VERIFIED'
  | 'REJECTED'
  | 'SUSPENDED';

export type InventoryStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'UNAVAILABLE';

export interface OperatingHours {
  open: string;
  close: string;
  days: string;
}

export interface MedicineProduct {
  id: string;
  name: string;
  brand_name: string;
  generic_name: string;
  strength: string;
  dosage_form: string;
  pack_size: string;
  manufacturer: string;
  description?: string;
  requires_prescription: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at: string;
}

export interface Pharmacy {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  licence_number: string;
  gst_number?: string;
  phone: string;
  email?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  operating_hours?: OperatingHours;
  logo_url?: string;
  is_verified: boolean;
  is_active: boolean;
  verification_status: PharmacyVerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface PharmacyInventory {
  id: string;
  pharmacy_id: string;
  product_id: string;
  selling_price: number;
  mrp: number;
  stock_quantity: number;
  low_stock_threshold: number;
  status: InventoryStatus;
  batch_number?: string;
  expiry_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShoppingCart {
  id: string;
  customer_id: string;
  pharmacy_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ShoppingCartItem {
  id: string;
  cart_id: string;
  inventory_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}
