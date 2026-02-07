'use client';
import { useState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
const EMPLOYMENT_OPTIONS = [
  { value: 'full_time', label: 'Full-time (Fixed hours)' },
  { value: 'gig', label: 'Gig / Contract (Per order)' },
];
const SHIFT_OPTIONS = [
  { value: 'shift_a', label: 'Shift A: 6 AM – 2 PM' },
  { value: 'shift_b', label: 'Shift B: 2 PM – 10 PM' },
];
const MAX_PHOTO_SIZE_BYTES = 3 * 1024 * 1024;
const ACCEPTED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
function validatePhoto(file) {
  if (!file) return null;
  if (file.size > MAX_PHOTO_SIZE_BYTES) return 'Photo must be less than 3 MB.';
  if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) return 'Use JPG, PNG, or WebP.';
  return null;
}
export default function AddDriverModal({ onClose, onSubmit, error: externalError }) {
  const [fullName, setFullName] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoError, setPhotoError] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [homeAddress, setHomeAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [shiftTiming, setShiftTiming] = useState('');
  const isFormValid =
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    homeAddress.trim().length > 0 &&
    licenseNumber.trim().length > 0 &&
    employmentType &&
    shiftTiming &&
    !photoError;
  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) {
      setPhotoFile(null);
      setPhotoError(null);
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
      return;
    }
    const error = validatePhoto(file);
    setPhotoError(error);
    setPhotoFile(error ? null : file);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(error ? null : URL.createObjectURL(file));
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (!isFormValid) return;
    onSubmit({
      fullName: fullName.trim(),
      photoFile,
      photoPreview,
      homeAddress: homeAddress.trim(),
      phone: phone.trim() || null,
      email: email.trim() || null,
      licenseNumber: licenseNumber.trim(),
      licenseExpiry: licenseExpiry.trim() || null,
      employmentType,
      shiftTiming,
    });
    if (photoPreview) URL.revokeObjectURL(photoPreview);
  }
  function handleClose() {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    onClose();
  }
  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center p-4"
      style={{ background: 'rgba(15, 23, 42, 0.4)' }}
      onClick={handleClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
        style={{ border: '1px solid #e2e8f0' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold" style={{ color: '#0f172a' }}>
            Add Driver
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-sm hover:underline"
            style={{ color: '#64748b', background: 'transparent' }}
          >
            Close
          </button>
        </div>
        {externalError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {externalError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: '#475569' }}>
              Full Name *
            </label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Driver full name"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: '#475569' }}>
              Photo
            </label>
            <div className="flex items-start gap-3">
              {photoPreview && (
                <div className="flex-shrink-0 w-14 h-14 rounded-full overflow-hidden border bg-slate-100" style={{ borderColor: '#e2e8f0' }}>
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handlePhotoChange}
                  className="block w-full text-xs"
                  style={{ color: '#64748b' }}
                />
                {photoError && <p className="text-xs mt-1" style={{ color: '#dc2626' }}>{photoError}</p>}
                <p className="text-[11px] mt-0.5" style={{ color: '#94a3b8' }}>JPG, PNG or WebP, max 3 MB.</p>
              </div>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: '#475569' }}>
              Home Address *
            </label>
            <Input
              value={homeAddress}
              onChange={(e) => setHomeAddress(e.target.value)}
              placeholder="Street, city, state, PIN"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: '#475569' }}>
                Phone Number
              </label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: '#475569' }}>
                Email *
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="driver@example.com"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: '#475569' }}>
                License Number *
              </label>
              <Input
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="License ID"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: '#475569' }}>
                License Expiry
              </label>
              <Input
                type="date"
                value={licenseExpiry}
                onChange={(e) => setLicenseExpiry(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: '#475569' }}>
              Employment Type *
            </label>
            <Select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
            >
              <option value="">Select type</option>
              {EMPLOYMENT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: '#475569' }}>
              Shift Timings *
            </label>
            <Select
              value={shiftTiming}
              onChange={(e) => setShiftTiming(e.target.value)}
            >
              <option value="">Select shift</option>
              {SHIFT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border px-4 py-2 text-xs font-medium"
              style={{ borderColor: '#e2e8f0', color: '#0f172a', background: 'transparent' }}
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
  );
}