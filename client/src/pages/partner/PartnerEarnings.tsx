import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { CreditCard, IndianRupee } from 'lucide-react';
import { formatINR } from '../../lib/utils';

export const PartnerEarnings: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Partner Earnings & Settlements</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent breakdown of delivery trip fares, peak incentives, and bank payouts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-white">
            <CardContent className="p-4 space-y-1">
              <p className="text-xs font-medium text-slate-500">Total Lifetime Earnings</p>
              <p className="text-2xl font-bold text-slate-900">{formatINR(0)}</p>
              <p className="text-[11px] text-slate-400">0 completed trips</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4 space-y-1">
              <p className="text-xs font-medium text-slate-500">Current Week Unsettled</p>
              <p className="text-2xl font-bold text-slate-900">{formatINR(0)}</p>
              <p className="text-[11px] text-emerald-600">Disbursed every Tuesday</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4 space-y-1">
              <p className="text-xs font-medium text-slate-500">Average Base Pay / Delivery</p>
              <p className="text-2xl font-bold text-slate-900">{formatINR(55)}</p>
              <p className="text-[11px] text-slate-400">Within 4 km radius</p>
            </CardContent>
          </Card>
        </div>

        <EmptyState
          icon={CreditCard}
          title="No Payout History Records Yet"
          description="Detailed trip statements, incentive breakdowns, and UPI bank settlement receipts will appear here once trips are completed."
          phaseBadge="Scheduled for Phase 3: Payments & Settlements"
        />
      </div>
    </DashboardLayout>
  );
};
