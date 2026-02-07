'use client';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  BarChart3, 
  Activity 
} from 'lucide-react';
import { cn } from '@/lib/utils';
const navigation = [
  { name: 'Dashboard', href: '#dashboard', icon: LayoutDashboard },
  { name: 'Drivers', href: '#drivers', icon: Users },
  { name: 'Tasks', href: '#tasks', icon: ClipboardList },
  { name: 'Fairness Analytics', href: '#analytics', icon: BarChart3 },
  { name: 'System Status', href: '#status', icon: Activity },
];
export default function Sidebar() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col z-10">
      {/* Logo / Brand */}
      <div className="px-6 py-5 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">D-FARE</h1>
            <p className="text-xs text-slate-500">Management Console</p>
          </div>
        </div>
      </div>
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;
          return (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(item.name);
              }}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary-50 text-primary-700 border border-primary-200'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </a>
          );
        })}
      </nav>
      {/* Footer Info */}
      <div className="px-6 py-4 border-t border-slate-200">
        <div className="text-xs text-slate-500 space-y-1">
          <p className="font-medium text-slate-700">AI-Powered Dispatch</p>
          <p>Read-only monitoring interface</p>
          <p className="text-slate-400 mt-2">Version 1.0.0</p>
        </div>
      </div>
    </aside>
  );
}