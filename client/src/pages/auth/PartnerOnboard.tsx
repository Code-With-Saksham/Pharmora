import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Alert } from '../../components/common/Alert';
import { Bike, ShieldCheck } from 'lucide-react';

export const PartnerOnboard: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleType, setVehicleType] = useState('TWO_WHEELER');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [drivingLicence, setDrivingLicence] = useState('');
  const [city, setCity] = useState('Bengaluru');
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
        fullName,
        role: 'DELIVERY_PARTNER',
        phone,
      });

      if (result.success) {
        navigate('/partner');
      } else {
        setError(result.error || 'Failed to submit partner application.');
      }
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
            <Bike className="h-5 w-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-brand-900">PHARMORA</span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Delivery Partner Application</h2>
        <p className="text-xs text-slate-500">
          Join our verified local medicine delivery network
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 border border-slate-200 shadow-sm rounded-2xl space-y-6">
          <Alert variant="warning" title="Verification Policy">
            Newly registered delivery partners are placed in <strong>Pending Verification</strong> status. 
            Active delivery tasks are only offered after identity and driver licence approval by administrators.
          </Alert>

          {error && <Alert variant="destructive" title="Application Error">{error}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name (As per Aadhaar/DL)"
              required
              placeholder="e.g. Vikram Singh"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <Input
              label="Email Address"
              type="email"
              required
              placeholder="vikram@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Mobile Number (India)"
              required
              placeholder="+91 99887 76655"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <div className="space-y-1.5 text-left">
              <label className="block text-sm font-medium text-slate-700">Vehicle Type</label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
              >
                <option value="TWO_WHEELER">Two-Wheeler (Motorcycle / Scooter)</option>
                <option value="EV">Electric Vehicle (EV Two-Wheeler)</option>
                <option value="BICYCLE">Bicycle (Hyperlocal Short Distance)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Vehicle Reg. Number"
                placeholder="KA-01-AB-1234"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
              />
              <Input
                label="Driving Licence No."
                placeholder="DL-0420110012345"
                value={drivingLicence}
                onChange={(e) => setDrivingLicence(e.target.value)}
              />
            </div>

            <Input
              label="Password"
              type="password"
              required
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" variant="primary" className="w-full bg-amber-600 hover:bg-amber-700" isLoading={isLoading}>
              Submit Partner Onboarding
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already registered as a partner?{' '}
              <Link to="/partner/login" className="font-semibold text-amber-700 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
