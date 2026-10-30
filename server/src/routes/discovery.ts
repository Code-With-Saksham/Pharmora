import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import {
  medicineProducts,
  pharmacies,
  pharmacyInventories,
  calculateDistanceKm,
} from '../services/dataStore.js';

const router = Router();

// GET /api/discovery/medicines - Search medicines and active local listings
router.get('/medicines', async (req: Request, res: Response) => {
  const query = (req.query.q as string || '').toLowerCase().trim();
  const dosageForm = req.query.dosage_form as string;
  const requiresRx = req.query.requires_prescription !== undefined
    ? req.query.requires_prescription === 'true'
    : undefined;
  const userCity = (req.query.city as string || '').toLowerCase().trim();
  const userPincode = (req.query.pincode as string || '').trim();
  const userLat = req.query.lat ? parseFloat(req.query.lat as string) : undefined;
  const userLng = req.query.lng ? parseFloat(req.query.lng as string) : undefined;

  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 15;

  if (supabaseAdmin) {
    try {
      // Live Supabase query
      let dbQuery = supabaseAdmin
        .from('medicine_products')
        .select(`
          *,
          pharmacy_inventory(
            *,
            pharmacy:pharmacies(*)
          )
        `)
        .eq('status', 'ACTIVE');

      if (query) {
        dbQuery = dbQuery.or(`name.ilike.%${query}%,brand_name.ilike.%${query}%,generic_name.ilike.%${query}%`);
      }
      if (dosageForm) {
        dbQuery = dbQuery.eq('dosage_form', dosageForm);
      }
      if (requiresRx !== undefined) {
        dbQuery = dbQuery.eq('requires_prescription', requiresRx);
      }

      const { data, error } = await dbQuery;

      if (error) {
        res.status(500).json({ success: false, error: { message: error.message } });
        return;
      }

      // Filter listings for verified and active pharmacies only
      const processed = (data || []).map((prod: any) => {
        const verifiedListings = (prod.pharmacy_inventory || []).filter((inv: any) => {
          const pharm = inv.pharmacy;
          if (!pharm || (!pharm.is_verified && pharm.verification_status !== 'VERIFIED') || !pharm.is_active) {
            return false;
          }
          if (inv.status === 'UNAVAILABLE' || inv.stock_quantity <= 0) return false;
          return true;
        }).map((inv: any) => {
          const pharm = inv.pharmacy;
          const dist = calculateDistanceKm(userLat, userLng, pharm.latitude, pharm.longitude);
          return {
            pharmacyId: pharm.id,
            pharmacyName: pharm.name,
            pharmacyCity: pharm.city,
            pharmacyPincode: pharm.pincode,
            distanceKm: dist,
            inventoryId: inv.id,
            sellingPrice: Number(inv.selling_price),
            mrp: Number(inv.mrp),
            stockQuantity: inv.stock_quantity,
            status: inv.status,
            isVerified: true,
            operatingHours: pharm.operating_hours,
          };
        });

        const prices = verifiedListings.map((l: any) => l.sellingPrice);
        const minPrice = prices.length ? Math.min(...prices) : 0;
        const maxPrice = prices.length ? Math.max(...prices) : 0;

        return {
          product: {
            id: prod.id,
            name: prod.name,
            brandName: prod.brand_name,
            genericName: prod.generic_name,
            strength: prod.strength,
            dosageForm: prod.dosage_form,
            packSize: prod.pack_size,
            manufacturer: prod.manufacturer,
            description: prod.description,
            requiresPrescription: prod.requires_prescription,
            status: prod.status,
          },
          minPrice,
          maxPrice,
          availablePharmacyCount: verifiedListings.length,
          listings: verifiedListings,
        };
      });

      const total = processed.length;
      const paginated = processed.slice((page - 1) * limit, page * limit);

      res.status(200).json({
        success: true,
        medicines: paginated,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      });
      return;
    } catch (err: unknown) {
      res.status(500).json({ success: false, error: { message: (err as Error).message } });
      return;
    }
  }

  // Developer Demonstration Mode
  // Verified and active pharmacies
  const verifiedPharmacies = pharmacies.filter((p) => (p.is_verified || p.verification_status === 'VERIFIED') && p.is_active);

  // Filter catalog products
  let matchedProducts = medicineProducts.filter((p) => {
    if (p.status !== 'ACTIVE') return false;
    if (query) {
      const matchName = p.name.toLowerCase().includes(query);
      const matchBrand = p.brand_name.toLowerCase().includes(query);
      const matchGeneric = p.generic_name.toLowerCase().includes(query);
      if (!matchName && !matchBrand && !matchGeneric) return false;
    }
    if (dosageForm && p.dosage_form.toLowerCase() !== dosageForm.toLowerCase()) {
      return false;
    }
    if (requiresRx !== undefined && p.requires_prescription !== requiresRx) {
      return false;
    }
    return true;
  });

  const processed = matchedProducts.map((prod) => {
    // Find all active listings from verified pharmacies
    const listings = pharmacyInventories
      .filter((inv) => {
        if (inv.product_id !== prod.id || !inv.is_active || inv.status === 'UNAVAILABLE' || inv.stock_quantity <= 0) {
          return false;
        }
        const pharm = verifiedPharmacies.find((p) => p.id === inv.pharmacy_id);
        if (!pharm) return false;
        if (userCity && pharm.city.toLowerCase() !== userCity) return false;
        if (userPincode && pharm.pincode !== userPincode) {
          // If pincode specified, allow within pincode or general city
        }
        return true;
      })
      .map((inv) => {
        const pharm = verifiedPharmacies.find((p) => p.id === inv.pharmacy_id)!;
        const dist = calculateDistanceKm(userLat, userLng, pharm.latitude, pharm.longitude);
        return {
          pharmacyId: pharm.id,
          pharmacyName: pharm.name,
          pharmacyCity: pharm.city,
          pharmacyPincode: pharm.pincode,
          distanceKm: dist,
          inventoryId: inv.id,
          sellingPrice: inv.selling_price,
          mrp: inv.mrp,
          stockQuantity: inv.stock_quantity,
          status: inv.status,
          isVerified: true,
          operatingHours: pharm.operating_hours,
        };
      });

    // Sort listings: lowest price or nearest
    listings.sort((a, b) => a.sellingPrice - b.sellingPrice);

    const prices = listings.map((l) => l.sellingPrice);
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 0;

    return {
      product: {
        id: prod.id,
        name: prod.name,
        brandName: prod.brand_name,
        genericName: prod.generic_name,
        strength: prod.strength,
        dosageForm: prod.dosage_form,
        packSize: prod.pack_size,
        manufacturer: prod.manufacturer,
        description: prod.description,
        requiresPrescription: prod.requires_prescription,
        status: prod.status,
      },
      minPrice,
      maxPrice,
      availablePharmacyCount: listings.length,
      listings,
    };
  });

  const total = processed.length;
  const paginated = processed.slice((page - 1) * limit, page * limit);

  res.status(200).json({
    success: true,
    medicines: paginated,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

// GET /api/discovery/medicines/:id - Detailed medicine view with all verified pharmacy offerings
router.get('/medicines/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const userLat = req.query.lat ? parseFloat(req.query.lat as string) : undefined;
  const userLng = req.query.lng ? parseFloat(req.query.lng as string) : undefined;

  const product = medicineProducts.find((p) => p.id === id);
  if (!product) {
    res.status(404).json({ success: false, error: { message: 'Medicine product not found.' } });
    return;
  }

  const verifiedPharmacies = pharmacies.filter(
    (p) => (p.is_verified || p.verification_status === 'VERIFIED') && p.is_active
  );

  const listings = pharmacyInventories
    .filter((inv) => inv.product_id === id && inv.is_active && inv.status !== 'UNAVAILABLE')
    .map((inv) => {
      const pharm = verifiedPharmacies.find((p) => p.id === inv.pharmacy_id);
      if (!pharm) return null;
      const dist = calculateDistanceKm(userLat, userLng, pharm.latitude, pharm.longitude);
      return {
        pharmacyId: pharm.id,
        pharmacyName: pharm.name,
        pharmacyAddress: `${pharm.address_line1}, ${pharm.city} - ${pharm.pincode}`,
        pharmacyCity: pharm.city,
        pharmacyPincode: pharm.pincode,
        distanceKm: dist,
        inventoryId: inv.id,
        sellingPrice: inv.selling_price,
        mrp: inv.mrp,
        stockQuantity: inv.stock_quantity,
        status: inv.status,
        isVerified: true,
        operatingHours: pharm.operating_hours,
      };
    })
    .filter(Boolean);

  res.status(200).json({
    success: true,
    product: {
      id: product.id,
      name: product.name,
      brandName: product.brand_name,
      genericName: product.generic_name,
      strength: product.strength,
      dosageForm: product.dosage_form,
      packSize: product.pack_size,
      manufacturer: product.manufacturer,
      description: product.description,
      requiresPrescription: product.requires_prescription,
      status: product.status,
    },
    listings,
  });
});

// GET /api/discovery/pharmacies - Discover verified local pharmacies
router.get('/pharmacies', async (req: Request, res: Response) => {
  const city = (req.query.city as string || '').toLowerCase().trim();
  const pincode = (req.query.pincode as string || '').trim();
  const userLat = req.query.lat ? parseFloat(req.query.lat as string) : undefined;
  const userLng = req.query.lng ? parseFloat(req.query.lng as string) : undefined;

  let verified = pharmacies.filter((p) => (p.is_verified || p.verification_status === 'VERIFIED') && p.is_active);

  if (city) {
    verified = verified.filter((p) => p.city.toLowerCase() === city);
  }
  if (pincode) {
    verified = verified.filter((p) => p.pincode === pincode);
  }

  const results = verified.map((p) => {
    const dist = calculateDistanceKm(userLat, userLng, p.latitude, p.longitude);
    const invCount = pharmacyInventories.filter(
      (inv) => inv.pharmacy_id === p.id && inv.is_active && inv.stock_quantity > 0
    ).length;

    return {
      id: p.id,
      name: p.name,
      description: p.description,
      licenceNumber: p.licence_number,
      phone: p.phone,
      addressLine1: p.address_line1,
      addressLine2: p.address_line2,
      city: p.city,
      state: p.state,
      pincode: p.pincode,
      operatingHours: p.operating_hours,
      distanceKm: dist,
      activeMedicineCount: invCount,
      isVerified: true,
    };
  });

  if (userLat !== undefined && userLng !== undefined) {
    results.sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999));
  }

  res.status(200).json({
    success: true,
    pharmacies: results,
  });
});

export default router;
