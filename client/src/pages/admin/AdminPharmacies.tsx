import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Alert } from '../../components/common/Alert';
import { Store, ShieldCheck, Check, X, FileText } from 'lucide-react';

interface PharmacyVerificationRecord {
  id: string;
  name: string;
  ownerName: string;
  licenceNumber: string;
  phone: string;
  city: string;
  status: 'PENDING_VERIFICATION' | 'ACTIVE' | 'REJECTED';
}

export const AdminPharmacies: React.FC = () => {
  const [pharmacies, setPharmacies] = useState<PharmacyVerificationRecord[]>([
    {
      id: 'ph-1',
      name: 'Sanjivani Medicare & Retail Chemist',
      ownerName: 'Rajesh Gupta',
      licenceNumber: 'DL-KA-BLR-847291',
      phone: '+91 98111 22334',
      city: 'Bengaluru, Karnataka',
      status: 'PENDING_VERIFICATION',
    },
    {
      id: 'ph-2',
      name: 'Apollo Pharmacy Koramangala',
      ownerName: 'Sunil Nair',
      licenceNumber: 'DL-KA-BLR-109283',
      phone: '+91 98222 33445',
      city: 'Bengaluru, Karnataka',
      status: 'ACTIVE',
    },
  ]);

  const [notification, setNotification] = useState<string | null>(null);

  const updateStatus = (id: string, newStatus: 'ACTIVE' | 'REJECTED' | 'PENDING_VERIFICATION') => {
    setPharmacies((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    setNotification(
      `Pharmacy status updated to ${newStatus}. Statutory compliance record updated.`
    );
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Pharmacy Verification Queue</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Examine state retail drug licences (Form 20/21) and authorize dispensary operations.
          </p>
        </div>

        {notification && (
          <Alert variant="success" title="Administrative Action Logged">
            {notification}
          </Alert>
        )}

        <div className="space-y-4">
          {pharmacies.map((pharmacy) => (
            <Card key={pharmacy.id} className="bg-white">
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{pharmacy.name}</h3>
                    <Badge status={pharmacy.status} />
                  </div>
                  <p className="text-xs text-slate-600">
                    Proprietor / Pharmacist: <span className="font-semibold">{pharmacy.ownerName}</span> ({pharmacy.phone})
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                      Licence: {pharmacy.licenceNumber}
                    </span>
                    <span>• {pharmacy.city}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {pharmacy.status === 'PENDING_VERIFICATION' ? (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => updateStatus(pharmacy.id, 'ACTIVE')}
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve Licence</span>
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => updateStatus(pharmacy.id, 'REJECTED')}
                      >
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateStatus(
                          pharmacy.id,
                          pharmacy.status === 'ACTIVE' ? 'PENDING_VERIFICATION' : 'ACTIVE'
                        )
                      }
                    >
                      {pharmacy.status === 'ACTIVE' ? 'Suspend Operations' : 'Re-verify'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};
