export type UserRole = 'CUSTOMER' | 'PHARMACY_OWNER' | 'DELIVERY_PARTNER' | 'ADMIN';

export type AccountStatus = 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED' | 'REJECTED';

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

export interface PharmacyProfile {
  id: string;
  ownerId: string;
  name: string;
  licenceNumber: string;
  gstNumber?: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

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

export interface AuthState {
  user: UserProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  isSupabaseConfigured: boolean;
  isDemoMode: boolean;
}
