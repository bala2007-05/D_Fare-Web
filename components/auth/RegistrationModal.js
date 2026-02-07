'use client';
import { useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, User, MapPin, FileText, CheckCircle, ArrowRight } from 'lucide-react';
export default function RegistrationModal({ isOpen, onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const defaultHub = () => ({
    hubName: '',
    hubId: '',
    hubAddress: '',
    serviceRadiusKm: '',
    officeStart: '',
    officeEnd: '',
    numberOfDrivers: '',
    vehicleTypes: [],
    minWeightKg: '',
    maxWeightKg: '',
  });
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: 'logistics',
    businessRegNumber: '',
    officialEmail: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    numberOfHubs: 1,
    hubs: [defaultHub()],
  });
  const inputClass = 'w-full px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none';
  const VEHICLE_OPTIONS = [
    { value: 'two_wheeler', label: 'Two Wheeler' },
    { value: 'three_wheeler', label: 'Three Wheeler' },
    { value: 'four_wheeler', label: 'Four Wheeler' },
  ];
  const steps = [
    { id: 1, name: 'Organization', icon: Building2 },
    { id: 2, name: 'Admin Setup', icon: User },
    { id: 3, name: 'Configuration', icon: MapPin },
  ];
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
      const n = Number(formData.numberOfHubs) || 0;
      if (n < 1 || !formData.hubs || formData.hubs.length !== n) return false;
      return formData.hubs.every(
        (h) =>
          h.hubName?.trim() !== '' &&
          h.hubId?.trim() !== '' &&
          h.hubAddress?.trim() !== '' &&
          h.numberOfDrivers !== '' &&
          h.vehicleTypes?.length > 0
      );
    }
    return false;
  };
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
  const handleStepClick = (clickedStep) => {
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
            background: '#ffffff',
            border: '1px solid rgba(148, 163, 184, 0.35)',
            maxWidth: '720px'
          }}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Organization Registration</h2>
              <p className="text-sm mt-1 text-slate-500">Step {step} of {steps.length}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Progress Steps */}
          <div 
            className="px-6 py-4 border-b border-slate-200"
            style={{
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
                          background: isCompleted || isActive ? '#2563eb' : 'rgba(148, 163, 184, 0.3)',
                          color: isCompleted || isActive ? 'white' : '#64748b',
                          border: isActive && !isCompleted ? '2px solid #2563eb' : 'none',
                          opacity: isClickable ? 1 : 0.5,
                          flexShrink: 0
                        }}
                      >
                        {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                      </div>
                      <span 
                        className="text-sm font-medium" 
                        style={{ 
                          color: isActive ? '#0f172a' : '#64748b',
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
                          background: completedSteps.includes(s.id) ? '#2563eb' : 'rgba(148, 163, 184, 0.3)',
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
                    <label className="block text-sm font-medium mb-2 text-slate-700">
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      value={formData.organizationName}
                      onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 transition-all"
                      placeholder="Enter organization name"
                      disabled={isSubmitting}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#2563eb';
                        e.target.style.boxShadow = '0 0 0 2px rgba(37,99,235,0.25)';
                        e.target.style.outline = 'none';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgb(226, 232, 240)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700">
                      Organization Type *
                    </label>
                    <select
                      value={formData.organizationType}
                      onChange={(e) => setFormData({ ...formData, organizationType: e.target.value })}
                      className={inputClass}
                      disabled={isSubmitting}
                    >
                      <option value="logistics">Logistics</option>
                      <option value="ecommerce">E-commerce</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700">
                      Business Registration Number *
                    </label>
                    <input
                      type="text"
                      value={formData.businessRegNumber}
                      onChange={(e) => setFormData({ ...formData, businessRegNumber: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 transition-all"
                      placeholder="GST or Business Registration Number"
                      disabled={isSubmitting}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#2563eb';
                        e.target.style.boxShadow = '0 0 0 2px rgba(37,99,235,0.25)';
                        e.target.style.outline = 'none';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgb(226, 232, 240)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      value={formData.officialEmail}
                      onChange={(e) => setFormData({ ...formData, officialEmail: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 transition-all"
                      placeholder="contact@company.com"
                      disabled={isSubmitting}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#2563eb';
                        e.target.style.boxShadow = '0 0 0 2px rgba(37,99,235,0.25)';
                        e.target.style.outline = 'none';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgb(226, 232, 240)';
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
                    <label className="block text-sm font-medium mb-2 text-slate-700">Admin Name *</label>
                    <input
                      type="text"
                      value={formData.adminName}
                      onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 transition-all"
                      placeholder="Full name"
                      disabled={isSubmitting}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#2563eb';
                        e.target.style.boxShadow = '0 0 0 2px rgba(37,99,235,0.25)';
                        e.target.style.outline = 'none';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgb(226, 232, 240)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700">Admin Email *</label>
                    <input
                      type="email"
                      value={formData.adminEmail}
                      onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 transition-all"
                      placeholder="admin@company.com"
                      disabled={isSubmitting}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#2563eb';
                        e.target.style.boxShadow = '0 0 0 2px rgba(37,99,235,0.25)';
                        e.target.style.outline = 'none';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgb(226, 232, 240)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700">Password *</label>
                    <input
                      type="password"
                      value={formData.adminPassword}
                      onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 transition-all"
                      placeholder="Create secure password"
                      disabled={isSubmitting}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#2563eb';
                        e.target.style.boxShadow = '0 0 0 2px rgba(37,99,235,0.25)';
                        e.target.style.outline = 'none';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgb(226, 232, 240)';
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
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700">Number of Hubs *</label>
                    <input
                      type="number"
                      min={1}
                      value={formData.numberOfHubs}
                      onChange={(e) => {
                        const n = Math.max(1, parseInt(e.target.value, 10) || 1);
                        const hubs = formData.hubs.slice(0, n);
                        while (hubs.length < n) hubs.push(defaultHub());
                        setFormData({ ...formData, numberOfHubs: n, hubs });
                      }}
                      className={inputClass}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-sm font-semibold text-slate-800">Hub Details</h3>
                    {formData.hubs.map((hub, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-4"
                      >
                        <div className="text-xs font-semibold uppercase tracking-wide text-blue-600 border-b border-slate-200 pb-2">
                          Hub {index + 1}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium mb-1 text-slate-700">Hub Name *</label>
                            <input
                              type="text"
                              value={hub.hubName}
                              onChange={(e) => {
                                const next = formData.hubs.slice();
                                next[index] = { ...next[index], hubName: e.target.value };
                                setFormData({ ...formData, hubs: next });
                              }}
                              placeholder="e.g. Central Depot"
                              className={inputClass}
                              disabled={isSubmitting}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1 text-slate-700">Hub ID *</label>
                            <input
                              type="text"
                              value={hub.hubId}
                              onChange={(e) => {
                                const next = formData.hubs.slice();
                                next[index] = { ...next[index], hubId: e.target.value };
                                setFormData({ ...formData, hubs: next });
                              }}
                              placeholder="e.g. HUB-01"
                              className={inputClass}
                              disabled={isSubmitting}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1 text-slate-700">Service Radius (km)</label>
                            <input
                              type="number"
                              min={0}
                              value={hub.serviceRadiusKm}
                              onChange={(e) => {
                                const next = formData.hubs.slice();
                                next[index] = { ...next[index], serviceRadiusKm: e.target.value };
                                setFormData({ ...formData, hubs: next });
                              }}
                              placeholder="km"
                              className={inputClass}
                              disabled={isSubmitting}
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium mb-1 text-slate-700">Hub Address *</label>
                            <input
                              type="text"
                              value={hub.hubAddress}
                              onChange={(e) => {
                                const next = formData.hubs.slice();
                                next[index] = { ...next[index], hubAddress: e.target.value };
                                setFormData({ ...formData, hubs: next });
                              }}
                              placeholder="Full address"
                              className={inputClass}
                              disabled={isSubmitting}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1 text-slate-700">Office Start Time</label>
                            <input
                              type="time"
                              value={hub.officeStart}
                              onChange={(e) => {
                                const next = formData.hubs.slice();
                                next[index] = { ...next[index], officeStart: e.target.value };
                                setFormData({ ...formData, hubs: next });
                              }}
                              className={inputClass}
                              disabled={isSubmitting}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1 text-slate-700">Office End Time</label>
                            <input
                              type="time"
                              value={hub.officeEnd}
                              onChange={(e) => {
                                const next = formData.hubs.slice();
                                next[index] = { ...next[index], officeEnd: e.target.value };
                                setFormData({ ...formData, hubs: next });
                              }}
                              className={inputClass}
                              disabled={isSubmitting}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1 text-slate-700">Number of Drivers *</label>
                            <input
                              type="number"
                              min={0}
                              value={hub.numberOfDrivers}
                              onChange={(e) => {
                                const next = formData.hubs.slice();
                                next[index] = { ...next[index], numberOfDrivers: e.target.value };
                                setFormData({ ...formData, hubs: next });
                              }}
                              placeholder="0"
                              className={inputClass}
                              disabled={isSubmitting}
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium mb-1 text-slate-700">Vehicle Types * (multi-select)</label>
                            <div className="flex flex-wrap gap-2">
                              {VEHICLE_OPTIONS.map((opt) => {
                                const selected = (hub.vehicleTypes || []).includes(opt.value);
                                return (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                      const next = formData.hubs.slice();
                                      const current = next[index].vehicleTypes || [];
                                      const nextTypes = selected
                                        ? current.filter((t) => t !== opt.value)
                                        : [...current, opt.value];
                                      next[index] = { ...next[index], vehicleTypes: nextTypes };
                                      setFormData({ ...formData, hubs: next });
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${selected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}
                                    disabled={isSubmitting}
                                  >
                                    {opt.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1 text-slate-700">Minimum Weight (kg)</label>
                            <input
                              type="number"
                              min={0}
                              value={hub.minWeightKg}
                              onChange={(e) => {
                                const next = formData.hubs.slice();
                                next[index] = { ...next[index], minWeightKg: e.target.value };
                                setFormData({ ...formData, hubs: next });
                              }}
                              placeholder="0"
                              className={inputClass}
                              disabled={isSubmitting}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1 text-slate-700">Maximum Weight (kg)</label>
                            <input
                              type="number"
                              min={0}
                              value={hub.maxWeightKg}
                              onChange={(e) => {
                                const next = formData.hubs.slice();
                                next[index] = { ...next[index], maxWeightKg: e.target.value };
                                setFormData({ ...formData, hubs: next });
                              }}
                              placeholder="0"
                              className={inputClass}
                              disabled={isSubmitting}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-slate-200">
            <button
              onClick={() => {
                if (step > 1) {
                  setStep(step - 1);
                  setShowError(false);
                }
              }}
              disabled={step === 1 || isSubmitting}
              className="px-4 py-2 text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => (step < 3 ? handleNext() : handleSubmit())}
              disabled={isSubmitting || (step === 3 && !isStepValid(3))}
              className="px-6 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 next-btn"
              style={{
                background: isSubmitting || (step === 3 && !isStepValid(3)) ? 'rgba(37, 99, 235, 0.5)' : '#2563eb',
                color: 'white',
                fontWeight: 700
              }}
              onMouseEnter={(e) => {
                if (!e.target.disabled) {
                  e.target.style.background = '#2563EB';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.target.disabled) {
                  e.target.style.background = '#2563eb';
                }
              }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'white', borderTopColor: 'transparent' }} />
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