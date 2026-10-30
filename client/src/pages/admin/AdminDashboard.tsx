import React from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Alert } from '../../components/common/Alert';
import { EmptyState } from '../../components/common/EmptyState';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Store,
  Bike,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Database,
  Activity,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">Platform Operations Command</h1>
              <Badge role="ADMIN" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Signed in as {user?.fullName} ({user?.email}) • Security Level: Tier-1 Administrative Control
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              System Online
            </span>
          </div>
        </div>

        {/* Phase 1 Operational Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white hover:border-slate-300 transition-all">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Total Users</span>
                <Users className="w-4 h-4 text-brand-700" />
              </div>
              <p className="text-2xl font-bold text-slate-900">4</p>
              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span>Phase 1 Seed Profiles</span>
                <Link to="/admin/users" className="text-brand-700 hover:underline">View →</Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white hover:border-slate-300 transition-all">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Pending Pharmacies</span>
                <Store className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-amber-600">1</p>
              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span>Awaiting DL verification</span>
                <Link to="/admin/pharmacies" className="text-brand-700 hover:underline">Review →</Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white hover:border-slate-300 transition-all">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Pending Riders</span>
                <Bike className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-amber-600">1</p>
              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span>Awaiting Aadhaar / DL</span>
                <Link to="/admin/partners" className="text-brand-700 hover:underline">Verify →</Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white hover:border-slate-300 transition-all">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Security Events</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">0</p>
              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span>RLS Violations: 0</span>
                <Link to="/admin/audit" className="text-brand-700 hover:underline">Logs →</Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Queues Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pharmacy Verification Queue Card */}
          <Card className="bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Store className="w-4 h-4 text-brand-700" />
                  <span>Pharmacy Approvals Queue</span>
                </CardTitle>
                <Link to="/admin/pharmacies">
                  <Button variant="ghost" size="sm" className="text-xs">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">Sanjivani Medicare & Chemist</span>
                  <Badge status="PENDING_VERIFICATION" />
                </div>
                <p className="text-[11px] text-slate-500">
                  Licence: DL-KA-BLR-847291 • Bengaluru (KA) • Submitted: Today
                </p>
                <div className="pt-1 flex gap-2">
                  <Link to="/admin/pharmacies" className="w-full">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      Inspect Licences & Verify
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Partner Verification Queue Card */}
          <Card className="bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Bike className="w-4 h-4 text-amber-600" />
                  <span>Courier Approvals Queue</span>
                </CardTitle>
                <Link to="/admin/partners">
                  <Button variant="ghost" size="sm" className="text-xs">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">Vikram Singh</span>
                  <Badge status="PENDING_VERIFICATION" />
                </div>
                <p className="text-[11px] text-slate-500">
                  Vehicle: Two-Wheeler (KA-01-AB-1234) • DL: DL-0420110012345
                </p>
                <div className="pt-1 flex gap-2">
                  <Link to="/admin/partners" className="w-full">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      Inspect DL & Approve
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
