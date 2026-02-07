'use client';
import { X, Truck, Package, Star, Wifi, Route, Clock, ClipboardList } from 'lucide-react';
export default function DriverDetailSidebar({ driver, assignedTaskCount, onClose }) {
  if (!driver) return null;
  const taskCount = assignedTaskCount !== undefined && assignedTaskCount !== null
    ? assignedTaskCount
    : (driver.totalOrders ?? 0);
  const initials = driver.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  const statusLabel = (driver.status || (driver.active ? 'busy' : 'idle')).toUpperCase();
  const isBusy = statusLabel === 'BUSY';
  return (
    <aside
      className="flex-shrink-0 w-[320px] min-w-[280px] border-l overflow-y-auto flex flex-col bg-white"
      style={{ borderColor: '#e2e8f0' }}
    >
      {/* Header */}
      <div className="flex-none flex items-center justify-between px-4 py-4 border-b" style={{ borderColor: '#e2e8f0' }}>
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm text-white"
            style={{ background: '#64748b' }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <div className="font-semibold truncate" style={{ color: '#0f172a' }}>
              {driver.name}
            </div>
            <div className="text-xs font-mono truncate" style={{ color: '#64748b' }}>
              {driver.driverId || driver.id}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-[#f1f5f9] transition-colors flex-shrink-0"
          style={{ color: '#64748b' }}
          aria-label="Close panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      {/* Status badge */}
      <div className="flex-none px-4 pt-3">
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold"
          style={{
            background: isBusy ? '#f1f5f9' : '#F1F5F9',
            color: isBusy ? '#0f172a' : '#64748b',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: isBusy ? '#0f172a' : '#94a3b8' }}
          />
          {statusLabel}
        </span>
      </div>
      {/* Key metrics */}
      <div className="flex-none px-4 py-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg p-3 border" style={{ borderColor: '#e2e8f0', background: '#ffffff' }}>
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-4 h-4" style={{ color: '#64748b' }} />
            <span className="text-xs font-medium" style={{ color: '#64748b' }}>Capacity</span>
          </div>
          <div className="text-lg font-bold" style={{ color: '#0f172a' }}>
            {driver.capacityUsed ?? 65}%
          </div>
        </div>
        <div className="rounded-lg p-3 border" style={{ borderColor: '#e2e8f0', background: '#ffffff' }}>
          <div className="flex items-center gap-2 mb-1">
            <ClipboardList className="w-4 h-4" style={{ color: '#64748b' }} />
            <span className="text-xs font-medium" style={{ color: '#64748b' }}>Tasks</span>
          </div>
          <div className="text-lg font-bold" style={{ color: '#0f172a' }}>
            {taskCount}
          </div>
          <div className="text-[10px]" style={{ color: '#64748b' }}>assigned from Orders</div>
        </div>
        <div className="rounded-lg p-3 border" style={{ borderColor: '#e2e8f0', background: '#ffffff' }}>
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-4 h-4" style={{ color: '#eab308' }} />
            <span className="text-xs font-medium" style={{ color: '#64748b' }}>Rating</span>
          </div>
          <div className="text-lg font-bold" style={{ color: '#0f172a' }}>
            {driver.rating ?? 4.8} ★
          </div>
        </div>
      </div>
      {/* Additional details */}
      <div className="flex-none px-4 pb-4 space-y-2">
        <div className="flex items-center justify-between py-2 border-b text-sm" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-center gap-2" style={{ color: '#64748b' }}>
            <Truck className="w-4 h-4" />
            <span>Vehicle</span>
          </div>
          <span className="font-mono font-medium" style={{ color: '#0f172a' }}>{driver.vehicleId ?? 'VEH-001'}</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b text-sm" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-center gap-2" style={{ color: '#64748b' }}>
            <Route className="w-4 h-4" />
            <span>Route</span>
          </div>
          <span className="font-mono font-medium truncate max-w-[140px]" style={{ color: '#0f172a' }} title={driver.routeName}>
            {driver.routeId ?? 'RTE-001'}
          </span>
        </div>
        <div className="flex items-center justify-between py-2 border-b text-sm" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-center gap-2" style={{ color: '#64748b' }}>
            <Clock className="w-4 h-4" />
            <span>Shift start</span>
          </div>
          <span className="font-medium" style={{ color: '#0f172a' }}>{driver.shiftStart ?? '6h ago'}</span>
        </div>
        <div className="flex items-center justify-between py-2 text-sm">
          <div className="flex items-center gap-2" style={{ color: '#64748b' }}>
            <Wifi className="w-4 h-4" />
            <span>Connectivity</span>
          </div>
          <span
            className="px-2 py-0.5 rounded text-xs font-semibold"
            style={{ background: '#DCFCE7', color: '#16a34a' }}
          >
            {driver.connectivity ?? 'Excellent'}
          </span>
        </div>
      </div>
      {/* Performance */}
      <div
        className="flex-none mx-4 mb-4 p-4 rounded-lg border"
        style={{ borderColor: '#e2e8f0', background: '#ffffff' }}
      >
        <div className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#64748b' }}>
          Performance
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-2xl font-bold" style={{ color: '#0f172a' }}>
              {driver.completionRate ?? Math.round((driver.deliveredOrders / (driver.totalOrders || 1)) * 100)}%
            </div>
            <div className="text-xs" style={{ color: '#64748b' }}>Completion</div>
          </div>
          <div className="h-10 w-px" style={{ background: '#e2e8f0' }} />
          <div>
            <div className="text-2xl font-bold" style={{ color: '#0f172a' }}>
              {driver.workloadScore ?? 7.2}
            </div>
            <div className="text-xs" style={{ color: '#64748b' }}>Workload</div>
          </div>
        </div>
      </div>
    </aside>
  );
}