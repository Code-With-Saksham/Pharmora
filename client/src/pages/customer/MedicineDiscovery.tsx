import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { MedicineDetailModal } from '../../components/customer/MedicineDetailModal';
import { MedicineProduct, MedicineDiscoveryItem, MedicinePharmacyListing } from '../../types';
import { formatINR } from '../../lib/utils';
import { INITIAL_CATALOG, INITIAL_PHARMACIES, INITIAL_INVENTORY } from '../../data/mockData';
import {
  Search,
  MapPin,
  Pill,
  Building2,
  Filter,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const MedicineDiscovery: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('Bengaluru');
  const [selectedDosage, setSelectedDosage] = useState('ALL');
  const [prescriptionFilter, setPrescriptionFilter] = useState<'ALL' | 'OTC' | 'RX'>('ALL');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Modal State
  const [selectedProduct, setSelectedProduct] = useState<MedicineProduct | null>(null);
  const [modalListings, setModalListings] = useState<MedicinePharmacyListing[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Compute live discovery items from data
  const [discoveryItems, setDiscoveryItems] = useState<MedicineDiscoveryItem[]>([]);

  useEffect(() => {
    // Attempt fetch from backend API if running
    const fetchDiscovery = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.set('q', search);
        if (selectedDosage !== 'ALL') queryParams.set('dosage_form', selectedDosage);
        if (prescriptionFilter === 'OTC') queryParams.set('requires_prescription', 'false');
        if (prescriptionFilter === 'RX') queryParams.set('requires_prescription', 'true');
        if (selectedCity) queryParams.set('city', selectedCity);

        const res = await fetch(`http://localhost:5000/api/discovery/medicines?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.medicines) {
            setDiscoveryItems(data.medicines);
            return;
          }
        }
      } catch (e) {
        // Fallback to client mock data
      }

      // Client-side fallback computation
      const verifiedPharmacies = INITIAL_PHARMACIES.filter(
        (p) => (p.isVerified || p.verificationStatus === 'VERIFIED') && p.isActive
      );

      const items: MedicineDiscoveryItem[] = INITIAL_CATALOG.filter((prod) => {
        if (prod.status !== 'ACTIVE') return false;
        if (search) {
          const q = search.toLowerCase();
          const matchName = prod.name.toLowerCase().includes(q);
          const matchBrand = prod.brandName.toLowerCase().includes(q);
          const matchGeneric = prod.genericName.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchGeneric) return false;
        }
        if (selectedDosage !== 'ALL' && prod.dosageForm.toLowerCase() !== selectedDosage.toLowerCase()) {
          return false;
        }
        if (prescriptionFilter === 'OTC' && prod.requiresPrescription) return false;
        if (prescriptionFilter === 'RX' && !prod.requiresPrescription) return false;
        return true;
      }).map((prod) => {
        const listings: MedicinePharmacyListing[] = INITIAL_INVENTORY.filter((inv) => {
          if (inv.productId !== prod.id || !inv.isActive || inv.status === 'UNAVAILABLE') return false;
          const pharm = verifiedPharmacies.find((p) => p.id === inv.pharmacyId);
          if (!pharm) return false;
          if (selectedCity && pharm.city.toLowerCase() !== selectedCity.toLowerCase()) return false;
          return true;
        }).map((inv) => {
          const pharm = verifiedPharmacies.find((p) => p.id === inv.pharmacyId)!;
          return {
            pharmacyId: pharm.id,
            pharmacyName: pharm.name,
            pharmacyCity: pharm.city,
            pharmacyPincode: pharm.pincode,
            distanceKm: 1.2,
            inventoryId: inv.id,
            sellingPrice: inv.sellingPrice,
            mrp: inv.mrp,
            stockQuantity: inv.stockQuantity,
            status: inv.status,
            isVerified: true,
            operatingHours: pharm.operatingHours,
          };
        });

        const prices = listings.map((l) => l.sellingPrice);
        const minPrice = prices.length ? Math.min(...prices) : 0;
        const maxPrice = prices.length ? Math.max(...prices) : 0;

        return {
          product: prod,
          minPrice,
          maxPrice,
          availablePharmacyCount: listings.length,
          listings,
        };
      });

      setDiscoveryItems(items);
    };

    fetchDiscovery();
  }, [search, selectedCity, selectedDosage, prescriptionFilter]);

  const displayedItems = inStockOnly
    ? discoveryItems.filter((it) => it.availablePharmacyCount > 0)
    : discoveryItems;

  const handleOpenDetail = (item: MedicineDiscoveryItem) => {
    setSelectedProduct(item.product);
    setModalListings(item.listings);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-brand-50 border border-brand-200 text-brand-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full mb-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-700" />
              <span>Hyperlocal Medicine Discovery</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">Search Local Pharmacy Inventory</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare medicine prices and verify real-time availability across licensed neighborhood retail chemists.
            </p>
          </div>

          {/* City / Delivery Location Switcher */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs">
            <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-medium">Delivery Zone:</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent font-bold text-slate-800 border-none focus:outline-none cursor-pointer text-xs"
              >
                <option value="Bengaluru">Bengaluru, KA</option>
                <option value="Mumbai">Mumbai, MH</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Hyderabad">Hyderabad, TS</option>
                <option value="Chennai">Chennai, TN</option>
                <option value="Pune">Pune, MH</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Bar & Filters */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by medicine name, brand, or generic salt (e.g. Paracetamol, Dolo 650, Telmisartan, Augmentin)..."
              className="w-full pl-9 pr-3 py-2.5 text-sm text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            {/* Dosage forms */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 font-medium mr-1 text-[11px]">Form:</span>
              {['ALL', 'Tablet', 'Capsule', 'Syrup', 'Gel'].map((form) => (
                <button
                  key={form}
                  onClick={() => setSelectedDosage(form)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedDosage === form
                      ? 'bg-brand-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {form === 'ALL' ? 'All Forms' : form}
                </button>
              ))}
            </div>

            {/* Prescription & Stock Filters */}
            <div className="flex items-center gap-2">
              <select
                value={prescriptionFilter}
                onChange={(e) => setPrescriptionFilter(e.target.value as any)}
                className="bg-slate-100 border border-slate-200 text-slate-700 rounded-lg px-2 py-1 text-xs focus:outline-none"
              >
                <option value="ALL">All Regulations</option>
                <option value="OTC">OTC Only (No Rx)</option>
                <option value="RX">Prescription Required (Rx)</option>
              </select>

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 text-xs">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-brand-700"
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Available Formulations ({displayedItems.length})
            </h2>
            <span className="text-[11px] text-slate-400">Verified retail pharmacy pricing</span>
          </div>

          {displayedItems.length === 0 ? (
            <EmptyState
              icon={Pill}
              title="No Medicines Found Matching Search"
              description="Try searching for generic salt names (e.g. Paracetamol, Metformin) or check spelling. All active inventory is cross-referenced with licensed Indian chemists."
              actionText="Reset Search"
              onAction={() => {
                setSearch('');
                setSelectedDosage('ALL');
                setPrescriptionFilter('ALL');
                setInStockOnly(false);
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedItems.map((item) => {
                const prod = item.product;
                const hasStock = item.availablePharmacyCount > 0;

                return (
                  <Card
                    key={prod.id}
                    className="bg-white hover:border-brand-400 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <CardContent className="p-4 space-y-3">
                      {/* Title & Rx Badge */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <h3 className="font-bold text-slate-900 text-sm">{prod.name}</h3>
                          <p className="text-xs text-slate-500 line-clamp-1">{prod.genericName}</p>
                          <p className="text-[11px] text-slate-400">{prod.packSize} • {prod.manufacturer}</p>
                        </div>
                        {prod.requiresPrescription ? (
                          <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded font-semibold whitespace-nowrap">
                            Rx Required
                          </span>
                        ) : (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium whitespace-nowrap">
                            OTC
                          </span>
                        )}
                      </div>

                      {/* Pricing & Availability */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-slate-400 block text-[11px]">Best Local Price</span>
                          {hasStock ? (
                            <span className="font-bold text-slate-900 text-sm">
                              From {formatINR(item.minPrice)}
                            </span>
                          ) : (
                            <span className="text-red-500 font-semibold text-xs">Out of Stock</span>
                          )}
                        </div>

                        <div className="text-right">
                          <span className="text-slate-400 block text-[11px]">Availability</span>
                          <span
                            className={`font-semibold text-xs ${
                              hasStock ? 'text-emerald-700' : 'text-slate-400'
                            }`}
                          >
                            {hasStock
                              ? `${item.availablePharmacyCount} chemist store${item.availablePharmacyCount > 1 ? 's' : ''}`
                              : 'Unavailable'}
                          </span>
                        </div>
                      </div>
                    </CardContent>

                    <div className="p-4 pt-0">
                      <Button
                        variant={hasStock ? 'primary' : 'outline'}
                        size="sm"
                        className="w-full text-xs justify-between"
                        onClick={() => handleOpenDetail(item)}
                      >
                        <span>{hasStock ? 'Compare Stores & Add' : 'View Medicine Details'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detail & Store Picker Modal */}
      <MedicineDetailModal
        product={selectedProduct}
        listings={modalListings}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </DashboardLayout>
  );
};
