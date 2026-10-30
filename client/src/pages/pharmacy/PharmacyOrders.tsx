import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { EmptyState } from '../../components/common/EmptyState';
import { ShoppingBag } from 'lucide-react';

export const PharmacyOrders: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Orders & Dispensing Handover</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Accept online medicine requests, verify doctor prescriptions, and prepare sealed packages for courier pickup.
          </p>
        </div>

        <EmptyState
          icon={ShoppingBag}
          title="No Active Orders Requiring Preparation"
          description="Customer orders placed with your store will appear here with customer delivery details and prescription attachments ready for pharmacist review."
          phaseBadge="Scheduled for Phase 1 Extension / Phase 2"
        />
      </div>
    </DashboardLayout>
  );
};
