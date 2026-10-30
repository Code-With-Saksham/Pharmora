import React from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Alert } from '../../components/common/Alert';
import { EmptyState } from '../../components/common/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { Store, Package, ShoppingBag, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

export const PharmacyDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Pharmacy Store Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">Sanjivani Medicare & Retail Chemist</h1>
              <Badge status={user?.status} />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Registered Pharmacist: {user?.fullName} • Drug Licence: DL-KA-BLR-847291 • Bengaluru, KA
            </p>
          </div>
          <Link to="/pharmacy/profile">
            <Button variant="outline" size="sm">
              Manage Store Profile
            </Button>
          </Link>
        </div>

        {/* Verification Status Banner if pending */}
        {user?.status === 'PENDING_VERIFICATION' && (
          <Alert variant="warning" title="Verification Pending Administrative Review">
            Your pharmacy licence documents (Form 20/21) are currently being reviewed by the PHARMORA compliance team. 
            Once verified by an administrator, your inventory will become visible to nearby patients and live orders will be routed to your store.
          </Alert>
        )}

        {/* Key Operational Metric Shells */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white">
            <CardContent className="p-4 space-y-1">
              <p className="text-xs font-medium text-slate-500">Today's Orders</p>
              <p className="text-2xl font-bold text-slate-900">0</p>
              <p className="text-[11px] text-slate-400">0 pending pharmacist review</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4 space-y-1">
              <p className="text-xs font-medium text-slate-500">Active Catalog Items</p>
              <p className="text-2xl font-bold text-slate-900">142</p>
              <p className="text-[11px] text-emerald-600">Standard formulary mapped</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4 space-y-1">
              <p className="text-xs font-medium text-slate-500">Prescriptions Verified</p>
              <p className="text-2xl font-bold text-slate-900">0</p>
              <p className="text-[11px] text-slate-400">By Registered Pharmacist</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4 space-y-1">
              <p className="text-xs font-medium text-slate-500">Settlement Balance (₹)</p>
              <p className="text-2xl font-bold text-slate-900">₹0.00</p>
              <p className="text-[11px] text-slate-400">Weekly bank transfer</p>
            </CardContent>
          </Card>
        </div>

        {/* Section: Incoming Orders Queue */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Live Order & Pickup Queue</h2>
            <Link to="/pharmacy/orders" className="text-xs text-brand-700 hover:underline">
              View all orders →
            </Link>
          </div>

          <EmptyState
            icon={ShoppingBag}
            title="No Incoming Orders at this Moment"
            description="When nearby customers select your pharmacy for medicine delivery, orders will ping here for prescription verification, preparation, and courier pickup."
            phaseBadge="Order Queue • Phase 1 Baseline"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};
