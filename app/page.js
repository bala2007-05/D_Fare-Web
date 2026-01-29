'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import OperationalOverview from '@/components/dashboard/OperationalOverview';
import EnhancedDriverTable from '@/components/drivers/EnhancedDriverTable';
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

  // Show loading while redirecting
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">D</span>
          </div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleDriverClick = (driver) => {
    setSelectedDriver(driver);
  };

  const handleOverride = (order) => {
    setOverrideOrder(order);
    setShowOverridePanel(true);
    setSelectedOrder(null);
  };

  const handleOverrideSubmit = (data) => {
    console.log('Override submitted:', data);
    setShowOverridePanel(false);
    setOverrideOrder(null);
    // In real app, would make API call here
  };

  return (
    <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="animate-fade-in">
        
        {/* Dashboard Tab */}
        {activeTab === 'Dashboard' && (
          <div className="space-y-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-900">Live Operations Overview</h2>
              <p className="text-sm text-slate-600 mt-1">
                Real-time system metrics and operational status
              </p>
            </div>
            <OperationalOverview />

            {/* Quick access to other modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <button
                onClick={() => setActiveTab('Orders')}
                className="p-4 bg-white border border-slate-200 rounded-lg hover:border-primary-300 hover:shadow-card-hover transition-all text-left"
              >
                <h3 className="font-semibold text-slate-900">Order Management</h3>
                <p className="text-sm text-slate-600 mt-1">View and manage delivery orders</p>
              </button>
              <button
                onClick={() => setActiveTab('Drivers')}
                className="p-4 bg-white border border-slate-200 rounded-lg hover:border-primary-300 hover:shadow-card-hover transition-all text-left"
              >
                <h3 className="font-semibold text-slate-900">Driver Monitoring</h3>
                <p className="text-sm text-slate-600 mt-1">Live driver status and tracking</p>
              </button>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'Orders' && (
          <div className="space-y-6">
            <OrderTable onOrderClick={handleOrderClick} />
          </div>
        )}

        {/* Drivers Tab */}
        {activeTab === 'Drivers' && (
          <div className="space-y-6">
            <EnhancedDriverTable onDriverClick={handleDriverClick} />
          </div>
        )}

        {/* Vehicles Tab */}
        {activeTab === 'Vehicles' && (
          <div className="space-y-6">
            <VehicleManagement />
          </div>
        )}

        {/* Routes Tab */}
        {activeTab === 'Routes' && (
          <div className="space-y-6">
            <RouteMonitoring />
          </div>
        )}

        {/* Fairness Analytics Tab */}
        {activeTab === 'Fairness Analytics' && (
          <div className="space-y-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-900">Fairness & Workload Analytics</h2>
              <p className="text-sm text-slate-600 mt-1">
                Visualize workload distribution and system fairness metrics
              </p>
            </div>
            <FairnessAnalytics />
            
            <div className="mt-8">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-900">AI Assignment Transparency</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Understand how the AI makes fair and balanced task assignments
                </p>
              </div>
              <div className="max-w-4xl">
                <ExplainabilityPanel />
              </div>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="pt-8 pb-4 text-center text-xs text-slate-500">
          <p>D-FARE Management Dashboard v2.0.0 - Enterprise Edition</p>
          <p className="mt-1">
            AI-powered fair dispatch system • Role-based access control
          </p>
        </div>
      </div>

      {/* Order Detail Side Panel */}
      {selectedOrder && (
        <OrderDetailPanel
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onOverride={handleOverride}
        />
      )}

      {/* Manual Override Modal */}
      {showOverridePanel && hasPermission('canOverride') && (
        <ManualOverridePanel
          order={overrideOrder}
          onClose={() => {
            setShowOverridePanel(false);
            setOverrideOrder(null);
          }}
          onSubmit={handleOverrideSubmit}
        />
      )}
    </MainLayout>
  );
}
