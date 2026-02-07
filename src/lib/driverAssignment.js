'use client';
import { useMemo, useState } from 'react';
import Card, { CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import { driversEnhanced, orders as baseOrders } from '@/lib/enterpriseMockData';
import { planFairAssignments } from '@/components/drivers/fairassignment';
import { formatRelativeTime } from '@/lib/utils';
export default function DriverAssignments() {
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const { assignedOrders, driverEffortSummary, assignments } = useMemo(() => {
    return planFairAssignments({
      previousDayOrders: baseOrders,
      todayOrders: baseOrders,
      drivers: driversEnhanced,
    });
  }, []);
  const ordersByDriver = useMemo(() => {
    const map = new Map();
    for (const order of assignedOrders) {
      if (!order.assignedDriver) continue;
      const list = map.get(order.assignedDriver) || [];
      list.push(order);
      map.set(order.assignedDriver, list);
    }
    return map;
  }, [assignedOrders]);
  const effortByOrderId = useMemo(() => {
    const map = new Map();
    for (const a of assignments || []) {
      map.set(a.orderId, a.effort);
    }
    return map;
  }, [assignments]);
  const selectedDriver =
    driversEnhanced.find((d) => d.driverId === selectedDriverId) || driversEnhanced[0] || null;
  const selectedDriverOrders = selectedDriver
    ? ordersByDriver.get(selectedDriver.driverId) || []
    : [];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Driver workload overview */}
      <Card>
        <CardHeader>
          <CardTitle>Driver Workload & Assignments</CardTitle>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Yesterday&apos;s effort vs today&apos;s planned tasks
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full">
              <thead className="bg-slate-50 border-y border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                    Driver
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                    Tasks Today
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                    Effort Yesterday
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                    Effort Today
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                    Total Effort
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {driversEnhanced.map((driver) => {
                  const summary = driverEffortSummary[driver.driverId] || {
                    yesterday: 0,
                    today: 0,
                    total: 0,
                  };
                  const todayTasks = ordersByDriver.get(driver.driverId) || [];
                  const isSelected = selectedDriver && selectedDriver.driverId === driver.driverId;
                  return (
                    <tr
                      key={driver.driverId}
                      onClick={() => setSelectedDriverId(driver.driverId)}
                      className={`cursor-pointer hover:bg-slate-50 ${
                        isSelected ? 'bg-slate-100' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <div className="font-medium text-slate-900">{driver.name}</div>
                          <div className="text-xs text-slate-500">{driver.driverId}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 capitalize">
                        {driver.status.replace(/_/g, ' ')}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {todayTasks.length}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {summary.yesterday.toFixed(1)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {summary.today.toFixed(1)}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                        {summary.total.toFixed(1)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {/* Selected driver task list */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedDriver
              ? `Tasks Assigned to ${selectedDriver.name}`
              : 'Select a driver to view tasks'}
          </CardTitle>
          {selectedDriver && (
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Showing tasks from the current fair assignment plan
            </p>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {!selectedDriver || selectedDriverOrders.length === 0 ? (
            <EmptyState
              icon={null}
              title="No tasks assigned"
              description={
                selectedDriver
                  ? 'This driver has no tasks in the current plan.'
                  : 'Select a driver from the table on the left.'
              }
            />
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full">
                <thead className="bg-slate-50 border-y border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                      Address
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                      Service
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                      Priority
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                      Effort
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {selectedDriverOrders.map((order) => (
                    <tr key={order.orderId}>
                      <td className="px-4 py-3 text-sm font-mono font-semibold text-slate-900">
                        {order.orderId}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 max-w-xs truncate">
                        {order.deliveryAddress}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 capitalize">
                        {order.serviceType.replace(/_/g, ' ')}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 capitalize">
                        {order.priority}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {effortByOrderId.get(order.orderId)?.toFixed(1) ?? '-'}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {formatRelativeTime(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}