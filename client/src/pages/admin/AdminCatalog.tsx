import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Alert } from '../../components/common/Alert';
import { MedicineProduct } from '../../types';
import { MOCK_CATALOG_PRODUCTS } from '../../data/mockData';
import { 
  Package, 
  Search, 
  Plus, 
  Edit, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Filter, 
  Pill, 
  ShieldAlert,
  X
} from 'lucide-react';

export const AdminCatalog: React.FC = () => {
  const [products, setProducts] = useState<MedicineProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedForm, setSelectedForm] = useState('ALL');
  const [selectedRx, setSelectedRx] = useState('ALL');
  const [notification, setNotification] = useState<{ type: 'success' | 'warning' | 'destructive' | 'info'; message: string } | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<MedicineProduct | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [strength, setStrength] = useState('');
  const [dosageForm, setDosageForm] = useState('Tablet');
  const [packSize, setPackSize] = useState('10 tablets / strip');
  const [manufacturer, setManufacturer] = useState('');
  const [description, setDescription] = useState('');
  const [requiresPrescription, setRequiresPrescription] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    // Load from server or localStorage
    const saved = localStorage.getItem('pharmora_admin_catalog');
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch (e) {
        setProducts(MOCK_CATALOG_PRODUCTS);
      }
    } else {
      setProducts(MOCK_CATALOG_PRODUCTS);
    }
  }, []);

  const saveCatalogState = (newProducts: MedicineProduct[]) => {
    setProducts(newProducts);
    localStorage.setItem('pharmora_admin_catalog', JSON.stringify(newProducts));
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName('');
    setBrandName('');
    setGenericName('');
    setStrength('');
    setDosageForm('Tablet');
    setPackSize('10 tablets / strip');
    setManufacturer('');
    setDescription('');
    setRequiresPrescription(false);
    setIsActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (p: MedicineProduct) => {
    setEditingProduct(p);
    setName(p.name);
    setBrandName(p.brandName);
    setGenericName(p.genericName);
    setStrength(p.strength);
    setDosageForm(p.dosageForm);
    setPackSize(p.packSize);
    setManufacturer(p.manufacturer || '');
    setDescription(p.description || '');
    setRequiresPrescription(p.requiresPrescription);
    setIsActive(p.status === 'ACTIVE' || p.isActive === true);
    setModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !brandName.trim() || !genericName.trim() || !strength.trim()) {
      alert('Please fill in all mandatory medication formulation fields.');
      return;
    }

    if (editingProduct) {
      // Update
      const updatedList = products.map((item) =>
        item.id === editingProduct.id
          ? {
              ...item,
              name,
              brandName,
              genericName,
              strength,
              dosageForm,
              packSize,
              manufacturer,
              description,
              requiresPrescription,
              status: isActive ? ('ACTIVE' as const) : ('INACTIVE' as const),
              isActive,
              updatedAt: new Date().toISOString(),
            }
          : item
      );
      saveCatalogState(updatedList);
      setNotification({
        type: 'success',
        message: `Medication "${brandName}" updated in central formulary.`,
      });
    } else {
      // Add
      const newProduct: MedicineProduct = {
        id: `med-${Date.now()}`,
        name,
        brandName,
        genericName,
        strength,
        dosageForm,
        packSize,
        manufacturer,
        description,
        requiresPrescription,
        status: isActive ? 'ACTIVE' : 'INACTIVE',
        isActive,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveCatalogState([newProduct, ...products]);
      setNotification({
        type: 'success',
        message: `Medication "${brandName} (${genericName})" added to central formulary. Licensed pharmacies can now map inventory.`,
      });
    }


    setModalOpen(false);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleToggleActive = (id: string) => {
    const updated = products.map((item) => {
      if (item.id !== id) return item;
      const isCurrentlyActive = item.status === 'ACTIVE' || item.isActive === true;
      return {
        ...item,
        status: isCurrentlyActive ? ('INACTIVE' as const) : ('ACTIVE' as const),
        isActive: !isCurrentlyActive,
      };
    });
    saveCatalogState(updated);
  };


  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      p.brandName.toLowerCase().includes(q) ||
      p.genericName.toLowerCase().includes(q) ||
      p.strength.toLowerCase().includes(q);

    const matchesForm = selectedForm === 'ALL' || p.dosageForm.toLowerCase() === selectedForm.toLowerCase();
    const matchesRx =
      selectedRx === 'ALL' ||
      (selectedRx === 'RX' && p.requiresPrescription) ||
      (selectedRx === 'OTC' && !p.requiresPrescription);

    return matchesSearch && matchesForm && matchesRx;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Standardized Medicine Formulary Catalog</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Centrally standardized Indian pharmaceutical drugs, chemical salts, and Schedule H prescription classifications.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={handleOpenAdd} className="gap-1.5 shadow-xs">
            <Plus className="w-4 h-4" />
            <span>Add Medicine to Formulary</span>
          </Button>
        </div>

        {notification && (
          <Alert variant={notification.type} title="Formulary Notice">
            {notification.message}
          </Alert>
        )}

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by drug trade name, chemical salt, or strength (e.g. Paracetamol, Telmisartan, 650mg)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedForm}
                onChange={(e) => setSelectedForm(e.target.value)}
                className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700 outline-none"
              >
                <option value="ALL">All Dosage Forms</option>
                <option value="Tablet">Tablets</option>
                <option value="Capsule">Capsules</option>
                <option value="Syrup">Syrups</option>
                <option value="Gel">Gels & Ointments</option>
                <option value="Injection">Injections</option>
              </select>

              <select
                value={selectedRx}
                onChange={(e) => setSelectedRx(e.target.value)}
                className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700 outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="OTC">OTC (Non-Prescription)</option>
                <option value="RX">Schedule H (Rx Required)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Formulary Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Brand & Formulary Name</th>
                  <th className="py-3 px-4">Generic Salt / Ingredient</th>
                  <th className="py-3 px-4">Strength & Form</th>
                  <th className="py-3 px-4">Pack Size</th>
                  <th className="py-3 px-4">Schedule / Rx</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      No standardized medicines found matching search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{p.brandName}</div>
                        <div className="text-[11px] text-slate-500">{p.name}</div>
                        {p.manufacturer && (
                          <div className="text-[10px] text-slate-400">Mfr: {p.manufacturer}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {p.genericName}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <span className="font-mono font-semibold">{p.strength}</span> • {p.dosageForm}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{p.packSize}</td>
                      <td className="py-3 px-4">
                        {p.requiresPrescription ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <ShieldAlert className="w-3 h-3 text-amber-600" />
                            Schedule H (Rx)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            OTC
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleActive(p.id)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer ${
                            p.status === 'ACTIVE' || p.isActive === true
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                          title="Click to toggle active formulary state"
                        >
                          {p.status === 'ACTIVE' || p.isActive === true ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-slate-400" />
                              Inactive
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(p)}
                          className="gap-1 text-slate-600 hover:text-brand-700"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-brand-700" />
                  <span>{editingProduct ? 'Edit Standard Formulary Medicine' : 'Add Medicine to Central Formulary'}</span>
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitForm} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Brand Name *"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g. Dolo 650, Telma 40"
                    required
                  />
                  <Input
                    label="Formal Product Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dolo 650mg Paracetamol Tablets"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Generic Chemical Salt / Salt Combination *"
                    value={genericName}
                    onChange={(e) => setGenericName(e.target.value)}
                    placeholder="e.g. Paracetamol, Telmisartan IP"
                    required
                  />
                  <Input
                    label="Strength / Potency *"
                    value={strength}
                    onChange={(e) => setStrength(e.target.value)}
                    placeholder="e.g. 650mg, 40mg, 500mg/5ml"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Dosage Form *
                    </label>
                    <select
                      value={dosageForm}
                      onChange={(e) => setDosageForm(e.target.value)}
                      className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white outline-none focus:ring-1 focus:ring-brand-500"
                    >
                      <option value="Tablet">Tablet</option>
                      <option value="Capsule">Capsule</option>
                      <option value="Syrup">Syrup</option>
                      <option value="Suspension">Suspension</option>
                      <option value="Gel">Gel / Ointment</option>
                      <option value="Cream">Cream</option>
                      <option value="Drops">Drops</option>
                      <option value="Inhaler">Inhaler</option>
                      <option value="Injection">Injection</option>
                    </select>
                  </div>

                  <Input
                    label="Pack Unit Size *"
                    value={packSize}
                    onChange={(e) => setPackSize(e.target.value)}
                    placeholder="e.g. 15 tablets / strip"
                    required
                  />

                  <Input
                    label="Manufacturer"
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    placeholder="e.g. Micro Labs, Cipla"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Description & Pharmacological Notes
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Antipyretic and analgesic indicated for fever and acute pain relief."
                    className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:border-brand-500 outline-none"
                  />
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="requiresRx"
                      checked={requiresPrescription}
                      onChange={(e) => setRequiresPrescription(e.target.checked)}
                      className="rounded border-amber-400 text-amber-600 focus:ring-amber-500"
                    />
                    <label htmlFor="requiresRx" className="text-xs font-bold text-amber-900 cursor-pointer">
                      Schedule H / H1 Statutory Drug (Requires Valid Doctor's Prescription)
                    </label>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    Under Drugs & Cosmetics Act 1940, Schedule H drugs cannot be dispensed OTC without a Registered Medical Practitioner's signed prescription.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActiveToggle"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <label htmlFor="isActiveToggle" className="text-xs font-medium text-slate-700 cursor-pointer">
                    Active Formulary Product (Visible for Pharmacy Inventory Mapping)
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <Button variant="ghost" size="sm" type="button" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    {editingProduct ? 'Save Formulary Changes' : 'Publish Product to Formulary'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
