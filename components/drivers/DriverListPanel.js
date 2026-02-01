'use client';

import { useState } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { driversEnhanced, DRIVER_STATUS } from '@/lib/enterpriseMockData';
import { formatRelativeTime } from '@/lib/utils';

export default function DriverListPanel({ onDriverSelect, selectedDriver }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const filteredDrivers = driversEnhanced.filter((driver) => {
    const matchesSearch = 
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.driverId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="driver-panel" style={{
      width: '30%',
      background: '#ffffff',
      borderRight: '1px solid #e5e7eb',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #e5e7eb',
        background: '#f9fafb'
      }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Live Drivers</h2>
            <p className="text-xs text-slate-500 mt-1">
              {filteredDrivers.length} active drivers
            </p>
          </div>
          <button
            onClick={() => setLastRefresh(new Date())}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4 text-slate-600" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search drivers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>
        
        {/* Filter */}
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full text-sm"
        >
          <option value="all">All Status</option>
          <option value={DRIVER_STATUS.IDLE}>Idle</option>
          <option value={DRIVER_STATUS.BUSY}>Busy</option>
          <option value={DRIVER_STATUS.ON_BREAK}>On Break</option>
          <option value={DRIVER_STATUS.OFFLINE}>Offline</option>
        </Select>
      </div>

      {/* Driver Cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
        {filteredDrivers.map((driver) => (
          <div
            key={driver.driverId}
            className="driver-card"
            onClick={() => onDriverSelect(driver)}
            style={{
              padding: '14px',
              margin: '10px',
              borderRadius: '10px',
              background: selectedDriver?.driverId === driver.driverId ? '#eef2ff' : '#f9fafb',
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: selectedDriver?.driverId === driver.driverId ? '2px solid #3b82f6' : '2px solid transparent',
              boxShadow: selectedDriver?.driverId === driver.driverId 
                ? '0 4px 12px rgba(59, 130, 246, 0.2)' 
                : '0 1px 3px rgba(0,0,0,0.05)'
            }}
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
                fontSize: '14px',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                flexShrink: 0
              }}>
                {driver.name.split(' ').map(n => n[0]).join('')}
              </div>
              
              {/* Driver Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="text-sm font-semibold text-slate-900 truncate">
                  {driver.name}
                </div>
                <div className="text-xs text-slate-500 font-mono truncate">
                  {driver.driverId}
                </div>
                <div className="mt-1">
                  <Badge variant={driver.status} dot>
                    {driver.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
