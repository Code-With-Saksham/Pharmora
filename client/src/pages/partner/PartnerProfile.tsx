import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Alert } from '../../components/common/Alert';
import { useAuth } from '../../context/AuthContext';
import { Bike, Shield, FileCheck } from 'lucide-react';

export const PartnerProfile: React.FC = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || 'Vikram Singh');
  const [phone, setPhone] = useState(user?.phone || '+91 99887 76655');
  const [vehicleNo, setVehicleNo] = useState('KA-01-AB-1234');
  const [dlNumber, setDlNumber] = useState('DL-0420110012345');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Partner Profile & Documents</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Identity verification and vehicle licensing particulars.
          </p>
        </div>

        {saved && (
          <Alert variant="success" title="Profile Saved">
            Your delivery partner details were updated successfully.
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Rider Identity</span>
                <Badge role="DELIVERY_PARTNER" status={user?.status} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Legal Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <Input
                    label="Registered Email"
                    value={user?.email || ''}
                    disabled
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Mobile Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <Input
                    label="Vehicle Type"
                    value="Two-Wheeler (Motorcycle)"
                    disabled
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Vehicle Registration"
                    value={vehicleNo}
                    onChange={(e) => setVehicleNo(e.target.value)}
                  />
                  <Input
                    label="Driving Licence Number"
                    value={dlNumber}
                    disabled
                    helperText="Document locked during verification."
                  />
                </div>

                <Button type="submit" variant="primary" size="sm">
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-base">Document Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-slate-600">
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <FileCheck className="w-4 h-4 text-amber-600" />
                  <span>Aadhaar & DL Verification</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  Documents submitted. Awaiting administrative review.
                </p>
              </div>

              <div className="pt-2 text-slate-500 space-y-1 text-[11px]">
                <p>• Emergency Transit Kit: Provided upon verification</p>
                <p>• Insulated Bag: Required for heat-sensitive drugs</p>
                <p>• Police Verification: In process</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
