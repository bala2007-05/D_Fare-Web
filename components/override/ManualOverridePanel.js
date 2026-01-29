'use client';

import { useState } from 'react';
import { AlertTriangle, X, Check, History } from 'lucide-react';
import Card, { CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import { driversEnhanced, overrideHistory } from '@/lib/enterpriseMockData';
import { formatDateTime } from '@/lib/utils';

export default function ManualOverridePanel({ order, onClose, onSubmit }) {
  const [selectedDriver, setSelectedDriver] = useState('');
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  if (!order) return null;

  const reasonOptions = [
    { value: 'proximity', label: 'Driver Proximity - Closest to pickup' },
    { value: 'skill_match', label: 'Skill Requirement Match' },
    { value: 'vehicle_capacity', label: 'Vehicle Capacity Required' },
    { value: 'customer_request', label: 'Customer Specific Request' },
    { value: 'driver_unavailable', label: 'Original Driver Unavailable' },
    { value: 'emergency', label: 'Emergency / Urgent Delivery' },
    { value: 'route_optimization', label: 'Route Optimization' },
    { value: 'other', label: 'Other (Specify)' },
  ];

  const handleSubmit = () => {
    if (!selectedDriver || !reason || (reason === 'other' && !customReason)) {
      alert('Please fill in all required fields');
      return;
    }

    onSubmit && onSubmit({
      orderId: order.orderId,
      newDriver: selectedDriver,
      reason: reason === 'other' ? customReason : reasonOptions.find(r => r.value === reason)?.label,
      timestamp: new Date().toISOString(),
    });
  };

  // Get available drivers for override
  const availableDrivers = driversEnhanced.filter(d => 
    d.status !== 'offline' && d.driverId !== order.assignedDriver
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header with Warning */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 z-10">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Manual Override</h2>
              <p className="text-sm text-slate-500">Order: {order.orderId}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-warning-50 border border-warning-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-warning-900">
                Manual Override Will Affect Fairness Metrics
              </div>
              <p className="text-xs text-warning-700 mt-1">
                This action will be logged and audited. Overriding AI assignments may impact workload distribution fairness.
                Provide a clear reason for this override.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Assignment */}
          <Card className="border-slate-300">
            <CardHeader>
              <CardTitle>Current Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-500">Assigned Driver</div>
                  <div className="text-sm font-semibold text-slate-900">
                    {order.assignedDriver || 'Unassigned'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Route</div>
                  <div className="text-sm font-mono text-slate-700">
                    {order.assignedRoute || '—'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* New Driver Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Select New Driver <span className="text-danger-600">*</span>
            </label>
            <Select
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value)}
              className="w-full"
            >
              <option value="">— Select Driver —</option>
              {availableDrivers.map((driver) => (
                <option key={driver.driverId} value={driver.driverId}>
                  {driver.driverId} - {driver.name} ({driver.status}, {driver.capacityUsed}% capacity)
                </option>
              ))}
            </Select>
          </div>

          {/* Reason Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Reason for Override <span className="text-danger-600">*</span>
            </label>
            <Select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full"
            >
              <option value="">— Select Reason —</option>
              {reasonOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Custom Reason (if "Other" selected) */}
          {reason === 'other' && (
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Specify Reason <span className="text-danger-600">*</span>
              </label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Provide detailed explanation for this override..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
              />
            </div>
          )}

          {/* Override History */}
          {overrideHistory.length > 0 && (
            <Card className="border-primary-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-primary-600" />
                  <CardTitle>Recent Override History</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {overrideHistory.slice(0, 3).map((override) => (
                    <div 
                      key={override.overrideId}
                      className="pb-3 border-b border-slate-200 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-sm font-mono font-semibold text-slate-900">
                          {override.orderId}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatDateTime(override.timestamp)}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mb-1">
                        {override.originalDriver ? (
                          <>
                            {override.originalDriver} → {override.newDriver}
                          </>
                        ) : (
                          <>Assigned to {override.newDriver}</>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 italic">
                        "{override.reason}"
                      </div>
                      {override.fairnessImpact && (
                        <div className="text-xs text-warning-600 mt-1">
                          Fairness Impact: {override.fairnessImpact}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedDriver || !reason || (reason === 'other' && !customReason)}
              className="flex-1 px-4 py-2.5 bg-danger-500 hover:bg-danger-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Confirm Override
            </button>
          </div>

          <p className="text-xs text-center text-slate-500 italic">
            This override will be logged and auditable by administrators
          </p>
        </div>
      </div>
    </div>
  );
}
