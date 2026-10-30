import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Public Pages
import { Home } from './pages/public/Home';
import { About } from './pages/public/About';
import { HowItWorks } from './pages/public/HowItWorks';
import { Contact } from './pages/public/Contact';
import { Terms } from './pages/public/Terms';
import { Privacy } from './pages/public/Privacy';
import { RoleSelection } from './pages/public/RoleSelection';
import { NotFound } from './pages/NotFound';

// Auth Pages
import { CustomerLogin } from './pages/auth/CustomerLogin';
import { CustomerRegister } from './pages/auth/CustomerRegister';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { PharmacyLogin } from './pages/auth/PharmacyLogin';
import { PharmacyOnboard } from './pages/auth/PharmacyOnboard';
import { PartnerLogin } from './pages/auth/PartnerLogin';
import { PartnerOnboard } from './pages/auth/PartnerOnboard';
import { AdminLogin } from './pages/auth/AdminLogin';

// Customer Portal Pages
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { CustomerOrders } from './pages/customer/CustomerOrders';
import { CustomerProfile } from './pages/customer/CustomerProfile';
import { CustomerSearchPreview } from './pages/customer/CustomerSearchPreview';

// Pharmacy Portal Pages
import { PharmacyDashboard } from './pages/pharmacy/PharmacyDashboard';
import { PharmacyProfile } from './pages/pharmacy/PharmacyProfile';
import { PharmacyInventory } from './pages/pharmacy/PharmacyInventory';
import { PharmacyOrders } from './pages/pharmacy/PharmacyOrders';
import { PharmacySettings } from './pages/pharmacy/PharmacySettings';

// Delivery Partner Portal Pages
import { PartnerDashboard } from './pages/partner/PartnerDashboard';
import { PartnerDeliveries } from './pages/partner/PartnerDeliveries';
import { PartnerEarnings } from './pages/partner/PartnerEarnings';
import { PartnerProfile } from './pages/partner/PartnerProfile';

// Admin Portal Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminPharmacies } from './pages/admin/AdminPharmacies';
import { AdminPartners } from './pages/admin/AdminPartners';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/auth" element={<RoleSelection />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<CustomerLogin />} />
          <Route path="/signup" element={<CustomerRegister />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/pharmacy/login" element={<PharmacyLogin />} />
          <Route path="/pharmacy/onboard" element={<PharmacyOnboard />} />
          <Route path="/partner/login" element={<PartnerLogin />} />
          <Route path="/partner/onboard" element={<PartnerOnboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Customer Portal */}
          <Route
            path="/customer"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/orders"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <CustomerOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/profile"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <CustomerProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/search"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <CustomerSearchPreview />
              </ProtectedRoute>
            }
          />

          {/* Protected Pharmacy Portal */}
          <Route
            path="/pharmacy"
            element={
              <ProtectedRoute allowedRoles={['PHARMACY_OWNER', 'ADMIN']}>
                <PharmacyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pharmacy/profile"
            element={
              <ProtectedRoute allowedRoles={['PHARMACY_OWNER', 'ADMIN']}>
                <PharmacyProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pharmacy/inventory"
            element={
              <ProtectedRoute allowedRoles={['PHARMACY_OWNER', 'ADMIN']}>
                <PharmacyInventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pharmacy/orders"
            element={
              <ProtectedRoute allowedRoles={['PHARMACY_OWNER', 'ADMIN']}>
                <PharmacyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pharmacy/settings"
            element={
              <ProtectedRoute allowedRoles={['PHARMACY_OWNER', 'ADMIN']}>
                <PharmacySettings />
              </ProtectedRoute>
            }
          />

          {/* Protected Delivery Partner Portal */}
          <Route
            path="/partner"
            element={
              <ProtectedRoute allowedRoles={['DELIVERY_PARTNER', 'ADMIN']}>
                <PartnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/partner/deliveries"
            element={
              <ProtectedRoute allowedRoles={['DELIVERY_PARTNER', 'ADMIN']}>
                <PartnerDeliveries />
              </ProtectedRoute>
            }
          />
          <Route
            path="/partner/earnings"
            element={
              <ProtectedRoute allowedRoles={['DELIVERY_PARTNER', 'ADMIN']}>
                <PartnerEarnings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/partner/profile"
            element={
              <ProtectedRoute allowedRoles={['DELIVERY_PARTNER', 'ADMIN']}>
                <PartnerProfile />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Portal */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/pharmacies"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminPharmacies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/partners"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminPartners />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/audit"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminAuditLogs />
              </ProtectedRoute>
            }
          />

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
