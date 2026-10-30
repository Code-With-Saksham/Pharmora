import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  Activity,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Store,
  Bike,
  ShieldAlert,
  Users,
  FileCheck,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  CreditCard,
  User,
  Search,
  CheckCircle,
  MapPin
} from 'lucide-react';
import { UserRole } from '../../types';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
}

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, role, logout, isDemoMode, switchDemoRole } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Role-specific Navigation
  const getNavItems = (currentRole: UserRole | null): NavItem[] => {
    switch (currentRole) {
      case 'ADMIN':
        return [
          { label: 'Operations Overview', path: '/admin', icon: LayoutDashboard },
          { label: 'Medicine Formulary', path: '/admin/catalog', icon: Package, badge: 'Phase 2' },
          { label: 'User Directory', path: '/admin/users', icon: Users },
          { label: 'Pharmacy Approvals', path: '/admin/pharmacies', icon: Store, badge: 'Compliance' },
          { label: 'Partner Verifications', path: '/admin/partners', icon: Bike, badge: 'Phase 1' },
          { label: 'Security & Audit Logs', path: '/admin/audit', icon: FileCheck },
        ];
      case 'PHARMACY_OWNER':
        return [
          { label: 'Store Overview', path: '/pharmacy', icon: LayoutDashboard },
          { label: 'Store Profile', path: '/pharmacy/profile', icon: Store },
          { label: 'Inventory Catalog', path: '/pharmacy/inventory', icon: Package, badge: 'Live' },
          { label: 'Orders & Handover', path: '/pharmacy/orders', icon: ShoppingBag, badge: 'Upcoming' },
          { label: 'Settings & Licences', path: '/pharmacy/settings', icon: Settings },
        ];
      case 'DELIVERY_PARTNER':
        return [
          { label: 'Partner Dashboard', path: '/partner', icon: LayoutDashboard },
          { label: 'Active Deliveries', path: '/partner/deliveries', icon: Bike, badge: 'Upcoming' },
          { label: 'Earnings & Payouts', path: '/partner/earnings', icon: CreditCard, badge: 'Upcoming' },
          { label: 'Profile & Documents', path: '/partner/profile', icon: User },
        ];
      default: // CUSTOMER
        return [
          { label: 'My Dashboard', path: '/customer', icon: LayoutDashboard },
          { label: 'Find Medicines', path: '/customer/search', icon: Search, badge: 'Live' },
          { label: 'Nearby Pharmacies', path: '/customer/pharmacies', icon: MapPin },
          { label: 'Shopping Cart', path: '/customer/cart', icon: ShoppingBag, badge: totalItems > 0 ? `${totalItems}` : undefined },
          { label: 'Order History', path: '/customer/orders', icon: Package },
          { label: 'My Profile & Addresses', path: '/customer/profile', icon: User },
        ];
    }
  };


  const navItems = getNavItems(role);

  const getPortalTitle = (currentRole: UserRole | null) => {
    switch (currentRole) {
      case 'ADMIN':
        return 'Operations Command Panel';
      case 'PHARMACY_OWNER':
        return 'Pharmacy Partner Portal';
      case 'DELIVERY_PARTNER':
        return 'Delivery Partner Portal';
      default:
        return 'Customer Portal';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Demo Switcher Ribbon if active */}
      {isDemoMode && (
        <div className="bg-slate-900 text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-emerald-300">Phase 1 Demo Mode:</span>
            <span className="text-slate-300 hidden md:inline">Logged in as {user?.fullName} ({role})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px]">Switch Portal:</span>
            {(['CUSTOMER', 'PHARMACY_OWNER', 'DELIVERY_PARTNER', 'ADMIN'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => {
                  switchDemoRole(r);
                  navigate(r === 'ADMIN' ? '/admin' : r === 'PHARMACY_OWNER' ? '/pharmacy' : r === 'DELIVERY_PARTNER' ? '/partner' : '/customer');
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  role === r
                    ? 'bg-brand-700 text-white shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {r === 'PHARMACY_OWNER' ? 'Pharmacy' : r === 'DELIVERY_PARTNER' ? 'Delivery' : r}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Top Header */}
      <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Toggle navigation"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-700 text-white shadow-xs">
              <Activity className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-brand-900 text-base leading-none">PHARMORA</span>
              <span className="text-[10px] font-medium text-slate-500">{getPortalTitle(role)}</span>
            </div>
          </Link>
        </div>

        {/* User Status and Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-900">{user?.fullName || 'User'}</span>
            <span className="text-[11px] text-slate-500">{user?.email}</span>
          </div>

          <Badge role={role || 'CUSTOMER'} status={user?.status} />

          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await logout();
              navigate('/');
            }}
            className="text-slate-500 hover:text-red-600 gap-1.5"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Portal Body with Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs sticky top-24 space-y-1">
            <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-800 font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand-700' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-normal">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-4 mt-4 border-t border-slate-100">
              <Link
                to="/"
                className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-brand-700 transition-colors"
              >
                <span>← Back to Public Website</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs flex">
            <div className="w-72 bg-white h-full p-4 space-y-3 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="font-bold text-slate-900 text-sm">{getPortalTitle(role)}</span>
                  <button onClick={() => setSidebarOpen(false)} className="p-1 rounded text-slate-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="mt-4 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${
                          isActive
                            ? 'bg-brand-50 text-brand-800 font-semibold'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 text-slate-500" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <Link
                  to="/"
                  onClick={() => setSidebarOpen(false)}
                  className="block text-xs text-slate-500 hover:text-brand-700 py-2"
                >
                  ← Back to Public Website
                </Link>
              </div>
            </div>
            <div className="flex-1" onClick={() => setSidebarOpen(false)} />
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
};
