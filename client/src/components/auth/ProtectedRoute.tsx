import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Alert } from '../common/Alert';
import { Button } from '../common/Button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner size="lg" label="Validating security credentials..." />
      </div>
    );
  }

  // Not authenticated
  if (!user || !role) {
    const isTargetAdmin = allowedRoles?.includes('ADMIN');
    const isTargetPharmacy = allowedRoles?.includes('PHARMACY_OWNER');
    const isTargetPartner = allowedRoles?.includes('DELIVERY_PARTNER');

    const redirectPath = isTargetAdmin
      ? '/admin/login'
      : isTargetPharmacy
      ? '/pharmacy/login'
      : isTargetPartner
      ? '/partner/login'
      : '/login';

    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Role validation
  if (allowedRoles && !allowedRoles.includes(role)) {
    const authorizedPath =
      role === 'ADMIN'
        ? '/admin'
        : role === 'PHARMACY_OWNER'
        ? '/pharmacy'
        : role === 'DELIVERY_PARTNER'
        ? '/partner'
        : '/customer';

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl border border-red-200 p-6 shadow-sm text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <ShieldAlert className="h-6 w-6" />
          </div>

          <h2 className="text-lg font-bold text-slate-900">Access Restricted</h2>
          <p className="text-sm text-slate-600">
            Your authenticated role (<span className="font-semibold">{role}</span>) does not have authorization to view this resource.
          </p>

          <Alert variant="warning" title="Security Notice">
            PHARMORA enforces strict server and client role isolation. Administrative and commercial operations require verified accounts.
          </Alert>

          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <Link to={authorizedPath} className="w-full">
              <Button variant="primary" className="w-full">
                Go to My Portal ({role})
              </Button>
            </Link>
            <Link to="/" className="w-full">
              <Button variant="outline" className="w-full">
                Return Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
