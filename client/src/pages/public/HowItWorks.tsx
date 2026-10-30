import React from 'react';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { Footer } from '../../components/layout/Footer';
import { Card, CardContent } from '../../components/common/Card';
import {
  Search,
  Compass,
  GitCompare,
  ShoppingBag,
  FileCheck2,
  PackageCheck,
  Send,
  Truck,
  CheckCircle,
  Database,
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: 1,
      title: 'Search & Prescription Submission',
      desc: 'The customer enters the medicine name, salt compound, or securely uploads an electronic doctor prescription.',
      icon: Search,
      role: 'Customer',
    },
    {
      num: 2,
      title: 'Hyperlocal Discovery',
      desc: 'PHARMORA calculates distances and queries live inventory among verified pharmacies within your delivery radius.',
      icon: Compass,
      role: 'Platform Engine',
    },
    {
      num: 3,
      title: 'Compare Price & Distance',
      desc: 'The customer reviews availability, transparent itemized pricing in INR (₹), and estimated delivery times.',
      icon: GitCompare,
      role: 'Customer',
    },
    {
      num: 4,
      title: 'Order Placement',
      desc: 'Customer confirms the selected pharmacy and places the order with delivery address coordinates.',
      icon: ShoppingBag,
      role: 'Customer',
    },
    {
      num: 5,
      title: 'Pharmacist Prescription Verification',
      desc: 'An authorized registered pharmacist at the chemist shop examines the prescription for Schedule H compliance.',
      icon: FileCheck2,
      role: 'Pharmacy Owner',
    },
    {
      num: 6,
      title: 'Preparation & Batch Checks',
      desc: 'The chemist picks stock from the shelf, verifies expiry dates and batch numbers, and securely packages the order.',
      icon: PackageCheck,
      role: 'Pharmacy Owner',
    },
    {
      num: 7,
      title: 'Delivery Partner Assignment',
      desc: 'An available, identity-verified delivery partner within the pharmacy vicinity accepts the handover assignment.',
      icon: Send,
      role: 'Delivery Engine',
    },
    {
      num: 8,
      title: 'Pharmacy Pickup & Verification',
      desc: 'The partner arrives at the medical store, confirms order ID match with the pharmacist, and secures the package.',
      icon: Truck,
      role: 'Delivery Partner',
    },
    {
      num: 9,
      title: 'Doorstep Handover',
      desc: 'The partner navigates to the customer residence, hands over the intact package, and records successful delivery.',
      icon: CheckCircle,
      role: 'Delivery Partner',
    },
    {
      num: 10,
      title: 'Settlement & Audit Recording',
      desc: 'Order status updates to completed, payments and pharmacy commissions are logged, and audit trails are finalized.',
      icon: Database,
      role: 'Admin & System',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Fulfillment Architecture</span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">The 10-Step PHARMORA Journey</h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Every step is designed to guarantee compliance with Indian drug regulations, protect customer safety, and support local chemists.
          </p>
        </div>

        <div className="relative border-l-2 border-brand-200 ml-4 sm:ml-8 space-y-8 pl-6 sm:pl-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="relative group">
                {/* Step Circle Indicator */}
                <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-brand-700 text-white font-bold text-xs sm:text-sm ring-4 ring-slate-50 shadow-xs">
                  {step.num}
                </div>

                <Card className="bg-white hover:border-brand-300 transition-all shadow-xs">
                  <CardContent className="p-4 sm:p-5 flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900">{step.title}</h3>
                        <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {step.role}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
};
