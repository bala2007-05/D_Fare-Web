'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, Download, Plus, Clock, AlertTriangle } from 'lucide-react';
import Card, { CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import EmptyState from '@/components/ui/EmptyState';
import { orders, ORDER_STATUS } from '@/lib/enterpriseMockData';
import { formatDateTime, formatRelativeTime, cn } from '@/lib/utils';
import { useRole } from '@/lib/roleContext';

export default function OrderTable({ onOrderClick }) {
  const { hasPermission } = useRole();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = 
        order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesService = serviceFilter === 'all' || order.serviceType === serviceFilter;
      
      return matchesSearch && matchesStatus && matchesService;
    });
  }, [searchQuery, statusFilter, serviceFilter]);

  // Calculate SLA status
  const getSLAStatus = (order) => {
    const now = new Date();
    const windowEnd = new Date(order.timeWindowEnd);
    const hoursRemaining = (windowEnd - now) / (1000 * 60 * 60);
    
    if (order.status === ORDER_STATUS.DELIVERED) return 'completed';
    if (hoursRemaining < 0) return 'overdue';
    if (hoursRemaining < 1) return 'critical';
    if (hoursRemaining < 3) return 'warning';
    return 'ontime';
  };

  const getSLABadge = (order) => {
    const status = getSLAStatus(order);
    const colors = {
      completed: 'bg-success-100 text-success-700',
      ontime: 'bg-slate-100 text-slate-600',
      warning: 'bg-warning-100 text-warning-700',
      critical: 'bg-danger-100 text-danger-700',
      overdue: 'bg-danger-500 text-white',
    };
    
    const labels = {
      completed: 'Completed',
      ontime: 'On Time',
      warning: 'Due Soon',
      critical: 'Critical',
      overdue: 'Overdue',
    };
    
    return (
      <span className={cn('px-2 py-0.5 rounded text-xs font-medium', colors[status])}>
        {labels[status]}
      </span>
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      [ORDER_STATUS.PENDING]: 'bg-slate-100 text-slate-700',
      [ORDER_STATUS.ASSIGNED]: 'bg-primary-100 text-primary-700',
      [ORDER_STATUS.PICKED_UP]: 'bg-blue-100 text-blue-700',
      [ORDER_STATUS.IN_TRANSIT]: 'bg-purple-100 text-purple-700',
      [ORDER_STATUS.ARRIVED]: 'bg-cyan-100 text-cyan-700',
      [ORDER_STATUS.DELIVERED]: 'bg-success-100 text-success-700',
      [ORDER_STATUS.FAILED]: 'bg-danger-100 text-danger-700',
      [ORDER_STATUS.RTO]: 'bg-warning-100 text-warning-700',
    };
    return colors[status] || 'bg-slate-100 text-slate-600';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Order Management</CardTitle>
            <p className="text-sm text-slate-500 mt-1">
              {filteredOrders.length} of {orders.length} orders
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasPermission('canUploadOrders') && (
              <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium">
                <Plus className="w-4 h-4" />
                New Order
              </button>
            )}
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-3 mt-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by Order ID, Customer, Address..."
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
            <option value={ORDER_STATUS.PENDING}>Pending</option>
            <option value={ORDER_STATUS.ASSIGNED}>Assigned</option>
            <option value={ORDER_STATUS.IN_TRANSIT}>In Transit</option>
            <option value={ORDER_STATUS.DELIVERED}>Delivered</option>
            <option value={ORDER_STATUS.FAILED}>Failed</option>
          </Select>
          
          <Select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="w-40"
          >
            <option value="all">All Services</option>
            <option value="standard">Standard</option>
            <option value="express">Express</option>
            <option value="same_day">Same Day</option>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {filteredOrders.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No orders found"
            description="Try adjusting your filters or search query"
          />
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full">
              <thead className="bg-slate-50 border-y border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Address</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">SLA</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Service</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Driver</th>
                  {hasPermission('canViewFinancials') && (
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">COD</th>
                  )}
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredOrders.map((order) => (
                  <tr 
                    key={order.orderId}
                    onClick={() => onOrderClick && onOrderClick(order)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono font-semibold text-slate-900">
                        {order.orderId}
                      </span>
                      {order.priority === 'urgent' && (
                        <AlertTriangle className="w-3 h-3 text-danger-600 inline ml-1" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <div className="font-medium text-slate-900">{order.customerName}</div>
                        <div className="text-slate-500 text-xs">{order.customerPhone}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-slate-600 max-w-xs truncate">
                        {order.deliveryAddress}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'inline-flex px-2 py-1 rounded-md text-xs font-medium',
                        getStatusColor(order.status)
                      )}>
                        {order.status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {getSLABadge(order)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-600 capitalize">
                        {order.serviceType.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-slate-700">
                        {order.assignedDriver || <span className="text-slate-400">Unassigned</span>}
                      </span>
                    </td>
                    {hasPermission('canViewFinancials') && (
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-slate-900">
                          ${order.codAmount.toFixed(2)}
                        </span>
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <div className="text-xs text-slate-500">
                        {formatRelativeTime(order.createdAt)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
