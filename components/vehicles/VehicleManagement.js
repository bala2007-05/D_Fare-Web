'use client';
import { useState } from 'react';
import { Truck, Fuel, Wrench, AlertTriangle, Plus } from 'lucide-react';
import Card, { CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { vehicles, VEHICLE_TYPES } from '@/lib/enterpriseMockData';
import { formatDateTime, cn } from '@/lib/utils';
import { useRole } from '@/lib/roleContext';
export default function VehicleManagement() {
  const { hasPermission } = useRole();
  const getVehicleIcon = (type) => {
    return Truck;
  };
  const getFuelLevelColor = (level) => {
    if (!level) return 'text-slate-400';
    if (level > 50) return 'text-success-600';
    if (level > 25) return 'text-warning-600';
    return 'text-danger-600';
  };
  const getMaintenanceStatus = (date) => {
    const daysUntil = Math.floor((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysUntil < 0) return { label: 'Overdue', color: 'bg-danger-100 text-danger-700' };
    if (daysUntil < 3) return { label: 'Due Soon', color: 'bg-warning-100 text-warning-700' };
    return { label: `${daysUntil} days`, color: 'bg-slate-100 text-slate-600' };
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Vehicle Fleet Management</h2>
          <p className="text-sm text-slate-600 mt-1">{vehicles.length} vehicles in fleet</p>
        </div>
        {hasPermission('canManageVehicles') && (
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
            <Plus className="w-4 h-4" />
            Add Vehicle
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => {
          const Icon = getVehicleIcon(vehicle.vehicleType);
          const maintenance = getMaintenanceStatus(vehicle.nextMaintenanceDate);
          return (
            <Card key={vehicle.vehicleId} className="hover:shadow-card-hover transition-all">
              <CardContent className="py-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{vehicle.vehicleId}</div>
                      <div className="text-xs text-slate-500 uppercase">{vehicle.vehicleType}</div>
                    </div>
                  </div>
                  <Badge variant={vehicle.status === 'active' ? 'operational' : 'warning'}>
                    {vehicle.status}
                  </Badge>
                </div>
                {/* License Plate */}
                <div className="mb-3 p-2 bg-slate-100 rounded text-center">
                  <span className="text-sm font-mono font-bold text-slate-900">
                    {vehicle.licensePlate}
                  </span>
                </div>
                {/* Capacity */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <div className="text-xs text-slate-500">Max Weight</div>
                    <div className="text-sm font-semibold text-slate-900">{vehicle.maxWeightCapacity} kg</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Max Volume</div>
                    <div className="text-sm font-semibold text-slate-900">{vehicle.maxVolumeCapacity} m³</div>
                  </div>
                </div>
                {/* Fuel/Charge */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500">
                      {vehicle.chargeLevel !== null ? 'Battery' : 'Fuel'}
                    </span>
                    <span className={cn(
                      'text-xs font-semibold',
                      getFuelLevelColor(vehicle.fuelLevel || vehicle.chargeLevel)
                    )}>
                      {vehicle.fuelLevel || vehicle.chargeLevel || 0}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        'h-full rounded-full',
                        (vehicle.fuelLevel || vehicle.chargeLevel || 0) > 50 ? 'bg-success-500' :
                        (vehicle.fuelLevel || vehicle.chargeLevel || 0) > 25 ? 'bg-warning-500' :
                        'bg-danger-500'
                      )}
                      style={{ width: `${vehicle.fuelLevel || vehicle.chargeLevel || 0}%` }}
                    />
                  </div>
                </div>
                {/* Driver Assignment */}
                <div className="mb-3 pb-3 border-b border-slate-200">
                  <div className="text-xs text-slate-500">Assigned Driver</div>
                  <div className="text-sm font-medium text-slate-900">
                    {vehicle.assignedDriver || <span className="text-slate-400">Unassigned</span>}
                  </div>
                </div>
                {/* Maintenance */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-600">Next Maintenance</span>
                  </div>
                  <span className={cn('text-xs font-medium px-2 py-0.5 rounded', maintenance.color)}>
                    {maintenance.label}
                  </span>
                </div>
                {vehicle.status === 'maintenance_due' && (
                  <div className="mt-3 flex items-center gap-2 p-2 bg-warning-50 border border-warning-200 rounded">
                    <AlertTriangle className="w-3.5 h-3.5 text-warning-600" />
                    <span className="text-xs text-warning-700 font-medium">Service Required</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}