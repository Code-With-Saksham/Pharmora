import React from 'react';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { Footer } from '../../components/layout/Footer';
import { Card, CardContent } from '../../components/common/Card';
import { HeartPulse, Target, ShieldCheck, MapPin, Users, Building2 } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicNavbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700">About PHARMORA</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Empowering Local Chemists, <br />
            <span className="text-brand-700">Delivering Genuine Care.</span>
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            In every Indian locality, trusted neighborhood pharmacies already stock the essential medicines people need every day. 
            PHARMORA connects these licensed community pharmacists directly to customers through smart technology and an ethical delivery network.
          </p>
        </div>

        {/* Mission and Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-brand-200 bg-white">
            <CardContent className="pt-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Our Mission</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                To make medicine discovery transparent, convenient, and accessible while upholding statutory pharmacy regulations and supporting independent Indian medical retail stores.
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 bg-white">
            <CardContent className="pt-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <HeartPulse className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Responsible Medicine Fulfillment</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We believe medicines are not quick-commerce grocery items. We reject reckless delivery promises that compromise pharmacist oversight, medicine temperature standards, or courier safety.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Core Values */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 text-center">Why PHARMORA Matters in India</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-2">
              <Building2 className="w-6 h-6 text-brand-700 mb-2" />
              <h4 className="font-semibold text-slate-900 text-sm">Hyperlocal Fulfillment</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Instead of waiting days for an interstate courier package, orders are sourced from chemist shops within a few kilometers of your residence.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600 mb-2" />
              <h4 className="font-semibold text-slate-900 text-sm">Pharmacist in the Loop</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Registered pharmacists physically check dosages, expiry dates, and doctor credentials before any prescription medicine leaves the dispensary.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-2">
              <Users className="w-6 h-6 text-amber-600 mb-2" />
              <h4 className="font-semibold text-slate-900 text-sm">Supporting Small Businesses</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                We provide independent chemists with the digital storefront, order management tools, and logistics they need to thrive in the modern internet era.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
