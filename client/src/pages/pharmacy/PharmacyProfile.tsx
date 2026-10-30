import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Alert } from '../../components/common/Alert';
import { useAuth } from '../../context/AuthContext';
import { Store, ShieldCheck } from 'lucide-react';

export const PharmacyProfile: React.FC = () => {
  const { user } = useAuth();
  const [storeName, setStoreName] = useState('Sanjivani Medicare');
  const [pharmacistName, setPharmacistName] = useState(user?.fullName || 'Rajesh Gupta');
  const [licenceNo, setLicenceNo] = useState('DL-KA-BLR-847291');
  const [gstin, setGstin] = useState('29AAAAA1234A1Z5');
  const [phone, setPhone] = useState(user?.phone || '+91 98111 22334');
  const [address, setAddress] = useState('Shop No. 4, 100ft Road, Indiranagar, Bengaluru, KA - 560038');
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
          <h1 className="text-xl font-bold text-slate-900">Pharmacy Store Profile</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered medical store particulars and statutory licensing compliance records.
          </p>
        </div>

        {saved && (
          <Alert variant="success" title="Profile Updated">
            Pharmacy details updated successfully.
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Store Information</span>
                <Badge role="PHARMACY_OWNER" status={user?.status} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Store Trade Name"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                  />
                  <Input
                    label="Authorized Pharmacist"
                    value={pharmacistName}
                    onChange={(e) => setPharmacistName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Drug Licence (Form 20/21)"
                    value={licenceNo}
                    disabled
                    helperText="Licence verification is locked. Contact admin to renew."
                  />
                  <Input
                    label="GSTIN"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                  />
                </div>

                <Input
                  label="Store Address (Physical dispensary location)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />

                <Input
                  label="Store Contact Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                <Button type="submit" variant="primary" size="sm">
                  Save Store Profile
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Compliance & Licence Card */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-base">Licensing Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Drug Licence Verified</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Form 20 (Allopathic Retail) & Form 21 (Biologicals) verified under Drugs & Cosmetics Rules.
                </p>
              </div>

              <div className="pt-2 text-slate-500 space-y-1 text-[11px]">
                <p>• Validity: 31 Dec 2027</p>
                <p>• State Licensing Authority: Karnataka</p>
                <p>• Cold Chain Storage: Compliant</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
