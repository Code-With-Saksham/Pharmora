import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Alert } from '../../components/common/Alert';
import { useAuth } from '../../context/AuthContext';
import { User, MapPin, Plus, Check } from 'lucide-react';

export const CustomerProfile: React.FC = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
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
          <h1 className="text-xl font-bold text-slate-900">Account & Delivery Profiles</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your personal contact details, verified mobile, and delivery addresses.
          </p>
        </div>

        {saved && (
          <Alert variant="success" title="Success">
            Your profile details have been saved successfully.
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Personal Info */}
          <Card className="bg-white md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Personal Information</span>
                <Badge role="CUSTOMER" status={user?.status} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <Input
                    label="Email Address"
                    value={user?.email || ''}
                    disabled
                    helperText="Email cannot be changed directly."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Mobile Number (India)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    helperText="Primary number for delivery partner OTP handovers."
                  />
                  <Input
                    label="Account Role"
                    value="CUSTOMER"
                    disabled
                    helperText="Role is protected and governed by server security."
                  />
                </div>

                <Button type="submit" variant="primary" size="sm">
                  Save Profile Changes
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Saved Addresses */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Saved Addresses</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-normal">
                  India Pincode Ready
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-700" />
                    Home (Default)
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                    Primary
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Flat 402, Shanti Heights, 12th Cross, Indiranagar, Bengaluru, KA - 560038
                </p>
              </div>

              <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Address</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
