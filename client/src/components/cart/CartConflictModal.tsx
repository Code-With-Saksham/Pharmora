import React from 'react';
import { Button } from '../common/Button';
import { AlertTriangle, Store, ArrowRight, X } from 'lucide-react';

interface CartConflictModalProps {
  isOpen: boolean;
  existingPharmacyName: string;
  newPharmacyName: string;
  onKeepExisting: () => void;
  onSwitchAndClear: () => void;
  onClose: () => void;
}

export const CartConflictModal: React.FC<CartConflictModalProps> = ({
  isOpen,
  existingPharmacyName,
  newPharmacyName,
  onKeepExisting,
  onSwitchAndClear,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Switch Pharmacy Order?</h3>
              <p className="text-xs text-slate-500">One Local Pharmacy per Delivery Rule</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-900 leading-relaxed space-y-2">
          <p>
            Your shopping cart currently contains medicines from:
          </p>
          <div className="flex items-center gap-2 font-bold text-slate-900 bg-white p-2 rounded-lg border border-amber-200">
            <Store className="w-4 h-4 text-brand-700 flex-shrink-0" />
            <span className="truncate">{existingPharmacyName}</span>
          </div>
          <p>
            To ensure temperature compliance and statutory pharmacist verification, a delivery order can only be collected from <strong>one licensed pharmacy</strong> at a time.
          </p>
        </div>

        <p className="text-xs text-slate-600">
          Would you like to keep your existing items or clear your cart to add medicines from <strong>{newPharmacyName}</strong>?
        </p>

        <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
          <Button
            variant="outline"
            size="md"
            className="w-full text-xs font-semibold"
            onClick={onKeepExisting}
          >
            Keep Existing Cart
          </Button>
          <Button
            variant="primary"
            size="md"
            className="w-full text-xs font-semibold bg-brand-700 hover:bg-brand-800 text-white gap-1.5"
            onClick={onSwitchAndClear}
          >
            <span>Clear & Add New</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
