import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase.js';

export interface AuthenticatedUser {
  id: string;
  email?: string;
  role: 'CUSTOMER' | 'PHARMACY_OWNER' | 'DELIVERY_PARTNER' | 'ADMIN';
  full_name: string;
  status: 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED' | 'REJECTED';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: { message: 'Authentication required: missing or malformed Bearer token.' },
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  // Developer Demonstration Mode Support:
  // When live Supabase credentials are not configured or demo tokens are sent
  if (!supabaseAdmin || token.startsWith('demo-token-') || token === 'demo-token') {
    let role: 'CUSTOMER' | 'PHARMACY_OWNER' | 'DELIVERY_PARTNER' | 'ADMIN' = 'CUSTOMER';
    let id = 'usr-demo-customer';
    let full_name = 'Demo Customer';

    if (token.includes('admin')) {
      role = 'ADMIN';
      id = 'usr-demo-admin';
      full_name = 'Demo Administrator';
    } else if (token.includes('pharmacy')) {
      role = 'PHARMACY_OWNER';
      id = 'usr-demo-pharmacy';
      full_name = 'Rajesh Gupta (Pharmacist)';
    } else if (token.includes('partner') || token.includes('delivery')) {
      role = 'DELIVERY_PARTNER';
      id = 'usr-demo-partner';
      full_name = 'Demo Rider';
    }

    req.user = {
      id,
      email: `${role.toLowerCase()}@pharmora.local`,
      role,
      full_name,
      status: 'ACTIVE',
    };

    next();
    return;
  }

  try {
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      res.status(401).json({
        success: false,
        error: { message: 'Invalid or expired session token.' },
      });
      return;
    }

    // Fetch user profile from public.profiles
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, role, full_name, status')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      res.status(403).json({
        success: false,
        error: { message: 'User profile not found or access restricted.' },
      });
      return;
    }

    req.user = {
      id: profile.id,
      email: user.email,
      role: profile.role,
      full_name: profile.full_name,
      status: profile.status,
    };

    next();
  } catch (err) {
    console.error('Authentication verification error:', err);
    res.status(500).json({
      success: false,
      error: { message: 'Internal error verifying authentication.' },
    });
  }
};

