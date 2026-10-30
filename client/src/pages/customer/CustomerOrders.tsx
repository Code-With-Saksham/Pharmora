import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { EmptyState } from '../../components/common/EmptyState';
import { Package, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CustomerOrders: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Order History</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review past purchases, current fulfillment statuses, and pharmacist review notes.
          </p>
        </div>

        <EmptyState
          icon={Package}
          title="No Active or Past Orders Found"
          description="You haven't placed any medicine orders yet. Once an order is initiated, you'll be able to track pharmacy acceptance, pharmacist prescription checks, and doorstep transit in real-time."
          phaseBadge="Scheduled for Phase 1 Extension / Phase 2"
          actionText="Browse Medicine Catalog"
          onAction={() => navigate('/customer/search')}
        />
      </div>
    </DashboardLayout>
  );
};
