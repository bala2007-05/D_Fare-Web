'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, CheckCircle } from 'lucide-react';
import { useProvider } from '@/lib/providerContext';
import { useRole, ROLES } from '@/lib/roleContext';
import LogisticsBackground from '@/components/auth/LogisticsBackground';
import ProfessionalLoadingText from '@/components/auth/ProfessionalLoadingText';
import RegistrationModal from '@/components/auth/RegistrationModal';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const { login } = useProvider();
  const { setCurrentRole } = useRole();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      try {
        login(email, password);
        setCurrentRole(ROLES.ADMIN);
        setIsSuccess(true);

        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } catch (err) {
        setError('Invalid credentials');
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleRegistrationComplete = () => {
    setShowRegistration(false);
    setError('');
    setTimeout(() => {
      alert('Registration successful! Please sign in with your credentials.');
    }, 300);
  };

  return (
    <div className="login-page">
      {/* Loading overlay */}
      {isLoading && !isSuccess && (
        <motion.div
          className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm z-10 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}

      {/* Main Content */}
      <motion.div
        className="relative z-20 w-full max-w-md px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: isSuccess ? 0 : 1, 
          y: isSuccess ? -20 : 0,
          scale: isSuccess ? 0.95 : 1
        }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <img 
            src="https://i.ibb.co/pBj9bMp4/logo-removebg-preview.png"
            alt="D-FARE Logo" 
            className="login-logo mx-auto mb-3"
          />
          <p className="login-subtitle text-sm">Fair Dispatch Management System</p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          className="login-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Sign In</h2>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Access your dispatch operations</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#E2A94B' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg transition-all"
                  placeholder="you@company.com"
                  disabled={isLoading || isSuccess}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#E2A94B' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg transition-all"
                  placeholder="••••••••"
                  disabled={isLoading || isSuccess}
                  required
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
              >
                <p className="text-sm text-red-400">{error}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              whileHover={!isLoading && !isSuccess ? { y: -1 } : {}}
              whileTap={!isLoading && !isSuccess ? { scale: 0.98 } : {}}
            >
              {isLoading && !isSuccess ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Success</span>
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* Loading State */}
          {isLoading && !isSuccess && (
            <motion.div
              className="mt-4 pt-4 border-t border-slate-700/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <ProfessionalLoadingText />
            </motion.div>
          )}

          {/* Demo Credentials */}
          <div className="mt-6 p-4 rounded-lg" style={{ background: 'rgba(12, 34, 57, 0.5)', border: '1px solid rgba(226, 169, 75, 0.2)' }}>
            <p className="text-xs font-medium mb-2" style={{ color: '#E2A94B' }}>Demo Credentials</p>
            <div className="text-xs space-y-1 font-mono" style={{ color: 'rgba(255,255,255,0.6)' }}>
              <p>demo@organization.com</p>
              <p>demo123</p>
            </div>
          </div>

          {/* Registration Link */}
          <div className="mt-6 text-center text-sm">
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>New organization? </span>
            <button
              onClick={() => setShowRegistration(true)}
              className="register-link transition-colors"
              disabled={isLoading}
            >
              Register here
            </button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-6 text-center text-xs"
          style={{ color: 'rgba(255,255,255,0.6)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>© 2026 D-FARE Systems. Enterprise Edition.</p>
          <p className="mt-1">Secure authentication • Data isolation • GDPR compliant</p>
        </motion.div>
      </motion.div>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={showRegistration}
        onClose={() => setShowRegistration(false)}
        onComplete={handleRegistrationComplete}
      />
    </div>
  );
}
