import React, { useState } from 'react';
import { driversEnhanced } from '@/lib/enterpriseMockData';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { generateDriverId, saveDriverToBackend } from '@/lib/supabase/drivers';
type EmploymentType = 'full_time' | 'gig';
interface DriverFormState {
  fullName: string;
  photoUrl: string;
  homeAddress: string;
  licenseNumber: string;
  employmentType: EmploymentType | '';
  shift: 'shift_a' | 'shift_b' | '';
  assignedHub: string;
  vehicleType: string;
  documentFile?: File | null;
  documentError?: string | null;
}
const MAX_DRIVER_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_DRIVER_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
function validateDriverDocument(file: File): string | null {
  if (file.size > MAX_DRIVER_FILE_SIZE_BYTES) {
    return 'File size must be less than 5 MB.';
  }
  if (!ACCEPTED_DRIVER_FILE_TYPES.includes(file.type)) {
    return 'Unsupported file type. Upload PDF, JPG, or PNG.';
  }
  return null;
}
export default function DriverManagementPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [drivers, setDrivers] = useState(driversEnhanced);
  const [driverSaveError, setDriverSaveError] = useState<string | null>(null);
  const [form, setForm] = useState<DriverFormState>({
    fullName: '',
    photoUrl: '',
    homeAddress: '',
    licenseNumber: '',
    employmentType: '',
    shift: '',
    assignedHub: '',
    vehicleType: '',
    documentFile: null,
    documentError: null,
  });
  const isFormValid =
    form.fullName.trim().length > 0 &&
    form.homeAddress.trim().length > 0 &&
    form.licenseNumber.trim().length > 0 &&
    !!form.employmentType &&
    !!form.shift &&
    form.assignedHub.trim().length > 0 &&
    form.vehicleType.trim().length > 0 &&
    !form.documentError;
  function resetForm() {
    setForm({
      fullName: '',
      photoUrl: '',
      homeAddress: '',
      licenseNumber: '',
      employmentType: '',
      shift: '',
      assignedHub: '',
      vehicleType: '',
      documentFile: null,
      documentError: null,
    });
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid) return;
    setDriverSaveError(null);
    const driverId = generateDriverId(drivers);
    const newDriver = {
      driverId,
      name: form.fullName,
      status: 'idle',
      liveLocation: null,
      lastPingTimestamp: new Date().toISOString(),
      batteryLevel: 100,
      appVersion: '2.5.1',
      shiftStartTime: new Date().toISOString(),
      currentRouteId: null,
      capacityUsed: 0,
      vehicleId: '',
      tasksToday: 0,
      workloadScore: 0,
      phone: '',
      rating: 5,
      completionRate: 0,
      codLimit: 0,
      homeAddress: form.homeAddress,
      licenseNumber: form.licenseNumber,
      employmentType: form.employmentType,
      shift: form.shift,
      assignedHub: form.assignedHub,
      vehicleType: form.vehicleType,
      photoUrl: form.photoUrl,
    } as any;
    const { error } = await saveDriverToBackend(newDriver);
    if (error) {
      setDriverSaveError(error.message || 'Failed to save driver to backend');
      return;
    }
    setDrivers((prev) => [...prev, newDriver]);
    resetForm();
    setIsOpen(false);
  }
  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold" style={{ color: '#0F172A' }}>Drivers</h3>
          <p className="text-xs" style={{ color: '#64748b' }}>
            Manage driver records, shifts, and hub assignments.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold text-white shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{ background: '#1F4FD8', boxShadow: '0 4px 14px rgba(31, 79, 216, 0.4)' }}
          title="Add Driver"
        >
          +
        </button>
      </div>
      <div className="overflow-hidden rounded-xl border bg-white" style={{ borderColor: '#DBEAFE' }}>
        <table className="min-w-full divide-y text-sm" style={{ borderColor: '#DBEAFE' }}>
          <thead style={{ background: '#EFF6FF' }}>
            <tr>
              <th className="px-4 py-2 text-left font-medium" style={{ color: '#0F172A' }}>Name</th>
              <th className="px-4 py-2 text-left font-medium" style={{ color: '#0F172A' }}>Status</th>
              <th className="px-4 py-2 text-left font-medium" style={{ color: '#0F172A' }}>Employment</th>
              <th className="px-4 py-2 text-left font-medium" style={{ color: '#0F172A' }}>Shift</th>
              <th className="px-4 py-2 text-left font-medium" style={{ color: '#0F172A' }}>Hub</th>
              <th className="px-4 py-2 text-left font-medium" style={{ color: '#0F172A' }}>Vehicle</th>
            </tr>
          </thead>
          <tbody className="divide-y bg-white" style={{ borderColor: '#DBEAFE' }}>
            {drivers.map((driver: any) => (
              <tr key={driver.driverId}>
                <td className="px-4 py-2 text-slate-900">{driver.name}</td>
                <td className="px-4 py-2 text-xs capitalize text-slate-600">
                  {driver.status?.toLowerCase().replace(/_/g, ' ') ?? 'idle'}
                </td>
                <td className="px-4 py-2 text-xs text-slate-600">
                  {driver.employmentType === 'full_time'
                    ? 'Full-time'
                    : driver.employmentType === 'gig'
                    ? 'Gig / Contract'
                    : '—'}
                </td>
                <td className="px-4 py-2 text-xs text-slate-600">
                  {driver.shift === 'shift_a'
                    ? 'Shift A'
                    : driver.shift === 'shift_b'
                    ? 'Shift B'
                    : '—'}
                </td>
                <td className="px-4 py-2 text-xs text-slate-600">
                  {driver.assignedHub || '—'}
                </td>
                <td className="px-4 py-2 text-xs text-slate-600">
                  {driver.vehicleType || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-4" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" style={{ border: '1px solid #DBEAFE' }}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold" style={{ color: '#0F172A' }}>Add Driver</h2>
              <button
                type="button"
                onClick={() => {
                  setDriverSaveError(null);
                  resetForm();
                  setIsOpen(false);
                }}
                className="text-sm hover:underline"
                style={{ color: '#64748b', background: 'transparent' }}
              >
                Close
              </button>
            </div>
            {driverSaveError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                {driverSaveError}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Full Name *
                  </label>
                  <Input
                    value={form.fullName}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, fullName: e.target.value }))
                    }
                    placeholder="Driver name"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Photo URL
                  </label>
                  <Input
                    value={form.photoUrl}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, photoUrl: e.target.value }))
                    }
                    placeholder="https://"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Home Address *
                </label>
                <Input
                  value={form.homeAddress}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, homeAddress: e.target.value }))
                  }
                  placeholder="Street, city, country"
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    License Number *
                  </label>
                  <Input
                    value={form.licenseNumber}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, licenseNumber: e.target.value }))
                    }
                    placeholder="License ID"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Employment Type *
                  </label>
                  <Select
                    value={form.employmentType}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        employmentType: e.target.value as EmploymentType,
                      }))
                    }
                  >
                    <option value="">Select type</option>
                    <option value="full_time">Full-time</option>
                    <option value="gig">Gig / Contract</option>
                  </Select>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Shift Timing *
                  </label>
                  <Select
                    value={form.shift}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        shift: e.target.value as DriverFormState['shift'],
                      }))
                    }
                  >
                    <option value="">Select shift</option>
                    <option value="shift_a">Shift A (6 AM – 2 PM)</option>
                    <option value="shift_b">Shift B (2 PM – 10 PM)</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Assigned Hub *
                  </label>
                  <Input
                    value={form.assignedHub}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, assignedHub: e.target.value }))
                    }
                    placeholder="Hub ID or name"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Vehicle Type *
                </label>
                <Select
                  value={form.vehicleType}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, vehicleType: e.target.value }))
                  }
                >
                  <option value="">Select vehicle</option>
                  <option value="2_wheeler">2-Wheeler</option>
                  <option value="3_wheeler">3-Wheeler</option>
                  <option value="van">Van</option>
                  <option value="truck_4ft">4ft Truck</option>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Driver License Document
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) {
                      setForm((prev) => ({
                        ...prev,
                        documentFile: null,
                        documentError: null,
                      }));
                      return;
                    }
                    const error = validateDriverDocument(file);
                    setForm((prev) => ({
                      ...prev,
                      documentFile: error ? null : file,
                      documentError: error,
                    }));
                  }}
                  className="block w-full text-xs text-slate-600"
                />
                {form.documentError && (
                  <p className="text-xs text-red-600">{form.documentError}</p>
                )}
                {!form.documentError && form.documentFile && (
                  <p className="text-xs text-green-700">
                    File selected: {form.documentFile.name}
                  </p>
                )}
                <p className="text-[11px] text-slate-400">
                  PDF, JPG, PNG up to 5 MB.
                </p>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setIsOpen(false);
                  }}
                  className="rounded-lg border px-4 py-2 text-xs font-medium"
                  style={{ borderColor: '#DBEAFE', color: '#0F172A' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className="rounded-lg px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
                  style={{ background: '#1F4FD8' }}
                >
                  Save Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}