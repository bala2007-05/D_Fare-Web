'use client';

import MainLayout from '@/components/layout/MainLayout';
import OperationalOverview from '@/components/dashboard/OperationalOverview';
import DriverTable from '@/components/drivers/DriverTable';
import TaskQueue from '@/components/tasks/TaskQueue';
import FairnessAnalytics from '@/components/analytics/FairnessAnalytics';
import ExplainabilityPanel from '@/components/analytics/ExplainabilityPanel';

export default function DashboardPage() {
  return (
    <MainLayout>
      {/* Page content with proper spacing between sections */}
      <div className="space-y-6">
        
        {/* Section 1: Live Operations Overview */}
        <section id="dashboard" className="scroll-mt-20">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">Live Operations Overview</h2>
            <p className="text-sm text-slate-600 mt-1">
              Real-time system metrics and operational status
            </p>
          </div>
          <OperationalOverview />
        </section>

        {/* Section 2: Real-Time Driver Monitoring */}
        <section id="drivers" className="scroll-mt-20">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">Driver Monitoring</h2>
            <p className="text-sm text-slate-600 mt-1">
              Track driver status, workload, and activity in real-time
            </p>
          </div>
          <DriverTable />
        </section>

        {/* Section 3: Task Queue Monitoring */}
        <section id="tasks" className="scroll-mt-20">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">Task Queue</h2>
            <p className="text-sm text-slate-600 mt-1">
              Monitor pending, active, and completed tasks
            </p>
          </div>
          <TaskQueue />
        </section>

        {/* Section 4: Fairness & Workload Analytics */}
        <section id="analytics" className="scroll-mt-20">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">Fairness & Workload Analytics</h2>
            <p className="text-sm text-slate-600 mt-1">
              Visualize workload distribution and system fairness metrics
            </p>
          </div>
          <FairnessAnalytics />
        </section>

        {/* Section 5: AI Explainability */}
        <section id="explainability" className="scroll-mt-20">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">AI Assignment Transparency</h2>
            <p className="text-sm text-slate-600 mt-1">
              Understand how the AI makes fair and balanced task assignments
            </p>
          </div>
          <div className="max-w-4xl">
            <ExplainabilityPanel />
          </div>
        </section>

        {/* System Status Footer */}
        <section id="status" className="scroll-mt-20">
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">System Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-success-500 mt-1.5"></div>
                <div>
                  <p className="text-sm font-medium text-slate-900">API Server</p>
                  <p className="text-xs text-slate-500">Operational</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-success-500 mt-1.5"></div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Database</p>
                  <p className="text-xs text-slate-500">Healthy</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-success-500 mt-1.5"></div>
                <div>
                  <p className="text-sm font-medium text-slate-900">AI Engine</p>
                  <p className="text-xs text-slate-500">Active</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Info */}
        <div className="pt-8 pb-4 text-center text-xs text-slate-500">
          <p>D-FARE Management Dashboard v1.0.0</p>
          <p className="mt-1">
            AI-powered dispatch system • Read-only monitoring interface
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
