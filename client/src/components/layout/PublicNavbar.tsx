import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { 
  Activity, 
  Menu, 
  X, 
  ArrowRight, 
  UserCircle, 
  Shield, 
  Store, 
  Bike, 
  ShoppingCart,
  Search,
  MapPin
} from 'lucide-react';
import { UserRole } from '../../types';

export const PublicNavbar: React.FC = () => {
  const { user, role, isDemoMode, switchDemoRole, logout } = useAuth();
  const { cart, totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const getDashboardPath = (targetRole: UserRole | null) => {
    switch (targetRole) {
      case 'ADMIN':
        return '/admin';
      case 'PHARMACY_OWNER':
        return '/pharmacy';
      case 'DELIVERY_PARTNER':
        return '/partner';
      default:
        return '/customer';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      {/* Demo Mode Notice Bar */}
      {isDemoMode && (
        <div className="bg-brand-900 text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-brand-800">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium">Developer Demo Mode Active:</span>
            <span className="text-slate-300 hidden sm:inline">Explore PHARMORA marketplace and inventory with simulated state.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-300 text-[11px]">Simulate Role:</span>
            {(['CUSTOMER', 'PHARMACY_OWNER', 'DELIVERY_PARTNER', 'ADMIN'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => {
                  switchDemoRole(r);
                  navigate(getDashboardPath(r));
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                  role === r
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-brand-800/80 text-brand-200 hover:bg-brand-700'
                }`}
              >
                {r === 'PHARMACY_OWNER' ? 'Pharmacy' : r === 'DELIVERY_PARTNER' ? 'Delivery' : r}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-700 text-white shadow-xs transition-transform group-hover:scale-105">
              <Activity className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-brand-900">PHARMORA</span>
              <span className="text-[10px] font-medium text-emerald-700 -mt-1 hidden sm:block">
                Your Local Pharmacy. Delivered.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
            <Link to="/medicines" className="flex items-center gap-1.5 text-brand-800 font-semibold hover:text-brand-950 transition-colors">
              <Search className="w-4 h-4 text-brand-600" />
              <span>Find Medicines</span>
            </Link>
            <Link to="/pharmacies" className="flex items-center gap-1.5 hover:text-brand-700 transition-colors">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>Nearby Pharmacies</span>
            </Link>
            <Link to="/how-it-works" className="hover:text-brand-700 transition-colors">
              How it Works
            </Link>
            <Link to="/about" className="hover:text-brand-700 transition-colors">
              About
            </Link>
          </nav>

          {/* Desktop Auth CTAs and Cart Button */}
          <div className="hidden md:flex items-center gap-3">
            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-700 hover:text-brand-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
              title="View Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 text-slate-700" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
              {totalItems > 0 && (
                <span className="text-xs font-semibold text-brand-900 hidden lg:inline">
                  ₹{cart.subtotal.toFixed(0)}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <Link to={getDashboardPath(role)}>
                  <Button variant="primary" size="sm" className="gap-2">
                    <UserCircle className="w-4 h-4" />
                    <span>My Portal</span>
                    <Badge role={role || 'CUSTOMER'} className="ml-1 text-[10px] py-0 px-1.5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => logout()}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="primary" size="sm" className="gap-1.5">
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu & Cart Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/cart"
              className="relative p-2 text-slate-700 rounded-lg"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute 0 top-0 right-0 bg-brand-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2 text-base font-medium text-slate-700">
            <Link
              to="/medicines"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50 flex items-center gap-2 font-semibold text-brand-800"
            >
              <Search className="w-4 h-4 text-brand-600" />
              <span>Find Medicines</span>
            </Link>
            <Link
              to="/pharmacies"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50 flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>Nearby Pharmacies</span>
            </Link>
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-slate-500" />
                <span>Shopping Cart</span>
              </div>
              {totalItems > 0 && (
                <span className="bg-brand-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {totalItems} items
                </span>
              )}
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50"
            >
              How it Works
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50"
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50"
            >
              Contact & Help
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to={getDashboardPath(role)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button variant="primary" className="w-full justify-between">
                    <span>Open Dashboard</span>
                    <Badge role={role || 'CUSTOMER'} />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <Button variant="outline" className="w-full">
                    Customer Sign In
                  </Button>
                </Link>
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <Button variant="primary" className="w-full">
                    Explore All Portals
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

