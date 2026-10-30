import React from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Alert } from '../../components/common/Alert';
import { EmptyState } from '../../components/common/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { Search, ShoppingBag, FileUp, MapPin, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Welcome, {user?.fullName}!</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Your customer dashboard for discovering neighborhood medical stores and managing orders.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/customer/search">
              <Button variant="primary" size="sm" className="gap-2">
                <Search className="w-4 h-4" />
                <span>Search Medicines</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Informational phase alert */}
        <Alert variant="info" title="Phase 1 Architecture Active">
          Authentication and customer portal shell are operational. Live medicine checkout, cart sync, and prescription processing workflows are scheduled for the next deployment stages.
        </Alert>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:border-brand-300 transition-all">
            <CardHeader className="pb-3">
              <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center mb-2">
                <Search className="h-5 w-5" />
              </div>
              <CardTitle className="text-base">Medicine Discovery</CardTitle>
              <CardDescription className="text-xs">
                Search local pharmacy stocks by brand, molecule, or generic salt name.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/customer/search">
                <Button variant="outline" size="sm" className="w-full justify-between">
                  <span>Browse Available Salts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:border-brand-300 transition-all">
            <CardHeader className="pb-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2">
                <FileUp className="h-5 w-5" />
              </div>
              <CardTitle className="text-base">Prescription Vault</CardTitle>
              <CardDescription className="text-xs">
                Upload registered medical practitioner (RMP) prescriptions safely.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/customer/orders">
                <Button variant="outline" size="sm" className="w-full justify-between">
                  <span>View Prescriptions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:border-brand-300 transition-all">
            <CardHeader className="pb-3">
              <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-2">
                <MapPin className="h-5 w-5" />
              </div>
              <CardTitle className="text-base">Delivery Addresses</CardTitle>
              <CardDescription className="text-xs">
                Manage your home, work, and emergency Indian addresses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/customer/profile">
                <Button variant="outline" size="sm" className="w-full justify-between">
                  <span>Manage Addresses</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Recent Medicine Orders</h2>
            <Link to="/customer/orders" className="text-xs text-brand-700 hover:underline">
              View all orders →
            </Link>
          </div>

          <EmptyState
            icon={ShoppingBag}
            title="No Medicine Orders Placed Yet"
            description="When you place your first order from a nearby verified retail pharmacy, fulfillment stages, receipts, and live courier tracking will be displayed here."
            phaseBadge="Order Flow • Phase 1 Baseline"
            actionText="Explore Medicine Catalog"
            onAction={() => window.location.assign('/customer/search')}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};
