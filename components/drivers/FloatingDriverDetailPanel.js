'use client';
import { X, User, Truck, Battery, Package, Star, Wifi, MapPin, Route, Clock } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { formatRelativeTime, cn } from '@/lib/utils';
import { routes } from '@/lib/enterpriseMockData';
export default function FloatingDriverDetailPanel({ driver, onClose }) {
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
  const driverRoutes = routes.filter((route) => route.driverId === driver.driverId);
  const totalRoutesAssigned = driverRoutes.length;
  const routesCompleted = driverRoutes.filter((route) => route.status === 'completed').length;
  const activeRoute = driverRoutes.find((route) => route.status === 'in_progress') || null;
  const currentStop =
    activeRoute && activeRoute.stops && activeRoute.stops.length > 0
      ? activeRoute.stops[activeRoute.sequenceNumber - 1]
      : null;
  return (
    <div 
      className="driver-detail-panel"
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        width: '320px',
        maxHeight: 'calc(100vh - 160px)',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        padding: '0',
        zIndex: 1000,
        overflow: 'hidden',
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        padding: '16px',
        color: 'white'
      }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              {driver.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="font-bold text-sm">{driver.name}</div>
              <div className="text-xs opacity-90 font-mono">{driver.driverId}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            className="hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <Badge variant={driver.status} dot>
          {driver.status.replace(/_/g, ' ')}
        </Badge>
      </div>
      {/* Scrollable Content */}
      <div style={{
        maxHeight: 'calc(100vh - 280px)',
        overflowY: 'auto',
        padding: '16px'
      }}>
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* Battery */}
          <div style={{
            background: '#f9fafb',
            borderRadius: '8px',
            padding: '10px',
            border: '1px solid #e5e7eb'
          }}>
            <div className="flex items-center gap-2 mb-1">
              <Battery className={cn('w-4 h-4', getBatteryColor(driver.batteryLevel))} />
              <span className="text-xs text-slate-600 font-medium">Battery</span>
            </div>
            <div className="text-lg font-bold text-slate-900">{driver.batteryLevel}%</div>
          </div>
          {/* Capacity */}
          <div style={{
            background: '#f9fafb',
            borderRadius: '8px',
            padding: '10px',
            border: '1px solid #e5e7eb'
          }}>
            <div className="flex items-center gap-2 mb-1">
              <Package className={cn('w-4 h-4',
                driver.capacityUsed > 80 ? 'text-danger-600' : driver.capacityUsed > 60 ? 'text-warning-600' : 'text-success-600'
              )} />
              <span className="text-xs text-slate-600 font-medium">Capacity</span>
            </div>
            <div className="text-lg font-bold text-slate-900">{driver.capacityUsed}%</div>
          </div>
          {/* Tasks */}
          <div style={{
            background: '#f9fafb',
            borderRadius: '8px',
            padding: '10px',
            border: '1px solid #e5e7eb'
          }}>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-primary-600" />
              <span className="text-xs text-slate-600 font-medium">Tasks</span>
            </div>
            <div className="text-lg font-bold text-slate-900">{driver.tasksToday}</div>
          </div>
          {/* Rating */}
          <div style={{
            background: '#f9fafb',
            borderRadius: '8px',
            padding: '10px',
            border: '1px solid #e5e7eb'
          }}>
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-amber-600" />
              <span className="text-xs text-slate-600 font-medium">Rating</span>
            </div>
            <div className="text-lg font-bold text-slate-900">{driver.rating} ★</div>
          </div>
        </div>
        {/* Details List */}
        <div style={{
          background: '#f9fafb',
          borderRadius: '8px',
          padding: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-1 text-xs border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Truck className="w-3 h-3 text-slate-400" />
                <span className="text-slate-600">Vehicle</span>
              </div>
              <span className="font-mono font-semibold text-slate-900">{driver.vehicleId}</span>
            </div>
            <div className="flex items-center justify-between py-1 text-xs border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Route className="w-3 h-3 text-slate-400" />
                <span className="text-slate-600">Route</span>
              </div>
              <span className="font-mono font-semibold text-slate-900">
                {driver.currentRouteId || <span className="text-slate-400">—</span>}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 text-xs border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-slate-400" />
                <span className="text-slate-600">Shift Start</span>
              </div>
              <span className="font-medium text-slate-900 text-xs">
                {formatRelativeTime(driver.shiftStartTime)}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 text-xs">
              <div className="flex items-center gap-2">
                <Wifi className="w-3 h-3 text-slate-400" />
                <span className="text-slate-600">Connectivity</span>
              </div>
              <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold', connectivity.bgColor, connectivity.color)}>
                {connectivity.status}
              </span>
            </div>
          </div>
        </div>
        {/* Performance */}
        <div style={{
          marginTop: '12px',
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          borderRadius: '8px',
          padding: '12px',
          border: '1px solid #bfdbfe'
        }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                Performance
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-xl font-bold text-blue-900">{driver.completionRate}%</div>
                  <div className="text-xs text-blue-600">Completion</div>
                </div>
                <div className="h-8 w-px bg-blue-300"></div>
                <div>
                  <div className="text-xl font-bold text-blue-900">{driver.workloadScore}</div>
                  <div className="text-xs text-blue-600">Workload</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Route Overview (reusing Routes data inside driver view) */}
        <div style={{
          marginTop: '12px',
          background: '#f9fafb',
          borderRadius: '8px',
          padding: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Route className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Route Overview
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              {totalRoutesAssigned} routes assigned
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
            <div>
              <div className="text-slate-500 mb-0.5">Routes Completed</div>
              <div className="font-semibold text-slate-900">
                {routesCompleted} / {totalRoutesAssigned || 0}
              </div>
            </div>
            <div>
              <div className="text-slate-500 mb-0.5">Active Route</div>
              <div className="font-mono text-slate-900">
                {activeRoute ? activeRoute.routeId : <span className="text-slate-400">—</span>}
              </div>
            </div>
            <div>
              <div className="text-slate-500 mb-0.5">Current Stop</div>
              {activeRoute && currentStop ? (
                <div className="text-slate-900 font-mono">
                  {activeRoute.sequenceNumber} / {activeRoute.totalStops}{' '}
                  <span className="block text-[11px] text-slate-500">
                    {currentStop.orderId}
                  </span>
                </div>
              ) : (
                <div className="text-slate-400">No active stop</div>
              )}
            </div>
            <div>
              <div className="text-slate-500 mb-0.5">ETA Next Stop</div>
              {activeRoute ? (
                <div className="text-slate-900 font-medium">
                  {formatRelativeTime(activeRoute.etaNextStop)}
                </div>
              ) : (
                <div className="text-slate-400">—</div>
              )}
            </div>
          </div>
          {activeRoute && (
            <div className="mt-2 rounded-md border border-slate-200 bg-white p-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-slate-700 uppercase">
                  Active Route Snapshot
                </span>
                <span className="text-[11px] text-slate-500">
                  {activeRoute.distanceTraveled.toFixed(1)} /{' '}
                  {activeRoute.totalDistance.toFixed(1)} km
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${(activeRoute.distanceTraveled / activeRoute.totalDistance) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}