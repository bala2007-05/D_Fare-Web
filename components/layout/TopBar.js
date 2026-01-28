'use client';

import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  BarChart3, 
  Activity, 
  Clock 
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { formatTime, cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '#dashboard', icon: LayoutDashboard },
  { name: 'Drivers', href: '#drivers', icon: Users },
  { name: 'Tasks', href: '#tasks', icon: ClipboardList },
  { name: 'Fairness Analytics', href: '#analytics', icon: BarChart3 },
];

export default function TopBar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('Dashboard');

  useEffect(() => {
    // Update current time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Simulate data refresh every 5 seconds
    const updateInterval = setInterval(() => {
      setLastUpdate(new Date());
    }, 5000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(updateInterval);
    };
  }, []);

  return (
    <header className="fixed top-0 right-0 left-0 bg-white border-b border-slate-200 z-10">
      {/* Top section with logo and status */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200">
        {/* Left side - Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">D-FARE</h1>
            <p className="text-xs text-slate-500">Management Console</p>
          </div>
        </div>

        {/* Right side - Status indicators */}
        <div className="flex items-center gap-6">
          {/* Live Status */}
          <div className="flex items-center gap-2">
            <Badge variant="operational" dot>
              Live
            </Badge>
          </div>

          {/* System Health */}
          <div className="flex items-center gap-2 text-sm">
            <Activity className="w-4 h-4 text-success-600" />
            <span className="text-slate-600">System OK</span>
          </div>

          {/* Last Update Time */}
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock className="w-4 h-4" />
            <div className="flex flex-col">
              <span className="text-xs text-slate-400">Last update</span>
              <span className="font-medium text-slate-600">
                {formatTime(lastUpdate.toISOString())}
              </span>
            </div>
          </div>

          {/* Current Time */}
          <div className="pl-6 border-l border-slate-200">
            <div className="text-sm font-medium text-slate-900">
              {currentTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </div>
            <div className="text-xs text-slate-500">
              {currentTime.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <nav className="h-14 px-6 flex items-center gap-2 bg-slate-50">
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
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-white hover:text-slate-900 hover:shadow-sm'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </a>
          );
        })}
      </nav>
    </header>
  );
}
