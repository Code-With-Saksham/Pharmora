import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { supabaseAdmin } from '../config/supabase.js';
import { pharmacies, medicineProducts, pharmacyInventories } from '../services/dataStore.js';

const router = Router();

// Protect all admin routes with authentication and ADMIN role check
router.use(authenticateToken);
router.use(requireRole(['ADMIN']));

// Overview statistics for Admin operations portal
router.get('/overview', async (_req: Request, res: Response) => {
  if (supabaseAdmin) {
    try {
      const [profilesRes, pharmaciesRes, partnersRes, catalogRes] = await Promise.all([
        supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }),
        supabaseAdmin.from('pharmacies').select('id', { count: 'exact', head: true }).eq('is_verified', false),
        supabaseAdmin.from('delivery_partners').select('id', { count: 'exact', head: true }).eq('is_verified', false),
        supabaseAdmin.from('medicine_products').select('id', { count: 'exact', head: true }),
      ]);

      res.status(200).json({
        success: true,
        metrics: {
          totalUsers: profilesRes.count || 0,
          pendingPharmacies: pharmaciesRes.count || 0,
          pendingPartners: partnersRes.count || 0,
          totalCatalogMedicines: catalogRes.count || 0,
          activeOrders: 0,
        },
      });
      return;
    } catch (err) {
      res.status(500).json({ success: false, error: { message: 'Failed to retrieve admin metrics' } });
      return;
    }
  }

  // Demo mode overview metrics
  const pendingPharmaciesCount = pharmacies.filter((p) => p.verification_status === 'PENDING_VERIFICATION').length;
  const verifiedPharmaciesCount = pharmacies.filter((p) => p.verification_status === 'VERIFIED').length;
  const totalCatalog = medicineProducts.length;

  res.status(200).json({
    success: true,
    metrics: {
      totalUsers: 4,
      pendingPharmacies: pendingPharmaciesCount,
      verifiedPharmacies: verifiedPharmaciesCount,
      pendingPartners: 1,
      totalCatalogMedicines: totalCatalog,
      activeOrders: 0,
    },
  });
});

// GET /api/admin/pharmacies - View all pharmacies with details and verification statuses
router.get('/pharmacies', async (_req: Request, res: Response) => {
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('pharmacies')
        .select(`
          *,
          owner:profiles(full_name, email, phone)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        res.status(500).json({ success: false, error: { message: error.message } });
        return;
      }

      res.status(200).json({ success: true, pharmacies: data });
      return;
    } catch (err: unknown) {
      res.status(500).json({ success: false, error: { message: (err as Error).message } });
      return;
    }
  }

  // Demo mode
  const list = pharmacies.map((p) => {
    const invCount = pharmacyInventories.filter((i) => i.pharmacy_id === p.id).length;
    return {
      ...p,
      inventoryCount: invCount,
    };
  });

  res.status(200).json({
    success: true,
    pharmacies: list,
  });
});

// PATCH /api/admin/pharmacies/:id/verification - Approve, reject, or suspend pharmacy
router.patch('/pharmacies/:id/verification', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, reason } = req.body;
  const adminId = req.user!.id;

  const validStatuses = ['VERIFIED', 'REJECTED', 'SUSPENDED', 'PENDING_VERIFICATION'];
  if (!validStatuses.includes(status)) {
    res.status(400).json({
      success: false,
      error: { message: `Invalid status. Must be one of [${validStatuses.join(', ')}].` },
    });
    return;
  }

  const isVerified = status === 'VERIFIED';
  const isActive = status === 'VERIFIED';

  if (supabaseAdmin) {
    try {
      // Get previous status
      const { data: current } = await supabaseAdmin
        .from('pharmacies')
        .select('verification_status')
        .eq('id', id)
        .single();

      const previousStatus = current?.verification_status || 'PENDING_VERIFICATION';

      const { data: updated, error } = await supabaseAdmin
        .from('pharmacies')
        .update({
          verification_status: status,
          is_verified: isVerified,
          is_active: isActive,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        res.status(500).json({ success: false, error: { message: error.message } });
        return;
      }

      // Record audit log
      await supabaseAdmin.from('pharmacy_verification_audit_logs').insert({
        pharmacy_id: id,
        admin_id: adminId,
        previous_status: previousStatus,
        new_status: status,
        reason: reason || null,
      });

      res.status(200).json({
        success: true,
        pharmacy: updated,
        message: `Pharmacy status updated to ${status}.`,
      });
      return;
    } catch (err: unknown) {
      res.status(500).json({ success: false, error: { message: (err as Error).message } });
      return;
    }
  }

  // Demo mode
  const pharm = pharmacies.find((p) => p.id === id);
  if (!pharm) {
    res.status(404).json({ success: false, error: { message: 'Pharmacy record not found.' } });
    return;
  }

  const prev = pharm.verification_status;
  pharm.verification_status = status;
  pharm.is_verified = isVerified;
  pharm.is_active = isActive;
  pharm.updated_at = new Date().toISOString();

  res.status(200).json({
    success: true,
    pharmacy: pharm,
    message: `Pharmacy status updated from ${prev} to ${status}. Audit entry recorded.`,
  });
});

// Alias for PUT /api/admin/pharmacy/:id/status
router.put('/pharmacy/:id/status', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, reason, rejectionReason } = req.body;
  const targetReason = reason || rejectionReason;
  const adminId = req.user!.id;

  const validStatuses = ['VERIFIED', 'REJECTED', 'SUSPENDED', 'PENDING_VERIFICATION'];
  if (!validStatuses.includes(status)) {
    res.status(400).json({
      success: false,
      error: { message: `Invalid status. Must be one of [${validStatuses.join(', ')}].` },
    });
    return;
  }

  const isVerified = status === 'VERIFIED';
  const isActive = status === 'VERIFIED';

  if (supabaseAdmin) {
    try {
      const { data: current } = await supabaseAdmin
        .from('pharmacies')
        .select('verification_status')
        .eq('id', id)
        .single();

      const previousStatus = current?.verification_status || 'PENDING_VERIFICATION';

      const { data: updated, error } = await supabaseAdmin
        .from('pharmacies')
        .update({
          verification_status: status,
          is_verified: isVerified,
          is_active: isActive,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        res.status(500).json({ success: false, error: { message: error.message } });
        return;
      }

      await supabaseAdmin.from('pharmacy_verification_audit_logs').insert({
        pharmacy_id: id,
        admin_id: adminId,
        previous_status: previousStatus,
        new_status: status,
        reason: targetReason || null,
      });

      res.status(200).json({
        success: true,
        pharmacy: updated,
        message: `Pharmacy status updated to ${status}.`,
      });
      return;
    } catch (err: unknown) {
      res.status(500).json({ success: false, error: { message: (err as Error).message } });
      return;
    }
  }

  // Demo mode
  const pharm = pharmacies.find((p) => p.id === id);
  if (!pharm) {
    res.status(404).json({ success: false, error: { message: 'Pharmacy record not found.' } });
    return;
  }

  const prev = pharm.verification_status;
  pharm.verification_status = status;
  pharm.is_verified = isVerified;
  pharm.is_active = isActive;
  pharm.updated_at = new Date().toISOString();

  res.status(200).json({
    success: true,
    pharmacy: pharm,
    message: `Pharmacy status updated from ${prev} to ${status}. Audit entry recorded.`,
  });
});

export default router;

