import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Activity, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-700 text-white shadow-sm mb-4">
        <Activity className="h-6 w-6" />
      </div>

      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">404</h1>
      <h2 className="text-lg font-semibold text-slate-800 mt-2">Page Not Found</h2>
      <p className="text-xs text-slate-500 max-w-sm mt-1">
        The destination you requested does not exist or may have been relocated within the PHARMORA network.
      </p>

      <div className="mt-6 flex gap-3">
        <Link to="/">
          <Button variant="primary" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Button>
        </Link>
        <Link to="/auth">
          <Button variant="outline" size="sm">
            Portal Gateway
          </Button>
        </Link>
      </div>
    </div>
  );
};
