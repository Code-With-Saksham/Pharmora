import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Alert } from '../../components/common/Alert';
import { Bike, Check, X, ShieldCheck } from 'lucide-react';

interface PartnerVerificationRecord {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  dlNumber: string;
  status: 'PENDING_VERIFICATION' | 'ACTIVE' | 'REJECTED';
}

export const AdminPartners: React.FC = () => {
  const [partners, setPartners] = useState<PartnerVerificationRecord[]>([
    {
      id: 'pt-1',
      name: 'Vikram Singh',
      phone: '+91 99887 76655',
      vehicleType: 'Two-Wheeler (Motorcycle)',
      vehicleNumber: 'KA-01-AB-1234',
      dlNumber: 'DL-0420110012345',
      status: 'PENDING_VERIFICATION',
    },
    {
      id: 'pt-2',
      name: 'Mohammed Rizwan',
      phone: '+91 98333 44556',
      vehicleType: 'EV Two-Wheeler',
      vehicleNumber: 'KA-05-EV-9876',
      dlNumber: 'DL-0520180098765',
      status: 'ACTIVE',
    },
  ]);

  const [notification, setNotification] = useState<string | null>(null);

  const updateStatus = (id: string, newStatus: 'ACTIVE' | 'REJECTED' | 'PENDING_VERIFICATION') => {
    setPartners((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    setNotification(`Partner status updated to ${newStatus}. Access policies updated.`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Delivery Partner Verifications</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Vet courier identities, driving licences, and vehicle registration before approving for live medicine dispatch.
          </p>
        </div>

        {notification && (
          <Alert variant="success" title="Verification Updated">
            {notification}
          </Alert>
        )}

        <div className="space-y-4">
          {partners.map((partner) => (
            <Card key={partner.id} className="bg-white">
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{partner.name}</h3>
                    <Badge status={partner.status} />
                  </div>
                  <p className="text-xs text-slate-600">
                    Contact: {partner.phone} • Vehicle: {partner.vehicleType} ({partner.vehicleNumber})
                  </p>
                  <p className="text-[11px] font-mono text-slate-500">
                    Driving Licence: {partner.dlNumber}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {partner.status === 'PENDING_VERIFICATION' ? (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => updateStatus(partner.id, 'ACTIVE')}
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve Courier</span>
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => updateStatus(partner.id, 'REJECTED')}
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
                          partner.id,
                          partner.status === 'ACTIVE' ? 'PENDING_VERIFICATION' : 'ACTIVE'
                        )
                      }
                    >
                      {partner.status === 'ACTIVE' ? 'Suspend Rider' : 'Re-verify'}
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
