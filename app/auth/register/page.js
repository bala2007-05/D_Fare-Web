'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Building2, ArrowLeft } from 'lucide-react';
const VEHICLE_OPTIONS = [
  { value: 'two_wheeler', label: 'Two Wheeler' },
  { value: 'three_wheeler', label: 'Three Wheeler' },
  { value: 'four_wheeler', label: 'Four Wheeler' },
];
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
const inputBase =
  'w-full px-4 py-2.5 rounded-lg bg-white border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#1F4FD8]/20';
const borderClr = { borderColor: '#DBEAFE' };
const labelClr = { color: '#0F172A' };
export default function RegisterOrganizationPage() {
  const [numberOfHubs, setNumberOfHubs] = useState(1);
  const [hubs, setHubs] = useState([defaultHub()]);
  const n = Math.max(1, Math.min(Number(numberOfHubs) || 1, 20));
  const hubList = useMemo(() => {
    const arr = [...hubs];
    while (arr.length < n) arr.push(defaultHub());
    return arr.slice(0, n);
  }, [n, hubs]);
  const setHub = (index, data) => {
    setHubs((prev) => {
      const next = [...prev];
      next[index] = { ...(next[index] || defaultHub()), ...data };
      return next;
    });
  };
  const toggleVehicle = (hubIndex, value) => {
    setHubs((prev) => {
      const next = [...prev];
      const h = next[hubIndex] || defaultHub();
      const types = h.vehicleTypes || [];
      const set = new Set(types);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      next[hubIndex] = { ...h, vehicleTypes: Array.from(set) };
      return next;
    });
  };
  return (
    <div
      className="min-h-screen w-full overflow-y-auto"
      style={{ background: 'linear-gradient(180deg, #ffffff 0%, #EFF6FF 100%)' }}
    >
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-sm font-medium mb-8"
          style={{ color: '#1F4FD8' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight" style={labelClr}>
            Register Your Organization
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#64748b' }}>
            Configure your hubs and operations
          </p>
        </div>
        <div
          className="rounded-xl p-6 mb-8"
          style={{
            background: '#ffffff',
            border: '1px solid #DBEAFE',
            boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
          }}
        >
          <label className="block text-sm font-medium mb-2" style={labelClr}>
            Number of Hubs
          </label>
          <input
            type="number"
            min={1}
            max={20}
            value={numberOfHubs}
            onChange={(e) => setNumberOfHubs(e.target.value)}
            className={inputBase}
            style={borderClr}
          />
        </div>
        <div className="space-y-8">
          {hubList.map((hub, index) => (
            <section
              key={index}
              className="rounded-xl p-6 sm:p-8"
              style={{
                background: '#ffffff',
                border: '1px solid #DBEAFE',
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
              }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Building2 className="w-5 h-5" style={{ color: '#1F4FD8' }} />
                <h2 className="text-lg font-semibold" style={labelClr}>
                  Hub {index + 1}
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-2" style={labelClr}>
                    Hub Name
                  </label>
                  <input
                    type="text"
                    value={hub.hubName}
                    onChange={(e) => setHub(index, { hubName: e.target.value })}
                    className={inputBase}
                    style={borderClr}
                    placeholder="e.g. North Hub"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={labelClr}>
                    Hub ID
                  </label>
                  <input
                    type="text"
                    value={hub.hubId}
                    onChange={(e) => setHub(index, { hubId: e.target.value })}
                    className={inputBase}
                    style={borderClr}
                    placeholder="e.g. HUB-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={labelClr}>
                    Service Radius (km)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={hub.serviceRadiusKm}
                    onChange={(e) => setHub(index, { serviceRadiusKm: e.target.value })}
                    className={inputBase}
                    style={borderClr}
                    placeholder="0"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-2" style={labelClr}>
                    Hub Address
                  </label>
                  <textarea
                    rows={3}
                    value={hub.hubAddress}
                    onChange={(e) => setHub(index, { hubAddress: e.target.value })}
                    className={`${inputBase} resize-y`}
                    style={borderClr}
                    placeholder="Full address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={labelClr}>
                    Office Start Time
                  </label>
                  <input
                    type="time"
                    value={hub.officeStart}
                    onChange={(e) => setHub(index, { officeStart: e.target.value })}
                    className={inputBase}
                    style={borderClr}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={labelClr}>
                    Office End Time
                  </label>
                  <input
                    type="time"
                    value={hub.officeEnd}
                    onChange={(e) => setHub(index, { officeEnd: e.target.value })}
                    className={inputBase}
                    style={borderClr}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={labelClr}>
                    Number of Drivers
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={hub.numberOfDrivers}
                    onChange={(e) => setHub(index, { numberOfDrivers: e.target.value })}
                    className={inputBase}
                    style={borderClr}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="mt-6 pt-6" style={{ borderTop: '1px solid #DBEAFE' }}>
                <label className="block text-sm font-medium mb-3" style={labelClr}>
                  Vehicle Types
                </label>
                <div className="flex flex-wrap gap-4">
                  {VEHICLE_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-2 cursor-pointer"
                      style={labelClr}
                    >
                      <input
                        type="checkbox"
                        checked={(hub.vehicleTypes || []).includes(opt.value)}
                        onChange={() => toggleVehicle(index, opt.value)}
                        className="rounded border-[#DBEAFE] text-[#1F4FD8] focus:ring-[#1F4FD8]"
                      />
                      <span className="text-sm">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mt-6 pt-6 grid grid-cols-1 gap-6 sm:grid-cols-2" style={{ borderTop: '1px solid #DBEAFE' }}>
                <div>
                  <label className="block text-sm font-medium mb-2" style={labelClr}>
                    Minimum Weight (kg)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={hub.minWeightKg}
                    onChange={(e) => setHub(index, { minWeightKg: e.target.value })}
                    className={inputBase}
                    style={borderClr}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={labelClr}>
                    Maximum Weight (kg)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={hub.maxWeightKg}
                    onChange={(e) => setHub(index, { maxWeightKg: e.target.value })}
                    className={inputBase}
                    style={borderClr}
                    placeholder="0"
                  />
                </div>
              </div>
            </section>
          ))}
        </div>
        <p className="mt-8 text-center text-sm" style={{ color: '#64748b' }}>
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium hover:underline" style={{ color: '#1F4FD8' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}