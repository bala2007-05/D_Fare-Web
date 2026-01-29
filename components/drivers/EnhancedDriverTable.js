'use client';

import { useState, useMemo } from 'react';
import { Search, Battery, Wifi, AlertTriangle, RefreshCw } from 'lucide-react';
import Card, { CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { driversEnhanced, DRIVER_STATUS } from '@/lib/enterpriseMockData';
import { formatRelativeTime, cn } from '@/lib/utils';

export default function EnhancedDriverTable({ onDriverClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const filteredDrivers = useMemo(() => {
    return driversEnhanced.filter((driver) => {
      const matchesSearch = 
        driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.driverId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const getStatusColor = (status) => {
    const colors = {
      [DRIVER_STATUS.IDLE]: 'bg-success-100 text-success-700',
      [DRIVER_STATUS.BUSY]: 'bg-primary-100 text-primary-700',
      [DRIVER_STATUS.OFFLINE]: 'bg-slate-100 text-slate-600',
      [DRIVER_STATUS.ON_BREAK]: 'bg-warning-100 text-warning-700',
      [DRIVER_STATUS.RETURNING_TO_HUB]: 'bg-purple-100 text-purple-700',
    };
    return colors[status] || 'bg-slate-100 text-slate-600';
  };

  const getConnectivityStatus = (lastPing) => {
    const secondsSinceLastPing = (new Date() - new Date(lastPing)) / 1000;
    if (secondsSinceLastPing < 60) return { status: 'excellent', color: 'text-success-600' };
    if (secondsSinceLastPing < 180) return { status: 'good', color: 'text-primary-600' };
    if (secondsSinceLastPing < 300) return { status: 'weak', color: 'text-warning-600' };
    return { status: 'poor', color: 'text-danger-600' };
  };

  const getBatteryColor = (level) => {
    if (level > 60) return 'text-success-600';
    if (level > 30) return 'text-warning-600';
    return 'text-danger-600';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Live Driver Monitoring</CardTitle>
            <p className="text-sm text-slate-500 mt-1">
              {filteredDrivers.length} active drivers
            </p>
          </div>
          <button
            onClick={() => setLastRefresh(new Date())}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-xs text-slate-500">
              Updated {formatRelativeTime(lastRefresh.toISOString())}
            </span>
          </button>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-3 mt-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search drivers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-48"
          >
            <option value="all">All Status</option>
            <option value={DRIVER_STATUS.IDLE}>Idle</option>
            <option value={DRIVER_STATUS.BUSY}>Busy</option>
            <option value={DRIVER_STATUS.ON_BREAK}>On Break</option>
            <option value={DRIVER_STATUS.OFFLINE}>Offline</option>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full">
            <thead className="bg-slate-50 border-y border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Driver</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Vehicle</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Connectivity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Battery</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Capacity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Tasks Today</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Route</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredDrivers.map((driver) => {
                const connectivity = getConnectivityStatus(driver.lastPingTimestamp);
                return (
                  <tr 
                    key={driver.driverId}
                    onClick={() => onDriverClick && onDriverClick(driver)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-slate-900">{driver.name}</div>
                        <div className="text-xs text-slate-500 font-mono">{driver.driverId}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={driver.status} dot>
                        {driver.status.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono text-slate-700">{driver.vehicleId}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Wifi className={cn('w-4 h-4', connectivity.color)} />
                        <span className="text-xs text-slate-500">
                          {formatRelativeTime(driver.lastPingTimestamp)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Battery className={cn('w-4 h-4', getBatteryColor(driver.batteryLevel))} />
                        <span className="text-sm font-medium">{driver.batteryLevel}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              'h-full rounded-full',
                              driver.capacityUsed > 80 ? 'bg-danger-500' :
                              driver.capacityUsed > 60 ? 'bg-warning-500' :
                              'bg-success-500'
                            )}
                            style={{ width: `${driver.capacityUsed}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-700">{driver.capacityUsed}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-slate-900">{driver.tasksToday}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono text-slate-600">
                        {driver.currentRouteId || <span className="text-slate-400">—</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-slate-900">{driver.rating}</span>
                        <span className="text-xs text-slate-400">★</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
