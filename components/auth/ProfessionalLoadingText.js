'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const systemMessages = [
  "Initializing dispatch engine…",
  "Balancing workload across drivers…",
  "Validating fairness constraints…",
  "Preparing operations dashboard…",
  "Loading route optimization system…",
  "Establishing secure connection…",
];

export default function ProfessionalLoadingText() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % systemMessages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-5 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={currentIndex}
          className="text-sm text-slate-400 font-normal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {systemMessages[currentIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
