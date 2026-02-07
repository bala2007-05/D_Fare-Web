import React, { useState } from 'react';
import type {
  OrganizationTenant,
  Hub,
  FleetConfigForHub,
  VehicleKind,
  VehicleCapacityConfig,
  DeliveryRules,
} from '@/lib/organizationModels';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { registerOrganizationWithAuth } from '@/lib/auth/registerWithSupabase';
import { isSupabaseConfigured } from '@/lib/supabase/client';
type WizardStep = 1 | 2 | 3;
interface CompanyProfileForm {
  legalBusinessName: string;
  serviceType: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  adminPassword: string;
  billingPlan: string;
  registrationDocument?: File | null;
  registrationDocumentError?: string | null;
}
const VEHICLE_OPTIONS: { label: string; value: VehicleKind }[] = [
  { label: '2-Wheeler', value: '2_wheeler' },
  { label: '3-Wheeler', value: '3_wheeler' },
  { label: 'Van', value: 'van' },
  { label: '4ft Truck', value: 'truck_4ft' },
];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validateOrgDocument(file: File): string | null {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return 'File size must be less than 5 MB.';
  }
  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    return 'Unsupported file type. Upload PDF, JPG, or PNG.';
  }
  return null;
}
function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}
function generateHubId(index: number): string {
  const padded = String(index + 1).padStart(2, '0');
  return `HUB-${padded}`;
}
function emptyCompanyProfile(): CompanyProfileForm {
  return {
    legalBusinessName: '',
    serviceType: '',
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    adminPassword: '',
    billingPlan: '',
    registrationDocument: null,
    registrationDocumentError: null,
  };
}
function createInitialHubs(count: number): Hub[] {
  return Array.from({ length: count }, (_v, idx) => ({
    id: generateHubId(idx),
    name: '',
    address: '',
    serviceRadiusKm: undefined,
    operatingWindowStart: '',
    operatingWindowEnd: '',
  }));
}
function createInitialFleetConfig(hubs: Hub[]): FleetConfigForHub[] {
  return hubs.map((hub) => ({
    hubId: hub.id,
    totalActiveDrivers: 0,
    vehicleConfigs: [],
  }));
}
const defaultDeliveryRules: DeliveryRules = {
  codLimitPerDriver: 500,
  defaultPaymentStatus: 'cod',
  failureProtocol: {
    reattemptCount: 2,
    returnToOriginOnFailure: true,
    finalStatusOnFailure: 'returned_to_hub',
  },
};
interface OrganizationWizardProps {
  onComplete?: () => void;
}
export default function OrganizationWizard({ onComplete }: OrganizationWizardProps) {
  const [step, setStep] = useState<WizardStep>(1);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfileForm>(emptyCompanyProfile);
  const [hubs, setHubs] = useState<Hub[]>(createInitialHubs(1));
  const [fleets, setFleets] = useState<FleetConfigForHub[]>(createInitialFleetConfig(createInitialHubs(1)));
  const [deliveryRules, setDeliveryRules] = useState<DeliveryRules>(defaultDeliveryRules);
  const [hubCountInput, setHubCountInput] = useState<string>('1');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabaseReady = isSupabaseConfigured();
  const adminEmailValid = validateEmail(companyProfile.adminEmail);
  const isStep1Valid =
    companyProfile.legalBusinessName.trim().length > 0 &&
    companyProfile.serviceType.trim().length > 0 &&
    companyProfile.billingPlan.trim().length > 0;
  const isStep2Valid =
    companyProfile.adminName.trim().length > 0 &&
    companyProfile.adminEmail.trim().length > 0 &&
    adminEmailValid &&
    companyProfile.adminPassword.length >= 6 &&
    !companyProfile.registrationDocumentError;
  const isStep3Valid = hubs.every((hub) => hub.name.trim().length > 0 && hub.address.trim().length > 0) &&
  fleets.every(
    (fleet) =>
      fleet.totalActiveDrivers >= 0 &&
      fleet.vehicleConfigs.length > 0 &&
      fleet.vehicleConfigs.every(
        (vc) =>
          vc.maxWeightKg > 0 &&
          vc.maxVolumeCubicFt > 0 &&
          vc.costPerKm > 0 &&
          validateVehicleCapacity(vc) === null,
      ),
  );
  function validateVehicleCapacity(config: VehicleCapacityConfig): string | null {
    if (config.vehicleType === '2_wheeler' || config.vehicleType === '3_wheeler') {
      if (config.maxWeightKg > 150) {
        return 'Two/three wheelers cannot exceed 150 kg.';
      }
      if (config.maxVolumeCubicFt > 60) {
        return 'Two/three wheelers cannot exceed 60 cubic ft.';
      }
    }
    return null;
  }
  function handleCompanyProfileChange(partial: Partial<CompanyProfileForm>) {
    setCompanyProfile((prev) => ({ ...prev, ...partial }));
  }
  function syncFleetWithHubs(nextHubs: Hub[]) {
    setFleets((prev) => {
      const next: FleetConfigForHub[] = nextHubs.map((hub) => {
        const existing = prev.find((f) => f.hubId === hub.id);
        return (
          existing ?? {
            hubId: hub.id,
            totalActiveDrivers: 0,
            vehicleConfigs: [],
          }
        );
      });
      return next;
    });
  }
  function handleHubCountApply() {
    const parsed = Number(hubCountInput);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return;
    }
    const nextHubs = createInitialHubs(parsed);
    setHubs(nextHubs);
    syncFleetWithHubs(nextHubs);
  }
  function handleAddHub() {
    const newId = generateHubId(hubs.length);
    const newHub: Hub = {
      id: newId,
      name: '',
      address: '',
      serviceRadiusKm: undefined,
      operatingWindowStart: '',
      operatingWindowEnd: '',
    };
    setHubs((prev) => [...prev, newHub]);
    setFleets((prev) => [...prev, { hubId: newId, totalActiveDrivers: 0, vehicleConfigs: [] }]);
    setHubCountInput(String(hubs.length + 1));
  }
  function handleHubFieldChange(hubId: string, partial: Partial<Hub>) {
    const isIdChange = partial.id !== undefined && partial.id !== hubId;
    const nextHubs = hubs.map((hub) => (hub.id === hubId ? { ...hub, ...partial } : hub));
    if (isIdChange) {
      setFleets((prev) =>
        prev.map((f) => (f.hubId === hubId ? { ...f, hubId: partial.id! } : f)),
      );
    }
    setHubs(nextHubs);
  }
  function handleRemoveHub(hubId: string) {
    if (hubs.length <= 1) return;
    const idx = hubs.findIndex((h) => h.id === hubId);
    if (idx < 0) return;
    const nextHubs = hubs.filter((h) => h.id !== hubId);
    setHubs(nextHubs);
    setFleets((prev) => prev.filter((f) => f.hubId !== hubId));
    setHubCountInput(String(nextHubs.length));
  }
  function toggleVehicleForHub(hubId: string, vehicleType: VehicleKind) {
    setFleets((prev) =>
      prev.map((fleet) => {
        if (fleet.hubId !== hubId) return fleet;
        const exists = fleet.vehicleConfigs.find((v) => v.vehicleType === vehicleType);
        if (exists) {
          return {
            ...fleet,
            vehicleConfigs: fleet.vehicleConfigs.filter((v) => v.vehicleType !== vehicleType),
          };
        }
        const newConfig: VehicleCapacityConfig = {
          vehicleType,
          maxWeightKg: vehicleType === 'truck_4ft' ? 1200 : vehicleType === 'van' ? 600 : 120,
          maxVolumeCubicFt: vehicleType === 'truck_4ft' ? 500 : vehicleType === 'van' ? 220 : 60,
          costPerKm: 25,
        };
        return {
          ...fleet,
          vehicleConfigs: [...fleet.vehicleConfigs, newConfig],
        };
      }),
    );
  }
  function handleVehicleConfigChange(
    hubId: string,
    vehicleType: VehicleKind,
    partial: Partial<VehicleCapacityConfig>,
  ) {
    setFleets((prev) =>
      prev.map((fleet) => {
        if (fleet.hubId !== hubId) return fleet;
        return {
          ...fleet,
          vehicleConfigs: fleet.vehicleConfigs.map((vc) =>
            vc.vehicleType === vehicleType ? { ...vc, ...partial } : vc,
          ),
        };
      }),
    );
  }
  async function handleSubmit() {
    setSubmitError(null);
    setIsSubmitting(true);
    const result = await registerOrganizationWithAuth({
      adminEmail: companyProfile.adminEmail,
      adminPassword: companyProfile.adminPassword,
      adminName: companyProfile.adminName,
      adminPhone: companyProfile.adminPhone,
      registrationProofUrl: null,
      legalBusinessName: companyProfile.legalBusinessName,
      serviceType: companyProfile.serviceType,
      billingPlan: companyProfile.billingPlan,
    });
    setIsSubmitting(false);
    if (result.error) {
      setSubmitError(result.error.message || 'Registration failed');
      return;
    }
    setHasSubmitted(true);
    onComplete?.();
  }
  const canGoNext =
    (step === 1 && isStep1Valid) ||
    (step === 2 && isStep2Valid) ||
    (step === 3 && isStep3Valid);
  const stepLabel = (currentStep: WizardStep) => {
    if (currentStep === 1) return 'Organization Details';
    if (currentStep === 2) return 'Admin Contact';
    return 'Hub / Fleet';
  };
  const isStepCompleted = (s: WizardStep) =>
    (s === 1 && isStep1Valid) || (s === 2 && isStep2Valid) || (s === 3 && hasSubmitted);
  const canGoToStep = (s: WizardStep) => s <= step;
  const stepTitle = step === 1 ? 'Organization Details' : step === 2 ? 'Admin Contact' : 'Hub / Fleet Configuration';
  return (
    <div className="space-y-0">
      <div className="bg-white rounded-lg" style={{ border: 'none' }}>
        <div className="px-6 py-4 border-b text-center" style={{ borderColor: '#DBEAFE', background: '#ffffff' }}>
          <h2 className="text-base font-semibold" style={{ color: '#0F172A' }}>Register your organization</h2>
          <div className="flex items-center justify-center gap-1 sm:gap-2 mt-4 flex-wrap">
            {([1, 2, 3] as const).map((s) => {
              const current = s as WizardStep;
              const isActive = step === current;
              const completed = current < step || isStepCompleted(current);
              const clickable = canGoToStep(current);
              const label = stepLabel(current);
              return (
                <React.Fragment key={current}>
                  {current > 1 && (
                    <span className="text-slate-300 px-0.5 sm:px-1" aria-hidden>→</span>
                  )}
                  <button
                    type="button"
                    onClick={() => clickable && setStep(current)}
                    className="flex items-center gap-1.5 border-0 rounded-md px-2 py-1.5 text-left transition-colors"
                    style={{
                      cursor: clickable ? 'pointer' : 'default',
                      background: isActive ? '#1F4FD8' : completed ? '#EFF6FF' : 'transparent',
                      color: isActive ? '#ffffff' : completed ? '#1F4FD8' : '#94a3b8',
                    }}
                  >
                    <span className="text-xs font-semibold">{current}</span>
                    <span className="text-xs font-medium hidden sm:inline">{label}</span>
                    {completed && !isActive && <span className="text-xs" aria-hidden>✓</span>}
                  </button>
                </React.Fragment>
              );
            })}
          </div>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full" style={{ background: '#DBEAFE' }}>
            <div
              className="h-full transition-all duration-300"
              style={{
                width: step === 1 ? '33%' : step === 2 ? '66%' : '100%',
                background: '#1F4FD8',
              }}
            />
          </div>
        </div>
        <div className="p-6 space-y-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-center mb-6" style={{ color: '#1F4FD8' }}>
            {stepTitle}
          </h3>
          {step === 1 && (
            <div className="max-w-md mx-auto">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Legal Business Name *
                  </label>
                  <Input
                    value={companyProfile.legalBusinessName}
                    onChange={(e) =>
                      handleCompanyProfileChange({ legalBusinessName: e.target.value })
                    }
                    placeholder="Registered company name"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Service Type *
                  </label>
                  <Select
                    value={companyProfile.serviceType}
                    onChange={(e) =>
                      handleCompanyProfileChange({ serviceType: e.target.value })
                    }
                  >
                    <option value="">Select service type</option>
                    <option value="ecommerce">eCommerce</option>
                    <option value="logistics">Logistics</option>
                    <option value="grocery">Grocery</option>
                    <option value="courier">Courier</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Billing / Plan Tier *
                  </label>
                  <Select
                    value={companyProfile.billingPlan}
                    onChange={(e) =>
                      handleCompanyProfileChange({ billingPlan: e.target.value })
                    }
                  >
                    <option value="">Select billing plan</option>
                    <option value="startup">Startup</option>
                    <option value="enterprise">Enterprise</option>
                    <option value="pay_per_driver">Pay-per-Driver</option>
                  </Select>
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="max-w-md mx-auto">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Admin Name *
                  </label>
                  <Input
                    value={companyProfile.adminName}
                    onChange={(e) =>
                      handleCompanyProfileChange({ adminName: e.target.value })
                    }
                    placeholder="Primary admin contact"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Admin Email *
                  </label>
                  <Input
                    type="email"
                    value={companyProfile.adminEmail}
                    onChange={(e) =>
                      handleCompanyProfileChange({ adminEmail: e.target.value })
                    }
                    placeholder="admin@company.com"
                  />
                  {companyProfile.adminEmail.trim().length > 0 && !adminEmailValid && (
                    <p className="mt-1 text-xs text-red-600">Please enter a valid email address.</p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Admin Phone
                  </label>
                  <Input
                    value={companyProfile.adminPhone}
                    onChange={(e) =>
                      handleCompanyProfileChange({ adminPhone: e.target.value })
                    }
                    placeholder="+1 000 000 0000"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Password (for login) *
                  </label>
                  <Input
                    type="password"
                    value={companyProfile.adminPassword}
                    onChange={(e) =>
                      handleCompanyProfileChange({ adminPassword: e.target.value })
                    }
                    placeholder="Min 6 characters"
                  />
                  {companyProfile.adminPassword.length > 0 && companyProfile.adminPassword.length < 6 && (
                    <p className="mt-1 text-xs text-red-600">Password must be at least 6 characters.</p>
                  )}
                </div>
                <div className="space-y-2 pt-2">
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Company Registration Proof
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) {
                        handleCompanyProfileChange({
                          registrationDocument: null,
                          registrationDocumentError: null,
                        });
                        return;
                      }
                      const errorMessage = validateOrgDocument(file);
                      handleCompanyProfileChange({
                        registrationDocument: errorMessage ? null : file,
                        registrationDocumentError: errorMessage,
                      });
                    }}
                    className="block w-full text-xs text-slate-600"
                  />
                  {companyProfile.registrationDocumentError && (
                    <p className="text-xs text-red-600">
                      {companyProfile.registrationDocumentError}
                    </p>
                  )}
                  {!companyProfile.registrationDocumentError &&
                    companyProfile.registrationDocument && (
                      <p className="text-xs text-green-700">
                        File selected: {companyProfile.registrationDocument.name}
                      </p>
                    )}
                  <p className="text-[11px] text-slate-400">
                    PDF, JPG, PNG up to 5 MB.
                  </p>
                </div>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-6 w-full">
              <div className="grid gap-4 md:grid-cols-[1fr,2fr]">
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide" style={{ color: '#1F4FD8' }}>
                    Hub Configuration
                  </h3>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Number of hubs
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      value={hubCountInput}
                      onChange={(e) => setHubCountInput(e.target.value)}
                      className="w-24"
                    />
                    <button
                      type="button"
                      onClick={handleHubCountApply}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-white"
                      style={{ background: '#1F4FD8' }}
                    >
                      Apply
                    </button>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-400">
                    Configure each hub below with address and service area.
                  </p>
                  <button
                    type="button"
                    onClick={handleAddHub}
                    className="mt-3 rounded-lg border border-dashed px-3 py-2 text-xs font-medium"
                    style={{ borderColor: '#1F4FD8', color: '#1F4FD8' }}
                  >
                    + Add hub
                  </button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {hubs.map((hub, hubIndex) => (
                  <div
                    key={hub.id}
                    className="rounded-lg border p-4"
                    style={{ borderColor: '#DBEAFE', background: '#F8FAFC' }}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#1F4FD8' }}>
                        Hub {hubIndex + 1}
                      </span>
                      {hubs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveHub(hub.id)}
                          className="text-xs font-medium hover:underline"
                          style={{ color: '#dc2626' }}
                        >
                          Remove hub
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1 block text-[11px] font-medium text-slate-700">
                          Hub ID
                        </label>
                        <Input
                          value={hub.id}
                          onChange={(e) =>
                            handleHubFieldChange(hub.id, { id: e.target.value.trim() || hub.id })
                          }
                          placeholder="e.g. HUB-01"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-medium text-slate-700">
                          Hub Name *
                        </label>
                        <Input
                          value={hub.name}
                          onChange={(e) =>
                            handleHubFieldChange(hub.id, { name: e.target.value })
                          }
                          placeholder="Central Hub"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-medium text-slate-700">
                          Physical Address *
                        </label>
                        <Input
                          value={hub.address}
                          onChange={(e) =>
                            handleHubFieldChange(hub.id, { address: e.target.value })
                          }
                          placeholder="Street, City, Country"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-medium text-slate-700">
                          Service Radius (km)
                        </label>
                        <Input
                          type="number"
                          min={0}
                          value={hub.serviceRadiusKm ?? ''}
                          onChange={(e) =>
                            handleHubFieldChange(hub.id, {
                              serviceRadiusKm: e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            })
                          }
                          placeholder="e.g. 15"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="mb-1 block text-[11px] font-medium text-slate-700">
                            Start Time
                          </label>
                          <Input
                            type="time"
                            value={hub.operatingWindowStart ?? ''}
                            onChange={(e) =>
                              handleHubFieldChange(hub.id, {
                                operatingWindowStart: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[11px] font-medium text-slate-700">
                            End Time
                          </label>
                          <Input
                            type="time"
                            value={hub.operatingWindowEnd ?? ''}
                            onChange={(e) =>
                              handleHubFieldChange(hub.id, {
                                operatingWindowEnd: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide" style={{ color: '#1F4FD8' }}>
                  Fleet & Capacity
                </h3>
                <p className="text-xs text-slate-500">
                  Define capacities per hub and vehicle type. Lighter vehicles enforce
                  strict limits automatically.
                </p>
              </div>
              <div className="space-y-4">
                {hubs.map((hub) => {
                  const fleet = fleets.find((f) => f.hubId === hub.id)!;
                  return (
                    <div
                      key={hub.id}
                      className="rounded-lg border p-4"
                      style={{ borderColor: '#DBEAFE', background: '#F8FAFC' }}
                    >
                      <div className="mb-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            {hub.name || 'Hub'} ({hub.id})
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Configure driver count & vehicle capacities
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="mb-1 block text-[11px] font-medium text-slate-700">
                            Vehicle Types
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {VEHICLE_OPTIONS.map((opt) => {
                              const isSelected = fleet.vehicleConfigs.some(
                                (vc) => vc.vehicleType === opt.value,
                              );
                              return (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => toggleVehicleForHub(hub.id, opt.value)}
                                  className="rounded-full border px-3 py-1 text-xs font-medium"
                                style={
                                  isSelected
                                    ? { borderColor: '#1F4FD8', background: '#EFF6FF', color: '#1F4FD8' }
                                    : { borderColor: '#DBEAFE', background: '#ffffff', color: '#64748b' }
                                }
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        {fleet.vehicleConfigs.length > 0 && (
                          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {fleet.vehicleConfigs.map((vc) => {
                              const error = validateVehicleCapacity(vc);
                              const label =
                                VEHICLE_OPTIONS.find((o) => o.value === vc.vehicleType)
                                  ?.label ?? vc.vehicleType;
                              return (
                                <div
                                  key={vc.vehicleType}
                                  className="rounded-md border bg-white p-3"
                                  style={{ borderColor: '#DBEAFE' }}
                                >
                                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    {label}
                                  </p>
                                  <div className="space-y-2">
                                    <div>
                                      <label className="mb-1 block text-[11px] font-medium text-slate-700">
                                        Max Weight (kg)
                                      </label>
                                      <Input
                                        type="number"
                                        min={0}
                                        value={vc.maxWeightKg}
                                        onChange={(e) =>
                                          handleVehicleConfigChange(
                                            hub.id,
                                            vc.vehicleType,
                                            {
                                              maxWeightKg: Number(e.target.value) || 0,
                                            },
                                          )
                                        }
                                      />
                                    </div>
                                    <div>
                                      <label className="mb-1 block text-[11px] font-medium text-slate-700">
                                        Max Volume (cubic ft)
                                      </label>
                                      <Input
                                        type="number"
                                        min={0}
                                        value={vc.maxVolumeCubicFt}
                                        onChange={(e) =>
                                          handleVehicleConfigChange(
                                            hub.id,
                                            vc.vehicleType,
                                            {
                                              maxVolumeCubicFt:
                                                Number(e.target.value) || 0,
                                            },
                                          )
                                        }
                                      />
                                    </div>
                                    <div>
                                      <label className="mb-1 block text-[11px] font-medium text-slate-700">
                                        Cost per km
                                      </label>
                                      <Input
                                        type="number"
                                        min={0}
                                        value={vc.costPerKm}
                                        onChange={(e) =>
                                          handleVehicleConfigChange(
                                            hub.id,
                                            vc.vehicleType,
                                            {
                                              costPerKm: Number(e.target.value) || 0,
                                            },
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                  {error && (
                                    <p className="mt-2 text-[11px] text-red-600">{error}</p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 rounded-lg border bg-white p-4" style={{ borderColor: '#DBEAFE' }}>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide" style={{ color: '#1F4FD8' }}>
                  Delivery & Operational Rules
                </h3>
                <div className="grid gap-4 md:grid-cols-1">
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-700">
                      Re-attempt Count
                    </label>
                    <Select
                      value={deliveryRules.failureProtocol.reattemptCount}
                      onChange={(e) =>
                        setDeliveryRules((prev) => ({
                          ...prev,
                          failureProtocol: {
                            ...prev.failureProtocol,
                            reattemptCount: Number(e.target.value) as 1 | 2,
                          },
                        }))
                      }
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                    </Select>
                  </div>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-700">
                      On final failure, return to origin hub
                    </label>
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <label className="inline-flex items-center gap-1">
                        <input
                          type="radio"
                          name="returnToOrigin"
                          checked={deliveryRules.failureProtocol.returnToOriginOnFailure}
                          onChange={() =>
                            setDeliveryRules((prev) => ({
                              ...prev,
                              failureProtocol: {
                                ...prev.failureProtocol,
                                returnToOriginOnFailure: true,
                                finalStatusOnFailure: 'returned_to_hub',
                              },
                            }))
                          }
                        />
                        <span>Return to Hub</span>
                      </label>
                      <label className="inline-flex items-center gap-1">
                        <input
                          type="radio"
                          name="returnToOrigin"
                          checked={!deliveryRules.failureProtocol.returnToOriginOnFailure}
                          onChange={() =>
                            setDeliveryRules((prev) => ({
                              ...prev,
                              failureProtocol: {
                                ...prev.failureProtocol,
                                returnToOriginOnFailure: false,
                                finalStatusOnFailure: 'failed',
                              },
                            }))
                          }
                        />
                        <span>Mark as Failed</span>
                      </label>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    When a customer is not available and re-attempts are exhausted, order
                    status updates: <strong>FAILED → RETURNED_TO_HUB</strong>
                    {!deliveryRules.failureProtocol.returnToOriginOnFailure && ' (or final FAILED if Return to Hub is disabled).'}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between border-t pt-4 mt-6" style={{ borderColor: '#DBEAFE' }}>
            <button
              type="button"
              onClick={() => setStep((prev) => (prev > 1 ? ((prev - 1) as WizardStep) : prev))}
              className="rounded-lg border bg-white px-4 py-2 text-xs font-medium disabled:opacity-50"
              style={{ borderColor: '#DBEAFE', color: '#0F172A' }}
              disabled={step === 1}
            >
              Back
            </button>
            <div className="flex items-center gap-3">
              {submitError && (
                <span className="text-xs text-red-600">{submitError}</span>
              )}
              {step === 3 && !supabaseReady && !submitError && (
                <span className="text-xs text-red-600">
                  Registration is unavailable. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local and restart the dev server.
                </span>
              )}
              {hasSubmitted && (
                <span className="text-xs text-green-600">
                  Organization registered. You can now log in with your email and password.
                </span>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep((prev) => (prev < 3 ? ((prev + 1) as WizardStep) : prev))}
                  className="registration-next-btn rounded-lg px-4 py-2 text-xs font-semibold disabled:opacity-50 transition-all duration-200"
                  style={{
                    background: '#ffffff',
                    border: '2px solid #1F4FD8',
                    color: '#1F4FD8',
                  }}
                  disabled={!canGoNext}
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  className="rounded-lg px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
                  style={{ background: '#1F4FD8' }}
                  disabled={!isStep3Valid || isSubmitting || !supabaseReady}
                >
                  {isSubmitting ? 'Creating account…' : 'Complete Setup'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
