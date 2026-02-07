'use client';
import { useState } from 'react';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useProvider } from '@/lib/providerContext';
import { useRole, ROLES } from '@/lib/roleContext';
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useProvider();
  const { setCurrentRole } = useRole();
  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }
    login(email, password);
    setCurrentRole(ROLES.ADMIN); // Default role
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">D</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">D-FARE</h1>
          <p className="text-slate-600">Fair Dispatch Management System</p>
          <p className="text-sm text-slate-500 mt-1">Multi-Provider Logistics Platform</p>
        </div>
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">Service Provider Login</h2>
            <p className="text-sm text-slate-600 mt-1">Access your dispatch operations</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                required
              />
            </div>
            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Lock className="w-4 h-4 inline mr-1" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                required
              />
            </div>
            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/30"
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </button>
          </form>
          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs font-semibold text-slate-700 mb-2">Demo Credentials:</p>
            <div className="text-xs text-slate-600 space-y-1">
              <p>Org ID: <span className="font-mono">demo-org</span></p>
              <p>Email: <span className="font-mono">admin@demo.com</span></p>
              <p>Password: <span className="font-mono">demo123</span></p>
            </div>
          </div>
          {/* Footer Links */}
          <div className="mt-6 text-center text-sm text-slate-500 space-y-2">
            <p>
              <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                Forgot Password?
              </a>
            </p>
            <div className="pt-3 border-t border-slate-200">
              <p className="text-xs text-slate-600 mb-2">New Organization?</p>
              <button
                type="button"
                onClick={() => window.alert('Onboarding flow would open here')}
                className="text-sm font-semibold text-primary-600 hover:text-primary-700"
              >
                Register Your Organization →
              </button>
            </div>
          </div>
        </div>
        {/* Security Notice */}
        <div className="mt-6 text-center text-xs text-slate-500">
          <p>🔒 Secure enterprise authentication</p>
          <p className="mt-1">Your data is isolated and protected</p>
        </div>
      </div>
    </div>
  );
}