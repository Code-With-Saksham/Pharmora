import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { EmptyState } from '../../components/common/EmptyState';
import { Bike } from 'lucide-react';

export const PartnerDeliveries: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Delivery Assignments</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Accept local pharmacy pickups, view drop-off coordinates, and complete doorstep handovers.
          </p>
        </div>

        <EmptyState
          icon={Bike}
          title="No Delivery Tasks Available"
          description="Trip assignment algorithms and real-time GPS navigation integration are scheduled for Phase 2: Delivery Operations."
          phaseBadge="Scheduled for Phase 2: Delivery Operations"
        />
      </div>
    </DashboardLayout>
  );
};
