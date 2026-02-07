'use client';
import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { DRIVERS, ROUTES } from './driverMonitoringData';
import DriverDetailSidebar from './DriverDetailSidebar';
import AddDriverModal from './AddDriverModal';
import { generateDriverId } from '@/lib/supabase/drivers';
const DriverMapPanel = dynamic(() => import('./DriverMapPanel'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full min-h-[300px]" style={{ background: '#f8fafc', color: '#64748b', fontSize: '0.875rem' }}>
      Loading map…
    </div>
  ),
});
function buildNewDriver(formData, driverId) {
  const id = driverId.replace(/-/g, '').toLowerCase();
  return {
    id,
    name: formData.fullName,
    driverId,
    lat: 11.0168,
    lng: 76.9558,
    totalOrders: 0,
    deliveredOrders: 0,
    routeName: '',
    active: false,
    status: 'idle',
    vehicleId: '',
    routeId: null,
    shiftStart: '-',
    batteryLevel: null,
    capacityUsed: 0,
    rating: 0,
    completionRate: 0,
    workloadScore: 0,
    connectivity: '-',
    homeAddress: formData.homeAddress,
    phone: formData.phone || null,
    email: formData.email || null,
    licenseNumber: formData.licenseNumber,
    licenseExpiry: formData.licenseExpiry || null,
    employmentType: formData.employmentType,
    shift: formData.shiftTiming,
    photoUrl: formData.photoPreview || null,
  };
}
function useAssignedOrderCounts(orders) {
  return useMemo(() => {
    const counts = {};
    if (!Array.isArray(orders)) return counts;
    orders.forEach((order) => {
      const driverId = order.assignedDriver ?? order.assigned_driver ?? null;
      if (driverId) {
        counts[driverId] = (counts[driverId] ?? 0) + 1;
      }
    });
    return counts;
  }, [orders]);
}
export default function DriversOperationalScreen({ orders = [] }) {
  const [drivers, setDrivers] = useState(() => [...DRIVERS]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [locationDenied, setLocationDenied] = useState(false);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [driverSaveError, setDriverSaveError] = useState(null);
  const assignedCountByDriver = useAssignedOrderCounts(orders);
  const onlineCount = useMemo(() => drivers.filter((d) => d.active).length, [drivers]);
  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden border bg-white"
      style={{
        minHeight: 'calc(100vh - 160px)',
        height: 'calc(100vh - 160px)',
        borderColor: '#e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      <div className="flex flex-1 min-h-0">
        <aside
          className="flex-shrink-0 border-r overflow-y-auto flex flex-col w-[30%] min-w-[240px]"
          style={{ borderColor: '#e2e8f0', background: '#ffffff' }}
        >
          <div className="flex-none px-4 py-3 border-b flex items-center justify-between gap-2" style={{ borderColor: '#e2e8f0' }}>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: '#0f172a' }}>
                Live Drivers
              </h3>
              <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
                {onlineCount} active drivers
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddDriverModal(true)}
              className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-lg font-semibold text-white transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F4FD8]"
              style={{ background: '#1F4FD8' }}
              title="Add Driver"
            >
              +
            </button>
          </div>
          <ul className="flex-1 overflow-y-auto p-2">
            {drivers.map((driver) => {
              const isSelected = selectedDriver?.id === driver.id;
              const initials = driver.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
              const status = driver.status || (driver.active ? 'busy' : 'idle');
              return (
                <li key={driver.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedDriver(driver)}
                    className="w-full text-left px-3 py-3 rounded-lg transition-colors border flex items-center gap-3"
                    style={{
                      background: isSelected ? '#ffffff' : 'transparent',
                      borderColor: isSelected ? '#e2e8f0' : 'transparent',
                      color: isSelected ? '#0f172a' : '#0f172a',
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                      style={{ background: isSelected ? '#0f172a' : '#94a3b8' }}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-medium block truncate">{driver.name}</span>
                      <span className="text-xs opacity-80 block truncate">{driver.driverId || driver.id}</span>
                    </div>
                    <span
                      className="flex items-center gap-1 text-xs flex-shrink-0"
                      style={{ color: '#64748b' }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: driver.active ? '#16a34a' : '#94a3b8' }}
                      />
                      {status}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>
        <main className="flex-1 min-w-0 flex flex-col relative" style={{ background: '#f8fafc' }}>
          <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
            <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-white/95 text-sm cursor-pointer" style={{ borderColor: '#e2e8f0' }}>
              <input
                type="checkbox"
                checked={onlineOnly}
                onChange={(e) => setOnlineOnly(e.target.checked)}
                className="rounded border-gray-300 text-[#1F4FD8] focus:ring-[#1F4FD8]"
              />
              <span style={{ color: '#0f172a' }}>Online only</span>
              <span className="text-xs" style={{ color: '#64748b' }}>({onlineCount} online)</span>
            </label>
          </div>
          <div className="absolute inset-0">
            <DriverMapPanel
              drivers={drivers}
              selectedDriverId={selectedDriver?.id ?? null}
              onSelectDriver={setSelectedDriver}
              onLocationDenied={() => setLocationDenied(true)}
              driversOnlineOnly={onlineOnly}
            />
          </div>
          {locationDenied && (
            <div
              className="absolute inset-0 flex items-center justify-center p-6 text-center z-10"
              style={{ background: 'rgba(255, 255, 255, 0.97)', border: '1px solid #e2e8f0' }}
            >
              <p className="text-sm font-medium" style={{ color: '#1e40af' }}>
                Enable location access to view live driver tracking.
              </p>
            </div>
          )}
        </main>
        {selectedDriver && (
          <DriverDetailSidebar
            driver={selectedDriver}
            assignedTaskCount={selectedDriver.assignedTaskCount ?? assignedCountByDriver[selectedDriver.driverId || selectedDriver.driver_id || selectedDriver.id] ?? 0}
            onClose={() => setSelectedDriver(null)}
          />
        )}
      </div>
      {showAddDriverModal && (
        <AddDriverModal
          error={driverSaveError}
          onClose={() => {
            setDriverSaveError(null);
            setShowAddDriverModal(false);
          }}
          onSubmit={async (formData) => {
            setDriverSaveError(null);
            if (!formData.email?.trim()) {
              setDriverSaveError('Email is required to create driver account and send credentials.');
              return;
            }
            try {
              const res = await fetch('/api/drivers/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  fullName: formData.fullName,
                  email: formData.email.trim(),
                  phone: formData.phone || null,
                  homeAddress: formData.homeAddress || null,
                  licenseNumber: formData.licenseNumber || null,
                  licenseExpiry: formData.licenseExpiry || null,
                  employmentType: formData.employmentType || null,
                  shiftTiming: formData.shiftTiming || null,
                }),
              });
              let data = {};
              try {
                data = await res.json();
              } catch {
                setDriverSaveError('Invalid response from server. Please try again.');
                return;
              }
              if (!res.ok) {
                setDriverSaveError(data.error || 'Failed to create driver');
                return;
              }
              const driverId = data.driverId || data.driver?.driver_id;
              const newDriver = buildNewDriver(formData, driverId);
              setDrivers((prev) => [...prev, newDriver]);
              setShowAddDriverModal(false);
            } catch (err) {
              setDriverSaveError(err.message || 'Failed to create driver');
            }
          }}
        />
      )}
      <footer
        className="flex-none flex flex-wrap items-center gap-6 px-6 py-3 border-t"
        style={{ borderColor: '#e2e8f0', background: '#ffffff' }}
      >
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#64748b' }}>Route summary</span>
        {ROUTES.map((route) => (
          <div key={route.id} className="flex items-center gap-2">
            <span className="text-sm font-medium" style={{ color: '#0f172a' }}>{route.name}</span>
            <span className="text-sm" style={{ color: '#64748b' }}>—</span>
            <span className="text-sm" style={{ color: '#475569' }}>{route.driverNames.join(', ')}</span>
          </div>
        ))}
      </footer>
    </div>
  );
}