import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, HeartPulse, Building2, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">
      {/* Trust & Compliance Banner */}
      <div className="bg-slate-50 border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-6 w-6 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Verified Local Pharmacies</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Only state-licensed retail chemists and verified pharmacists dispense medicines through PHARMORA.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <HeartPulse className="h-6 w-6 text-brand-700 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Strict Prescription Compliance</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Schedule H and prescription medications are reviewed by registered pharmacists prior to dispensing.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Building2 className="h-6 w-6 text-slate-700 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Hyperlocal Delivery Network</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Connecting Indian neighborhoods to nearby stock rather than distant warehouses.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-700 text-white">
                <Activity className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-brand-900">PHARMORA</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your Local Pharmacy. Delivered. Digitizing independent Indian retail chemists for reliable, compliant doorstep medicine delivery.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Built for India • PAN-India Local Network</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Platform</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-brand-700 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-brand-700 transition-colors">
                  How it Works
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-700 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-700 transition-colors">
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Partner Portals */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Portals</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/login" className="hover:text-brand-700 transition-colors">
                  Customer Sign In
                </Link>
              </li>
              <li>
                <Link to="/pharmacy/login" className="hover:text-brand-700 transition-colors">
                  Pharmacy Owner Portal
                </Link>
              </li>
              <li>
                <Link to="/partner/login" className="hover:text-brand-700 transition-colors">
                  Delivery Partner Portal
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-brand-700 transition-colors">
                  Operations & Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal and Compliance */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Legal & Governance</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/terms" className="hover:text-brand-700 transition-colors">
                  Terms of Service (Draft)
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-brand-700 transition-colors">
                  Privacy Policy (Draft)
                </Link>
              </li>
              <li className="pt-2 text-[11px] text-slate-400 leading-normal">
                Phase 1 MVP Architecture. All pharmacy licensing and doctor prescription rules strictly enforced under Drugs & Cosmetics Act.
              </li>
            </ul>
          </div>
        </div>

        {/* Emergency disclaimer banner */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-[11px] text-amber-900 leading-relaxed text-center sm:text-left">
            <span className="font-semibold">⚠️ Medical Emergency Disclaimer:</span> PHARMORA is an inventory discovery and local fulfillment facilitator. It is not an emergency medical response service. For critical or life-threatening emergencies, please immediately contact your nearest hospital or call national emergency numbers <strong>112 / 108</strong>.
          </div>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <span>© {new Date().getFullYear()} PHARMORA Technologies. All rights reserved.</span>
            <span>Version 1.0.0 (Phase 1 Baseline)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
