import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole, AccountStatus } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  isSupabaseConfigured: boolean;
  isDemoMode: boolean;
  login: (email: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    email: string;
    fullName: string;
    role: UserRole;
    phone?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  switchDemoRole: (newRole: UserRole) => void;
}

const DEMO_PROFILES: Record<UserRole, UserProfile> = {
  CUSTOMER: {
    id: 'demo-customer-uuid',
    email: 'customer@pharmora.in',
    role: 'CUSTOMER',
    fullName: 'Aarav Sharma',
    phone: '+91 98765 43210',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
  PHARMACY_OWNER: {
    id: 'demo-pharmacy-uuid',
    email: 'owner@sanjivanimedicare.in',
    role: 'PHARMACY_OWNER',
    fullName: 'Rajesh Gupta',
    phone: '+91 98111 22334',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
  DELIVERY_PARTNER: {
    id: 'demo-partner-uuid',
    email: 'delivery@pharmora.in',
    role: 'DELIVERY_PARTNER',
    fullName: 'Vikram Singh',
    phone: '+91 99887 76655',
    status: 'PENDING_VERIFICATION',
    createdAt: new Date().toISOString(),
  },
  ADMIN: {
    id: 'demo-admin-uuid',
    email: 'admin@pharmora.in',
    role: 'ADMIN',
    fullName: 'Priya Iyer (Platform Operations)',
    phone: '+91 91234 56789',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(!isSupabaseConfigured);

  useEffect(() => {
    // If Supabase is configured, use real Supabase session management
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      setIsDemoMode(false);
      const initAuth = async () => {
        try {
          const { data: { session } } = await client.auth.getSession();
          if (session?.user) {
            await fetchUserProfile(session.user.id, session.user.email || '');
          } else {
            setUser(null);
            setRole(null);
          }
        } catch (err) {
          console.error('Failed to get Supabase session:', err);
        } finally {
          setIsLoading(false);
        }
      };

      initAuth();

      const { data: { subscription } } = client.auth.onAuthStateChange(
        async (_event, session) => {
          if (session?.user) {
            await fetchUserProfile(session.user.id, session.user.email || '');
          } else {
            setUser(null);
            setRole(null);
          }
          setIsLoading(false);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // In unconfigured / local development demonstration mode
      const savedRole = (localStorage.getItem('pharmora_demo_role') as UserRole) || 'CUSTOMER';
      const demoUser = DEMO_PROFILES[savedRole] || DEMO_PROFILES.CUSTOMER;
      setUser(demoUser);
      setRole(demoUser.role);
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async (userId: string, email: string) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        console.warn('Profile not found in database, creating fallback profile');
        const fallback: UserProfile = {
          id: userId,
          email,
          role: 'CUSTOMER',
          fullName: email.split('@')[0],
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
        };
        setUser(fallback);
        setRole('CUSTOMER');
        return;
      }

      const mapped: UserProfile = {
        id: data.id,
        email,
        role: data.role as UserRole,
        fullName: data.full_name,
        phone: data.phone,
        status: data.status as AccountStatus,
        avatarUrl: data.avatar_url,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setUser(mapped);
      setRole(mapped.role);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const login = async (email: string, targetRole?: UserRole) => {
    if (isSupabaseConfigured && supabase) {
      // Real Supabase signin
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: 'Password123!', // In actual usage, user types password
        });
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true };
      } catch (err: unknown) {
        return { success: false, error: (err as Error).message || 'Failed to sign in' };
      }
    } else {
      // Demo mode login
      const selectedRole = targetRole || (
        email.includes('admin') ? 'ADMIN' :
        email.includes('owner') || email.includes('pharmacy') ? 'PHARMACY_OWNER' :
        email.includes('partner') || email.includes('delivery') ? 'DELIVERY_PARTNER' :
        'CUSTOMER'
      );
      const demoUser = {
        ...DEMO_PROFILES[selectedRole],
        email,
      };
      setUser(demoUser);
      setRole(demoUser.role);
      localStorage.setItem('pharmora_demo_role', demoUser.role);
      return { success: true };
    }
  };

  const register = async (data: {
    email: string;
    fullName: string;
    role: UserRole;
    phone?: string;
  }) => {
    if (data.role === 'ADMIN') {
      return { success: false, error: 'Public registration cannot grant ADMIN access.' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: 'Password123!',
          options: {
            data: {
              full_name: data.fullName,
              role: data.role,
              phone: data.phone,
            },
          },
        });
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true };
      } catch (err: unknown) {
        return { success: false, error: (err as Error).message };
      }
    } else {
      // Demo registration
      const newDemoUser: UserProfile = {
        id: `demo-${Date.now()}`,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
        phone: data.phone,
        status: data.role === 'CUSTOMER' ? 'ACTIVE' : 'PENDING_VERIFICATION',
        createdAt: new Date().toISOString(),
      };
      setUser(newDemoUser);
      setRole(newDemoUser.role);
      localStorage.setItem('pharmora_demo_role', newDemoUser.role);
      return { success: true };
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setRole(null);
    localStorage.removeItem('pharmora_demo_role');
  };

  const resetPassword = async (email: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        return { success: false, message: error.message };
      }
      return { success: true, message: `Password reset link sent to ${email}` };
    } else {
      return {
        success: true,
        message: `(Demo) Password reset email simulated for ${email}. When Supabase is configured, an actual link will be dispatched.`,
      };
    }
  };

  const switchDemoRole = (newRole: UserRole) => {
    const demoUser = DEMO_PROFILES[newRole];
    setUser(demoUser);
    setRole(demoUser.role);
    localStorage.setItem('pharmora_demo_role', newRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoading,
        isSupabaseConfigured,
        isDemoMode,
        login,
        register,
        logout,
        resetPassword,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
