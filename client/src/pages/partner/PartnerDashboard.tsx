import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Alert } from '../../components/common/Alert';
import { EmptyState } from '../../components/common/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { Bike, Power, MapPin, IndianRupee, Clock, ArrowRight } from 'lucide-react';

export const PartnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(false);

  const isPending = user?.status === 'PENDING_VERIFICATION';

  const toggleAvailability = () => {
    if (isPending) {
      alert('Your profile is currently Pending Verification. Once approved by operations, you can switch online.');
      return;
    }
    setIsOnline(!isOnline);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Partner Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{user?.fullName || 'Delivery Partner'}</h1>
              <Badge status={user?.status} />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Vehicle: Two-Wheeler (KA-01-AB-1234) • Zone: Bengaluru Central (Indiranagar / Koramangala)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant={isOnline ? 'secondary' : 'outline'}
              size="sm"
              onClick={toggleAvailability}
              className="gap-2"
            >
              <Power className={`w-4 h-4 ${isOnline ? 'text-white' : 'text-slate-400'}`} />
              <span>{isOnline ? 'Status: ONLINE (Receiving Trips)' : 'Status: OFFLINE'}</span>
            </Button>
          </div>
        </div>

        {/* Pending Verification Notice */}
        {isPending && (
          <Alert variant="warning" title="Partner Onboarding: Verification Pending">
            Your identity and driving licence records are currently queued for verification by the PHARMORA operations team. 
            You will receive an SMS and email notification as soon as your account is activated for live deliveries.
          </Alert>
        )}

        {/* Quick Earnings / Trips Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-white">
            <CardContent className="p-4 space-y-1">
              <p className="text-xs font-medium text-slate-500">Today's Deliveries Completed</p>
              <p className="text-2xl font-bold text-slate-900">0</p>
              <p className="text-[11px] text-slate-400">0 active trips in transit</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4 space-y-1">
              <p className="text-xs font-medium text-slate-500">Today's Earnings (₹)</p>
              <p className="text-2xl font-bold text-slate-900">₹0.00</p>
              <p className="text-[11px] text-emerald-600">Direct weekly payout to bank</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4 space-y-1">
              <p className="text-xs font-medium text-slate-500">Service Rating</p>
              <p className="text-2xl font-bold text-slate-900">5.0 ★</p>
              <p className="text-[11px] text-slate-400">Compliant medicine transit</p>
            </CardContent>
          </Card>
        </div>

        {/* Available Deliveries Queue */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Available Delivery Requests Nearby</h2>
            <Link to="/partner/deliveries" className="text-xs text-brand-700 hover:underline">
              View trip pool →
            </Link>
          </div>

          <EmptyState
            icon={Bike}
            title="No Active Delivery Requests in Your Zone"
            description="When nearby retail pharmacies prepare orders ready for pickup, dispatch assignments with estimated travel distance and trip payouts in INR will appear here."
            phaseBadge="Delivery Dispatch • Phase 1 Baseline"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};
