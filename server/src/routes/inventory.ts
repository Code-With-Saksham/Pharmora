import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { supabaseAdmin } from '../config/supabase.js';
import { pharmacyInventories, pharmacies, medicineProducts } from '../services/dataStore.js';
import { PharmacyInventory } from '../types/index.js';

const router = Router();

// Protect all inventory routes
router.use(authenticateToken);
router.use(requireRole(['PHARMACY_OWNER', 'ADMIN']));

// Helper to determine status
function calculateStockStatus(
  quantity: number,
  threshold: number,
  currentStatus: string
): 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'UNAVAILABLE' {
  if (currentStatus === 'UNAVAILABLE') return 'UNAVAILABLE';
  if (quantity <= 0) return 'OUT_OF_STOCK';
  if (quantity <= threshold) return 'LOW_STOCK';
  return 'IN_STOCK';
}

// GET all inventory items for current pharmacy owner
router.get('/', async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const statusFilter = req.query.status as string;
  const query = (req.query.q as string || '').toLowerCase().trim();

  // Find pharmacy owned by user
  let pharmacyId = req.query.pharmacy_id as string;
  if (!pharmacyId) {
    if (supabaseAdmin) {
      const { data: pharm } = await supabaseAdmin
        .from('pharmacies')
        .select('id')
        .eq('owner_id', userId)
        .maybeSingle();
      pharmacyId = pharm?.id;
    } else {
      const pharm = pharmacies.find((p) => p.owner_id === userId) || pharmacies.find((p) => p.id === 'ph-sanjivani');
      pharmacyId = pharm?.id || 'ph-sanjivani';
    }
  }

  if (!pharmacyId) {
    res.status(404).json({ success: false, error: { message: 'Pharmacy profile not found.' } });
    return;
  }

  if (supabaseAdmin) {
    try {
      let dbQuery = supabaseAdmin
        .from('pharmacy_inventory')
        .select(`
          *,
          product:medicine_products(*)
        `)
        .eq('pharmacy_id', pharmacyId);

      if (statusFilter) {
        dbQuery = dbQuery.eq('status', statusFilter);
      }

      const { data, error } = await dbQuery.order('created_at', { ascending: false });

      if (error) {
        res.status(500).json({ success: false, error: { message: error.message } });
        return;
      }

      res.status(200).json({ success: true, inventory: data });
      return;
    } catch (err: unknown) {
      res.status(500).json({ success: false, error: { message: (err as Error).message } });
      return;
    }
  }

  // Demo mode
  let items = pharmacyInventories.filter((inv) => inv.pharmacy_id === pharmacyId);

  // Populate product details
  const populated = items.map((inv) => {
    const product = medicineProducts.find((p) => p.id === inv.product_id);
    return {
      ...inv,
      product,
    };
  });

  // Apply filters
  let filtered = populated.filter((item) => {
    if (statusFilter && item.status !== statusFilter) return false;
    if (query && item.product) {
      const matchName = item.product.name.toLowerCase().includes(query);
      const matchGeneric = item.product.generic_name.toLowerCase().includes(query);
      const matchBrand = item.product.brand_name.toLowerCase().includes(query);
      if (!matchName && !matchGeneric && !matchBrand) return false;
    }
    return true;
  });

  // Calculate summary counts
  const totalCount = items.length;
  const inStockCount = items.filter((i) => i.status === 'IN_STOCK').length;
  const lowStockCount = items.filter((i) => i.status === 'LOW_STOCK').length;
  const outOfStockCount = items.filter((i) => i.status === 'OUT_OF_STOCK').length;
  const unavailableCount = items.filter((i) => i.status === 'UNAVAILABLE').length;

  res.status(200).json({
    success: true,
    inventory: filtered,
    summary: {
      total: totalCount,
      inStock: inStockCount,
      lowStock: lowStockCount,
      outOfStock: outOfStockCount,
      unavailable: unavailableCount,
    },
  });
});

// POST add a catalog medicine to inventory
router.post('/', async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const {
    product_id,
    selling_price,
    mrp,
    stock_quantity,
    low_stock_threshold = 10,
    batch_number,
    expiry_date,
  } = req.body;

  if (!product_id || selling_price === undefined || mrp === undefined || stock_quantity === undefined) {
    res.status(400).json({
      success: false,
      error: { message: 'product_id, selling_price, mrp, and stock_quantity are required.' },
    });
    return;
  }

  const numSelling = Number(selling_price);
  const numMrp = Number(mrp);
  const numStock = parseInt(stock_quantity, 10);
  const numThreshold = parseInt(low_stock_threshold, 10);

  if (numSelling < 0 || numMrp < 0 || numStock < 0 || numThreshold < 0) {
    res.status(400).json({ success: false, error: { message: 'Prices and stock quantities cannot be negative.' } });
    return;
  }

  if (numSelling > numMrp) {
    res.status(400).json({ success: false, error: { message: 'Selling price cannot exceed Maximum Retail Price (MRP).' } });
    return;
  }

  let pharmacyId = req.body.pharmacy_id;
  if (!pharmacyId) {
    if (supabaseAdmin) {
      const { data: pharm } = await supabaseAdmin
        .from('pharmacies')
        .select('id')
        .eq('owner_id', userId)
        .maybeSingle();
      pharmacyId = pharm?.id;
    } else {
      const pharm = pharmacies.find((p) => p.owner_id === userId) || pharmacies.find((p) => p.id === 'ph-sanjivani');
      pharmacyId = pharm?.id || 'ph-sanjivani';
    }
  }

  const initialStatus = calculateStockStatus(numStock, numThreshold, 'IN_STOCK');

  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('pharmacy_inventory')
        .insert({
          pharmacy_id: pharmacyId,
          product_id,
          selling_price: numSelling,
          mrp: numMrp,
          stock_quantity: numStock,
          low_stock_threshold: numThreshold,
          status: initialStatus,
          batch_number,
          expiry_date,
          is_active: true,
        })
        .select(`*, product:medicine_products(*)`)
        .single();

      if (error) {
        if (error.code === '23505') {
          res.status(409).json({ success: false, error: { message: 'This medicine is already listed in your pharmacy inventory.' } });
          return;
        }
        res.status(500).json({ success: false, error: { message: error.message } });
        return;
      }

      res.status(201).json({ success: true, item: data });
      return;
    } catch (err: unknown) {
      res.status(500).json({ success: false, error: { message: (err as Error).message } });
      return;
    }
  }

  // Demo mode
  const existing = pharmacyInventories.find(
    (inv) => inv.pharmacy_id === pharmacyId && inv.product_id === product_id
  );

  if (existing) {
    res.status(409).json({ success: false, error: { message: 'This medicine is already listed in your pharmacy inventory.' } });
    return;
  }

  const newItem: PharmacyInventory = {
    id: `inv-${pharmacyId}-${product_id}`,
    pharmacy_id: pharmacyId,
    product_id,
    selling_price: numSelling,
    mrp: numMrp,
    stock_quantity: numStock,
    low_stock_threshold: numThreshold,
    status: initialStatus,
    batch_number: batch_number || `BATCH-${Date.now().toString().slice(-4)}`,
    expiry_date: expiry_date || '2027-12-31',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  pharmacyInventories.unshift(newItem);
  const product = medicineProducts.find((p) => p.id === product_id);

  res.status(201).json({
    success: true,
    item: { ...newItem, product },
  });
});

// PUT update price, stock, or threshold
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    selling_price,
    mrp,
    stock_quantity,
    low_stock_threshold,
    batch_number,
    expiry_date,
    status,
  } = req.body;

  if (supabaseAdmin) {
    try {
      const updates: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };
      if (selling_price !== undefined) updates.selling_price = Number(selling_price);
      if (mrp !== undefined) updates.mrp = Number(mrp);
      if (stock_quantity !== undefined) updates.stock_quantity = parseInt(stock_quantity, 10);
      if (low_stock_threshold !== undefined) updates.low_stock_threshold = parseInt(low_stock_threshold, 10);
      if (batch_number !== undefined) updates.batch_number = batch_number;
      if (expiry_date !== undefined) updates.expiry_date = expiry_date;

      if (stock_quantity !== undefined || low_stock_threshold !== undefined) {
        updates.status = calculateStockStatus(
          Number(updates.stock_quantity || 0),
          Number(updates.low_stock_threshold || 10),
          status || 'IN_STOCK'
        );
      }

      const { data, error } = await supabaseAdmin
        .from('pharmacy_inventory')
        .update(updates)
        .eq('id', id)
        .select(`*, product:medicine_products(*)`)
        .single();

      if (error) {
        res.status(500).json({ success: false, error: { message: error.message } });
        return;
      }

      res.status(200).json({ success: true, item: data });
      return;
    } catch (err: unknown) {
      res.status(500).json({ success: false, error: { message: (err as Error).message } });
      return;
    }
  }

  // Demo mode
  const idx = pharmacyInventories.findIndex((i) => i.id === id);
  if (idx === -1) {
    res.status(404).json({ success: false, error: { message: 'Inventory record not found.' } });
    return;
  }

  const current = pharmacyInventories[idx];
  const newSelling = selling_price !== undefined ? Number(selling_price) : current.selling_price;
  const newMrp = mrp !== undefined ? Number(mrp) : current.mrp;
  const newStock = stock_quantity !== undefined ? parseInt(stock_quantity, 10) : current.stock_quantity;
  const newThreshold = low_stock_threshold !== undefined ? parseInt(low_stock_threshold, 10) : current.low_stock_threshold;

  if (newSelling > newMrp) {
    res.status(400).json({ success: false, error: { message: 'Selling price cannot exceed Maximum Retail Price (MRP).' } });
    return;
  }

  const updatedStatus = status || calculateStockStatus(newStock, newThreshold, current.status);

  pharmacyInventories[idx] = {
    ...current,
    selling_price: newSelling,
    mrp: newMrp,
    stock_quantity: newStock,
    low_stock_threshold: newThreshold,
    batch_number: batch_number !== undefined ? batch_number : current.batch_number,
    expiry_date: expiry_date !== undefined ? expiry_date : current.expiry_date,
    status: updatedStatus,
    updated_at: new Date().toISOString(),
  };

  const product = medicineProducts.find((p) => p.id === pharmacyInventories[idx].product_id);

  res.status(200).json({
    success: true,
    item: { ...pharmacyInventories[idx], product },
  });
});

// PATCH toggle availability (available / unavailable)
router.patch('/:id/availability', async (req: Request, res: Response) => {
  const { id } = req.params;

  if (supabaseAdmin) {
    try {
      const { data: item } = await supabaseAdmin
        .from('pharmacy_inventory')
        .select('status, stock_quantity, low_stock_threshold')
        .eq('id', id)
        .single();

      if (!item) {
        res.status(404).json({ success: false, error: { message: 'Inventory item not found.' } });
        return;
      }

      const nextStatus = item.status === 'UNAVAILABLE'
        ? calculateStockStatus(item.stock_quantity, item.low_stock_threshold, 'IN_STOCK')
        : 'UNAVAILABLE';

      const { data, error } = await supabaseAdmin
        .from('pharmacy_inventory')
        .update({ status: nextStatus, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select(`*, product:medicine_products(*)`)
        .single();

      if (error) {
        res.status(500).json({ success: false, error: { message: error.message } });
        return;
      }

      res.status(200).json({ success: true, item: data });
      return;
    } catch (err: unknown) {
      res.status(500).json({ success: false, error: { message: (err as Error).message } });
      return;
    }
  }

  const idx = pharmacyInventories.findIndex((i) => i.id === id);
  if (idx === -1) {
    res.status(404).json({ success: false, error: { message: 'Inventory item not found.' } });
    return;
  }

  const current = pharmacyInventories[idx];
  const nextStatus = current.status === 'UNAVAILABLE'
    ? calculateStockStatus(current.stock_quantity, current.low_stock_threshold, 'IN_STOCK')
    : 'UNAVAILABLE';

  pharmacyInventories[idx] = {
    ...current,
    status: nextStatus,
    updated_at: new Date().toISOString(),
  };

  const product = medicineProducts.find((p) => p.id === current.product_id);
  res.status(200).json({ success: true, item: { ...pharmacyInventories[idx], product } });
});

// DELETE remove from inventory
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  if (supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin.from('pharmacy_inventory').delete().eq('id', id);
      if (error) {
        res.status(500).json({ success: false, error: { message: error.message } });
        return;
      }
      res.status(200).json({ success: true, message: 'Item removed from pharmacy inventory.' });
      return;
    } catch (err: unknown) {
      res.status(500).json({ success: false, error: { message: (err as Error).message } });
      return;
    }
  }

  const idx = pharmacyInventories.findIndex((i) => i.id === id);
  if (idx !== -1) {
    pharmacyInventories.splice(idx, 1);
  }

  res.status(200).json({ success: true, message: 'Item removed from pharmacy inventory.' });
});

export default router;
