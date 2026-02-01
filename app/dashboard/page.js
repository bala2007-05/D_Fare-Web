'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import OperationalOverview from '@/components/dashboard/OperationalOverview';
import DriverMonitoring from '@/components/drivers/DriverMonitoring';
import OrderTable from '@/components/orders/OrderTable';
import OrderDetailPanel from '@/components/orders/OrderDetailPanel';
import VehicleManagement from '@/components/vehicles/VehicleManagement';
import RouteMonitoring from '@/components/routes/RouteMonitoring';
import FairnessAnalytics from '@/components/analytics/FairnessAnalytics';
import ExplainabilityPanel from '@/components/analytics/ExplainabilityPanel';
import ManualOverridePanel from '@/components/override/ManualOverridePanel';
import { useRole } from '@/lib/roleContext';
import { useProvider } from '@/lib/providerContext';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated } = useProvider();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showOverridePanel, setShowOverridePanel] = useState(false);
  const [overrideOrder, setOverrideOrder] = useState(null);
  const { hasPermission } = useRole();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
  };

  const handleDriverSelect = (driver) => {
    setSelectedDriver(driver);
  };

  const handleOverride = (order) => {
    setOverrideOrder(order);
    setShowOverridePanel(true);
  };

  if (!isAuthenticated) {
    return null; // Or a loading spinner
  }

  return (
    <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="animate-fade-in">
        {/* Dashboard Tab */}
        {activeTab === 'Dashboard' && (
          <div className="space-y-6">
            <div style={{ marginTop: '32px' }}>
              <h2 className="text-2xl tracking-tight" style={{ 
                color: '#0F2A47',
                fontWeight: 600
              }}>Live Operations Overview</h2>
              <p className="text-sm mt-2" style={{ color: 'rgba(15, 42, 71, 0.75)' }}>
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
                  <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: '#0F2A47' }}>Quick Actions</h3>
                </div>
                <button
                  onClick={() => setActiveTab('Orders')}
                  className="w-full p-4 rounded-xl transition-all text-left group"
                  style={{
                    background: '#0F2A47',
                    border: '1px solid rgba(226, 169, 75, 0.2)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(226, 169, 75, 0.3)';
                    e.currentTarget.style.borderColor = 'rgba(226, 169, 75, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                    e.currentTarget.style.borderColor = 'rgba(226, 169, 75, 0.2)';
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors" style={{ background: 'rgba(226, 169, 75, 0.15)' }}>
                      <span className="text-2xl">📦</span>
                    </div>
                    <div>
                      <div className="font-semibold" style={{ color: 'white' }}>Order Management</div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Track & manage deliveries</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('Drivers')}
                  className="w-full p-4 rounded-xl transition-all text-left group"
                  style={{
                    background: '#0F2A47',
                    border: '1px solid rgba(226, 169, 75, 0.2)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(226, 169, 75, 0.3)';
                    e.currentTarget.style.borderColor = 'rgba(226, 169, 75, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                    e.currentTarget.style.borderColor = 'rgba(226, 169, 75, 0.2)';
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors" style={{ background: 'rgba(226, 169, 75, 0.15)' }}>
                      <span className="text-2xl">👨‍✈️</span>
                    </div>
                    <div>
                      <div className="font-semibold" style={{ color: 'white' }}>Driver Monitoring</div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Real-time driver status</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('Vehicles')}
                  className="w-full p-4 rounded-xl transition-all text-left group"
                  style={{
                    background: '#0F2A47',
                    border: '1px solid rgba(226, 169, 75, 0.2)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(226, 169, 75, 0.3)';
                    e.currentTarget.style.borderColor = 'rgba(226, 169, 75, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                    e.currentTarget.style.borderColor = 'rgba(226, 169, 75, 0.2)';
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors" style={{ background: 'rgba(226, 169, 75, 0.15)' }}>
                      <span className="text-2xl">🚚</span>
                    </div>
                    <div>
                      <div className="font-semibold" style={{ color: 'white' }}>Vehicle Fleet</div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Manage fleet & capacity</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('Routes')}
                  className="w-full p-4 rounded-xl transition-all text-left group"
                  style={{
                    background: '#0F2A47',
                    border: '1px solid rgba(226, 169, 75, 0.2)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(226, 169, 75, 0.3)';
                    e.currentTarget.style.borderColor = 'rgba(226, 169, 75, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                    e.currentTarget.style.borderColor = 'rgba(226, 169, 75, 0.2)';
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors" style={{ background: 'rgba(226, 169, 75, 0.15)' }}>
                      <span className="text-2xl">🗺️</span>
                    </div>
                    <div>
                      <div className="font-semibold" style={{ color: 'white' }}>Active Routes</div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Monitor route progress</div>
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
              <h2 className="text-2xl" style={{ color: '#0F2A47', fontWeight: 600 }}>Order & Shipment Management</h2>
              <p className="text-sm" style={{ 
                color: '#0F2A47',
                marginTop: '16px',
                marginBottom: '20px',
                fontWeight: 500
              }}>
                Manage delivery orders, track status, and handle assignments
              </p>
            </div>
            <OrderTable
              onOrderSelect={handleOrderSelect}
              onOverride={handleOverride}
            />
            {selectedOrder && (
              <OrderDetailPanel
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
              />
            )}
          </div>
        )}

        {/* Drivers Tab */}
        {activeTab === 'Drivers' && (
          <div className="space-y-8">
            <div style={{ marginTop: '32px' }}>
              <h2 className="text-2xl font-bold" style={{ color: '#E2A94B' }}>Driver Intelligence System</h2>
              <p className="text-sm" style={{ 
                color: '#0F2A47',
                marginTop: '16px',
                marginBottom: '20px',
                fontWeight: 500
              }}>
                Interactive driver monitoring with live location tracking and detailed analytics
              </p>
            </div>
            <DriverMonitoring />
          </div>
        )}

        {/* Vehicles Tab */}
        {activeTab === 'Vehicles' && (
          <div className="space-y-8">
            <div style={{ marginTop: '32px' }}>
              <h2 className="text-2xl font-bold" style={{ color: '#E2A94B' }}>Vehicle & Fleet Management</h2>
              <p className="text-sm" style={{ 
                color: '#0F2A47',
                marginTop: '16px',
                marginBottom: '20px',
                fontWeight: 500
              }}>
                Track vehicle availability, capacity, and maintenance schedules
              </p>
            </div>
            <VehicleManagement />
          </div>
        )}

        {/* Routes Tab */}
        {activeTab === 'Routes' && (
          <div className="space-y-8">
            <div style={{ marginTop: '32px' }}>
              <h2 className="text-2xl font-bold" style={{ color: '#E2A94B' }}>Route & Navigation Monitoring</h2>
              <p className="text-sm" style={{ 
                color: '#0F2A47',
                marginTop: '16px',
                marginBottom: '20px',
                fontWeight: 500
              }}>
                Real-time route tracking, ETAs, and traffic analysis
              </p>
            </div>
            <RouteMonitoring />
          </div>
        )}

        {/* Fairness Analytics Tab */}
        {activeTab === 'Fairness Analytics' && (
          <div className="space-y-8">
            <div style={{ marginTop: '32px' }}>
              <h2 className="text-2xl font-bold" style={{ color: '#E2A94B' }}>Fairness & Analytics Dashboard</h2>
              <p className="text-sm" style={{ 
                color: '#0F2A47',
                marginTop: '16px',
                marginBottom: '20px',
                fontWeight: 500
              }}>
                Workload distribution, fairness metrics, and performance insights
              </p>
            </div>
            <FairnessAnalytics />
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
