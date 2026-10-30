import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { Search, MapPin, Pill, Building2, ShieldAlert } from 'lucide-react';
import { formatINR } from '../../lib/utils';

export const CustomerSearchPreview: React.FC = () => {
  const [search, setSearch] = useState('');

  // Sample catalog data demonstrating Indian medicine discovery architecture
  const sampleMedicines = [
    {
      id: '1',
      name: 'Dolo 650 Tablet',
      salt: 'Paracetamol 650mg',
      manufacturer: 'Micro Labs Ltd',
      requiresPrescription: false,
      mrp: 33.6,
      stockCount: 'In Stock (Nearby)',
      pharmacy: 'Sanjivani Medicare (0.8 km)',
    },
    {
      id: '2',
      name: 'Telma 40 Tablet',
      salt: 'Telmisartan 40mg',
      manufacturer: 'Glenmark Pharmaceuticals',
      requiresPrescription: true,
      mrp: 142.5,
      stockCount: 'In Stock (Nearby)',
      pharmacy: 'Apollo Pharmacy Indiranagar (1.2 km)',
    },
    {
      id: '3',
      name: 'Augmentin 625 Duo Tablet',
      salt: 'Amoxycillin (500mg) + Clavulanic Acid (125mg)',
      manufacturer: 'GSK India',
      requiresPrescription: true,
      mrp: 204.5,
      stockCount: 'In Stock (Nearby)',
      pharmacy: 'MedPlus Pharmacy (1.5 km)',
    },
  ];

  const filtered = sampleMedicines.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.salt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-brand-50 border border-brand-200 text-brand-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full mb-1">
            <span>Phase 1 Architecture Preview</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Local Medicine & Salt Discovery</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover real-time medicine availability across verified neighborhood chemists.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by brand name or salt (e.g. Paracetamol, Telma, Metformin)..."
              className="w-full pl-9 pr-3 py-2 text-sm text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
            />
          </div>
          <Button variant="primary" size="sm" className="sm:w-auto">
            Search Radius (5 km)
          </Button>
        </div>

        {/* Results */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900">Available Formulations (Demonstration)</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <Card key={item.id} className="bg-white hover:border-brand-300 transition-all flex flex-col justify-between">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
                      <p className="text-xs text-slate-500">{item.salt}</p>
                      <p className="text-[11px] text-slate-400">{item.manufacturer}</p>
                    </div>
                    {item.requiresPrescription ? (
                      <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded font-semibold whitespace-nowrap">
                        Rx Required
                      </span>
                    ) : (
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium whitespace-nowrap">
                        OTC
                      </span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500">Retail Price: </span>
                      <span className="font-bold text-slate-900">{formatINR(item.mrp)}</span>
                    </div>
                    <span className="text-emerald-700 font-medium text-[11px] bg-emerald-50 px-2 py-0.5 rounded">
                      {item.stockCount}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    <span>{item.pharmacy}</span>
                  </div>
                </CardContent>

                <div className="p-4 pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() =>
                      alert(
                        'Full cart and checkout workflow is part of the next phase. The discovery catalog schema and layout are active!'
                      )
                    }
                  >
                    Select Pharmacy & Order
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
