'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, MapPin, Upload, FileText, Check, ArrowRight, ArrowLeft, User, Mail, Lock, Phone } from 'lucide-react';
import Card, { CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';

export default function RegisterOrganization() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Organization Details
    organizationName: '',
    organizationType: 'logistics',
    businessRegNumber: '',
    officialEmail: '',
    officialPhone: '',
    // Admin Account
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    confirmPassword: '',
    // Service Setup
    numberOfHubs: '1',
    serviceAreas: '',
    // Documents
    businessDoc: null,
    insurance: null,
    kycProof: null,
  });

  const steps = [
    { id: 1, name: 'Organization Details', icon: Building2 },
    { id: 2, name: 'Admin Account', icon: User },
    { id: 3, name: 'Service Setup', icon: MapPin },
    { id: 4, name: 'Documents', icon: FileText },
  ];

  const validateStep = (stepNumber) => {
    if (stepNumber === 1) {
      return formData.organizationName && formData.businessRegNumber && formData.officialEmail;
    }
    if (stepNumber === 2) {
      return formData.adminName && formData.adminEmail && formData.adminPassword && 
             formData.adminPassword === formData.confirmPassword;
    }
    if (stepNumber === 3) {
      return formData.numberOfHubs && formData.serviceAreas;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(step)) {
      alert('Please fill in all required fields');
      return;
    }
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    // In real app, send data to API
    console.log('Organization Registration Data:', formData);
    
    // Simulate success and redirect to login
    setTimeout(() => {
      router.push('/auth/login?registered=true');
    }, 500);
  };

  const handleFileChange = (field, event) => {
    const file = event.target.files[0];
    setFormData({...formData, [field]: file});
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">D</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Organization Registration</h1>
          <p className="text-sm text-slate-600">Complete your registration to start using D-FARE</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isCompleted = step > s.id;
              
              return (
                <div key={s.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isCompleted ? 'bg-success-500 text-white' :
                      isActive ? 'bg-primary-500 text-white' :
                      'bg-slate-200 text-slate-400'
                    }`}>
                      {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <p className={`text-xs font-medium mt-2 ${
                      isActive ? 'text-slate-900' : 'text-slate-500'
                    }`}>
                      {s.name}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-1 flex-1 mx-4 rounded transition-all ${
                      step > s.id ? 'bg-success-500' : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Step {step} of 4: {steps[step - 1].name}</CardTitle>
            <p className="text-sm text-slate-600 mt-1">
              {step === 1 && 'Enter your organization information'}
              {step === 2 && 'Create your admin account'}
              {step === 3 && 'Configure your service operations'}
              {step === 4 && 'Upload required documents'}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Organization Details */}
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Organization Name <span className="text-danger-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.organizationName}
                    onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
                    placeholder="Enter your organization name"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Organization Type <span className="text-danger-600">*</span>
                  </label>
                  <select
                    value={formData.organizationType}
                    onChange={(e) => setFormData({...formData, organizationType: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="logistics">Logistics</option>
                    <option value="courier">Courier</option>
                    <option value="food_delivery">Food Delivery</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Business Registration / GST Number <span className="text-danger-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.businessRegNumber}
                    onChange={(e) => setFormData({...formData, businessRegNumber: e.target.value})}
                    placeholder="GST or Business Registration Number"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Official Email <span className="text-danger-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.officialEmail}
                    onChange={(e) => setFormData({...formData, officialEmail: e.target.value})}
                    placeholder="contact@yourorganization.com"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Official Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.officialPhone}
                    onChange={(e) => setFormData({...formData, officialPhone: e.target.value})}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </>
            )}

            {/* Step 2: Admin Account */}
            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Admin Name <span className="text-danger-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.adminName}
                    onChange={(e) => setFormData({...formData, adminName: e.target.value})}
                    placeholder="Full Name"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Admin Email <span className="text-danger-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.adminEmail}
                    onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                    placeholder="admin@yourorganization.com"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Password <span className="text-danger-600">*</span>
                  </label>
                  <input
                    type="password"
                    value={formData.adminPassword}
                    onChange={(e) => setFormData({...formData, adminPassword: e.target.value})}
                    placeholder="Create a strong password"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Confirm Password <span className="text-danger-600">*</span>
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="Re-enter password"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                  {formData.confirmPassword && formData.adminPassword !== formData.confirmPassword && (
                    <p className="text-xs text-danger-600 mt-1">Passwords do not match</p>
                  )}
                </div>
              </>
            )}

            {/* Step 3: Service Setup */}
            {step === 3 && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Number of Hubs <span className="text-danger-600">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.numberOfHubs}
                    onChange={(e) => setFormData({...formData, numberOfHubs: e.target.value})}
                    placeholder="How many hubs?"
                    min="1"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Primary Service Areas <span className="text-danger-600">*</span>
                  </label>
                  <textarea
                    value={formData.serviceAreas}
                    onChange={(e) => setFormData({...formData, serviceAreas: e.target.value})}
                    placeholder="List your service areas (one per line)&#10;Example:&#10;Downtown Manhattan&#10;Brooklyn Heights&#10;Queens Central"
                    rows={5}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">Enter one service area per line</p>
                </div>
              </>
            )}

            {/* Step 4: Documents */}
            {step === 4 && (
              <>
                <div className="space-y-4">
                  {/* Business Registration */}
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-primary-400 transition-colors">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-700 text-center mb-2">
                      Business Registration Certificate
                    </p>
                    <input 
                      type="file" 
                      onChange={(e) => handleFileChange('businessDoc', e)}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
                    />
                    {formData.businessDoc && (
                      <p className="text-xs text-success-600 mt-2 text-center">
                        ✓ {formData.businessDoc.name}
                      </p>
                    )}
                  </div>

                  {/* Insurance */}
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-primary-400 transition-colors">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-700 text-center mb-2">
                      Insurance Certificate
                    </p>
                    <input 
                      type="file" 
                      onChange={(e) => handleFileChange('insurance', e)}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
                    />
                    {formData.insurance && (
                      <p className="text-xs text-success-600 mt-2 text-center">
                        ✓ {formData.insurance.name}
                      </p>
                    )}
                  </div>

                  {/* KYC Proof */}
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-primary-400 transition-colors">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-700 text-center mb-2">
                      KYC Proof (PAN, Aadhaar, etc.)
                    </p>
                    <input 
                      type="file" 
                      onChange={(e) => handleFileChange('kycProof', e)}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
                    />
                    {formData.kycProof && (
                      <p className="text-xs text-success-600 mt-2 text-center">
                        ✓ {formData.kycProof.name}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
              <div className="flex items-center gap-3">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-2.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                )}
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Back to Login
                </Link>
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center gap-2 font-semibold"
              >
                {step === 4 ? 'Register Organization' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="mt-6 text-center text-xs text-slate-500">
          <p>All information will be verified before activation</p>
          <p className="mt-1">You'll receive a confirmation email once approved</p>
        </div>
      </div>
    </div>
  );
}
