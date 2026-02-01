'use client';

import { motion } from 'framer-motion';
import { 
  Scale, Brain, TrendingUp, Truck, MapPin, Zap, 
  BarChart3, Bell, Bot, ArrowRight, Play, CheckCircle,
  Target, Clock, Fuel
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  const features = [
    { icon: Truck, text: 'Smart Dispatch System' },
    { icon: MapPin, text: 'Live Location Tracking' },
    { icon: Zap, text: 'Faster Reassignment' },
    { icon: BarChart3, text: 'Delivery Insights' },
    { icon: Bell, text: 'Alerts & Notifications' },
    { icon: Brain, text: 'Efficient Route Planning' },
  ];

  const scrollingFeatures = [...features, ...features];

  const howItWorks = [
    {
      icon: Scale,
      title: 'Balanced Driver Assignment',
      description: 'Every driver gets equal opportunity with proper workload distribution.'
    },
    {
      icon: Brain,
      title: 'Smart Route Planning',
      description: 'We provide shorter and more efficient delivery routes.'
    },
    {
      icon: TrendingUp,
      title: 'Live Demand Monitoring',
      description: 'System adapts quickly to changing delivery demand.'
    }
  ];

  const stats = [
    { icon: Zap, value: '+30%', label: 'Faster Dispatch' },
    { icon: Fuel, value: '+20%', label: 'Fuel Savings' },
    { icon: Scale, value: '100%', label: 'Fair Workload Balance' },
  ];

  return (
    <div className="min-h-screen bg-[#0B1C2D] text-white font-['Inter'] overflow-x-hidden">
      {/* Animated Background Lines */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-[#D4A017] to-transparent"
            style={{
              top: `${(i + 1) * 20}%`,
              width: '100%',
            }}
            animate={{
              x: i % 2 === 0 ? ['-100%', '200%'] : ['200%', '-100%'],
            }}
            transition={{
              duration: 15 + i * 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav className="relative z-50" style={{
        background: 'linear-gradient(to right, #0a192f, #0b1f3a)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div className="max-w-7xl mx-auto" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '35px 60px'
        }}>
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="https://i.ibb.co/pBj9bMp4/logo-removebg-preview.png"
              alt="D-FARE Logo"
              className="main-logo"
              style={{
                height: '170px',
                width: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))'
              }}
            />
          </motion.div>

          {/* Nav Links */}
          <motion.div
            className="hidden md:flex"
            style={{
              display: 'flex',
              gap: '40px',
              alignItems: 'center'
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <a 
              href="#features" 
              style={{
                color: '#ffffff',
                fontWeight: '500',
                textDecoration: 'none',
                fontSize: '16px',
                transition: 'color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#F5C76B'}
              onMouseLeave={(e) => e.target.style.color = '#ffffff'}
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              style={{
                color: '#ffffff',
                fontWeight: '500',
                textDecoration: 'none',
                fontSize: '16px',
                transition: 'color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#F5C76B'}
              onMouseLeave={(e) => e.target.style.color = '#ffffff'}
            >
              How It Works
            </a>
            <a 
              href="#why-dfare" 
              style={{
                color: '#ffffff',
                fontWeight: '500',
                textDecoration: 'none',
                fontSize: '16px',
                transition: 'color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#F5C76B'}
              onMouseLeave={(e) => e.target.style.color = '#ffffff'}
            >
              Why D-FARE
            </a>
            <button
              onClick={() => router.push('/auth/login')}
              className="login-btn"
              style={{
                background: '#f5b942',
                color: '#000',
                padding: '10px 22px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(245, 185, 66, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Login
            </button>
          </motion.div>
        </div>
      </nav>

      {/* SECTION 1: HERO */}
      <section className="relative min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-[#F5C76B] to-[#D4A017] bg-clip-text text-transparent">
                  Fair Dispatch System
                </span>{' '}
                for Smarter Deliveries
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Balancing driver workload, reducing delays, and providing efficient delivery routes in real-time.
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-[#F5C76B] to-[#D4A017] text-[#0B1C2D] font-semibold rounded-xl shadow-lg shadow-[#D4A017]/30 hover:shadow-[#D4A017]/50 transition-all flex items-center gap-2"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/auth/register-organization')}
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                <motion.button
                  className="px-8 py-4 bg-transparent border-2 border-[#D4A017] text-[#D4A017] font-semibold rounded-xl hover:bg-[#D4A017]/10 transition-all flex items-center gap-2"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-5 h-5" />
                  Watch Demo
                </motion.button>
              </div>
            </motion.div>

            {/* Right Illustration */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                <div className="aspect-square relative">
                  {/* Central AI Node */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-[#F5C76B] to-[#D4A017] flex items-center justify-center shadow-lg shadow-[#D4A017]/50"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Brain className="w-12 h-12 text-[#0B1C2D]" />
                  </motion.div>

                  {/* Orbiting Elements */}
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute top-1/2 left-1/2 w-16 h-16"
                      animate={{ rotate: [i * 90, i * 90 + 360] }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                      style={{ transformOrigin: '0 0' }}
                    >
                      <motion.div
                        className="absolute -top-8 -left-8 w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-[#D4A017]/30 flex items-center justify-center"
                        animate={{ rotate: [-(i * 90), -(i * 90 + 360)] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                      >
                        <Truck className="w-8 h-8 text-[#F5C76B]" />
                      </motion.div>
                    </motion.div>
                  ))}

                  {/* Connecting Circle */}
                  <svg className="absolute inset-0 w-full h-full">
                    <motion.circle
                      cx="50%"
                      cy="50%"
                      r="40%"
                      fill="none"
                      stroke="#D4A017"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      opacity="0.3"
                      animate={{ strokeDashoffset: [0, 50] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2: HOW IT WORKS */}
      <section id="how-it-works" className="relative py-20 bg-gradient-to-b from-transparent to-[#0F2438]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How <span className="text-[#D4A017]">It Works</span>
            </h2>
            <p className="text-gray-400 text-lg">Smart automation in three powerful steps</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <motion.div
                key={index}
                className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:border-[#D4A017]/50 hover:shadow-lg hover:shadow-[#D4A017]/20 transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <div className="absolute -top-6 left-8 w-12 h-12 rounded-xl bg-gradient-to-br from-[#F5C76B] to-[#D4A017] flex items-center justify-center shadow-lg shadow-[#D4A017]/30 group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6 text-[#0B1C2D]" />
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURES STRIP (Animated) */}
      <section id="features" className="relative py-16 bg-[#0F2438] border-y border-[#D4A017]/20 overflow-hidden">
        <motion.div
          className="flex gap-6"
          animate={{ x: [0, -1920] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          {scrollingFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0 px-6 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-[#D4A017]/40 hover:border-[#D4A017] transition-all duration-300 shadow-lg hover:shadow-[#D4A017]/30 group"
              whileHover={{ y: -4, scale: 1.05 }}
            >
              <div className="flex items-center gap-3 whitespace-nowrap">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#F5C76B] to-[#D4A017] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <feature.icon className="w-5 h-5 text-[#0B1C2D]" />
                </div>
                <span className="font-semibold text-white">{feature.text}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* SECTION 4: WHY D-FARE */}
      <section id="why-dfare" className="relative py-20 bg-gradient-to-b from-[#0F2438] to-[#0B1C2D]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="text-[#D4A017]">D-FARE</span>
            </h2>
            <p className="text-gray-400 text-lg">Proven results that transform logistics operations</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center hover:border-[#D4A017]/50 hover:shadow-lg hover:shadow-[#D4A017]/20 transition-all duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#F5C76B] to-[#D4A017] flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-[#0B1C2D]" />
                </div>
                <div className="text-5xl font-bold text-[#D4A017] mb-2">{stat.value}</div>
                <div className="text-gray-300 font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: CTA */}
      <section className="relative py-20 bg-gradient-to-r from-[#D4A017] to-[#F5C76B]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#0B1C2D] mb-6">
              Ready to Transform Your Dispatch Operations?
            </h2>
            <p className="text-xl text-[#0B1C2D]/80 mb-8">
              Join leading logistics companies using AI-powered fair dispatch
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                className="px-8 py-4 bg-[#0B1C2D] text-[#F5C76B] font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/auth/register-organization')}
              >
                Register Organization
              </motion.button>
              <motion.button
                className="px-8 py-4 bg-white text-[#0B1C2D] font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/auth/login')}
              >
                Login to Dashboard
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 bg-[#0B1C2D] border-t border-white/10">
        <div className="max-w-200xl mx-auto px-200">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src="https://i.ibb.co/pBj9bMp4/logo-removebg-preview.png"
                  alt="D-FARE Logo" 
                  className="h-12 w-auto object-contain"
                />
              </div>
              <p className="text-sm text-gray-400">Smart fair dispatch for modern logistics</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[#D4A017] transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-[#D4A017] transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-[#D4A017] transition-colors">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[#D4A017] transition-colors">About</a></li>
                <li><a href="#" className="hover:text-[#D4A017] transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-[#D4A017] transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[#D4A017] transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-[#D4A017] transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-[#D4A017] transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-sm text-gray-400">
            © 2026 D-FARE Systems. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
