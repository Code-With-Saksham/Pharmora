import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { supabaseAdmin } from '../config/supabase.js';
import { medicineProducts } from '../services/dataStore.js';
import { MedicineProduct } from '../types/index.js';

const router = Router();

// GET all catalog medicines (search, filter, pagination)
router.get('/', async (req: Request, res: Response) => {
  const query = (req.query.q as string || '').toLowerCase().trim();
  const dosageForm = req.query.dosage_form as string;
  const requiresRx = req.query.requires_prescription !== undefined 
    ? req.query.requires_prescription === 'true' 
    : undefined;
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 20;

  if (supabaseAdmin) {
    try {
      let dbQuery = supabaseAdmin
        .from('medicine_products')
        .select('*', { count: 'exact' });

      if (query) {
        dbQuery = dbQuery.or(`name.ilike.%${query}%,brand_name.ilike.%${query}%,generic_name.ilike.%${query}%`);
      }
      if (dosageForm) {
        dbQuery = dbQuery.eq('dosage_form', dosageForm);
      }
      if (requiresRx !== undefined) {
        dbQuery = dbQuery.eq('requires_prescription', requiresRx);
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      const { data, count, error } = await dbQuery.range(from, to).order('name', { ascending: true });

      if (error) {
        res.status(500).json({ success: false, error: { message: error.message } });
        return;
      }

      res.status(200).json({
        success: true,
        products: data,
        pagination: {
          total: count || 0,
          page,
          limit,
          totalPages: Math.ceil((count || 0) / limit),
        },
      });
      return;
    } catch (err: unknown) {
      res.status(500).json({ success: false, error: { message: (err as Error).message } });
      return;
    }
  }

  // Developer Demonstration Mode
  let results = medicineProducts.filter((p) => {
    if (p.status !== 'ACTIVE' && req.user?.role !== 'ADMIN') return false;
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

  const total = results.length;
  const paginated = results.slice((page - 1) * limit, page * limit);

  res.status(200).json({
    success: true,
    products: paginated,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

// GET single catalog item
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('medicine_products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error || !data) {
        res.status(404).json({ success: false, error: { message: 'Medicine product not found in central catalog.' } });
        return;
      }

      res.status(200).json({ success: true, product: data });
      return;
    } catch (err: unknown) {
      res.status(500).json({ success: false, error: { message: (err as Error).message } });
      return;
    }
  }

  const product = medicineProducts.find((p) => p.id === id);
  if (!product) {
    res.status(404).json({ success: false, error: { message: 'Medicine product not found in central catalog.' } });
    return;
  }

  res.status(200).json({ success: true, product });
});

// ADMIN ONLY: Add new standardized medicine to catalog
router.post('/', authenticateToken, requireRole(['ADMIN']), async (req: Request, res: Response) => {
  const {
    name,
    brand_name,
    generic_name,
    strength,
    dosage_form,
    pack_size,
    manufacturer,
    description,
    requires_prescription,
  } = req.body;

  if (!name || !brand_name || !generic_name || !strength || !dosage_form || !pack_size || !manufacturer) {
    res.status(400).json({
      success: false,
      error: { message: 'All formulation fields (name, brand, generic, strength, dosage form, pack size, manufacturer) are required.' },
    });
    return;
  }

  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('medicine_products')
        .insert({
          name,
          brand_name,
          generic_name,
          strength,
          dosage_form,
          pack_size,
          manufacturer,
          description,
          requires_prescription: Boolean(requires_prescription),
          status: 'ACTIVE',
        })
        .select()
        .single();

      if (error) {
        res.status(500).json({ success: false, error: { message: error.message } });
        return;
      }

      res.status(201).json({ success: true, product: data });
      return;
    } catch (err: unknown) {
      res.status(500).json({ success: false, error: { message: (err as Error).message } });
      return;
    }
  }

  // Demo Mode
  const newProduct: MedicineProduct = {
    id: `prod-${Date.now()}`,
    name,
    brand_name,
    generic_name,
    strength,
    dosage_form,
    pack_size,
    manufacturer,
    description: description || '',
    requires_prescription: Boolean(requires_prescription),
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  medicineProducts.unshift(newProduct);
  res.status(201).json({ success: true, product: newProduct });
});

// ADMIN ONLY: Edit medicine product
router.put('/:id', authenticateToken, requireRole(['ADMIN']), async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('medicine_products')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        res.status(500).json({ success: false, error: { message: error.message } });
        return;
      }

      res.status(200).json({ success: true, product: data });
      return;
    } catch (err: unknown) {
      res.status(500).json({ success: false, error: { message: (err as Error).message } });
      return;
    }
  }

  const idx = medicineProducts.findIndex((p) => p.id === id);
  if (idx === -1) {
    res.status(404).json({ success: false, error: { message: 'Product not found.' } });
    return;
  }

  medicineProducts[idx] = {
    ...medicineProducts[idx],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  res.status(200).json({ success: true, product: medicineProducts[idx] });
});

// ADMIN ONLY: Toggle status
router.patch('/:id/status', authenticateToken, requireRole(['ADMIN']), async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (status !== 'ACTIVE' && status !== 'INACTIVE') {
    res.status(400).json({ success: false, error: { message: 'Status must be ACTIVE or INACTIVE.' } });
    return;
  }

  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('medicine_products')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        res.status(500).json({ success: false, error: { message: error.message } });
        return;
      }

      res.status(200).json({ success: true, product: data });
      return;
    } catch (err: unknown) {
      res.status(500).json({ success: false, error: { message: (err as Error).message } });
      return;
    }
  }

  const product = medicineProducts.find((p) => p.id === id);
  if (!product) {
    res.status(404).json({ success: false, error: { message: 'Product not found.' } });
    return;
  }

  product.status = status;
  product.updated_at = new Date().toISOString();

  res.status(200).json({ success: true, product });
});

export default router;
