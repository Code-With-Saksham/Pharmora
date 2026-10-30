import React, { createContext, useContext, useState, useEffect } from 'react';
import { ShoppingCart, CartItem, MedicineProduct, InventoryStatus } from '../types';
import { CartConflictModal } from '../components/cart/CartConflictModal';

export interface AddItemPayload {
  inventoryId: string;
  quantity: number;
  product: MedicineProduct;
  inventory: {
    id: string;
    sellingPrice: number;
    mrp: number;
    stockQuantity: number;
    status: InventoryStatus;
  };
  pharmacyId: string;
  pharmacyName: string;
}

interface CartContextType {
  cart: ShoppingCart;
  itemCount: number;
  totalItems: number;
  addToCart: (payload: AddItemPayload) => { success: boolean; conflict?: boolean; error?: string };
  updateQuantity: (itemId: string, newQuantity: number) => { success: boolean; error?: string };
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'pharmora_cart_v2';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<ShoppingCart>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved cart:', e);
    }
    return {
      id: `cart-${Date.now()}`,
      customerId: 'customer-current',
      pharmacyId: null,
      pharmacyName: null,
      items: [],
      subtotal: 0,
      estimatedDeliveryFee: 0,
      total: 0,
      updatedAt: new Date().toISOString(),
    };
  });

  // Conflict modal state
  const [conflictState, setConflictState] = useState<{
    isOpen: boolean;
    existingPharmacyName: string;
    newPharmacyName: string;
    pendingPayload: AddItemPayload | null;
  }>({
    isOpen: false,
    existingPharmacyName: '',
    newPharmacyName: '',
    pendingPayload: null,
  });

  // Calculate totals whenever items change
  const recalculateCart = (items: CartItem[], pharmacyId: string | null, pharmacyName: string | null): ShoppingCart => {
    const subtotal = items.reduce((sum, it) => sum + it.inventory.sellingPrice * it.quantity, 0);
    const estimatedDeliveryFee = subtotal > 0 && subtotal < 500 ? 30 : 0;
    const total = subtotal + estimatedDeliveryFee;

    return {
      id: cart.id,
      customerId: cart.customerId,
      pharmacyId: items.length > 0 ? pharmacyId : null,
      pharmacyName: items.length > 0 ? pharmacyName : null,
      items,
      subtotal,
      estimatedDeliveryFee,
      total,
      updatedAt: new Date().toISOString(),
    };
  };

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart to localStorage:', e);
    }
  }, [cart]);

  const addToCart = (payload: AddItemPayload) => {
    // 1. Check for one pharmacy rule conflict
    if (cart.pharmacyId && cart.pharmacyId !== payload.pharmacyId && cart.items.length > 0) {
      setConflictState({
        isOpen: true,
        existingPharmacyName: cart.pharmacyName || 'Current Pharmacy',
        newPharmacyName: payload.pharmacyName,
        pendingPayload: payload,
      });
      return { success: false, conflict: true };
    }

    // 2. Check stock availability
    const existingIndex = cart.items.findIndex((it) => it.inventoryId === payload.inventoryId);
    const currentQtyInCart = existingIndex !== -1 ? cart.items[existingIndex].quantity : 0;
    const targetQty = currentQtyInCart + payload.quantity;

    if (targetQty > payload.inventory.stockQuantity) {
      return {
        success: false,
        error: `Cannot add ${payload.quantity}. Only ${payload.inventory.stockQuantity} unit(s) in stock (you already have ${currentQtyInCart} in cart).`,
      };
    }

    let newItems = [...cart.items];
    if (existingIndex !== -1) {
      newItems[existingIndex] = {
        ...newItems[existingIndex],
        quantity: targetQty,
      };
    } else {
      const newItem: CartItem = {
        id: `ci-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        cartId: cart.id,
        inventoryId: payload.inventoryId,
        productId: payload.product.id,
        quantity: payload.quantity,
        product: payload.product,
        inventory: payload.inventory,
        pharmacyId: payload.pharmacyId,
        pharmacyName: payload.pharmacyName,
      };
      newItems.push(newItem);
    }

    const updated = recalculateCart(newItems, payload.pharmacyId, payload.pharmacyName);
    setCart(updated);
    return { success: true };
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    const existingIndex = cart.items.findIndex((it) => it.id === itemId);
    if (existingIndex === -1) return { success: false, error: 'Item not in cart' };

    const item = cart.items[existingIndex];
    if (newQuantity <= 0) {
      removeItem(itemId);
      return { success: true };
    }

    if (newQuantity > item.inventory.stockQuantity) {
      return {
        success: false,
        error: `Only ${item.inventory.stockQuantity} unit(s) available in stock.`,
      };
    }

    const newItems = [...cart.items];
    newItems[existingIndex] = {
      ...newItems[existingIndex],
      quantity: newQuantity,
    };

    setCart(recalculateCart(newItems, cart.pharmacyId, cart.pharmacyName));
    return { success: true };
  };

  const removeItem = (itemId: string) => {
    const newItems = cart.items.filter((it) => it.id !== itemId);
    const updated = recalculateCart(newItems, newItems.length > 0 ? cart.pharmacyId : null, newItems.length > 0 ? cart.pharmacyName : null);
    setCart(updated);
  };

  const clearCart = () => {
    const updated = recalculateCart([], null, null);
    setCart(updated);
  };

  const handleKeepExisting = () => {
    setConflictState({
      isOpen: false,
      existingPharmacyName: '',
      newPharmacyName: '',
      pendingPayload: null,
    });
  };

  const handleSwitchAndClear = () => {
    if (conflictState.pendingPayload) {
      const payload = conflictState.pendingPayload;
      const newItem: CartItem = {
        id: `ci-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        cartId: cart.id,
        inventoryId: payload.inventoryId,
        productId: payload.product.id,
        quantity: payload.quantity,
        product: payload.product,
        inventory: payload.inventory,
        pharmacyId: payload.pharmacyId,
        pharmacyName: payload.pharmacyName,
      };
      const updated = recalculateCart([newItem], payload.pharmacyId, payload.pharmacyName);
      setCart(updated);
    }
    setConflictState({
      isOpen: false,
      existingPharmacyName: '',
      newPharmacyName: '',
      pendingPayload: null,
    });
  };

  const itemCount = cart.items.reduce((total, it) => total + it.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        totalItems: itemCount,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}

      <CartConflictModal
        isOpen={conflictState.isOpen}
        existingPharmacyName={conflictState.existingPharmacyName}
        newPharmacyName={conflictState.newPharmacyName}
        onKeepExisting={handleKeepExisting}
        onSwitchAndClear={handleSwitchAndClear}
        onClose={handleKeepExisting}
      />
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
