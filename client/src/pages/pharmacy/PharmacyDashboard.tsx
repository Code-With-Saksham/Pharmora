import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Alert } from '../../components/common/Alert';
import { useAuth } from '../../context/AuthContext';
import { 
  Store, 
  Package, 
  ShoppingBag, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Boxes,
  Percent
} from 'lucide-react';
import { PharmacyInventoryItem, PharmacyVerificationStatus } from '../../types';
import { MOCK_INITIAL_INVENTORY } from '../../data/mockData';

export const PharmacyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<PharmacyInventoryItem[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<PharmacyVerificationStatus>('VERIFIED');
  const [storeName, setStoreName] = useState('Sanjivani Medicare & Retail Chemist');
  const [licenceNumber, setLicenceNumber] = useState('DL-KA-BLR-847291');

  useEffect(() => {
    // Load profile
    const savedProfile = localStorage.getItem('pharmora_pharmacy_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setStoreName(parsed.name || storeName);
        setLicenceNumber(parsed.licenceNumber || licenceNumber);
        setVerificationStatus(parsed.verificationStatus || 'VERIFIED');
      } catch (e) {}
    }

    // Load inventory
    const savedInv = localStorage.getItem('pharmora_inventory_v2');
    if (savedInv) {
      try {
        setInventory(JSON.parse(savedInv));
      } catch (e) {
        setInventory(MOCK_INITIAL_INVENTORY);
      }
    } else {
      setInventory(MOCK_INITIAL_INVENTORY);
    }
  }, []);

  const totalListings = inventory.length;
  const inStockCount = inventory.filter((i) => i.status === 'IN_STOCK').length;
  const lowStockCount = inventory.filter((i) => i.status === 'LOW_STOCK').length;
  const outOfStockCount = inventory.filter((i) => i.status === 'OUT_OF_STOCK' || i.status === 'UNAVAILABLE').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Pharmacy Store Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900">{storeName}</h1>
              {verificationStatus === 'VERIFIED' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Dispensary
                </span>
              )}
              {verificationStatus === 'PENDING_VERIFICATION' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Verification Pending
                </span>
              )}
              {verificationStatus === 'SUSPENDED' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  Suspended
                </span>
              )}
              {verificationStatus === 'DRAFT' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  Draft
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Registered Pharmacist: {user?.fullName || 'Rajesh Gupta'} • Drug Licence: {licenceNumber} • Bengaluru, KA
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/pharmacy/inventory">
              <Button variant="primary" size="sm" className="gap-1.5 shadow-xs">
                <Plus className="w-4 h-4" />
                <span>Add Inventory</span>
              </Button>
            </Link>
            <Link to="/pharmacy/profile">
              <Button variant="outline" size="sm">
                Store Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Verification Status Banner if pending or unverified */}
        {verificationStatus === 'PENDING_VERIFICATION' && (
          <Alert variant="warning" title="Verification Pending Administrative Review">
            Your pharmacy licence documents (Form 20/21) are currently being reviewed by the PHARMORA compliance team. 
            Once verified by an administrator, your inventory will automatically become visible to nearby patients.
          </Alert>
        )}

        {verificationStatus === 'DRAFT' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900">
            <div>
              <h4 className="text-sm font-semibold">Store Profile Incomplete</h4>
              <p className="text-xs text-amber-800 mt-0.5">
                Complete your dispensary address, operating hours, and licence registration to submit for verification.
              </p>
            </div>
            <Link to="/pharmacy/profile">
              <Button variant="secondary" size="sm">
                Complete Profile →
              </Button>
            </Link>
          </div>
        )}

        {verificationStatus === 'SUSPENDED' && (
          <Alert variant="destructive" title="Store Operations Suspended">
            Your store is currently suspended. Customer orders cannot be fulfilled and your listings are hidden from search.
          </Alert>
        )}


        {/* Real Inventory Operational Metric Shells */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white">
            <CardContent className="p-4 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-500">Active Listings</p>
                <Package className="w-4 h-4 text-brand-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{totalListings}</p>
              <p className="text-[11px] text-slate-500">Standardized formulary items</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-500">In Stock Medicines</p>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-emerald-700">{inStockCount}</p>
              <p className="text-[11px] text-emerald-600">Available for customer cart</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-500">Low Stock Warnings</p>
                <AlertCircle className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-amber-700">{lowStockCount}</p>
              <p className="text-[11px] text-amber-600">Near reorder threshold</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-500">Out of Stock</p>
                <Boxes className="w-4 h-4 text-rose-600" />
              </div>
              <p className="text-2xl font-bold text-rose-700">{outOfStockCount}</p>
              <p className="text-[11px] text-rose-500">Hidden from discovery</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Inventory Summary Preview */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Current Medicine Inventory</h2>
              <p className="text-xs text-slate-500">
                Manage stock levels, batch numbers, and retail prices in INR (₹).
              </p>
            </div>
            <Link to="/pharmacy/inventory">
              <Button variant="outline" size="sm" className="gap-1.5">
                <span>Manage All Inventory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Medicine / Brand</th>
                  <th className="py-2.5 px-3">Dosage / Form</th>
                  <th className="py-2.5 px-3">Stock Units</th>
                  <th className="py-2.5 px-3">Selling Price</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventory.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {item.product?.name || 'Medicine'}
                      <span className="block text-[11px] font-normal text-slate-500">
                        {item.product?.genericName}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {item.product?.dosageForm} ({item.product?.strength})
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">
                      {item.stockQuantity} {item.stockQuantity <= item.lowStockThreshold && (
                        <span className="text-[10px] text-amber-600 ml-1">⚠️ Low</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-brand-900">
                      ₹{item.sellingPrice.toFixed(2)}
                      {item.mrp && <span className="text-[10px] text-slate-400 font-normal line-through ml-1">₹{item.mrp.toFixed(2)}</span>}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          item.status === 'IN_STOCK'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'LOW_STOCK'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Callout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
            <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-brand-700" />
              <span>Standardized Central Formulary</span>
            </h3>
            <p className="text-xs text-slate-500">
              Pick medicines from PHARMORA's centralized, verified Indian medicine catalog with Schedule H flags and standard strengths.
            </p>
            <Link to="/pharmacy/inventory" className="inline-block pt-1">
              <Button variant="secondary" size="sm" className="gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>Add Medicines from Formulary</span>
              </Button>
            </Link>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
            <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-700" />
              <span>Dispensary Licensing & Geo Coordinates</span>
            </h3>
            <p className="text-xs text-slate-500">
              Ensure physical GPS coordinates and Form 20/21 drug licences are verified for local patient medicine discovery.
            </p>
            <Link to="/pharmacy/profile" className="inline-block pt-1">
              <Button variant="outline" size="sm">
                Update Store Details
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

