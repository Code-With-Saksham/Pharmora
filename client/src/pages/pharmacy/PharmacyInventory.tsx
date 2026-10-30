import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Alert } from '../../components/common/Alert';
import { EmptyState } from '../../components/common/EmptyState';
import { PharmacyInventoryItem, MedicineProduct, InventoryStatus } from '../../types';
import { formatINR } from '../../lib/utils';
import { INITIAL_INVENTORY, INITIAL_CATALOG } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Power,
  AlertTriangle,
  CheckCircle2,
  X,
  Pill,
} from 'lucide-react';

export const PharmacyInventory: React.FC = () => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<PharmacyInventoryItem[]>([]);
  const [catalog, setCatalog] = useState<MedicineProduct[]>(INITIAL_CATALOG);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | InventoryStatus>('ALL');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Add Medicine Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<MedicineProduct | null>(null);
  const [formSellingPrice, setFormSellingPrice] = useState('');
  const [formMrp, setFormMrp] = useState('');
  const [formStock, setFormStock] = useState('20');
  const [formThreshold, setFormThreshold] = useState('5');
  const [formBatch, setFormBatch] = useState('');
  const [formExpiry, setFormExpiry] = useState('2027-12-31');

  // Quick Edit Modal State
  const [editItem, setEditItem] = useState<PharmacyInventoryItem | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');

  // Initial load
  useEffect(() => {
    // Populate Sanjivani inventory with catalog info
    const initial = INITIAL_INVENTORY.filter((inv) => inv.pharmacyId === 'ph-sanjivani').map((inv) => {
      const prod = INITIAL_CATALOG.find((p) => p.id === inv.productId);
      return {
        ...inv,
        product: prod,
      };
    });
    setInventory(initial);
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  // Helper to determine status
  const calculateStatus = (qty: number, threshold: number): InventoryStatus => {
    if (qty <= 0) return 'OUT_OF_STOCK';
    if (qty <= threshold) return 'LOW_STOCK';
    return 'IN_STOCK';
  };

  // Add medicine submission
  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCatalogItem) {
      showNotification('error', 'Please select a standardized medicine from the catalog.');
      return;
    }

    const price = parseFloat(formSellingPrice);
    const mrp = parseFloat(formMrp);
    const stock = parseInt(formStock, 10);
    const threshold = parseInt(formThreshold, 10);

    if (isNaN(price) || isNaN(mrp) || isNaN(stock) || isNaN(threshold)) {
      showNotification('error', 'All numeric fields must be valid.');
      return;
    }

    if (price > mrp) {
      showNotification('error', 'Selling price cannot exceed Maximum Retail Price (MRP).');
      return;
    }

    if (inventory.some((i) => i.productId === selectedCatalogItem.id)) {
      showNotification('error', 'This medicine formulation is already listed in your store inventory.');
      return;
    }

    const newItem: PharmacyInventoryItem = {
      id: `inv-sanjivani-${selectedCatalogItem.id}-${Date.now()}`,
      pharmacyId: 'ph-sanjivani',
      productId: selectedCatalogItem.id,
      product: selectedCatalogItem,
      sellingPrice: price,
      mrp,
      stockQuantity: stock,
      lowStockThreshold: threshold,
      status: calculateStatus(stock, threshold),
      batchNumber: formBatch || `BATCH-${Date.now().toString().slice(-4)}`,
      expiryDate: formExpiry,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setInventory([newItem, ...inventory]);
    setIsAddModalOpen(false);
    setSelectedCatalogItem(null);
    setFormSellingPrice('');
    setFormMrp('');
    showNotification('success', `${selectedCatalogItem.name} added to pharmacy inventory successfully.`);
  };

  // Edit price / stock submission
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;

    const price = parseFloat(editPrice);
    const stock = parseInt(editStock, 10);

    if (isNaN(price) || isNaN(stock) || price < 0 || stock < 0) {
      showNotification('error', 'Invalid price or stock quantity.');
      return;
    }

    if (price > editItem.mrp) {
      showNotification('error', 'Selling price cannot exceed Maximum Retail Price (MRP).');
      return;
    }

    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === editItem.id) {
          return {
            ...item,
            sellingPrice: price,
            stockQuantity: stock,
            status: item.status === 'UNAVAILABLE' ? 'UNAVAILABLE' : calculateStatus(stock, item.lowStockThreshold),
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      })
    );

    setEditItem(null);
    showNotification('success', 'Medicine inventory record updated successfully.');
  };

  // Toggle availability
  const handleToggleAvailability = (id: string) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'UNAVAILABLE'
            ? calculateStatus(item.stockQuantity, item.lowStockThreshold)
            : 'UNAVAILABLE';
          return {
            ...item,
            status: nextStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      })
    );
    showNotification('success', 'Medicine availability status changed.');
  };

  // Remove listing
  const handleRemove = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from your pharmacy inventory?`)) {
      setInventory((prev) => prev.filter((i) => i.id !== id));
      showNotification('success', `${name} removed from inventory.`);
    }
  };

  // Filtered Inventory
  const filteredInventory = inventory.filter((item) => {
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (search && item.product) {
      const q = search.toLowerCase();
      const matchName = item.product.name.toLowerCase().includes(q);
      const matchGeneric = item.product.genericName.toLowerCase().includes(q);
      const matchBatch = item.batchNumber?.toLowerCase().includes(q);
      if (!matchName && !matchGeneric && !matchBatch) return false;
    }
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Pharmacy Inventory & Stock</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage medicine prices in INR (₹), physical shelf counts, batch numbers, and availability.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setIsAddModalOpen(true);
              setCatalogSearch('');
              setSelectedCatalogItem(null);
            }}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Medicine to Stock</span>
          </Button>
        </div>

        {notification && (
          <Alert variant={notification.type === 'success' ? 'success' : 'destructive'} title="Inventory Update">
            {notification.message}
          </Alert>
        )}

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-400 block font-medium">Total Listings</span>
            <span className="text-lg font-bold text-slate-900">{inventory.length}</span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200">
            <span className="text-[11px] text-emerald-600 block font-medium">In Stock</span>
            <span className="text-lg font-bold text-emerald-700">
              {inventory.filter((i) => i.status === 'IN_STOCK').length}
            </span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200">
            <span className="text-[11px] text-amber-600 block font-medium">Low Stock Alerts</span>
            <span className="text-lg font-bold text-amber-600">
              {inventory.filter((i) => i.status === 'LOW_STOCK').length}
            </span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200">
            <span className="text-[11px] text-red-500 block font-medium">Out of Stock</span>
            <span className="text-lg font-bold text-red-600">
              {inventory.filter((i) => i.status === 'OUT_OF_STOCK').length}
            </span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search store inventory by name, salt, or batch number..."
              className="w-full pl-9 pr-3 py-2 text-sm text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
            {(['ALL', 'IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'UNAVAILABLE'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                  statusFilter === st
                    ? 'bg-brand-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Inventory Table */}
        <Card className="bg-white overflow-hidden shadow-xs">
          {filteredInventory.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={Package}
                title="No Medicines Match Filter"
                description="Use the 'Add Medicine to Stock' button above to link standardized products from the central catalog to your dispensary."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Medicine & Salt</th>
                    <th className="px-4 py-3">Batch & Expiry</th>
                    <th className="px-4 py-3">Price (INR)</th>
                    <th className="px-4 py-3">Available Stock</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & Salt */}
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 text-sm">{item.product?.name}</div>
                        <div className="text-[11px] text-slate-500">{item.product?.genericName} • {item.product?.strength}</div>
                        <div className="text-[10px] text-slate-400">{item.product?.packSize}</div>
                      </td>

                      {/* Batch & Expiry */}
                      <td className="px-4 py-3 font-mono text-[11px]">
                        <div className="text-slate-800">{item.batchNumber || '—'}</div>
                        <div className="text-slate-400">Exp: {item.expiryDate || '—'}</div>
                      </td>

                      {/* Selling Price & MRP */}
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{formatINR(item.sellingPrice)}</div>
                        <div className="text-[11px] text-slate-400 line-through">MRP {formatINR(item.mrp)}</div>
                      </td>

                      {/* Stock Quantity */}
                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-900 text-sm">{item.stockQuantity}</span>
                        <span className="text-[11px] text-slate-400 block">units</span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        {item.status === 'IN_STOCK' && (
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold text-[10px]">
                            In Stock
                          </span>
                        )}
                        {item.status === 'LOW_STOCK' && (
                          <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-semibold text-[10px]">
                            Low Stock (≤{item.lowStockThreshold})
                          </span>
                        )}
                        {item.status === 'OUT_OF_STOCK' && (
                          <span className="bg-red-50 text-red-800 border border-red-200 px-2 py-0.5 rounded-full font-semibold text-[10px]">
                            Out of Stock
                          </span>
                        )}
                        {item.status === 'UNAVAILABLE' && (
                          <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full font-semibold text-[10px]">
                            Unavailable
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditItem(item);
                              setEditPrice(item.sellingPrice.toString());
                              setEditStock(item.stockQuantity.toString());
                            }}
                            className="p-1.5 text-slate-500 hover:text-brand-700 rounded-md hover:bg-slate-100"
                            title="Edit Price or Stock"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleAvailability(item.id)}
                            className={`p-1.5 rounded-md hover:bg-slate-100 ${
                              item.status === 'UNAVAILABLE' ? 'text-slate-400' : 'text-emerald-600'
                            }`}
                            title={item.status === 'UNAVAILABLE' ? 'Mark Available' : 'Mark Unavailable'}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleRemove(item.id, item.product?.name || 'Item')}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50"
                            title="Remove Listing"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* MODAL 1: Add Medicine from Central Catalog */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Add Medicine from Central Catalog</h3>
                <p className="text-xs text-slate-500">Select a standardized formulary product to publish to your store.</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMedicine} className="space-y-4">
              {/* Step 1: Search Catalog */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">1. Select Medicine Formulation</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    placeholder="Type brand or salt name (e.g. Dolo, Telma, Metformin)..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-brand-600"
                  />
                </div>

                {/* Catalog selection list */}
                <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100 bg-slate-50 mt-1">
                  {catalog
                    .filter(
                      (p) =>
                        p.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                        p.genericName.toLowerCase().includes(catalogSearch.toLowerCase())
                    )
                    .slice(0, 5)
                    .map((catItem) => (
                      <div
                        key={catItem.id}
                        onClick={() => {
                          setSelectedCatalogItem(catItem);
                          // Auto-fill suggested MRP
                          setFormMrp('150.00');
                          setFormSellingPrice('140.00');
                        }}
                        className={`p-2.5 text-xs cursor-pointer hover:bg-brand-50 transition-colors flex items-center justify-between ${
                          selectedCatalogItem?.id === catItem.id
                            ? 'bg-brand-100/70 border-l-4 border-brand-700 font-semibold'
                            : ''
                        }`}
                      >
                        <div>
                          <div className="font-bold text-slate-900">{catItem.name}</div>
                          <div className="text-[11px] text-slate-500">{catItem.genericName} • {catItem.strength} ({catItem.packSize})</div>
                        </div>
                        {selectedCatalogItem?.id === catItem.id && (
                          <span className="text-[10px] bg-brand-700 text-white px-2 py-0.5 rounded font-bold">
                            Selected
                          </span>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              {selectedCatalogItem && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1">
                  <span className="font-bold text-emerald-900">Selected: {selectedCatalogItem.name}</span>
                  <p className="text-[11px] text-emerald-800">
                    {selectedCatalogItem.packSize} • Mfg: {selectedCatalogItem.manufacturer}
                  </p>
                </div>
              )}

              {/* Step 2: Pricing and Stock Fields */}
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Selling Price (₹)"
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 140.00"
                  value={formSellingPrice}
                  onChange={(e) => setFormSellingPrice(e.target.value)}
                />
                <Input
                  label="MRP (₹)"
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 150.00"
                  value={formMrp}
                  onChange={(e) => setFormMrp(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Stock Units on Shelf"
                  type="number"
                  required
                  placeholder="20"
                  value={formStock}
                  onChange={(e) => setFormStock(e.target.value)}
                />
                <Input
                  label="Low Stock Warning Limit"
                  type="number"
                  required
                  placeholder="5"
                  value={formThreshold}
                  onChange={(e) => setFormThreshold(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Batch Number"
                  placeholder="e.g. BATCH-8942"
                  value={formBatch}
                  onChange={(e) => setFormBatch(e.target.value)}
                />
                <Input
                  label="Expiry Date"
                  type="date"
                  required
                  value={formExpiry}
                  onChange={(e) => setFormExpiry(e.target.value)}
                />
              </div>

              <div className="pt-2 flex gap-2 justify-end">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Add to Pharmacy Inventory
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Quick Edit Selling Price & Stock */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">Update Stock & Price</h3>
                <p className="text-xs text-slate-500">{editItem.product?.name}</p>
              </div>
              <button onClick={() => setEditItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <Input
                label="Selling Price in INR (₹)"
                type="number"
                step="0.01"
                required
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                helperText={`MRP is ${formatINR(editItem.mrp)}`}
              />

              <Input
                label="Shelf Stock Quantity (Units)"
                type="number"
                required
                value={editStock}
                onChange={(e) => setEditStock(e.target.value)}
              />

              <div className="pt-2 flex gap-2 justify-end">
                <Button type="button" variant="outline" size="sm" onClick={() => setEditItem(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
