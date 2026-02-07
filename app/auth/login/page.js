'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProvider } from '@/lib/providerContext';
import { useRole, ROLES } from '@/lib/roleContext';
import RegistrationModalWrapper from '@/components/organization/RegistrationModalWrapper';
import { useAuthActions } from '@/lib/auth/useAuth';
import { supabase } from '@/lib/supabase/client';
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const { login } = useProvider();
  const { setCurrentRole } = useRole();
  const { signIn } = useAuthActions();
  const router = useRouter();
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    setIsLoading(true);
    try {
      if (supabase) {
        await signIn(email.trim(), password);
      } else {
        login(email, password);
      }
      setCurrentRole(ROLES.ADMIN);
      setIsSuccess(true);
      setTimeout(() => router.push('/dashboard'), 800);
    } catch (err) {
      setError(err?.message || 'Invalid credentials');
      setIsLoading(false);
    }
  };
  return (
    <div className="auth-page">
      {/* Left: illustration */}
      <div className="auth-left">
        <img
          src="/images/login.png"
          alt=""
        />
      </div>
      {/* Right: login form */}
      <div className="auth-right">
        <div className="login-card">
          <div className="mb-2 flex justify-center flex-shrink-0">
            <img
              src="/images/logo.png"
              alt="D-FARE"
              className="login-logo"
            />
          </div>
          <h1 className="text-lg font-bold tracking-tight flex-shrink-0" style={{ color: '#0F172A' }}>
            Login to D-FARE
          </h1>
          <form onSubmit={handleLogin} className="space-y-2" style={{ marginBottom: 0 }}>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium" style={{ color: '#0F172A' }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                disabled={isLoading || isSuccess}
                required
                className="login-input w-full rounded-lg border px-4 py-2 text-sm disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#1F4FD8] transition-all duration-200"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium" style={{ color: '#0F172A' }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading || isSuccess}
                required
                className="login-input w-full rounded-lg border px-4 py-2 text-sm disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#1F4FD8] transition-all duration-200"
              />
            </div>
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 border border-red-200">{error}</p>
            )}
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="login-submit-btn w-full rounded-full py-2 font-semibold text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: '#1F4FD8' }}
            >
              {isLoading && !isSuccess ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Signing in…
                </span>
              ) : isSuccess ? (
                'Success'
              ) : (
                'Login'
              )}
            </button>
            <div className="relative py-1.5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: '#DBEAFE' }} />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs font-medium uppercase tracking-wide" style={{ color: '#64748b' }}>
                  OR
                </span>
              </div>
            </div>
            <button
              type="button"
              className="flex w-full items-center justify-start gap-3 rounded-xl border bg-white px-4 py-2 font-medium shadow-sm transition hover:bg-slate-50"
              style={{ borderColor: '#DBEAFE', color: '#0F172A' }}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </span>
              <span>Sign in with Google</span>
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-start gap-3 rounded-xl border bg-white px-4 py-2 font-medium shadow-sm transition hover:bg-slate-50"
              style={{ borderColor: '#DBEAFE', color: '#0F172A' }}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                <svg className="h-5 w-5" viewBox="0 0 23 23" aria-hidden>
                  <path fill="#F25022" d="M1 1h10v10H1z" />
                  <path fill="#00A4EF" d="M12 1h10v10H12z" />
                  <path fill="#7FBA00" d="M1 12h10v10H1z" />
                  <path fill="#FFB900" d="M12 12h10v10H12z" />
                </svg>
              </span>
              <span>Sign in with Microsoft</span>
            </button>
            <p className="pt-1 text-center flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowRegistrationModal(true)}
                className="text-sm font-semibold !bg-transparent hover:!bg-transparent border-0 cursor-pointer p-0 !text-slate-700 hover:!text-slate-700 no-underline hover:no-underline"
              >
                Register your organization
              </button>
            </p>
          </form>
        </div>
      </div>
      <RegistrationModalWrapper
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
      />
    </div>
  );
}