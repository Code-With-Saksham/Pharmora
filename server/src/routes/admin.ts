import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { supabaseAdmin } from '../config/supabase.js';

const router = Router();

// Protect all admin routes with authentication and ADMIN role check
router.use(authenticateToken);
router.use(requireRole(['ADMIN']));

// Overview statistics shell for Admin portal
router.get('/overview', async (_req: Request, res: Response) => {
  if (!supabaseAdmin) {
    res.status(200).json({
      success: true,
      message: 'Supabase unconfigured; returning Phase 1 baseline structure',
      metrics: {
        totalUsers: 0,
        pendingPharmacies: 0,
        pendingPartners: 0,
        activeOrders: 0,
      },
    });
    return;
  }

  try {
    const [profilesRes, pharmaciesRes, partnersRes] = await Promise.all([
      supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('pharmacies').select('id', { count: 'exact', head: true }).eq('is_verified', false),
      supabaseAdmin.from('delivery_partners').select('id', { count: 'exact', head: true }).eq('is_verified', false),
    ]);

    res.status(200).json({
      success: true,
      metrics: {
        totalUsers: profilesRes.count || 0,
        pendingPharmacies: pharmaciesRes.count || 0,
        pendingPartners: partnersRes.count || 0,
        activeOrders: 0,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to retrieve admin metrics' },
    });
  }
});

export default router;
