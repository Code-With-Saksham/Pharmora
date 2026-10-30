import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/common/Button';
import { Card, CardContent } from '../../components/common/Card';
import {
  Search,
  MapPin,
  ShieldCheck,
  Building2,
  Clock,
  ArrowRight,
  FileText,
  Bike,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Bengaluru');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In Phase 1, medicine search redirects to customer portal discovery preview
    navigate('/customer/search');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 to-white pt-12 pb-16 sm:pb-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-100/80 px-3 py-1 text-xs font-semibold text-brand-900 border border-brand-200">
              <Sparkles className="w-3.5 h-3.5 text-brand-700" />
              <span>Smart Local Medicine Network • India</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Your Local Pharmacy. <br />
              <span className="text-brand-700">Delivered to Your Doorstep.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Find medicines in stock at licensed neighborhood medical stores. 
              Upload prescriptions securely, compare local chemist prices, and get genuine medications delivered responsibly.
            </p>

            {/* Medicine Discovery Search Bar Entry Point */}
            <div className="pt-4 max-w-2xl mx-auto">
              <form
                onSubmit={handleSearch}
                className="bg-white p-2 rounded-2xl shadow-lg border border-slate-200 flex flex-col sm:flex-row items-center gap-2"
              >
                {/* City / Location Picker */}
                <div className="flex items-center gap-2 px-3 py-2 text-slate-600 border-b sm:border-b-0 sm:border-r border-slate-200 w-full sm:w-auto">
                  <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    aria-label="Select City"
                    className="text-xs font-medium bg-transparent border-none focus:outline-none cursor-pointer text-slate-800"
                  >
                    <option value="Bengaluru">Bengaluru (KA)</option>
                    <option value="Mumbai">Mumbai (MH)</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Hyderabad">Hyderabad (TS)</option>
                    <option value="Chennai">Chennai (TN)</option>
                    <option value="Kolkata">Kolkata (WB)</option>
                    <option value="Pune">Pune (MH)</option>
                  </select>
                </div>

                {/* Medicine Search Input */}
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search medicine name, salt or brand (e.g. Paracetamol, Dolo 650, Telma 40)..."
                    className="w-full pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 bg-transparent border-none focus:outline-none"
                  />
                </div>

                {/* Submit button */}
                <Button type="submit" variant="primary" size="md" className="w-full sm:w-auto px-6 whitespace-nowrap">
                  Check Stock
                </Button>
              </form>

              <div className="mt-2.5 flex items-center justify-center gap-2 text-[11px] text-slate-500">
                <span>Popular searches:</span>
                <span className="font-medium text-brand-800 bg-brand-50 px-2 py-0.5 rounded cursor-pointer" onClick={() => setSearchQuery('Dolo 650')}>Dolo 650</span>
                <span className="font-medium text-brand-800 bg-brand-50 px-2 py-0.5 rounded cursor-pointer" onClick={() => setSearchQuery('Telmisartan 40')}>Telmisartan</span>
                <span className="font-medium text-brand-800 bg-brand-50 px-2 py-0.5 rounded cursor-pointer" onClick={() => setSearchQuery('Metformin 500')}>Metformin</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Platform Stakeholders Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-700">Four Roles, One Ecosystem</h2>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Engineered for Responsible Healthcare Fulfillment
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Every participant operates within a purpose-built portal tailored to their legal, operational, and customer duties.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Customer Portal */}
            <Card className="hover:border-brand-300 hover:shadow-md transition-all flex flex-col justify-between">
              <CardContent className="pt-6 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
                  <Search className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">For Customers</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Discover nearby medical stores, check real-time stock, upload prescriptions safely, and track door-to-door delivery.
                </p>
              </CardContent>
              <div className="p-6 pt-0">
                <Link to="/login">
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    <span>Customer Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Pharmacy Portal */}
            <Card className="hover:border-brand-300 hover:shadow-md transition-all flex flex-col justify-between">
              <CardContent className="pt-6 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Building2 className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">For Pharmacy Owners</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Digitize your local inventory, review electronic prescriptions, manage pricing, and accept customer pickup requests.
                </p>
              </CardContent>
              <div className="p-6 pt-0">
                <Link to="/pharmacy/login">
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    <span>Pharmacy Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Delivery Partner */}
            <Card className="hover:border-brand-300 hover:shadow-md transition-all flex flex-col justify-between">
              <CardContent className="pt-6 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Bike className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">For Delivery Partners</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Accept nearby delivery assignments, complete verified medicine handovers, and track transparent trip earnings.
                </p>
              </CardContent>
              <div className="p-6 pt-0">
                <Link to="/partner/login">
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    <span>Partner Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Admin Command */}
            <Card className="hover:border-brand-300 hover:shadow-md transition-all flex flex-col justify-between">
              <CardContent className="pt-6 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">For Administrators</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Centralized command center for pharmacy licence verification, courier checks, catalog oversight, and audit logs.
                </p>
              </CardContent>
              <div className="p-6 pt-0">
                <Link to="/admin/login">
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    <span>Admin Panel</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-700">Simple & Compliant</h2>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              How PHARMORA Operates
            </p>
            <p className="text-sm text-slate-500 mt-2">
              No unrealistic 10-minute marketing gimmicks. Reliable local fulfillment driven by real community chemists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                1
              </div>
              <h4 className="font-semibold text-slate-900 text-base">Search & Upload</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Search for needed medicines or upload a doctor's prescription securely in PDF or image format.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                2
              </div>
              <h4 className="font-semibold text-slate-900 text-base">Local Match & Review</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nearby verified pharmacies confirm stock availability. A qualified pharmacist reviews and approves the prescription.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                3
              </div>
              <h4 className="font-semibold text-slate-900 text-base">Dispensing & Handover</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                The pharmacy packages the medicine in tamper-evident packaging. An eligible delivery partner is assigned.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                4
              </div>
              <h4 className="font-semibold text-slate-900 text-base">Doorstep Delivery</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                The partner collects the sealed package and delivers it safely to your verified address with receipt.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link to="/how-it-works">
              <Button variant="outline" size="sm" className="gap-2">
                <span>View Full 10-Step Order Journey</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Legal Integrity Section */}
      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-brand-900 text-white p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-brand-800/80 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Regulatory Compliance First</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Authentic Medicines. Zero Compromises.
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                PHARMORA complies with the Drugs & Cosmetics Act, 1940 and rules thereunder. 
                Prescription medications cannot be dispensed without physical verification by an authorized registered pharmacist.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link to="/pharmacy/onboard">
                <Button variant="secondary" size="md" className="w-full sm:w-auto font-semibold">
                  Register Your Pharmacy
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="md" className="w-full sm:w-auto bg-transparent text-white border-white/30 hover:bg-white/10">
                  Explore Portals
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
