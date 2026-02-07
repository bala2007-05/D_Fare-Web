'use client';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  BarChart3,
} from 'lucide-react';
const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Orders', icon: ClipboardList },
  { name: 'Drivers', icon: Users },
  { name: 'Fairness Analytics', icon: BarChart3 },
];
import RoleSelector from './RoleSelector';
import HubSelector from './HubSelector';
import { useProvider } from '@/lib/providerContext';
import { useAuthActions } from '@/lib/auth/useAuth';
import { supabase } from '@/lib/supabase/client';
import { LogOut } from 'lucide-react';
export default function TopBar({ activeTab, setActiveTab }) {
  const { logout, providerData } = useProvider();
  const { signOut: authSignOut } = useAuthActions();
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);
  return (
    <header className="fixed top-0 right-0 left-0 z-10" style={{
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
    }}>
      {/* Top section with logo and status */}
      <div className="px-6 flex items-center justify-between" style={{ 
        height: '80px',
        borderBottom: '1px solid #e2e8f0' 
      }}>
        {/* Left side - Logo and Brand */}
        <div className="flex items-center">
          <img
            src="/images/logo.png"
            alt="D-FARE Logo"
            className="dashboard-logo"
          />
        </div>
        {/* Right side - Status indicators */}
        <div className="flex items-center gap-4">
          <HubSelector />
          <RoleSelector onNavigate={(tab) => setActiveTab(tab)} />
          <div className="pl-4" style={{ borderLeft: '1px solid #e2e8f0' }}>
            <div className="text-sm font-medium" style={{ color: '#0F172A' }}>
              {currentTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </div>
            <div className="text-xs" style={{ color: '#64748b' }}>
              {currentTime.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </div>
          <button
            onClick={() => {
              if (supabase) authSignOut();
              else logout();
            }}
            className="p-2 rounded-lg transition-colors"
            style={{ background: 'transparent', color: '#64748b' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#EFF6FF';
              e.currentTarget.style.color = '#1F4FD8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#64748b';
            }}
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
      {/* Navigation bar - white default, blue on hover/active */}
      <nav className="h-14 px-6 flex items-center gap-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;
          return (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                background: isActive ? '#1F4FD8' : 'transparent',
                color: isActive ? '#ffffff' : '#0F172A',
                border: isActive ? '1px solid #1F4FD8' : '1px solid #e2e8f0'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = '#1F4FD8';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#0F172A';
                }
              }}
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}