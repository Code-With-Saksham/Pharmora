import React from 'react';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { Footer } from '../../components/layout/Footer';
import { Alert } from '../../components/common/Alert';
import { Card, CardContent } from '../../components/common/Card';

export const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Legal Architecture</span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Terms of Service</h1>
          <p className="text-xs text-slate-500 mt-1">Last Updated: October 2026 (Phase 1 Baseline)</p>
        </div>

        <Alert variant="warning" title="Draft Document Notice — Pending Legal Counsel Review">
          This document is an architectural placeholder for PHARMORA Phase 1 development. 
          Prior to commercial launch in India, these terms must be formally reviewed and finalized by qualified Indian healthcare legal counsel.
        </Alert>

        <Card className="bg-white">
          <CardContent className="p-6 sm:p-8 space-y-6 text-sm text-slate-600 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">1. Nature of the Platform</h2>
              <p>
                PHARMORA is a technology platform connecting consumers with licensed retail pharmacies and independent delivery partners. 
                PHARMORA does not directly sell, manufacture, or dispense pharmaceutical products. All dispensing is performed exclusively by state-licensed medical stores.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">2. Statutory Compliance (India)</h2>
              <p>
                All medicine transactions, prescription reviews, and store verifications comply with the Drugs and Cosmetics Act (1940), 
                the Pharmacy Act (1948), and the Information Technology Act (2000). Schedule H, H1, and X drugs require valid physical/electronic prescription verification by a registered pharmacist.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">3. User Responsibilities & Emergency Medical Disclaimer</h2>
              <p>
                Users confirm that any prescription uploaded is genuine, issued by a registered medical practitioner (RMP), and intended for the named patient. 
                PHARMORA is not an emergency medical service and does not offer diagnostic consultations.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">4. Pricing & Delivery Indicative Estimates</h2>
              <p>
                Prices are shown in Indian Rupees (INR ₹) inclusive of applicable taxes (GST). Delivery estimates are subject to pharmacy operating hours, stock confirmation, traffic, and courier availability.
              </p>
            </section>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};
