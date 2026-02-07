'use client';
import { motion } from 'framer-motion';
import {
  Play,
  Truck,
  Scale,
  MapPin,
  TrendingUp,
  Bell,
  Brain,
  Zap,
  Users,
  Shield,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
export default function MarketingLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const features = [
    { icon: Truck, text: 'Real-Time Dispatch' },
    { icon: Scale, text: 'Fair Driver Allocation' },
    { icon: TrendingUp, text: 'Demand Prediction' },
    { icon: Bell, text: 'Instant Alerts' },
    { icon: Zap, text: 'Lightning Fast' },
    { icon: Users, text: 'Driver Fairness' },
    { icon: Shield, text: 'Secure Platform' },
  ];
  const scrollingFeatures = [...features, ...features];
  return (
    <div className={`relative min-h-screen font-['Inter'] text-slate-900 bg-gradient-to-b from-white via-slate-50/50 to-white ${isHome ? 'overflow-hidden' : 'overflow-auto'}`}>
      {/* Background waves / abstract shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-[-20%] h-[520px] w-[620px] rounded-[50%] bg-[radial-gradient(circle_at_top,_#f1f5f9_0,_transparent_60%)]" />
        <div className="absolute top-40 -left-52 h-[480px] w-[560px] rounded-[50%] bg-[radial-gradient(circle_at_top,_#e2e8f0_0,_transparent_65%)]" />
        <div className="absolute inset-x-[-10%] top-[32%] h-[420px] rounded-[50%] bg-gradient-to-b from-slate-100/80 via-transparent to-transparent" />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header / navbar */}
        <header className="flex-none border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            {/* Logo / Brand */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <img
                src="https://i.ibb.co/pBj9bMp4/logo-removebg-preview.png"
                alt="D-FARE Logo"
                style={{
                  height: '80px',
                  width: 'auto',
                  objectFit: 'contain',
                  filter:
                    'drop-shadow(0 4px 10px rgba(15,23,42,0.35)) drop-shadow(0 1px 4px rgba(37,99,235,0.45))',
                }}
              />
            </motion.div>
            {/* Menu */}
            <motion.div
              className="hidden items-center gap-5 md:flex"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <button
                type="button"
                onClick={() => router.push('/')}
                className="!bg-transparent border-none rounded-lg px-4 py-2 text-sm font-medium !text-slate-700 transition-colors hover:bg-transparent hover:!text-[#1d4ed8]"
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => router.push('/features')}
                className="!bg-transparent border-none rounded-lg px-4 py-2 text-sm font-medium !text-slate-700 transition-colors hover:bg-transparent hover:!text-[#1d4ed8]"
              >
                Features
              </button>
              <button
                type="button"
                onClick={() => router.push('/how-it-works')}
                className="!bg-transparent border-none rounded-lg px-4 py-2 text-sm font-medium !text-slate-700 transition-colors hover:bg-transparent hover:!text-[#1d4ed8]"
              >
                How It Works
              </button>
              <button
                type="button"
                onClick={() => router.push('/why-dfare')}
                className="!bg-transparent border-none rounded-lg px-4 py-2 text-sm font-medium !text-slate-700 transition-colors hover:bg-transparent hover:!text-[#1d4ed8]"
              >
                Why D-FARE
              </button>
              <button
                type="button"
                onClick={() => router.push('/auth/login')}
                className="rounded-full !bg-[#1d4ed8] border border-[#1d4ed8] px-5 py-2 text-sm font-semibold !text-white shadow-md transition-all hover:!bg-[#2563eb] hover:border-[#2563eb]"
              >
                Login
              </button>
            </motion.div>
          </div>
        </header>
        {/* Hero section (Home only) */}
        {isHome && (
        <section className="flex flex-none items-center py-6 md:py-10">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-16">
              {/* Left: text / CTAs */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <motion.div
                  className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 transition-colors hover:border-slate-300 hover:bg-slate-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                    <Brain className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">
                    D-FARE Dispatch System
                  </span>
                </motion.div>
                <motion.h1
                  className="mb-4 text-4xl font-bold leading-tight text-slate-900 md:text-5xl lg:text-6xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.25 }}
                >
                  Fair{' '}
                  <span className="text-slate-800">
                    Dispatch System
                  </span>{' '}
                  for Smarter Deliveries
                </motion.h1>
                <motion.p
                  className="mb-6 max-w-xl text-sm leading-relaxed text-slate-600 md:text-base lg:text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.35 }}
                >
                  Balancing workload, reducing delays and providing efficient delivery routes in real
                  time.
                </motion.p>
                <motion.div
                  className="flex flex-wrap items-center gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                >
                  <motion.button
                    type="button"
                    onClick={() => router.push('/auth/register-organization')}
                    className="rounded-full border border-[#1d4ed8] bg-[#1d4ed8] px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#2563eb] hover:border-[#2563eb] md:text-base"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    Get Started
                  </motion.button>
                  <motion.button
                    type="button"
                    className="flex items-center gap-2 rounded-full border border-slate-300 bg-transparent px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-[#1d4ed8] hover:border-[#1d4ed8] hover:text-white md:text-base"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <Play className="h-4 w-4" />
                    Watch Demo
                  </motion.button>
                </motion.div>
                {/* Helper text under CTAs */}
                <motion.p
                  className="mt-4 text-xs text-slate-600 md:text-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.45 }}
                >
                  Ready to transform your dispatch operations?{' '}
                  <button
                    type="button"
                    onClick={() => router.push('/auth/login')}
                    className="!bg-transparent !text-slate-700 border-none p-0 font-semibold underline-offset-2 hover:!text-[#1d4ed8] hover:underline cursor-pointer"
                  >
                    Register Organization
                  </button>{' '}
                  or{' '}
                  <button
                    type="button"
                    onClick={() => router.push('/auth/login')}
                    className="!bg-transparent !text-slate-700 border-none p-0 font-semibold underline-offset-2 hover:!text-[#1d4ed8] hover:underline cursor-pointer"
                  >
                    Login to Dashboard
                  </button>
                </motion.p>
              </motion.div>
              {/* Right: circular illustration with landing image */}
              <motion.div
                className="relative flex flex-col items-center justify-center"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <div className="flex items-center justify-center">
                  <motion.div
                    className="relative h-72 w-72 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 shadow-[0_18px_45px_rgba(15,23,42,0.12)] overflow-hidden flex items-center justify-center"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <img
                      src="/images/landingpage.png"
                      alt="D-FARE landing overview"
                      className="h-full w-full rounded-full object-cover object-center"
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        )}
        {/* Page content: hero area on home, or main content on /features, /how-it-works, /why-dfare */}
        <section className={isHome ? 'flex-none border-t border-slate-200 bg-transparent' : 'flex-1'}>
          {children}
        </section>
        {/* Bottom feature ticker (Home only) */}
        {isHome && (
        <footer className="flex-none border-t border-slate-200 bg-white/90 py-3">
          <div className="mx-auto max-w-7xl overflow-hidden px-4">
            <motion.div
              className="flex gap-4"
              animate={{ x: [0, -1920] }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
              {scrollingFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex-shrink-0 rounded-xl border border-slate-200 bg-white px-5 py-2 shadow-sm"
                  whileHover={{ y: -2, scale: 1.03 }}
                >
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <feature.icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 md:text-sm">
                      {feature.text}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </footer>
        )}
      </div>
    </div>
  );
}