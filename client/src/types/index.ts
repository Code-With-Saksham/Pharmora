export type UserRole = 'CUSTOMER' | 'PHARMACY_OWNER' | 'DELIVERY_PARTNER' | 'ADMIN';

export type AccountStatus = 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED' | 'REJECTED';

export type PharmacyVerificationStatus =
  | 'DRAFT'
  | 'PENDING_VERIFICATION'
  | 'VERIFIED'
  | 'REJECTED'
  | 'SUSPENDED';

export type InventoryStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'UNAVAILABLE';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  phone?: string;
  status: AccountStatus;
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface OperatingHours {
  open: string;
  close: string;
  days: string;
}

export interface PharmacyProfile {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  licenceNumber: string;
  gstNumber?: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  operatingHours?: OperatingHours;
  logoUrl?: string;
  isVerified: boolean;
  isActive: boolean;
  verificationStatus: PharmacyVerificationStatus;
  createdAt: string;
  updatedAt?: string;
}

export type Pharmacy = PharmacyProfile;

export interface DeliveryPartnerProfile {
  id: string;
  userId: string;
  vehicleType: 'TWO_WHEELER' | 'BICYCLE' | 'EV';
  vehicleNumber?: string;
  drivingLicenceNumber?: string;
  isVerified: boolean;
  isAvailable: boolean;
  createdAt: string;
}

export interface MedicineProduct {
  id: string;
  name: string;
  brandName: string;
  genericName: string;
  strength: string;
  dosageForm: string; // 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Cream' | 'Gel' | 'Drops'
  packSize: string;   // e.g. "Strip of 15 tablets"
  manufacturer: string;
  description?: string;
  requiresPrescription: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  isActive?: boolean;
  createdAt: string;
  updatedAt?: string;
}


export interface PharmacyInventoryItem {
  id: string;
  pharmacyId: string;
  productId: string;
  product?: MedicineProduct;
  sellingPrice: number;
  mrp: number;
  stockQuantity: number;
  lowStockThreshold: number;
  status: InventoryStatus;
  batchNumber?: string;
  expiryDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CartItem {
  id: string;
  cartId: string;
  inventoryId: string;
  productId: string;
  quantity: number;
  product: MedicineProduct;
  inventory: {
    id: string;
    sellingPrice: number;
    mrp: number;
    stockQuantity: number;
    status: InventoryStatus;
  };
  pharmacyId: string;
  pharmacyName: string;
}

export interface ShoppingCart {
  id: string;
  customerId: string;
  pharmacyId: string | null;
  pharmacyName: string | null;
  pharmacyAddress?: string;
  items: CartItem[];
  subtotal: number;
  estimatedDeliveryFee: number;
  total: number;
  updatedAt: string;
}

export interface MedicinePharmacyListing {
  pharmacyId: string;
  pharmacyName: string;
  pharmacyCity: string;
  pharmacyPincode: string;
  distanceKm?: number;
  inventoryId: string;
  sellingPrice: number;
  mrp: number;
  stockQuantity: number;
  status: InventoryStatus;
  isVerified: boolean;
  operatingHours?: OperatingHours;
}

export interface MedicineDiscoveryItem {
  product: MedicineProduct;
  minPrice: number;
  maxPrice: number;
  availablePharmacyCount: number;
  listings: MedicinePharmacyListing[];
}

export interface AuthState {
  user: UserProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  isSupabaseConfigured: boolean;
  isDemoMode: boolean;
}
