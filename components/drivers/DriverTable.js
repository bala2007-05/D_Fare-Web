'use client';

import { useState, useMemo } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import Card, { CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { driversEnhanced, DRIVER_STATUS } from '@/lib/enterpriseMockData';
import { formatRelativeTime } from '@/lib/utils';

export default function DriverTable({ onDriverClick, selectedDriver }) {
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Driver Intelligence</CardTitle>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {filteredDrivers.length} active drivers · Click to view details
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Driver Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredDrivers.map((driver) => (
                <tr 
                  key={driver.driverId}
                  onClick={() => onDriverClick(driver)}
                  className={`
                    hover:bg-blue-50 transition-all cursor-pointer
                    ${selectedDriver?.driverId === driver.driverId ? 'bg-blue-100 border-l-4 border-blue-600' : ''}
                  `}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
                        {driver.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{driver.name}</div>
                        <div className="text-xs text-slate-500 font-mono">{driver.driverId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={driver.status} dot>
                      {driver.status.replace(/_/g, ' ')}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
