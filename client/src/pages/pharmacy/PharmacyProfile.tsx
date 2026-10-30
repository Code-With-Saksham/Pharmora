import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Alert } from '../../components/common/Alert';
import { useAuth } from '../../context/AuthContext';
import { Pharmacy, PharmacyVerificationStatus } from '../../types';
import { 
  Store, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Send,
  Building2,
  Navigation
} from 'lucide-react';

export const PharmacyProfile: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submittingVerification, setSubmittingVerification] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'destructive' | 'warning' | 'info'; message: string } | null>(null);


  // Pharmacy Profile Fields
  const [pharmacyId, setPharmacyId] = useState('ph-sanjivani');
  const [name, setName] = useState('Sanjivani Medicare & Retail Chemist');
  const [description, setDescription] = useState('Licensed retail dispensary providing authentic prescription and OTC drugs with cold-chain storage facilities.');
  const [pharmacistName, setPharmacistName] = useState(user?.fullName || 'Rajesh Gupta');
  const [licenceNumber, setLicenceNumber] = useState('DL-KA-BLR-847291');
  const [gstin, setGstin] = useState('29AAAAA1234A1Z5');
  const [phone, setPhone] = useState(user?.phone || '+91 98111 22334');
  const [email, setEmail] = useState('sanjivani.meds@example.com');
  const [address, setAddress] = useState('Shop No. 4, 100ft Road, Indiranagar');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('560038');
  const [latitude, setLatitude] = useState('12.9716');
  const [longitude, setLongitude] = useState('77.6412');
  const [openTime, setOpenTime] = useState('08:00');
  const [closeTime, setCloseTime] = useState('22:00');
  const [daysOpen, setDaysOpen] = useState('Mon - Sun');
  const [verificationStatus, setVerificationStatus] = useState<PharmacyVerificationStatus>('VERIFIED');
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);

  useEffect(() => {
    // Attempt to load from server or localStorage
    const saved = localStorage.getItem('pharmora_pharmacy_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setName(parsed.name || name);
        setDescription(parsed.description || description);
        setPharmacistName(parsed.pharmacistName || pharmacistName);
        setLicenceNumber(parsed.licenceNumber || licenceNumber);
        setGstin(parsed.gstin || gstin);
        setPhone(parsed.phone || phone);
        setEmail(parsed.email || email);
        setAddress(parsed.address || address);
        setCity(parsed.city || city);
        setState(parsed.state || state);
        setPincode(parsed.pincode || pincode);
        setLatitude(String(parsed.latitude || latitude));
        setLongitude(String(parsed.longitude || longitude));
        setOpenTime(parsed.operatingHours?.openTime || openTime);
        setCloseTime(parsed.operatingHours?.closeTime || closeTime);
        setDaysOpen(parsed.operatingHours?.daysOpen || daysOpen);
        setVerificationStatus(parsed.verificationStatus || 'VERIFIED');
        setRejectionReason(parsed.rejectionReason || null);
      } catch (e) {
        // use defaults
      }
    }
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const profileData = {
      name,
      description,
      pharmacistName,
      licenceNumber,
      gstin,
      phone,
      email,
      address,
      city,
      state,
      pincode,
      latitude: parseFloat(latitude) || 12.9716,
      longitude: parseFloat(longitude) || 77.6412,
      operatingHours: {
        openTime,
        closeTime,
        daysOpen,
      },
      verificationStatus,
      rejectionReason,
    };

    try {
      // Send to server
      const token = localStorage.getItem('pharmora_token');
      await fetch('/api/pharmacy/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(profileData),
      });
    } catch (err) {
      // Continue locally for demo
    }

    localStorage.setItem('pharmora_pharmacy_profile', JSON.stringify(profileData));
    setLoading(false);
    setNotification({ type: 'success', message: 'Pharmacy store profile and operating hours saved successfully.' });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSubmitForVerification = async () => {
    setSubmittingVerification(true);
    try {
      const token = localStorage.getItem('pharmora_token');
      await fetch('/api/pharmacy/submit-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ pharmacyId }),
      });
    } catch (err) {
      // fall back locally
    }

    const updated = {
      ...JSON.parse(localStorage.getItem('pharmora_pharmacy_profile') || '{}'),
      verificationStatus: 'PENDING_VERIFICATION' as PharmacyVerificationStatus,
      rejectionReason: null,
    };
    setVerificationStatus('PENDING_VERIFICATION');
    setRejectionReason(null);
    localStorage.setItem('pharmora_pharmacy_profile', JSON.stringify(updated));
    setSubmittingVerification(false);
    setNotification({
      type: 'warning',
      message: 'Profile submitted to state regulatory verification queue. An administrator will inspect your Form 20/21 licences.',
    });
  };

  const getStatusBadge = (status: PharmacyVerificationStatus) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            VERIFIED & ORDERABLE
          </span>
        );
      case 'PENDING_VERIFICATION':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            PENDING ADMIN VERIFICATION
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            VERIFICATION REJECTED
          </span>
        );
      case 'SUSPENDED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-300">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            OPERATIONS SUSPENDED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            DRAFT PROFILE
          </span>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Pharmacy Store Profile & Licencing</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Statutory dispensary records, geo-coordinates, operating schedules, and state drug compliance particulars.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(verificationStatus)}
          </div>
        </div>

        {notification && (
          <Alert variant={notification.type} title="System Notice">
            {notification.message}
          </Alert>
        )}

        {/* Verification Status Card */}
        {verificationStatus === 'DRAFT' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold">Store Profile in Draft Mode</h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  Your store is not yet orderable by patients. Complete your address, hours, and licence numbers, then submit for review.
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSubmitForVerification}
              disabled={submittingVerification}
              className="gap-1.5 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>Submit for Verification</span>
            </Button>
          </div>
        )}

        {verificationStatus === 'PENDING_VERIFICATION' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-blue-900">
            <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold">Application Under Regulatory Review</h4>
              <p className="text-xs text-blue-800 mt-0.5">
                Our administrative compliance desk is verifying Form 20 (Allopathic Retail) and Form 21 with the Karnataka State Drug Controller. Your inventory will automatically become discoverable to nearby customers once approved.
              </p>
            </div>
          </div>
        )}

        {verificationStatus === 'REJECTED' && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-900">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold">Verification Application Rejected</h4>
                <p className="text-xs text-rose-800 mt-0.5">
                  Reason: {rejectionReason || 'Licence discrepancy detected. Please update your registered trade address and valid Form 20/21 numbers.'}
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSubmitForVerification}
              disabled={submittingVerification}
              className="gap-1.5 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>Resubmit Profile</span>
            </Button>
          </div>
        )}

        {verificationStatus === 'SUSPENDED' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-red-900">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold">Dispensary Operations Suspended</h4>
              <p className="text-xs text-red-800 mt-0.5">
                Your store inventory is currently hidden from customer search and shopping carts cannot be created. Please contact regulatory administration.
              </p>
            </div>
          </div>
        )}

        {/* Profile Editing Form */}
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Details (2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-brand-700" />
                    <span>Pharmacy Store Identity</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Official business registration name and public description seen by patients.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Pharmacy Trade Name *"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <Input
                      label="Supervising Registered Pharmacist *"
                      value={pharmacistName}
                      onChange={(e) => setPharmacistName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Store Description & Specializations
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                      placeholder="e.g. 24/7 cold-chain pharmacy specializing in cardiac, diabetic, and surgical care products."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Official Store Contact Phone *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                    <Input
                      label="Dispensary Notification Email *"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Physical Location and Geo-coordinates */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-700" />
                    <span>Physical Dispensary Location & Geo-Coordinates</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Accurate coordinates enable customers to discover medicines at closest verified radius.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Physical Street Address *"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="City *"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                    <Input
                      label="State *"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                    />
                    <Input
                      label="PIN Code *"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <Input
                        label="Latitude (GPS)"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        helperText="Used for Haversine distance matching (e.g. 12.9716)"
                      />
                    </div>
                    <div>
                      <Input
                        label="Longitude (GPS)"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        helperText="Used for Haversine distance matching (e.g. 77.6412)"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Operating Hours */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-700" />
                    <span>Operating Hours & Store Schedule</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Dispensary opening and closing times for on-demand medicine orders.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="Opening Time"
                      type="time"
                      value={openTime}
                      onChange={(e) => setOpenTime(e.target.value)}
                    />
                    <Input
                      label="Closing Time"
                      type="time"
                      value={closeTime}
                      onChange={(e) => setCloseTime(e.target.value)}
                    />
                    <Input
                      label="Operational Days"
                      value={daysOpen}
                      onChange={(e) => setDaysOpen(e.target.value)}
                      placeholder="e.g. Mon - Sun"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Statutory Compliance Column (1 col) */}
            <div className="space-y-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Statutory Drug Licencing</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Drugs & Cosmetics Rules compliance.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Input
                      label="Drug Licence (Form 20/21) *"
                      value={licenceNumber}
                      onChange={(e) => setLicenceNumber(e.target.value)}
                      helperText="Issued under Drugs & Cosmetics Act 1940"
                      required
                    />
                  </div>

                  <div>
                    <Input
                      label="GSTIN Identification Number"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      helperText="State GST tax registration"
                    />
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5 text-slate-600">
                    <p className="font-semibold text-slate-800">Compliance Notes:</p>
                    <p>• Form 20: Retail sale of Allopathic medicines other than Schedule C, C(1) and X.</p>
                    <p>• Form 21: Retail sale of Schedule C & C(1) biological products.</p>
                    <p>• Pharmacist must remain physically present during medicine dispensing.</p>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full justify-center shadow-xs"
                  disabled={loading}
                >
                  {loading ? 'Saving Profile...' : 'Save Profile Changes'}
                </Button>

                {verificationStatus !== 'VERIFIED' && verificationStatus !== 'PENDING_VERIFICATION' && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-center gap-1.5 border-brand-300 text-brand-800 hover:bg-brand-50"
                    onClick={handleSubmitForVerification}
                    disabled={submittingVerification}
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit for Admin Verification</span>
                  </Button>
                )}
              </div>
            </div>

          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

