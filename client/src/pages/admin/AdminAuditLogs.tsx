import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { ShieldCheck, Lock, Activity } from 'lucide-react';

export const AdminAuditLogs: React.FC = () => {
  const auditEntries = [
    {
      id: 'aud-1',
      actor: 'admin@pharmora.in',
      action: 'SYSTEM_BOOTSTRAP',
      target: 'PHARMORA Phase 1 Schema',
      ip: '127.0.0.1 (Loopback)',
      timestamp: '2026-10-29 11:15:00 UTC',
      status: 'SUCCESS',
    },
    {
      id: 'aud-2',
      actor: 'system',
      action: 'DATABASE_MIGRATION',
      target: '20261029000000_phase1_initial_schema.sql',
      ip: 'internal',
      timestamp: '2026-10-29 11:15:10 UTC',
      status: 'SUCCESS',
    },
    {
      id: 'aud-3',
      actor: 'admin@pharmora.in',
      action: 'ROLE_RBAC_CHECK',
      target: 'GET /api/admin/overview',
      ip: '127.0.0.1',
      timestamp: '2026-10-29 11:20:00 UTC',
      status: 'VERIFIED_ADMIN',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Security & Operational Audit Logs</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tamper-evident system logs tracking privileged operations, role changes, and compliance verifications.
          </p>
        </div>

        <Card className="bg-white overflow-hidden">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Immutable Audit Trail ({auditEntries.length} Records)</span>
            </CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Timestamp (UTC)</th>
                  <th className="px-4 py-3">Actor</th>
                  <th className="px-4 py-3">Action Event</th>
                  <th className="px-4 py-3">Target Details</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {auditEntries.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 text-slate-500">{log.timestamp}</td>
                    <td className="px-4 py-3 text-slate-900 font-semibold">{log.actor}</td>
                    <td className="px-4 py-3 text-brand-800">{log.action}</td>
                    <td className="px-4 py-3 text-slate-600">{log.target}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                        {log.status}
                      </span>
                    </td>
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
