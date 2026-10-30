import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { EmptyState } from '../../components/common/EmptyState';
import { Package, Plus } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const PharmacyInventory: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Pharmacy Inventory & Catalog</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage stock levels, batch expiry dates, and pricing in INR (₹).
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => alert('Full inventory CSV import and barcode scanning will activate in Phase 2!')}
          >
            <Plus className="w-4 h-4" />
            <span>Add Medicine Stock</span>
          </Button>
        </div>

        <EmptyState
          icon={Package}
          title="Store Inventory Management Shell"
          description="Detailed batch management, stock reservation concurrency guards, and custom retail price settings are architected for Phase 1 extension & Phase 2."
          phaseBadge="Scheduled for Phase 1 Extension / Phase 2"
          actionText="Learn About Stock Reservation Rules"
          onAction={() => window.open('https://github.com/Code-With-Saksham/Pharmora', '_blank')}
        />
      </div>
    </DashboardLayout>
  );
};
