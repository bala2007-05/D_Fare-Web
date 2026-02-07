'use client';
import { motion } from 'framer-motion';
import { Play, Truck, Scale, MapPin, TrendingUp, Bell, Brain, Zap, Users, Shield } from 'lucide-react';
export default function LandingPage() {
  const features = [
    { icon: Truck, text: 'Real-Time Dispatch' },
    { icon: Scale, text: 'Fair Driver Allocation' },
    { icon: MapPin, text: 'Smart Route Engine' },
    { icon: TrendingUp, text: 'Demand Prediction' },
    { icon: Bell, text: 'Instant Alerts' },
    { icon: Brain, text: 'Dynamic Optimization' },
    { icon: Zap, text: 'Lightning Fast' },
    { icon: Users, text: 'Driver Fairness' },
    { icon: Shield, text: 'Secure Platform' },
  ];
  const scrollingFeatures = [...features, ...features];
  return (
    <div className="min-h-screen bg-[#0B1C2D] relative overflow-hidden font-['Inter']">
      {/* Animated Background Gradient Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4A017] to-transparent opacity-30"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute top-1/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F5C76B] to-transparent opacity-20"
          animate={{
            x: ['200%', '-100%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4A017] to-transparent opacity-25"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute top-3/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F5C76B] to-transparent opacity-20"
          animate={{
            x: ['200%', '-100%'],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Logo Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-[#D4A017]/30 mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F5C76B] to-[#D4A017] flex items-center justify-center">
                <Brain className="w-5 h-5 text-[#0B1C2D]" />
              </div>
              <span className="text-[#F5C76B] font-semibold text-sm">D-FARE System</span>
            </motion.div>
            {/* Main Heading */}
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Fair Dispatch System for Smarter Deliveries
            </motion.h1>
            {/* Subtext */}
            <motion.p
              className="text-xl text-gray-300 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Balancing workload, reducing delays and providing efficient delivery routes in real
              time.
            </motion.p>
            {/* Buttons */}
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-[#F5C76B] to-[#D4A017] text-[#0B1C2D] font-semibold rounded-xl shadow-lg shadow-[#D4A017]/30 hover:shadow-[#D4A017]/50 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
              <motion.button
                className="px-8 py-4 bg-transparent border-2 border-[#D4A017] text-[#D4A017] font-semibold rounded-xl hover:bg-[#D4A017]/10 transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </motion.button>
            </motion.div>
            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div>
                <div className="text-3xl font-bold text-[#F5C76B]">98%</div>
                <div className="text-sm text-gray-400 mt-1">Fairness Score</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#F5C76B]">2.3s</div>
                <div className="text-sm text-gray-400 mt-1">Avg Response</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#F5C76B]">10K+</div>
                <div className="text-sm text-gray-400 mt-1">Daily Routes</div>
              </div>
            </motion.div>
          </motion.div>
          {/* Right Side - Illustration */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Glassmorphism Card Container */}
            <div className="relative">
              {/* Main Illustration Card */}
              <motion.div
                className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {/* AI Network Visualization */}
                <div className="aspect-square relative">
                  {/* Center AI Node */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-[#F5C76B] to-[#D4A017] flex items-center justify-center shadow-lg shadow-[#D4A017]/50"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Brain className="w-12 h-12 text-[#0B1C2D]" />
                  </motion.div>
                  {/* Orbiting Trucks */}
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute top-1/2 left-1/2 w-16 h-16"
                      animate={{
                        rotate: [i * 90, i * 90 + 360],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      style={{
                        transformOrigin: '0 0',
                      }}
                    >
                      <motion.div
                        className="absolute -top-8 -left-8 w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-[#D4A017]/30 flex items-center justify-center"
                        animate={{
                          rotate: [-(i * 90), -(i * 90 + 360)],
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      >
                        <Truck className="w-8 h-8 text-[#F5C76B]" />
                      </motion.div>
                    </motion.div>
                  ))}
                  {/* Connecting Lines */}
                  <svg className="absolute inset-0 w-full h-full">
                    <defs>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#D4A017" stopOpacity="0" />
                        <stop offset="50%" stopColor="#D4A017" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#D4A017" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <motion.circle
                      cx="50%"
                      cy="50%"
                      r="40%"
                      fill="none"
                      stroke="url(#lineGradient)"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      animate={{
                        strokeDashoffset: [0, 50],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  </svg>
                  {/* Floating Data Points */}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={`dot-${i}`}
                      className="absolute w-3 h-3 rounded-full bg-[#D4A017] shadow-lg shadow-[#D4A017]/50"
                      style={{
                        top: `${20 + i * 15}%`,
                        left: `${10 + i * 20}%`,
                      }}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 2 + i * 0.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </div>
              </motion.div>
              {/* Floating Feature Cards */}
              <motion.div
                className="absolute -top-8 -right-8 bg-white/10 backdrop-blur-xl border border-[#D4A017]/30 rounded-2xl p-4 shadow-xl"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F5C76B] to-[#D4A017] flex items-center justify-center">
                    <Zap className="w-6 h-6 text-[#0B1C2D]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Real-Time</div>
                    <div className="text-xs text-gray-400">AI Processing</div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                className="absolute -bottom-8 -left-8 bg-white/10 backdrop-blur-xl border border-[#D4A017]/30 rounded-2xl p-4 shadow-xl"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F5C76B] to-[#D4A017] flex items-center justify-center">
                    <Scale className="w-6 h-6 text-[#0B1C2D]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Fair Score</div>
                    <div className="text-xs text-gray-400">98% Accuracy</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      {/* Moving Bottom Strip */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0F2438] border-t border-[#D4A017]/20 py-4 overflow-hidden z-50">
        <motion.div
          className="flex gap-6"
          animate={{
            x: [0, -1920],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {scrollingFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0 px-6 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-[#D4A017]/40 hover:border-[#D4A017] transition-all duration-300 shadow-lg hover:shadow-[#D4A017]/30 group cursor-pointer"
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
      </div>
    </div>
  );
}