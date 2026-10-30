import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  shoppingCarts,
  pharmacyInventories,
  pharmacies,
  medicineProducts,
} from '../services/dataStore.js';
import { ShoppingCart, ShoppingCartItem } from '../types/index.js';

const router = Router();

// Protect all cart routes for authenticated users
router.use(authenticateToken);

// Helper to get or initialize a customer cart
function getOrCreateCart(customerId: string): { cart: ShoppingCart; items: ShoppingCartItem[] } {
  let userCart = shoppingCarts.get(customerId);
  if (!userCart) {
    const newCart: ShoppingCart = {
      id: `cart-${customerId}`,
      customer_id: customerId,
      pharmacy_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    userCart = { cart: newCart, items: [] };
    shoppingCarts.set(customerId, userCart);
  }
  return userCart;
}

// GET /api/cart - Retrieve current customer cart with populated details and live stock check
router.get('/', (req: Request, res: Response) => {
  const customerId = req.user!.id;
  const { cart, items } = getOrCreateCart(customerId);

  const pharmacy = cart.pharmacy_id ? pharmacies.find((p) => p.id === cart.pharmacy_id) : null;

  // Populate items and validate stock/prices
  const populatedItems = items.map((cartItem) => {
    const inventory = pharmacyInventories.find((inv) => inv.id === cartItem.inventory_id);
    const product = inventory ? medicineProducts.find((p) => p.id === inventory.product_id) : null;

    let warning: string | undefined = undefined;
    if (!inventory || !inventory.is_active || inventory.status === 'UNAVAILABLE') {
      warning = 'This medicine is currently unavailable at this pharmacy.';
    } else if (inventory.stock_quantity < cartItem.quantity) {
      warning = `Only ${inventory.stock_quantity} available in stock.`;
    }

    const unitPrice = inventory ? inventory.selling_price : 0;
    const mrp = inventory ? inventory.mrp : 0;
    const itemTotal = unitPrice * cartItem.quantity;

    return {
      id: cartItem.id,
      cartId: cart.id,
      inventoryId: cartItem.inventory_id,
      productId: cartItem.product_id,
      quantity: cartItem.quantity,
      unitPrice,
      mrp,
      itemTotal,
      warning,
      product: product
        ? {
            id: product.id,
            name: product.name,
            brandName: product.brand_name,
            genericName: product.generic_name,
            strength: product.strength,
            dosageForm: product.dosage_form,
            packSize: product.pack_size,
            manufacturer: product.manufacturer,
            requiresPrescription: product.requires_prescription,
          }
        : null,
      inventory: inventory
        ? {
            id: inventory.id,
            sellingPrice: inventory.selling_price,
            mrp: inventory.mrp,
            stockQuantity: inventory.stock_quantity,
            status: inventory.status,
          }
        : null,
      pharmacyId: cart.pharmacy_id,
      pharmacyName: pharmacy?.name || '',
    };
  });

  const subtotal = populatedItems.reduce((sum, item) => sum + item.itemTotal, 0);
  const estimatedDeliveryFee = subtotal > 0 && subtotal < 500 ? 30 : 0;
  const total = subtotal + estimatedDeliveryFee;

  res.status(200).json({
    success: true,
    cart: {
      id: cart.id,
      customerId: cart.customer_id,
      pharmacyId: cart.pharmacy_id,
      pharmacyName: pharmacy?.name || null,
      pharmacyAddress: pharmacy ? `${pharmacy.address_line1}, ${pharmacy.city} - ${pharmacy.pincode}` : undefined,
      items: populatedItems,
      subtotal,
      estimatedDeliveryFee,
      total,
      updatedAt: cart.updated_at,
    },
  });
});

// POST /api/cart/items - Add medicine to cart (Enforces One Pharmacy Rule & Stock Limits)
router.post('/items', (req: Request, res: Response) => {
  const customerId = req.user!.id;
  const { inventoryId, quantity = 1, clearExisting = false } = req.body;

  if (!inventoryId || quantity <= 0) {
    res.status(400).json({
      success: false,
      error: { message: 'A valid inventoryId and positive quantity are required.' },
    });
    return;
  }

  // Find inventory listing
  const inventory = pharmacyInventories.find((inv) => inv.id === inventoryId && inv.is_active);
  if (!inventory) {
    res.status(404).json({
      success: false,
      error: { message: 'Medicine listing was not found or is currently inactive.' },
    });
    return;
  }

  if (inventory.status === 'UNAVAILABLE' || inventory.stock_quantity <= 0) {
    res.status(400).json({
      success: false,
      error: { message: 'This medicine is currently out of stock at the selected pharmacy.' },
    });
    return;
  }

  // Find pharmacy
  const targetPharmacy = pharmacies.find(
    (p) => p.id === inventory.pharmacy_id && (p.is_verified || p.verification_status === 'VERIFIED') && p.is_active
  );

  if (!targetPharmacy) {
    res.status(400).json({
      success: false,
      error: { message: 'The pharmacy providing this listing is not currently verified or active.' },
    });
    return;
  }

  const { cart, items } = getOrCreateCart(customerId);

  // ONE PHARMACY PER CART RULE CHECK
  if (cart.pharmacy_id && cart.pharmacy_id !== inventory.pharmacy_id && items.length > 0) {
    if (!clearExisting) {
      const existingPharmacy = pharmacies.find((p) => p.id === cart.pharmacy_id);
      res.status(409).json({
        success: false,
        conflict: true,
        existingPharmacy: {
          id: existingPharmacy?.id,
          name: existingPharmacy?.name || 'Existing Pharmacy',
        },
        newPharmacy: {
          id: targetPharmacy.id,
          name: targetPharmacy.name,
        },
        message: `Your cart already contains items from "${existingPharmacy?.name}". A delivery order can only be fulfilled by one local pharmacy at a time.`,
      });
      return;
    } else {
      // Clear existing cart items and switch to new pharmacy
      items.length = 0;
      cart.pharmacy_id = targetPharmacy.id;
    }
  }

  // Set cart pharmacy if null
  if (!cart.pharmacy_id) {
    cart.pharmacy_id = targetPharmacy.id;
  }

  // Check if item already exists in cart
  const existingItemIndex = items.findIndex((it) => it.inventory_id === inventoryId);
  const currentQuantityInCart = existingItemIndex !== -1 ? items[existingItemIndex].quantity : 0;
  const requestedTotalQuantity = currentQuantityInCart + quantity;

  // Stock check
  if (requestedTotalQuantity > inventory.stock_quantity) {
    res.status(400).json({
      success: false,
      error: {
        message: `Cannot add ${quantity} item(s). Only ${inventory.stock_quantity} unit(s) available in stock (you already have ${currentQuantityInCart} in cart).`,
      },
    });
    return;
  }

  if (existingItemIndex !== -1) {
    items[existingItemIndex].quantity = requestedTotalQuantity;
    items[existingItemIndex].updated_at = new Date().toISOString();
  } else {
    items.push({
      id: `ci-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      cart_id: cart.id,
      inventory_id: inventory.id,
      product_id: inventory.product_id,
      quantity,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  cart.updated_at = new Date().toISOString();

  res.status(200).json({
    success: true,
    message: 'Medicine added to your shopping cart.',
  });
});

// PUT /api/cart/items/:itemId - Update item quantity
router.put('/items/:itemId', (req: Request, res: Response) => {
  const customerId = req.user!.id;
  const { itemId } = req.params;
  const { quantity } = req.body;

  const numQty = parseInt(quantity, 10);
  if (isNaN(numQty) || numQty < 0) {
    res.status(400).json({ success: false, error: { message: 'Quantity must be a non-negative integer.' } });
    return;
  }

  const { cart, items } = getOrCreateCart(customerId);
  const itemIndex = items.findIndex((it) => it.id === itemId);

  if (itemIndex === -1) {
    res.status(404).json({ success: false, error: { message: 'Item not found in your cart.' } });
    return;
  }

  if (numQty === 0) {
    items.splice(itemIndex, 1);
    if (items.length === 0) {
      cart.pharmacy_id = null;
    }
    cart.updated_at = new Date().toISOString();
    res.status(200).json({ success: true, message: 'Item removed from cart.' });
    return;
  }

  const cartItem = items[itemIndex];
  const inventory = pharmacyInventories.find((inv) => inv.id === cartItem.inventory_id);

  if (!inventory || inventory.status === 'UNAVAILABLE') {
    res.status(400).json({ success: false, error: { message: 'This item is no longer available.' } });
    return;
  }

  if (numQty > inventory.stock_quantity) {
    res.status(400).json({
      success: false,
      error: { message: `Requested quantity exceeds available stock (${inventory.stock_quantity} available).` },
    });
    return;
  }

  cartItem.quantity = numQty;
  cartItem.updated_at = new Date().toISOString();
  cart.updated_at = new Date().toISOString();

  res.status(200).json({ success: true, message: 'Cart quantity updated.' });
});

// DELETE /api/cart/items/:itemId - Remove item from cart
router.delete('/items/:itemId', (req: Request, res: Response) => {
  const customerId = req.user!.id;
  const { itemId } = req.params;

  const { cart, items } = getOrCreateCart(customerId);
  const idx = items.findIndex((it) => it.id === itemId);

  if (idx !== -1) {
    items.splice(idx, 1);
  }

  if (items.length === 0) {
    cart.pharmacy_id = null;
  }
  cart.updated_at = new Date().toISOString();

  res.status(200).json({ success: true, message: 'Item removed from cart.' });
});

// DELETE /api/cart - Clear entire cart
router.delete('/', (req: Request, res: Response) => {
  const customerId = req.user!.id;
  const { cart, items } = getOrCreateCart(customerId);

  items.length = 0;
  cart.pharmacy_id = null;
  cart.updated_at = new Date().toISOString();

  res.status(200).json({ success: true, message: 'Shopping cart cleared.' });
});

export default router;
