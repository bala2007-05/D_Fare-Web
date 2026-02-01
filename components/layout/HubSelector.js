'use client';

import { MapPin, ChevronDown } from 'lucide-react';
import { useProvider } from '@/lib/providerContext';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function HubSelector() {
  const { providerData, selectedHub, switchHub } = useProvider();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentHub = providerData?.hubs?.find(h => h.id === selectedHub);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!providerData?.hubs || providerData.hubs.length === 0) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
        style={{
          background: 'rgba(226, 169, 75, 0.1)',
          border: '1px solid rgba(226, 169, 75, 0.3)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(226, 169, 75, 0.2)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(226, 169, 75, 0.1)'}
      >
        <MapPin className="w-4 h-4" style={{ color: '#E2A94B' }} />
        <div className="text-left">
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Current Hub</div>
          <div className="text-sm font-medium" style={{ color: 'white' }}>
            {currentHub?.name || 'Select Hub'}
          </div>
        </div>
        <ChevronDown className={cn(
          'w-4 h-4 transition-transform',
          isOpen && 'rotate-180'
        )} style={{ color: '#E2A94B' }} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 rounded-lg shadow-lg py-2 z-50" style={{
          background: '#0F2A47',
          border: '1px solid rgba(226, 169, 75, 0.3)'
        }}>
          <div className="px-3 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <p className="text-xs font-semibold uppercase" style={{ color: '#E2A94B' }}>Switch Hub</p>
          </div>
          {providerData.hubs.map((hub) => (
            <button
              key={hub.id}
              onClick={() => {
                switchHub(hub.id);
                setIsOpen(false);
              }}
              className="w-full px-3 py-3 text-left transition-colors"
              style={{
                background: selectedHub === hub.id ? 'rgba(226, 169, 75, 0.1)' : 'transparent'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(226, 169, 75, 0.15)'}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = selectedHub === hub.id ? 'rgba(226, 169, 75, 0.1)' : 'transparent';
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm font-semibold" style={{
                    color: selectedHub === hub.id ? '#E2A94B' : 'white'
                  }}>
                    {hub.name}
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    ID: {hub.id}
                  </div>
                  {hub.serviceAreas && (
                    <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {hub.serviceAreas.join(', ')}
                    </div>
                  )}
                </div>
                {selectedHub === hub.id && (
                  <span className="text-xs font-semibold" style={{ color: '#E2A94B' }}>Active</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
