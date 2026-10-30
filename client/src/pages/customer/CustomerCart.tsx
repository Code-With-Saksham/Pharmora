import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../lib/utils';
import { Button } from '../../components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Alert } from '../../components/common/Alert';
import { EmptyState } from '../../components/common/EmptyState';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Store,
  ArrowRight,
  ShieldCheck,
  FileText,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';

export const CustomerCart: React.FC = () => {
  const { cart, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  const hasRxItem = cart.items.some((it) => it.product?.requiresPrescription);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">Shopping Cart</h1>
              {cart.items.length > 0 && (
                <span className="text-xs bg-brand-50 text-brand-800 font-semibold px-2 py-0.5 rounded-full border border-brand-200">
                  {cart.items.reduce((s, i) => s + i.quantity, 0)} items
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Review your selected medications, verify chemist prices, and prepare your order.
            </p>
          </div>

          {cart.items.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearCart}
              className="text-xs text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
            >
              Clear Entire Cart
            </Button>
          )}
        </div>

        {cart.items.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="Your Shopping Cart is Empty"
            description="Discover genuine medicines in stock at licensed neighborhood pharmacies across Bengaluru and other Indian cities."
            actionText="Search Available Medicines"
            onAction={() => navigate('/customer/search')}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns: Pharmacy Header and Items List */}
            <div className="lg:col-span-2 space-y-4">
              {/* Pharmacy Fulfiller Banner */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{cart.pharmacyName}</span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified Store</span>
                      </span>
                    </div>
                    {cart.pharmacyAddress && (
                      <p className="text-xs text-slate-500 mt-0.5">{cart.pharmacyAddress}</p>
                    )}
                    <p className="text-[11px] text-emerald-700 font-medium mt-1">
                      ✓ All medicines in this cart will be dispensed from this store.
                    </p>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <Card key={item.id} className="bg-white hover:border-slate-300 transition-all">
                    <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Medicine Info */}
                      <div className="space-y-1 max-w-sm">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-slate-900 text-sm">{item.product.name}</h4>
                          {item.product.requiresPrescription ? (
                            <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded font-semibold">
                              Rx Required
                            </span>
                          ) : (
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                              OTC
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          {item.product.genericName} • {item.product.strength} ({item.product.packSize})
                        </p>
                        <p className="text-[11px] text-slate-400">Mfg: {item.product.manufacturer}</p>
                        <div className="flex items-center gap-2 text-xs pt-1">
                          <span className="font-bold text-slate-900">{formatINR(item.inventory.sellingPrice)}</span>
                          {item.inventory.mrp > item.inventory.sellingPrice && (
                            <span className="text-[11px] text-slate-400 line-through">
                              MRP {formatINR(item.inventory.mrp)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Controls and Total */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3">
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-7 w-7 rounded-md bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-100 active:scale-95"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.inventory.stockQuantity}
                            className="h-7 w-7 rounded-md bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white active:scale-95"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-xs text-slate-400 block sm:hidden">Total</span>
                            <span className="text-sm font-bold text-slate-900">
                              {formatINR(item.inventory.sellingPrice * item.quantity)}
                            </span>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50"
                            title="Remove medicine"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Continue Shopping Button */}
              <div className="pt-2">
                <Link to="/customer/search">
                  <Button variant="outline" size="sm" className="gap-2 text-xs">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Add More Medicines from {cart.pharmacyName}</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: Order Summary & Compliance Checklist */}
            <div className="space-y-4">
              <Card className="bg-white shadow-xs">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-base">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-4 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Medicines Subtotal</span>
                    <span className="font-semibold text-slate-900">{formatINR(cart.subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Local Courier Delivery</span>
                    <span>
                      {cart.estimatedDeliveryFee === 0 ? (
                        <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                          FREE
                        </span>
                      ) : (
                        formatINR(cart.estimatedDeliveryFee)
                      )}
                    </span>
                  </div>

                  {cart.subtotal < 500 && (
                    <p className="text-[11px] text-slate-400">
                      Add {formatINR(500 - cart.subtotal)} more to qualify for Free Local Delivery.
                    </p>
                  )}

                  <div className="border-t border-slate-200 pt-3 flex justify-between text-sm font-bold text-slate-900">
                    <span>Total Estimated (INR)</span>
                    <span className="text-brand-800 text-base">{formatINR(cart.total)}</span>
                  </div>

                  {/* Prescription Warning Notice */}
                  {hasRxItem && (
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 space-y-1 mt-3">
                      <div className="flex items-center gap-1.5 font-bold text-[11px]">
                        <FileText className="w-3.5 h-3.5 text-amber-700" />
                        <span>Prescription Required</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        Contains Schedule H medicines. Under Indian pharmacy regulations, you will provide a registered doctor's prescription during checkout for verification by the pharmacist.
                      </p>
                    </div>
                  )}

                  <div className="pt-2">
                    <Button
                      variant="primary"
                      className="w-full justify-between"
                      onClick={() =>
                        alert(
                          'Phase 2 shopping cart is fully operational! Prescription upload, payment processing, and final delivery assignment belong to Phase 3.'
                        )
                      }
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quality & Trust Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-[11px] text-slate-500 space-y-2 leading-relaxed">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>PHARMORA Local Guarantee</span>
                </div>
                <p>• 100% Genuine batch medicines sourced directly from authorized Indian retail chemists.</p>
                <p>• Physical inspection by a registered pharmacist before packaging.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
