import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';
import { Settings, Shield, Bell } from 'lucide-react';

export const PharmacySettings: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Pharmacy Settings & Operations</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure store operating hours, pharmacist duty roster, and settlement bank accounts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="w-4 h-4 text-brand-700" />
                <span>Operating Hours</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-800">Monday - Saturday</span>
                <span>08:30 AM - 10:30 PM IST</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-800">Sunday</span>
                <span>10:00 AM - 08:00 PM IST</span>
              </div>
              <div className="pt-2">
                <Button variant="outline" size="sm" onClick={() => alert('Operating hours editor activates in Phase 2.')}>
                  Modify Working Hours
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="w-4 h-4 text-brand-700" />
                <span>Order Alerts & Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-slate-600">
              <p>Receive immediate alerts for new incoming orders and prescription uploads:</p>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded text-brand-700" />
                  <span>SMS notification on registered chemist mobile</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded text-brand-700" />
                  <span>Audio chime alert on dashboard for new orders</span>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
