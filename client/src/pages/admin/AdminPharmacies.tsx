import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Alert } from '../../components/common/Alert';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { 
  Store, 
  ShieldCheck, 
  Check, 
  X, 
  FileText, 
  Clock, 
  AlertTriangle, 
  PauseCircle, 
  PlayCircle,
  Building2,
  MapPin,
  Phone,
  Calendar
} from 'lucide-react';
import { PharmacyVerificationStatus } from '../../types';

interface AdminPharmacyRecord {
  id: string;
  name: string;
  pharmacistName: string;
  licenceNumber: string;
  gstin?: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  status: PharmacyVerificationStatus;
  rejectionReason?: string;
  submittedAt: string;
  updatedAt: string;
}

const INITIAL_PHARMACIES: AdminPharmacyRecord[] = [
  {
    id: 'ph-sanjivani',
    name: 'Sanjivani Medicare & Retail Chemist',
    pharmacistName: 'Rajesh Gupta',
    licenceNumber: 'DL-KA-BLR-847291',
    gstin: '29AAAAA1234A1Z5',
    phone: '+91 98111 22334',
    email: 'sanjivani.meds@example.com',
    address: 'Shop No. 4, 100ft Road, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    status: 'VERIFIED',
    submittedAt: '2026-10-25 10:30 AM',
    updatedAt: '2026-10-25 02:15 PM',
  },
  {
    id: 'ph-apollo-indiranagar',
    name: 'Apollo Pharmacy Indiranagar',
    pharmacistName: 'Sunil Nair',
    licenceNumber: 'DL-KA-BLR-109283',
    gstin: '29BBBBB5678B2Z1',
    phone: '+91 98222 33445',
    email: 'apollo.indiranagar@example.com',
    address: 'No. 542, CMH Road, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    status: 'VERIFIED',
    submittedAt: '2026-10-26 11:00 AM',
    updatedAt: '2026-10-26 04:45 PM',
  },
  {
    id: 'ph-carecure',
    name: 'Care & Cure Chemist',
    pharmacistName: 'Amit Verma',
    licenceNumber: 'DL-KA-BLR-554433',
    phone: '+91 98444 55667',
    email: 'carecure.koramangala@example.com',
    address: 'No. 88, 17th Main, 5th Block, Koramangala',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560095',
    status: 'PENDING_VERIFICATION',
    submittedAt: '2026-10-30 08:30 AM',
    updatedAt: '2026-10-30 08:30 AM',
  },
  {
    id: 'ph-medplus-kora',
    name: 'MedPlus Health Services Koramangala',
    pharmacistName: 'Priya Sharma',
    licenceNumber: 'DL-KA-BLR-443219',
    phone: '+91 98333 44556',
    email: 'medplus.kora@example.com',
    address: 'Plot 12, 80ft Road, 4th Block, Koramangala',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560034',
    status: 'VERIFIED',
    submittedAt: '2026-10-27 09:15 AM',
    updatedAt: '2026-10-27 03:00 PM',
  },
  {
    id: 'ph-citychem',
    name: 'City Medicos & Healthcare',
    pharmacistName: 'Harish Patel',
    licenceNumber: 'DL-KA-BLR-998877',
    phone: '+91 98777 66554',
    email: 'citymeds@example.com',
    address: 'Old Airport Road, Kodihalli',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560008',
    status: 'REJECTED',
    rejectionReason: 'Invalid Form 20 retail licence number. State licensing portal record does not match registered owner name.',
    submittedAt: '2026-10-28 01:20 PM',
    updatedAt: '2026-10-28 04:10 PM',
  },
];

export const AdminPharmacies: React.FC = () => {
  const { user } = useAuth();
  const [pharmacies, setPharmacies] = useState<AdminPharmacyRecord[]>(INITIAL_PHARMACIES);
  const [filter, setFilter] = useState<string>('ALL');
  const [notification, setNotification] = useState<{ type: 'success' | 'warning' | 'destructive' | 'info'; message: string } | null>(null);


  // Reject modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const updateStatus = async (id: string, newStatus: PharmacyVerificationStatus, reason?: string) => {
    try {
      const token = localStorage.getItem('pharmora_token');
      await fetch(`/api/admin/pharmacy/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          status: newStatus,
          rejectionReason: reason,
        }),
      });
    } catch (e) {
      // offline / mock mode fallback
    }

    setPharmacies((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: newStatus,
              rejectionReason: reason || item.rejectionReason,
              updatedAt: new Date().toLocaleString(),
            }
          : item
      )
    );

    const actionText = 
      newStatus === 'VERIFIED' ? 'approved & enabled for public discovery' :
      newStatus === 'REJECTED' ? `rejected (${reason})` :
      newStatus === 'SUSPENDED' ? 'suspended from marketplace' : 'status changed';

    setNotification({
      type: newStatus === 'VERIFIED' ? 'success' : 'warning',
      message: `Dispensary ${id} ${actionText}. Statutory audit log entry generated by Administrator.`,
    });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleOpenRejectModal = (id: string) => {
    setSelectedPharmacyId(id);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!selectedPharmacyId) return;
    if (!rejectReason.trim()) {
      alert('Please state an explicit rejection reason for statutory audit trail compliance.');
      return;
    }
    updateStatus(selectedPharmacyId, 'REJECTED', rejectReason);
    setRejectModalOpen(false);
    setSelectedPharmacyId(null);
  };

  const filteredPharmacies = pharmacies.filter((p) => {
    if (filter === 'ALL') return true;
    return p.status === filter;
  });

  const getStatusBadge = (status: PharmacyVerificationStatus) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <Check className="w-3 h-3 text-emerald-600" />
            VERIFIED
          </span>
        );
      case 'PENDING_VERIFICATION':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3 text-amber-600" />
            PENDING REVIEW
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
            <X className="w-3 h-3 text-rose-600" />
            REJECTED
          </span>
        );
      case 'SUSPENDED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            <AlertTriangle className="w-3 h-3 text-red-600" />
            SUSPENDED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            DRAFT
          </span>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Pharmacy Verification Queue</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Examine state retail drug licences (Form 20/21) and authorize or suspend dispensary operations.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
            {['ALL', 'PENDING_VERIFICATION', 'VERIFIED', 'REJECTED', 'SUSPENDED'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  filter === f
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f === 'PENDING_VERIFICATION' ? 'Pending' : f}
              </button>
            ))}
          </div>
        </div>

        {notification && (
          <Alert variant={notification.type} title="Administrative Audit Action Logged">
            {notification.message}
          </Alert>
        )}

        {/* Pharmacy Cards List */}
        <div className="space-y-4">
          {filteredPharmacies.length === 0 ? (
            <Card className="bg-white p-8 text-center text-slate-500 text-xs">
              No pharmacies matching the current status filter.
            </Card>
          ) : (
            filteredPharmacies.map((pharmacy) => (
              <Card key={pharmacy.id} className="bg-white">
                <CardContent className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-bold text-slate-900 text-base">{pharmacy.name}</h3>
                      {getStatusBadge(pharmacy.status)}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-600">
                      <div>
                        Supervising Pharmacist:{' '}
                        <span className="font-semibold text-slate-900">{pharmacy.pharmacistName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{pharmacy.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{pharmacy.address}, {pharmacy.city} ({pharmacy.pincode})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[11px]">
                          Licence: {pharmacy.licenceNumber}
                        </span>
                        {pharmacy.gstin && (
                          <span className="text-[10px] text-slate-400">GSTIN: {pharmacy.gstin}</span>
                        )}
                      </div>
                    </div>

                    {pharmacy.rejectionReason && (
                      <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Rejection Note: </span>
                          {pharmacy.rejectionReason}
                        </div>
                      </div>
                    )}

                    <div className="text-[11px] text-slate-400 flex items-center gap-3 pt-1">
                      <span>Submitted: {pharmacy.submittedAt}</span>
                      <span>•</span>
                      <span>Last Audited: {pharmacy.updatedAt}</span>
                    </div>
                  </div>

                  {/* Action Controls */}
                  <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                    {pharmacy.status === 'PENDING_VERIFICATION' && (
                      <>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="gap-1.5 shadow-xs"
                          onClick={() => updateStatus(pharmacy.id, 'VERIFIED')}
                        >
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>Approve Form 20/21</span>
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="gap-1.5"
                          onClick={() => handleOpenRejectModal(pharmacy.id)}
                        >
                          <X className="w-4 h-4" />
                          <span>Reject Application</span>
                        </Button>
                      </>
                    )}

                    {pharmacy.status === 'VERIFIED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-700 hover:bg-red-50 hover:border-red-300 gap-1.5"
                        onClick={() => updateStatus(pharmacy.id, 'SUSPENDED')}
                      >
                        <PauseCircle className="w-4 h-4" />
                        <span>Suspend Operations</span>
                      </Button>
                    )}

                    {pharmacy.status === 'SUSPENDED' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => updateStatus(pharmacy.id, 'VERIFIED')}
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>Reinstate Dispensary</span>
                      </Button>
                    )}

                    {pharmacy.status === 'REJECTED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => updateStatus(pharmacy.id, 'PENDING_VERIFICATION')}
                      >
                        <Clock className="w-4 h-4" />
                        <span>Send for Re-verification</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Rejection Modal */}
        {rejectModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <span>Reject Pharmacy Licencing</span>
                </h3>
                <button
                  onClick={() => setRejectModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-slate-600">
                  Please specify the statutory justification for rejecting this retail pharmacy application. This reason is logged to the permanent regulatory audit trail and displayed to the pharmacy owner.
                </p>

                <textarea
                  rows={4}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Registered address does not match Form 20 retail permit, or cold chain storage requirements not met under Drugs and Cosmetics Rules."
                  className="w-full text-xs rounded-lg border border-slate-300 p-3 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <Button variant="ghost" size="sm" onClick={() => setRejectModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="danger" size="sm" onClick={handleConfirmReject}>
                  Confirm Rejection
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

