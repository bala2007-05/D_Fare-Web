'use client';
import { X, MapPin, Package, Clock, DollarSign, User, Truck, AlertCircle } from 'lucide-react';
import Card, { CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { formatDateTime, cn } from '@/lib/utils';
import { useRole } from '@/lib/roleContext';
export default function OrderDetailPanel({ order, onClose, onOverride }) {
  const { hasPermission } = useRole();
  if (!order) return null;
  return (
    <div className="fixed inset-y-0 right-0 w-[600px] bg-white shadow-2xl border-l border-slate-200 z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Order Details</h2>
          <p className="text-sm text-slate-500 font-mono">{order.orderId}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>
      </div>
      <div className="p-6 space-y-6">
        {/* Status Overview */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-600">Current Status</span>
              <span className={cn(
                'px-3 py-1 rounded-md text-sm font-semibold',
                order.status === 'delivered' ? 'bg-success-100 text-success-700' :
                order.status === 'failed' ? 'bg-danger-100 text-danger-700' :
                'bg-primary-100 text-primary-700'
              )}>
                {order.status.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>
            {order.priority === 'urgent' && (
              <div className="flex items-center gap-2 p-3 bg-danger-50 border border-danger-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-danger-600" />
                <span className="text-sm font-medium text-danger-700">Urgent Priority</span>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-slate-900">{order.customerName}</div>
                <div className="text-xs text-slate-500">{order.customerPhone}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <div className="text-sm text-slate-700">{order.deliveryAddress}</div>
                <div className="text-xs text-slate-500 mt-1">
                  Lat: {order.geolocation.lat}, Lng: {order.geolocation.lng}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Package Details */}
        <Card>
          <CardHeader>
            <CardTitle>Package Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-500">Weight</div>
                <div className="text-sm font-semibold text-slate-900">{order.packageWeight} kg</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Volumetric</div>
                <div className="text-sm font-semibold text-slate-900">{order.volumetricWeight} kg</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Service Type</div>
                <div className="text-sm font-medium text-slate-700 capitalize">
                  {order.serviceType.replace(/_/g, ' ')}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Skill Required</div>
                <div className="text-sm font-medium text-slate-700 capitalize">
                  {order.skillRequirement.replace(/_/g, ' ')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Delivery Window */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Window</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Start</span>
              <span className="text-sm font-medium text-slate-900">
                {formatDateTime(order.timeWindowStart)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">End</span>
              <span className="text-sm font-medium text-slate-900">
                {formatDateTime(order.timeWindowEnd)}
              </span>
            </div>
          </CardContent>
        </Card>
        {/* Assignment */}
        <Card>
          <CardHeader>
            <CardTitle>Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Driver</span>
              <span className="text-sm font-semibold text-slate-900">
                {order.assignedDriver || <span className="text-slate-400">Unassigned</span>}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Route</span>
              <span className="text-sm font-mono text-slate-700">
                {order.assignedRoute || <span className="text-slate-400">—</span>}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Hub</span>
              <span className="text-sm font-mono text-slate-700">{order.hubId}</span>
            </div>
          </CardContent>
        </Card>
        {/* Financial Information */}
        {hasPermission('canViewFinancials') && (
          <Card className="border-primary-200 bg-primary-50/30">
            <CardHeader>
              <CardTitle>Financial Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">COD Amount</span>
                <span className="text-sm font-bold text-slate-900">
                  ₹{order.codAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Delivery Cost</span>
                <span className="text-sm font-semibold text-slate-900">
                  ₹{order.deliveryCost.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Driver Payout</span>
                <span className="text-sm font-semibold text-slate-900">
                  ₹{order.driverPayout.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Failure Reason */}
        {order.failureReason && (
          <Card className="border-danger-200 bg-danger-50">
            <CardHeader>
              <CardTitle>Failure Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-danger-600 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-danger-900">Delivery Failed</div>
                  <div className="text-sm text-danger-700 mt-1">{order.failureReason}</div>
                  <div className="text-xs text-danger-600 mt-2">Attempts: {order.attempts}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Override Action */}
        {hasPermission('canOverride') && order.status !== 'delivered' && (
          <button
            onClick={() => onOverride && onOverride(order)}
            className="w-full py-3 bg-warning-500 hover:bg-warning-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <AlertCircle className="w-4 h-4" />
            Manual Override / Reassign
          </button>
        )}
        {/* Timestamps */}
        <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 space-y-1">
          <div>Created: {formatDateTime(order.createdAt)}</div>
          <div>Last Updated: {formatDateTime(order.updatedAt)}</div>
        </div>
      </div>
    </div>
  );
}