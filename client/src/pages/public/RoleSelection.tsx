import React from 'react';
import { Link } from 'react-router-dom';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { Footer } from '../../components/layout/Footer';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { User, Store, Bike, Shield, ArrowRight } from 'lucide-react';

export const RoleSelection: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Unified Access Gateway</span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Select Your PHARMORA Portal</h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Choose your designated portal to sign in or start your onboarding process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer */}
          <Card className="hover:border-brand-400 hover:shadow-md transition-all">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-brand-100 text-brand-800 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Customer Portal</h3>
                  <p className="text-xs text-slate-500">Order medicines from neighborhood pharmacies</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Discover medicines, check verified stock in your pincode, upload prescriptions, and track doorstep deliveries.
              </p>
              <div className="pt-2 flex gap-3">
                <Link to="/login" className="flex-1">
                  <Button variant="primary" size="sm" className="w-full">
                    Customer Sign In
                  </Button>
                </Link>
                <Link to="/signup" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    Create Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Pharmacy Owner */}
          <Card className="hover:border-brand-400 hover:shadow-md transition-all">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Pharmacy Owner Portal</h3>
                  <p className="text-xs text-slate-500">For retail chemists and medical store owners</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Manage stock availability, review e-prescriptions by licensed pharmacists, process incoming orders, and track payouts.
              </p>
              <div className="pt-2 flex gap-3">
                <Link to="/pharmacy/login" className="flex-1">
                  <Button variant="primary" size="sm" className="w-full">
                    Pharmacy Sign In
                  </Button>
                </Link>
                <Link to="/pharmacy/onboard" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    Register Pharmacy
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Partner */}
          <Card className="hover:border-brand-400 hover:shadow-md transition-all">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Delivery Partner Portal</h3>
                  <p className="text-xs text-slate-500">For local couriers and riders</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Accept pickup tasks from nearby chemists, complete safe handovers to patients, and monitor daily trip earnings.
              </p>
              <div className="pt-2 flex gap-3">
                <Link to="/partner/login" className="flex-1">
                  <Button variant="primary" size="sm" className="w-full">
                    Partner Sign In
                  </Button>
                </Link>
                <Link to="/partner/onboard" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    Join as Rider
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Administrator Panel */}
          <Card className="hover:border-brand-400 hover:shadow-md transition-all border-slate-300">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Operations Command</h3>
                  <p className="text-xs text-slate-500">Platform administrators and compliance officers</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Restricted gateway for pharmacy drug licence verification, partner vetting, system audit logs, and catalog management.
              </p>
              <div className="pt-2">
                <Link to="/admin/login">
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    <span>Secure Admin Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};
