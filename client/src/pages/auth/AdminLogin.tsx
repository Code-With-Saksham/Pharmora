import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Alert } from '../../components/common/Alert';
import { Shield, Lock, ShieldCheck, KeyRound } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('admin@pharmora.in');
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
      const res = await login(email, 'ADMIN');
      if (res.success) {
        navigate('/admin');
      } else {
        setError(res.error || 'Access denied: Valid administrative credentials required.');
      }
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-700 text-white shadow-lg mx-auto">
          <Shield className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">PHARMORA Operations Command</h1>
        <p className="text-xs text-slate-400">
          Restricted administrative access for platform operations and regulatory compliance
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-800 border border-slate-700 py-8 px-6 sm:px-8 shadow-2xl rounded-2xl space-y-6">
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900/80 border border-slate-700/60 text-xs text-slate-300">
            <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Hardware MFA and IP restriction recommended for production access.</span>
          </div>

          {error && <Alert variant="destructive" title="Security Alert">{error}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="block text-sm font-medium text-slate-200">Admin Email</label>
              <input
                type="email"
                required
                placeholder="admin@pharmora.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label className="block text-sm font-medium text-slate-200">Security Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full bg-brand-600 hover:bg-brand-500 text-white font-semibold"
              isLoading={isLoading}
            >
              Authenticate Admin Session
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-700/60 text-center space-y-3">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Public self-registration for ADMIN role is strictly prohibited.
              Admin provisioning requires server-controlled privileges.
            </p>
            <div>
              <Link to="/" className="text-xs text-brand-400 hover:underline">
                ← Return to Public Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
