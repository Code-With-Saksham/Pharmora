import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { INITIAL_PHARMACIES, INITIAL_INVENTORY } from '../../data/mockData';
import {
  Store,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  Search,
  PackageCheck,
  ArrowRight,
} from 'lucide-react';

export const PharmacyDiscovery: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('Bengaluru');
  const navigate = useNavigate();

  // Only verified & active pharmacies are orderable!
  const verifiedPharmacies = INITIAL_PHARMACIES.filter(
    (p) => (p.isVerified || p.verificationStatus === 'VERIFIED') && p.isActive
  );

  const filtered = verifiedPharmacies.filter((p) => {
    if (selectedCity && p.city.toLowerCase() !== selectedCity.toLowerCase()) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchAddr = p.addressLine1.toLowerCase().includes(q);
      const matchPin = p.pincode.includes(q);
      if (!matchName && !matchAddr && !matchPin) return false;
    }
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Nearby Licensed Pharmacies</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified local retail chemists dispensing genuine medicines directly to your neighborhood.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs">
            <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent font-bold text-slate-800 border-none focus:outline-none cursor-pointer text-xs"
            >
              <option value="Bengaluru">Bengaluru, KA</option>
              <option value="Mumbai">Mumbai, MH</option>
              <option value="Delhi NCR">Delhi NCR</option>
              <option value="Hyderabad">Hyderabad, TS</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pharmacy name, landmark, or Indian pincode..."
              className="w-full pl-9 pr-3 py-2 text-sm text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Verified Medical Stores ({filtered.length})
            </h2>
            <span className="text-[11px] text-slate-400">Under Drugs & Cosmetics Act</span>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={Store}
              title="No Pharmacies Found in this Area"
              description="We currently onboard licensed retail chemists in central city zones. Try searching within Bengaluru or Indiranagar."
              actionText="Reset City Filter"
              onAction={() => {
                setSelectedCity('Bengaluru');
                setSearch('');
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((pharmacy) => {
                const stockCount = INITIAL_INVENTORY.filter(
                  (inv) => inv.pharmacyId === pharmacy.id && inv.isActive && inv.stockQuantity > 0
                ).length;

                return (
                  <Card key={pharmacy.id} className="bg-white hover:border-brand-300 transition-all">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900">{pharmacy.name}</h3>
                            <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5">
                              <ShieldCheck className="w-3 h-3" />
                              <span>Verified</span>
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {pharmacy.addressLine1}, {pharmacy.city} - {pharmacy.pincode}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {pharmacy.description}
                      </p>

                      <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{pharmacy.operatingHours?.open} - {pharmacy.operatingHours?.close}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{pharmacy.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                          {stockCount} formulations ready for pickup
                        </span>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/customer/search')}
                          className="gap-1.5 text-xs"
                        >
                          <span>Browse Stock</span>
                          <ArrowRight className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
