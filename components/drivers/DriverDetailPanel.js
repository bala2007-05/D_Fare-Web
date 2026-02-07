'use client';
import { X, User, Truck, Battery, Package, Star, Wifi, MapPin, Route, Clock } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { formatRelativeTime, cn } from '@/lib/utils';
export default function DriverDetailPanel({ driver, onClose }) {
  if (!driver) return null;
  const getConnectivityStatus = (lastPing) => {
    const secondsSinceLastPing = (new Date() - new Date(lastPing)) / 1000;
    if (secondsSinceLastPing < 60) return { status: 'Excellent', color: 'text-success-600', bgColor: 'bg-success-100' };
    if (secondsSinceLastPing < 180) return { status: 'Good', color: 'text-primary-600', bgColor: 'bg-primary-100' };
    if (secondsSinceLastPing < 300) return { status: 'Weak', color: 'text-warning-600', bgColor: 'bg-warning-100' };
    return { status: 'Poor', color: 'text-danger-600', bgColor: 'bg-danger-100' };
  };
  const getBatteryColor = (level) => {
    if (level > 60) return 'text-success-600';
    if (level > 30) return 'text-warning-600';
    return 'text-danger-600';
  };
  const connectivity = getConnectivityStatus(driver.lastPingTimestamp);
  return (
    <div 
      className="fixed right-0 top-0 h-full w-full md:w-[480px] bg-white shadow-2xl border-l border-slate-200 z-50 overflow-y-auto driver-panel-enter"
      style={{
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-5 shadow-lg z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-lg shadow-md">
              {driver.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-lg font-bold">{driver.name}</h2>
              <p className="text-xs text-blue-100 font-mono">{driver.driverId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      {/* Driver Details Cards */}
      <div className="p-6 space-y-4">
        {/* Status Card */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Current Status</span>
            <Badge variant={driver.status} dot>
              {driver.status.replace(/_/g, ' ')}
            </Badge>
          </div>
        </div>
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Battery */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', 
                driver.batteryLevel > 60 ? 'bg-success-100' : driver.batteryLevel > 30 ? 'bg-warning-100' : 'bg-danger-100'
              )}>
                <Battery className={cn('w-5 h-5', getBatteryColor(driver.batteryLevel))} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Battery</p>
                <p className="text-lg font-bold text-slate-900">{driver.batteryLevel}%</p>
              </div>
            </div>
          </div>
          {/* Capacity */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center',
                driver.capacityUsed > 80 ? 'bg-danger-100' : driver.capacityUsed > 60 ? 'bg-warning-100' : 'bg-success-100'
              )}>
                <Package className={cn('w-5 h-5',
                  driver.capacityUsed > 80 ? 'text-danger-600' : driver.capacityUsed > 60 ? 'text-warning-600' : 'text-success-600'
                )} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Capacity</p>
                <p className="text-lg font-bold text-slate-900">{driver.capacityUsed}%</p>
              </div>
            </div>
          </div>
          {/* Tasks Today */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Tasks Today</p>
                <p className="text-lg font-bold text-slate-900">{driver.tasksToday}</p>
              </div>
            </div>
          </div>
          {/* Rating */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Rating</p>
                <p className="text-lg font-bold text-slate-900">{driver.rating} ★</p>
              </div>
            </div>
          </div>
        </div>
        {/* Additional Details */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Driver Information</h3>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">Vehicle ID</span>
              </div>
              <span className="text-sm font-mono font-semibold text-slate-900">{driver.vehicleId}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <Route className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">Route ID</span>
              </div>
              <span className="text-sm font-mono font-semibold text-slate-900">
                {driver.currentRouteId || <span className="text-slate-400">Not assigned</span>}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">Shift Start</span>
              </div>
              <span className="text-sm font-medium text-slate-900">
                {formatRelativeTime(driver.shiftStartTime)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Wifi className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">Connectivity</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn('px-2 py-1 rounded-full text-xs font-semibold', connectivity.bgColor, connectivity.color)}>
                  {connectivity.status}
                </span>
                <span className="text-xs text-slate-500">
                  {formatRelativeTime(driver.lastPingTimestamp)}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Performance Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Performance</p>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-2xl font-bold text-blue-900">{driver.completionRate}%</p>
                  <p className="text-xs text-blue-600">Completion Rate</p>
                </div>
                <div className="h-10 w-px bg-blue-300"></div>
                <div>
                  <p className="text-2xl font-bold text-blue-900">{driver.workloadScore}</p>
                  <p className="text-xs text-blue-600">Workload Score</p>
                </div>
              </div>
            </div>
            <Star className="w-12 h-12 text-blue-300" />
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .driver-panel-enter {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}