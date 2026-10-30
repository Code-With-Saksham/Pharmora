import React, { useState } from 'react';
import { MedicineProduct, MedicinePharmacyListing } from '../../types';
import { formatINR } from '../../lib/utils';
import { useCart } from '../../context/CartContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  X,
  Building2,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Info,
} from 'lucide-react';

interface MedicineDetailModalProps {
  product: MedicineProduct | null;
  listings: MedicinePharmacyListing[];
  isOpen: boolean;
  onClose: () => void;
}

export const MedicineDetailModal: React.FC<MedicineDetailModalProps> = ({
  product,
  listings,
  isOpen,
  onClose,
}) => {
  const { addToCart } = useCart();
  const [addedInventoryId, setAddedInventoryId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !product) return null;

  const handleAdd = (listing: MedicinePharmacyListing) => {
    setErrorMessage(null);
    const result = addToCart({
      inventoryId: listing.inventoryId,
      quantity: 1,
      product,
      inventory: {
        id: listing.inventoryId,
        sellingPrice: listing.sellingPrice,
        mrp: listing.mrp,
        stockQuantity: listing.stockQuantity,
        status: listing.status,
      },
      pharmacyId: listing.pharmacyId,
      pharmacyName: listing.pharmacyName,
    });

    if (result.success) {
      setAddedInventoryId(listing.inventoryId);
      setTimeout(() => setAddedInventoryId(null), 2500);
    } else if (result.error) {
      setErrorMessage(result.error);
      setTimeout(() => setErrorMessage(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900">{product.name}</h2>
              {product.requiresPrescription ? (
                <span className="text-[11px] bg-amber-50 text-amber-800 border border-amber-200 font-semibold px-2 py-0.5 rounded-full">
                  Schedule H • Prescription Required
                </span>
              ) : (
                <span className="text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium px-2 py-0.5 rounded-full">
                  Over-The-Counter (OTC)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Active Ingredient: <span className="font-semibold text-slate-700">{product.genericName}</span> ({product.strength})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Product Spec Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Dosage Form</span>
            <span className="font-semibold text-slate-800">{product.dosageForm}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Packaging</span>
            <span className="font-semibold text-slate-800">{product.packSize}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Brand</span>
            <span className="font-semibold text-slate-800">{product.brandName}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Manufacturer</span>
            <span className="font-semibold text-slate-800 truncate block">{product.manufacturer}</span>
          </div>
        </div>

        {product.description && (
          <div className="text-xs text-slate-600 leading-relaxed bg-brand-50/50 p-3 rounded-lg border border-brand-100/60">
            <p><span className="font-semibold text-brand-900">Clinical Formulation:</span> {product.description}</p>
          </div>
        )}

        {/* Nearby Pharmacies Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Nearby Licensed Pharmacies ({listings.length})
            </h3>
            <span className="text-[11px] text-slate-400">Prices set by individual retail chemists</span>
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-8 p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 space-y-1.5">
              <Building2 className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">Currently Out of Stock Nearby</p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                No verified pharmacies in your immediate radius currently report active inventory for this medicine.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {listings.map((item) => {
                const discount = item.mrp > item.sellingPrice
                  ? Math.round(((item.mrp - item.sellingPrice) / item.mrp) * 100)
                  : 0;
                const isOutOfStock = item.stockQuantity <= 0 || item.status === 'OUT_OF_STOCK';
                const isAdded = addedInventoryId === item.inventoryId;

                return (
                  <div
                    key={item.inventoryId}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-brand-300 transition-all gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{item.pharmacyName}</span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verified Store</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {item.pharmacyCity} ({item.pharmacyPincode})
                        </span>
                        {item.distanceKm !== undefined && (
                          <span className="font-semibold text-brand-700">• {item.distanceKm} km away</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Stock: {isOutOfStock ? (
                          <span className="text-red-500 font-semibold">Out of Stock</span>
                        ) : (
                          <span className="text-emerald-700 font-medium">{item.stockQuantity} units available</span>
                        )}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                      <div className="text-right">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base font-bold text-slate-900">{formatINR(item.sellingPrice)}</span>
                          {discount > 0 && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                              {discount}% OFF
                            </span>
                          )}
                        </div>
                        {item.mrp > item.sellingPrice && (
                          <span className="text-[11px] text-slate-400 line-through">
                            MRP {formatINR(item.mrp)}
                          </span>
                        )}
                      </div>

                      <Button
                        variant={isAdded ? 'secondary' : 'primary'}
                        size="sm"
                        disabled={isOutOfStock}
                        onClick={() => handleAdd(item)}
                        className="gap-1.5 text-xs whitespace-nowrap"
                      >
                        {isAdded ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Added to Cart</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Regulatory footer notice */}
        <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-400 flex items-start gap-1.5 leading-normal">
          <Info className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
          <span>
            Medicines dispensed by state-licensed medical stores under Drugs & Cosmetics Rules. Schedule H & H1 medications require physical or electronic prescription review by an authorized registered pharmacist.
          </span>
        </div>
      </div>
    </div>
  );
};
