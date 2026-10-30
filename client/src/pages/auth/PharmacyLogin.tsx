import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Alert } from '../../components/common/Alert';
import { Activity, Store } from 'lucide-react';

export const PharmacyLogin: React.FC = () => {
  const [email, setEmail] = useState('owner@sanjivanimedicare.in');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await login(email, 'PHARMACY_OWNER');
      if (res.success) {
        navigate('/pharmacy');
      } else {
        setError(res.error || 'Failed to sign in. Verify pharmacy owner credentials.');
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
          <div className="h-10 w-10 rounded-xl bg-brand-700 text-white flex items-center justify-center shadow-xs">
            <Store className="h-5 w-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-brand-900">PHARMORA</span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Pharmacy Partner Portal</h2>
        <p className="text-xs text-slate-500">
          Sign in to manage medicine catalog, orders, and prescription reviews
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 border border-slate-200 shadow-sm rounded-2xl space-y-6">
          {error && <Alert variant="destructive" title="Authentication Error">{error}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Registered Store Email"
              type="email"
              required
              placeholder="owner@pharmacy.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-brand-700 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
              Sign In to Pharmacy Dashboard
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center space-y-2">
            <p className="text-xs text-slate-500">
              Own a retail medical store in India?{' '}
              <Link to="/pharmacy/onboard" className="font-semibold text-brand-700 hover:underline">
                Register Your Pharmacy
              </Link>
            </p>
            <p className="text-[11px] text-slate-400">
              <Link to="/auth" className="hover:underline">← Switch to other portals</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
