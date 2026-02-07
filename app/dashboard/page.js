'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import OperationalOverview from '@/components/dashboard/OperationalOverview';
import OrderTable from '@/components/orders/OrderTable';
import OrderDetailPanel from '@/components/orders/OrderDetailPanel';
import FairnessAnalytics from '@/components/analytics/FairnessAnalytics';
import ExplainabilityPanel from '@/components/analytics/ExplainabilityPanel';
import ManualOverridePanel from '@/components/override/ManualOverridePanel';
import DriversOperationalScreen from '@/components/drivers/DriversOperationalScreen';
import { useRole } from '@/lib/roleContext';
import { useProvider } from '@/lib/providerContext';
import { useSession } from '@/lib/auth/useAuth';
import { supabase } from '@/lib/supabase/client';
import { saveOrdersToBackend, updateOrderInBackend, fetchOrdersFromBackend } from '@/lib/supabase/orders';
import { driversEnhanced } from '@/lib/enterpriseMockData';
export default function DashboardPage() {
  const router = useRouter();
  const { session, loading: sessionLoading } = useSession();
  const { isAuthenticated } = useProvider();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOverridePanel, setShowOverridePanel] = useState(false);
  const [overrideOrder, setOverrideOrder] = useState(null);
  const [ordersSaveError, setOrdersSaveError] = useState(null);
  const { hasPermission } = useRole();
  const isAuth = supabase ? !!session : isAuthenticated;
  useEffect(() => {
    if (sessionLoading) return;
    if (!isAuth) {
      router.push('/auth/login');
      return;
    }
  }, [isAuth, sessionLoading, router]);
  useEffect(() => {
    if (!isAuth) return;
    let cancelled = false;
    setOrdersLoading(true);
    fetchOrdersFromBackend().then(({ data, error }) => {
      if (cancelled) return;
      setOrdersLoading(false);
      if (error) return;
      if (Array.isArray(data)) setOrders(data);
    });
    return () => { cancelled = true; };
  }, [isAuth]);
  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
  };
  const handleOverride = (order) => {
    setOverrideOrder(order);
    setShowOverridePanel(true);
  };
  const handleUpdateOrder = async (orderId, updates) => {
    const updatedAt = new Date().toISOString();
    setOrders((prev) =>
      prev.map((order) =>
        order.orderId === orderId ? { ...order, ...updates, updatedAt } : order
      )
    );
    setSelectedOrder((prev) =>
      prev && prev.orderId === orderId ? { ...prev, ...updates, updatedAt } : prev
    );
    await updateOrderInBackend(orderId, updates);
  };
  const handleCreateOrders = async (newOrders) => {
    if (!Array.isArray(newOrders) || newOrders.length === 0) return;
    setOrdersSaveError(null);
    const { error } = await saveOrdersToBackend(newOrders);
    if (error) setOrdersSaveError(error.message || 'Failed to save orders to backend');
    setOrders((prev) => [...newOrders, ...prev]);
  };
  if (sessionLoading || !isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#EFF6FF' }}>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1F4FD8] border-t-transparent" />
      </div>
    );
  }
  return (
    <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="animate-fade-in">
        {/* Dashboard Tab */}
        {activeTab === 'Dashboard' && (
          <div className="space-y-6">
            <div style={{ marginTop: '32px' }}>
              <h2 className="text-2xl tracking-tight" style={{ 
                color: '#0f172a',
                fontWeight: 600
              }}>Live Operations Overview</h2>
              <p className="text-sm mt-2" style={{ color: '#475569' }}>
                Real-time system metrics and operational status
              </p>
            </div>
            {/* Two-Column Layout: Stats (Left) + Quick Actions (Right) */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Left Column: Main Stats & KPIs (70%) */}
              <div className="flex-1 lg:w-[70%]">
                <OperationalOverview />
              </div>
              {/* Right Column: Feature/Action Cards (30%) */}
              <div className="lg:w-[30%] flex flex-col gap-4 flex-shrink-0">
                <div className="mb-2">
                  <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: '#0f172a' }}>Quick Actions</h3>
                </div>
                <button
                  onClick={() => setActiveTab('Orders')}
                  className="w-full p-4 rounded-xl transition-all text-left group border bg-white shadow-sm hover:shadow-md"
                style={{ borderColor: '#DBEAFE' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors bg-blue-50 text-blue-600">
                      <span className="text-2xl">📦</span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Order Management</div>
                      <div className="text-xs text-slate-500">Track & manage deliveries</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('Drivers')}
                  className="w-full p-4 rounded-xl transition-all text-left group border bg-white shadow-sm hover:shadow-md"
                style={{ borderColor: '#DBEAFE' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors bg-blue-50 text-blue-600">
                      <span className="text-2xl">👨‍✈️</span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Driver Monitoring</div>
                      <div className="text-xs text-slate-500">Real-time driver status</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('Drivers')}
                  className="w-full p-4 rounded-xl transition-all text-left group border bg-white shadow-sm hover:shadow-md"
                style={{ borderColor: '#DBEAFE' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors bg-blue-50 text-blue-600">
                      <span className="text-2xl">🗺️</span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Drivers & Routes</div>
                      <div className="text-xs text-slate-500">Operational screen & live map</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Orders Tab */}
        {activeTab === 'Orders' && (
          <div className="space-y-8">
            <div style={{ marginTop: '32px' }}>
              <h2 className="text-2xl text-slate-900" style={{ fontWeight: 600 }}>Order & Shipment Management</h2>
              <p className="text-sm text-slate-600" style={{
                marginTop: '16px',
                marginBottom: '20px',
                fontWeight: 500
              }}>
                Manage delivery orders, track status, and handle assignments
              </p>
            </div>
            <OrderTable
              orders={orders}
              drivers={driversEnhanced}
              ordersLoading={ordersLoading}
              onOrderSelect={handleOrderSelect}
              onOverride={handleOverride}
              onUpdateOrder={handleUpdateOrder}
              onCreateOrders={handleCreateOrders}
              onClearOrdersError={() => setOrdersSaveError(null)}
            />
            {selectedOrder && (
              <OrderDetailPanel
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
                onOverride={handleOverride}
                onUpdateOrder={handleUpdateOrder}
              />
            )}
          </div>
        )}
        {/* Drivers Tab – unified operational screen */}
        {activeTab === 'Drivers' && (
          <div style={{ marginTop: '24px' }}>
            <DriversOperationalScreen orders={orders} />
          </div>
        )}
        {/* Profile Tab */}
        {activeTab === 'Profile' && (
          <div className="space-y-6" style={{ marginTop: '32px' }}>
            <h2 className="text-2xl" style={{ color: '#0f172a', fontWeight: 600 }}>Profile</h2>
            <div className="rounded-xl border bg-white p-6" style={{ borderColor: '#e2e8f0' }}>
              <p className="text-sm" style={{ color: '#475569' }}>
                Manage your account profile details here.
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#64748b' }}>Name</div>
                  <div className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: '#e2e8f0', color: '#0f172a', background: '#ffffff' }}>
                    Admin User
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#64748b' }}>Email</div>
                  <div className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: '#e2e8f0', color: '#0f172a', background: '#ffffff' }}>
                    admin@dfare.local
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Subscription Tab */}
        {activeTab === 'Subscription' && (
          <div className="space-y-6" style={{ marginTop: '32px' }}>
            <h2 className="text-2xl" style={{ color: '#0f172a', fontWeight: 600 }}>Subscription</h2>
            <div className="rounded-xl border bg-white p-6" style={{ borderColor: '#e2e8f0' }}>
              <p className="text-sm" style={{ color: '#475569' }}>
                View your current plan and billing information.
              </p>
              <div className="mt-4 rounded-lg border p-4" style={{ borderColor: '#e2e8f0', background: '#ffffff' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold" style={{ color: '#0f172a' }}>Plan</div>
                    <div className="text-xs" style={{ color: '#64748b' }}>Starter</div>
                  </div>
                  <div className="text-sm font-semibold" style={{ color: '#0f172a' }}>₹0 / month</div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Settings Tab */}
        {activeTab === 'Settings' && (
          <div className="space-y-6" style={{ marginTop: '32px' }}>
            <h2 className="text-2xl" style={{ color: '#0f172a', fontWeight: 600 }}>Settings</h2>
            <div className="rounded-xl border bg-white p-6" style={{ borderColor: '#e2e8f0' }}>
              <p className="text-sm" style={{ color: '#475569' }}>
                Configure preferences and notifications.
              </p>
              <div className="mt-4 space-y-3">
                <label className="flex items-center justify-between rounded-lg border px-4 py-3" style={{ borderColor: '#e2e8f0' }}>
                  <span className="text-sm font-medium" style={{ color: '#0f172a' }}>Email notifications</span>
                  <input type="checkbox" defaultChecked />
                </label>
                <label className="flex items-center justify-between rounded-lg border px-4 py-3" style={{ borderColor: '#e2e8f0' }}>
                  <span className="text-sm font-medium" style={{ color: '#0f172a' }}>SMS notifications</span>
                  <input type="checkbox" />
                </label>
              </div>
            </div>
          </div>
        )}
        {/* Fairness Analytics Tab */}
        {activeTab === 'Fairness Analytics' && (
          <div className="space-y-8">
            <div style={{ marginTop: '32px' }}>
              <h2 className="text-2xl font-bold text-slate-900">Fairness & Analytics Dashboard</h2>
              <p className="text-sm text-slate-600" style={{
                marginTop: '16px',
                marginBottom: '20px',
                fontWeight: 500
              }}>
                Workload distribution, fairness metrics, and performance insights
              </p>
            </div>
            <FairnessAnalytics orders={orders} drivers={driversEnhanced} />
            <ExplainabilityPanel />
          </div>
        )}
        {/* Manual Override Panel */}
        {showOverridePanel && hasPermission('override') && (
          <ManualOverridePanel
            order={overrideOrder}
            onClose={() => {
              setShowOverridePanel(false);
              setOverrideOrder(null);
            }}
          />
        )}
      </div>
    </MainLayout>
  );
}