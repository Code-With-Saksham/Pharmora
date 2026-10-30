import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Alert } from '../../components/common/Alert';
import { Store, ShieldCheck } from 'lucide-react';

export const PharmacyOnboard: React.FC = () => {
  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenceNumber, setLicenceNumber] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await register({
        email,
        fullName: ownerName || storeName,
        role: 'PHARMACY_OWNER',
        phone,
      });

      if (result.success) {
        navigate('/pharmacy');
      } else {
        setError(result.error || 'Failed to onboard pharmacy.');
      }
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-brand-700 text-white flex items-center justify-center shadow-xs">
            <Store className="h-5 w-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-brand-900">PHARMORA</span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Retail Pharmacy Registration</h2>
        <p className="text-xs text-slate-500">
          Partner with PHARMORA to receive verified digital orders from nearby patients
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 border border-slate-200 shadow-sm rounded-2xl space-y-6">
          <Alert variant="info" title="Verification Requirement">
            Only state-licensed retail pharmacies with valid Drug Licence (Form 20/21) under the Drugs and Cosmetics Rules are eligible for active dispensing.
          </Alert>

          {error && <Alert variant="destructive" title="Onboarding Error">{error}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Pharmacy / Medical Store Name"
                required
                placeholder="e.g. Sanjivani Medicare"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
              />
              <Input
                label="Registered Pharmacist / Owner Name"
                required
                placeholder="e.g. Rajesh Gupta"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Official Email"
                type="email"
                required
                placeholder="store@pharmacy.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Contact Mobile"
                required
                placeholder="+91 98111 22334"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Drug Licence Number (Form 20/21)"
                required
                placeholder="e.g. DL-KA-BLR-12345"
                helperText="Subject to administrative verification."
                value={licenceNumber}
                onChange={(e) => setLicenceNumber(e.target.value)}
              />
              <Input
                label="GSTIN Number (Optional)"
                placeholder="29AAAAA0000A1Z5"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="City"
                required
                placeholder="Bengaluru"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <div className="space-y-1.5 text-left">
                <label className="block text-sm font-medium text-slate-700">State</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
                >
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                </select>
              </div>
              <Input
                label="Pincode"
                required
                placeholder="560001"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
            </div>

            <Input
              label="Account Password"
              type="password"
              required
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
              Submit Pharmacy Application
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already registered?{' '}
              <Link to="/pharmacy/login" className="font-semibold text-brand-700 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
