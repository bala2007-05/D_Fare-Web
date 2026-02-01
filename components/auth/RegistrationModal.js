'use client';

import { useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, User, MapPin, FileText, CheckCircle, ArrowRight } from 'lucide-react';

export default function RegistrationModal({ isOpen, onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: 'logistics',
    businessRegNumber: '',
    officialEmail: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    numberOfHubs: '1',
    serviceAreas: '',
  });

  const steps = [
    { id: 1, name: 'Organization', icon: Building2 },
    { id: 2, name: 'Admin Setup', icon: User },
    { id: 3, name: 'Configuration', icon: MapPin },
  ];

  // Validation function for each step
  const isStepValid = (stepNumber) => {
    if (stepNumber === 1) {
      return (
        formData.organizationName.trim() !== '' &&
        formData.organizationType.trim() !== '' &&
        formData.businessRegNumber.trim() !== '' &&
        formData.officialEmail.trim() !== ''
      );
    }

    if (stepNumber === 2) {
      return (
        formData.adminName.trim() !== '' &&
        formData.adminEmail.trim() !== '' &&
        formData.adminPassword.trim() !== ''
      );
    }

    if (stepNumber === 3) {
      return (
        formData.numberOfHubs.trim() !== '' &&
        formData.serviceAreas.trim() !== ''
      );
    }

    return false;
  };

  // Handle next button click
  const handleNext = () => {
    if (isStepValid(step)) {
      setShowError(false);
      if (!completedSteps.includes(step)) {
        setCompletedSteps([...completedSteps, step]);
      }
      setStep(step + 1);
    } else {
      setShowError(true);
    }
  };

  // Handle step click in progress indicator
  const handleStepClick = (clickedStep) => {
    // Only allow going back to previous steps or current step
    if (clickedStep < step || completedSteps.includes(clickedStep)) {
      setStep(clickedStep);
      setShowError(false);
    }
  };

  const handleSubmit = () => {
    if (isStepValid(step)) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        onComplete();
      }, 2000);
    } else {
      setShowError(true);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="registration-modal relative w-full rounded-lg shadow-2xl"
          style={{
            background: '#0F2A47',
            border: '2px solid rgba(226, 169, 75, 0.2)',
            maxWidth: '700px'
          }}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div>
              <h2 className="text-xl font-semibold" style={{ color: '#E2A94B' }}>Organization Registration</h2>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Step {step} of {steps.length}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'rgba(255,255,255,0.6)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div 
            className="px-6 py-4" 
            style={{ 
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              width: '100%',
              overflow: 'hidden'
            }}
          >
            <div 
              className="flex items-center" 
              style={{ 
                width: '100%',
                justifyContent: 'space-between',
                flexWrap: 'nowrap'
              }}
            >
              {steps.map((s, index) => {
                const Icon = s.icon;
                const isActive = step === s.id;
                const isCompleted = completedSteps.includes(s.id);
                const isClickable = s.id < step || completedSteps.includes(s.id);

                return (
                  <Fragment key={s.id}>
                    <div 
                      className="flex items-center gap-2"
                      onClick={() => handleStepClick(s.id)}
                      style={{ 
                        cursor: isClickable ? 'pointer' : 'not-allowed',
                        minWidth: '0',
                        flex: index === steps.length - 1 ? '0 0 auto' : '0 1 auto'
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                        style={{
                          background: isCompleted || isActive ? '#E2A94B' : 'rgba(255,255,255,0.1)',
                          color: isCompleted || isActive ? '#0F2A47' : '#cbd5e1',
                          border: isActive && !isCompleted ? '2px solid #E2A94B' : 'none',
                          opacity: isClickable ? 1 : 0.5,
                          flexShrink: 0
                        }}
                      >
                        {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                      </div>
                      <span 
                        className="text-sm font-medium" 
                        style={{ 
                          color: isActive ? 'white' : 'rgba(255,255,255,0.5)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {s.name}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div 
                        className="h-0.5" 
                        style={{ 
                          background: completedSteps.includes(s.id) ? '#E2A94B' : 'rgba(255,255,255,0.1)',
                          flex: '1 1 auto',
                          minWidth: '20px',
                          margin: '0 12px'
                        }} 
                      />
                    )}
                  </Fragment>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {/* Error Message */}
            {showError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}
              >
                <p className="text-sm font-medium" style={{ color: '#ef4444' }}>
                  Please fill all required fields before proceeding
                </p>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#E2A94B', fontWeight: 500 }}>
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      value={formData.organizationName}
                      onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg text-white transition-all registration-input"
                      style={{
                        background: '#0c2239',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: 'white'
                      }}
                      placeholder="Enter organization name"
                      disabled={isSubmitting}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#E2A94B';
                        e.target.style.boxShadow = '0 0 0 2px rgba(226,169,75,0.3)';
                        e.target.style.outline = 'none';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#E2A94B', fontWeight: 500 }}>
                      Organization Type *
                    </label>
                    <select
                      value={formData.organizationType}
                      onChange={(e) => setFormData({ ...formData, organizationType: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg text-white transition-all registration-input"
                      style={{
                        background: '#0c2239',
                        border: '1px solid rgba(255,255,255,0.15)'
                      }}
                      disabled={isSubmitting}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#E2A94B';
                        e.target.style.boxShadow = '0 0 0 2px rgba(226,169,75,0.3)';
                        e.target.style.outline = 'none';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <option value="logistics" style={{ background: '#0c2239' }}>Logistics</option>
                      <option value="courier" style={{ background: '#0c2239' }}>Courier</option>
                      <option value="food_delivery" style={{ background: '#0c2239' }}>Food Delivery</option>
                      <option value="ecommerce" style={{ background: '#0c2239' }}>E-commerce</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#E2A94B', fontWeight: 500 }}>
                      Business Registration Number *
                    </label>
                    <input
                      type="text"
                      value={formData.businessRegNumber}
                      onChange={(e) => setFormData({ ...formData, businessRegNumber: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg text-white transition-all registration-input"
                      style={{
                        background: '#0c2239',
                        border: '1px solid rgba(255,255,255,0.15)'
                      }}
                      placeholder="GST or Business Registration Number"
                      disabled={isSubmitting}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#E2A94B';
                        e.target.style.boxShadow = '0 0 0 2px rgba(226,169,75,0.3)';
                        e.target.style.outline = 'none';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#E2A94B', fontWeight: 500 }}>
                      Official Email *
                    </label>
                    <input
                      type="email"
                      value={formData.officialEmail}
                      onChange={(e) => setFormData({ ...formData, officialEmail: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg text-white transition-all registration-input"
                      style={{
                        background: '#0c2239',
                        border: '1px solid rgba(255,255,255,0.15)'
                      }}
                      placeholder="contact@company.com"
                      disabled={isSubmitting}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#E2A94B';
                        e.target.style.boxShadow = '0 0 0 2px rgba(226,169,75,0.3)';
                        e.target.style.outline = 'none';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#E2A94B', fontWeight: 500 }}>Admin Name *</label>
                    <input
                      type="text"
                      value={formData.adminName}
                      onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg text-white transition-all"
                      style={{
                        background: '#0c2239',
                        border: '1px solid rgba(255,255,255,0.15)'
                      }}
                      placeholder="Full name"
                      disabled={isSubmitting}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#E2A94B';
                        e.target.style.boxShadow = '0 0 0 2px rgba(226,169,75,0.3)';
                        e.target.style.outline = 'none';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#E2A94B', fontWeight: 500 }}>Admin Email *</label>
                    <input
                      type="email"
                      value={formData.adminEmail}
                      onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg text-white transition-all"
                      style={{
                        background: '#0c2239',
                        border: '1px solid rgba(255,255,255,0.15)'
                      }}
                      placeholder="admin@company.com"
                      disabled={isSubmitting}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#E2A94B';
                        e.target.style.boxShadow = '0 0 0 2px rgba(226,169,75,0.3)';
                        e.target.style.outline = 'none';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#E2A94B', fontWeight: 500 }}>Password *</label>
                    <input
                      type="password"
                      value={formData.adminPassword}
                      onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg text-white transition-all"
                      style={{
                        background: '#0c2239',
                        border: '1px solid rgba(255,255,255,0.15)'
                      }}
                      placeholder="Create secure password"
                      disabled={isSubmitting}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#E2A94B';
                        e.target.style.boxShadow = '0 0 0 2px rgba(226,169,75,0.3)';
                        e.target.style.outline = 'none';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#E2A94B', fontWeight: 500 }}>Number of Hubs *</label>
                    <input
                      type="number"
                      value={formData.numberOfHubs}
                      onChange={(e) => setFormData({ ...formData, numberOfHubs: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg text-white transition-all"
                      style={{
                        background: '#0c2239',
                        border: '1px solid rgba(255,255,255,0.15)'
                      }}
                      min="1"
                      disabled={isSubmitting}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#E2A94B';
                        e.target.style.boxShadow = '0 0 0 2px rgba(226,169,75,0.3)';
                        e.target.style.outline = 'none';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#E2A94B', fontWeight: 500 }}>
                      Service Areas *
                    </label>
                    <textarea
                      value={formData.serviceAreas}
                      onChange={(e) => setFormData({ ...formData, serviceAreas: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-lg text-white transition-all resize-none"
                      style={{
                        background: '#0c2239',
                        border: '1px solid rgba(255,255,255,0.15)'
                      }}
                      placeholder="Enter service areas (one per line)"
                      disabled={isSubmitting}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#E2A94B';
                        e.target.style.boxShadow = '0 0 0 2px rgba(226,169,75,0.3)';
                        e.target.style.outline = 'none';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <button
              onClick={() => {
                if (step > 1) {
                  setStep(step - 1);
                  setShowError(false);
                }
              }}
              disabled={step === 1 || isSubmitting}
              className="px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors back-btn"
              style={{ color: '#E2A94B' }}
              onMouseEnter={(e) => !e.target.disabled && (e.target.style.color = '#d1963a')}
              onMouseLeave={(e) => !e.target.disabled && (e.target.style.color = '#E2A94B')}
            >
              Back
            </button>
            <button
              onClick={() => (step < 3 ? handleNext() : handleSubmit())}
              disabled={isSubmitting || (step === 3 && !isStepValid(3))}
              className="px-6 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 next-btn"
              style={{
                background: isSubmitting || (step === 3 && !isStepValid(3)) ? 'rgba(226, 169, 75, 0.5)' : '#E2A94B',
                color: '#0F2A47',
                fontWeight: 700
              }}
              onMouseEnter={(e) => {
                if (!e.target.disabled) {
                  e.target.style.background = '#d1963a';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.target.disabled) {
                  e.target.style.background = '#E2A94B';
                }
              }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#0F2A47', borderTopColor: 'transparent' }} />
                  Processing...
                </>
              ) : step < 3 ? (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                'Complete Registration'
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
