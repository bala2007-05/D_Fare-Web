'use client';

import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  BarChart3, 
  Activity, 
  Clock,
  Truck
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { formatTime, cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Orders', icon: ClipboardList },
  { name: 'Drivers', icon: Users },
  { name: 'Vehicles', icon: Truck },
  { name: 'Routes', icon: BarChart3 },
  { name: 'Fairness Analytics', icon: BarChart3 },
];

import RoleSelector from './RoleSelector';
import HubSelector from './HubSelector';
import { useProvider } from '@/lib/providerContext';
import { LogOut } from 'lucide-react';

export default function TopBar({ activeTab, setActiveTab }) {
  const { logout, providerData } = useProvider();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastUpdate, setLastUpdate] = useState(new Date());

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
    <header className="fixed top-0 right-0 left-0 z-10" style={{
      background: '#0F2A47',
      borderBottom: '1px solid rgba(226, 169, 75, 0.2)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
    }}>
      {/* Top section with logo and status */}
      <div className="px-6 flex items-center justify-between" style={{ 
        height: '80px',
        borderBottom: '1px solid rgba(255,255,255,0.1)' 
      }}>
        {/* Left side - Logo and Brand */}
        <div className="flex items-center">
          <img 
            src="https://i.ibb.co/pBj9bMp4/logo-removebg-preview.png"
            alt="D-FARE Logo"
            style={{
              height: '98px',
              width: 'auto',
              objectFit: 'contain',
              opacity: 1,
              filter: 'drop-shadow(0 6px 16px rgba(255,255,255,0.4)) drop-shadow(0 2px 8px rgba(226, 169, 75, 0.6)) brightness(1.15) contrast(1.1)'
            }}
          />
        </div>

        {/* Right side - Status indicators */}
        <div className="flex items-center gap-4">
          {/* Hub Selector */}
          <HubSelector />
          
          {/* Role Selector */}
          <RoleSelector />
          
          {/* Live Status */}
          <div className="flex items-center gap-2">
            <Badge variant="operational" dot>
              Live
            </Badge>
          </div>

          {/* Last Update Time */}
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4" style={{ color: '#E2A94B' }} />
            <div className="flex flex-col">
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Last update</span>
              <span className="font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {formatTime(lastUpdate.toISOString())}
              </span>
            </div>
          </div>

          {/* Current Time */}
          <div className="pl-4" style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="text-sm font-medium" style={{ color: 'white' }}>
              {currentTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {currentTime.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="p-2 rounded-lg transition-colors"
            style={{ color: '#E2A94B' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(226, 169, 75, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation bar */}
      <nav className="h-14 px-6 flex items-center gap-2" style={{ background: 'rgba(5, 15, 35, 0.5)' }}>
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;
          
          return (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: isActive ? '#E2A94B' : 'transparent',
                color: isActive ? '#0F2A47' : 'rgba(255,255,255,0.7)',
                boxShadow: isActive ? '0 2px 8px rgba(226, 169, 75, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(226, 169, 75, 0.1)';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
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
