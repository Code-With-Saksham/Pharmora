import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import type { UserRole, AccountStatus } from '../../types';

interface DemoUserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  status: AccountStatus;
  createdAt: string;
}

export const AdminUsers: React.FC = () => {
  const users: DemoUserRecord[] = [
    {
      id: 'usr-1',
      name: 'Aarav Sharma',
      email: 'customer@pharmora.in',
      role: 'CUSTOMER',
      phone: '+91 98765 43210',
      status: 'ACTIVE',
      createdAt: '2026-10-25',
    },
    {
      id: 'usr-2',
      name: 'Rajesh Gupta (Sanjivani Medicare)',
      email: 'owner@sanjivanimedicare.in',
      role: 'PHARMACY_OWNER',
      phone: '+91 98111 22334',
      status: 'ACTIVE',
      createdAt: '2026-10-26',
    },
    {
      id: 'usr-3',
      name: 'Vikram Singh',
      email: 'delivery@pharmora.in',
      role: 'DELIVERY_PARTNER',
      phone: '+91 99887 76655',
      status: 'PENDING_VERIFICATION',
      createdAt: '2026-10-28',
    },
    {
      id: 'usr-4',
      name: 'Priya Iyer',
      email: 'admin@pharmora.in',
      role: 'ADMIN',
      phone: '+91 91234 56789',
      status: 'ACTIVE',
      createdAt: '2026-10-20',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">User Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered profiles across all four platform roles.
          </p>
        </div>

        <Card className="bg-white overflow-hidden">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-sm">Active & Pending Platform Accounts ({users.length})</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">User & Contact</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{u.name}</div>
                      <div className="text-[11px] text-slate-400">{u.email} • {u.phone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge role={u.role} />
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={u.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-500">{u.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};
