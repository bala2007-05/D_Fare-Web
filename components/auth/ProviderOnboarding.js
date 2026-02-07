'use client';
import { useState } from 'react';
import { Building2, MapPin, Upload, FileText, Check, ArrowRight } from 'lucide-react';
import Card, { CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
export default function ProviderOnboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: '',
    businessRegNumber: '',
    primaryEmail: '',
    primaryPhone: '',
    serviceAreas: '',
    numberOfHubs: '',
    hubLocations: '',
    businessDoc: null,
    insurance: null,
    kycProof: null,
  });
  const steps = [
    { id: 1, name: 'Organization Info', icon: Building2 },
    { id: 2, name: 'Operations Setup', icon: MapPin },
    { id: 3, name: 'Documents', icon: FileText },
  ];
  const handleNext = () => {
    if (step < 3) {
      if (step === 1 && (!formData.name || !formData.businessId)) {
        alert('Please fill in required fields');
        return;
      }
      setStep(step + 1);
    } else {
      const orgData = {
        name: formData.name,
        type: formData.type,
        businessId: formData.businessId,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        hubs: formData.hubLocations.split('\n').filter(h => h.trim()).map((hub, idx) => ({
          id: `HUB-${idx + 1}`.padStart(8, '0'),
          name: hub.trim(),
          serviceAreas: formData.serviceAreas.split('\n').filter(a => a.trim()),
        })),
      };
      onComplete && onComplete(orgData);
    }
  };
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
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
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-success-500 text-white' :
                      isActive ? 'bg-primary-500 text-white' :
                      'bg-slate-200 text-slate-400'
                    }`}>
                      {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <p className={`text-sm font-medium mt-2 ${
                      isActive ? 'text-slate-900' : 'text-slate-500'
                    }`}>
                      {s.name}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-1 flex-1 mx-4 rounded ${
                      step > s.id ? 'bg-success-500' : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Organization Registration - Step {step} of 3</CardTitle>
            <p className="text-sm text-slate-600 mt-1">
              Register your organization to start using D-FARE
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
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your organization name"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Organization Type <span className="text-danger-600">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg"
                  >
                    <option value="logistics">Logistics</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="food_delivery">Food Delivery</option>
                    <option value="courier">Courier Service</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Business Registration / GST Number <span className="text-danger-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.businessId}
                    onChange={(e) => setFormData({...formData, businessId: e.target.value})}
                    placeholder="GST or Business Registration Number"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Primary Contact Email <span className="text-danger-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                    placeholder="contact@yourorganization.com"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Primary Contact Phone <span className="text-danger-600">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg"
                  />
                </div>
              </>
            )}
            {/* Step 2: Operations & Hubs */}
            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Operating Regions <span className="text-danger-600">*</span>
                  </label>
                  <textarea
                    value={formData.operatingRegions}
                    onChange={(e) => setFormData({...formData, operatingRegions: e.target.value})}
                    placeholder="List regions where you operate (one per line)"
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Number of Hubs
                  </label>
                  <input
                    type="number"
                    value={formData.numberOfHubs}
                    onChange={(e) => setFormData({...formData, numberOfHubs: e.target.value})}
                    placeholder="How many hubs do you have?"
                    min="1"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Hub Locations <span className="text-danger-600">*</span>
                  </label>
                  <textarea
                    value={formData.hubLocations}
                    onChange={(e) => setFormData({...formData, hubLocations: e.target.value})}
                    placeholder="List your hub names/addresses (one per line)"
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg"
                  />
                  <p className="text-xs text-slate-500 mt-1">Example: Main Hub - Downtown, Secondary Hub - Airport</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Service Areas per Hub <span className="text-danger-600">*</span>
                  </label>
                  <textarea
                    value={formData.serviceAreas}
                    onChange={(e) => setFormData({...formData, serviceAreas: e.target.value})}
                    placeholder="List service coverage areas (one per line)"
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg"
                  />
                  <p className="text-xs text-slate-500 mt-1">Example: North Zone, South Zone, East Zone</p>
                </div>
              </>
            )}
            {/* Step 3: Documents */}
            {step === 3 && (
              <>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-primary-400 transition-colors">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-700 text-center">Business Registration</p>
                    <input type="file" className="mt-2 text-sm text-slate-600" />
                  </div>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-primary-400 transition-colors">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-700 text-center">Insurance Certificate</p>
                    <input type="file" className="mt-2 text-sm text-slate-600" />
                  </div>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-primary-400 transition-colors">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-700 text-center">KYC Proof</p>
                    <input type="file" className="mt-2 text-sm text-slate-600" />
                  </div>
                </div>
              </>
            )}
            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className="px-6 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                {step === 3 ? 'Complete Onboarding' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}