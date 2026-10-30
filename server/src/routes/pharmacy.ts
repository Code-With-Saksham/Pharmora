import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { supabaseAdmin } from '../config/supabase.js';
import { pharmacies } from '../services/dataStore.js';
import { Pharmacy } from '../types/index.js';

const router = Router();

// Protect all pharmacy routes
router.use(authenticateToken);
router.use(requireRole(['PHARMACY_OWNER', 'ADMIN']));

// GET current owner's pharmacy profile
router.get('/my-pharmacy', async (req: Request, res: Response) => {
  const userId = req.user!.id;

  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('pharmacies')
        .select('*')
        .eq('owner_id', userId)
        .maybeSingle();

      if (error) {
        res.status(500).json({ success: false, error: { message: error.message } });
        return;
      }

      if (!data) {
        res.status(404).json({ success: false, error: { message: 'No pharmacy profile registered for this account.' } });
        return;
      }

      res.status(200).json({ success: true, pharmacy: data });
      return;
    } catch (err: unknown) {
      res.status(500).json({ success: false, error: { message: (err as Error).message } });
      return;
    }
  }

  // Developer Demonstration Mode
  let pharmacy = pharmacies.find((p) => p.owner_id === userId);
  if (!pharmacy) {
    // If testing with standard demo user, return primary demo pharmacy
    pharmacy = pharmacies.find((p) => p.id === 'ph-sanjivani');
  }

  res.status(200).json({
    success: true,
    pharmacy: pharmacy || null,
  });
});

// PUT update pharmacy profile
router.put('/my-pharmacy', async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const {
    name,
    description,
    phone,
    email,
    address_line1,
    address_line2,
    city,
    state,
    pincode,
    latitude,
    longitude,
    operating_hours,
  } = req.body;

  if (!name || !phone || !address_line1 || !city || !pincode) {
    res.status(400).json({
      success: false,
      error: { message: 'Name, contact phone, street address, city, and pincode are required.' },
    });
    return;
  }

  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('pharmacies')
        .update({
          name,
          description,
          phone,
          email,
          address_line1,
          address_line2,
          city,
          state,
          pincode,
          latitude,
          longitude,
          operating_hours,
          updated_at: new Date().toISOString(),
        })
        .eq('owner_id', userId)
        .select()
        .single();

      if (error) {
        res.status(500).json({ success: false, error: { message: error.message } });
        return;
      }

      res.status(200).json({ success: true, pharmacy: data });
      return;
    } catch (err: unknown) {
      res.status(500).json({ success: false, error: { message: (err as Error).message } });
      return;
    }
  }

  // Demo mode update
  let pharmacy = pharmacies.find((p) => p.owner_id === userId) || pharmacies.find((p) => p.id === 'ph-sanjivani');
  if (pharmacy) {
    pharmacy.name = name;
    pharmacy.description = description || pharmacy.description;
    pharmacy.phone = phone;
    pharmacy.email = email || pharmacy.email;
    pharmacy.address_line1 = address_line1;
    pharmacy.address_line2 = address_line2 || pharmacy.address_line2;
    pharmacy.city = city;
    pharmacy.state = state || pharmacy.state;
    pharmacy.pincode = pincode;
    if (latitude) pharmacy.latitude = Number(latitude);
    if (longitude) pharmacy.longitude = Number(longitude);
    if (operating_hours) pharmacy.operating_hours = operating_hours;
    pharmacy.updated_at = new Date().toISOString();
  }

  res.status(200).json({
    success: true,
    pharmacy,
  });
});

// POST submit for verification
router.post('/submit-verification', async (req: Request, res: Response) => {
  const userId = req.user!.id;

  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('pharmacies')
        .update({
          verification_status: 'PENDING_VERIFICATION',
          updated_at: new Date().toISOString(),
        })
        .eq('owner_id', userId)
        .select()
        .single();

      if (error) {
        res.status(500).json({ success: false, error: { message: error.message } });
        return;
      }

      res.status(200).json({ success: true, pharmacy: data, message: 'Pharmacy profile submitted for administrative verification.' });
      return;
    } catch (err: unknown) {
      res.status(500).json({ success: false, error: { message: (err as Error).message } });
      return;
    }
  }

  // Demo mode
  const pharmacy = pharmacies.find((p) => p.owner_id === userId) || pharmacies.find((p) => p.id === 'ph-sanjivani');
  if (pharmacy) {
    pharmacy.verification_status = 'PENDING_VERIFICATION';
    pharmacy.updated_at = new Date().toISOString();
  }

  res.status(200).json({
    success: true,
    pharmacy,
    message: 'Pharmacy profile submitted for administrative verification.',
  });
});

export default router;
