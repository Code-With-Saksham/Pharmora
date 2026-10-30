import React from 'react';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { Footer } from '../../components/layout/Footer';
import { Alert } from '../../components/common/Alert';
import { Card, CardContent } from '../../components/common/Card';

export const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Data Protection</span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-slate-500 mt-1">Last Updated: October 2026 (Phase 1 Baseline)</p>
        </div>

        <Alert variant="warning" title="Draft Policy Notice — Pending DPDP Act Compliance Review">
          This policy is a Phase 1 structural draft. Prior to production handling of live Indian citizen health data, 
          it will be validated against the Digital Personal Data Protection Act (DPDP Act) 2023.
        </Alert>

        <Card className="bg-white">
          <CardContent className="p-6 sm:p-8 space-y-6 text-sm text-slate-600 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">1. Collection of Health and Identity Data</h2>
              <p>
                To facilitate compliant medicine fulfillment, PHARMORA processes customer names, delivery addresses, telephone numbers, and uploaded doctor prescriptions. 
                Prescription data is treated as sensitive medical information.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">2. Secure Document Storage Architecture</h2>
              <p>
                In accordance with PHARMORA architectural standards, prescription files and pharmacy drug licences are stored in private, authenticated cloud object storage with Row Level Security (RLS). 
                They are never placed in publicly queryable directories or shared with unauthorized commercial advertisers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">3. Purpose-Limited Disclosure</h2>
              <p>
                Prescriptions are shared exclusively with the registered pharmacist at the selected local medical store responsible for order verification and dispensing. 
                Delivery partners only receive packaging identifiers and delivery coordinates necessary for physical transit.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">4. User Rights and Data Retention</h2>
              <p>
                Users retain the right to review their account profile, request correction of inaccurate records, or delete their customer profile subject to statutory medical record-keeping retention mandates under Indian law.
              </p>
            </section>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};
