'use client';
import { MapPin, ChevronDown } from 'lucide-react';
import { useProvider } from '@/lib/providerContext';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
export default function HubSelector() {
  const { providerData, selectedHub, switchHub } = useProvider();
  const [isOpen, setIsOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const dropdownRef = useRef(null);
  const currentHub = providerData?.hubs?.find(h => h.id === selectedHub);
  const iconColor = hover ? '#1F4FD8' : '#64748b';
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
          background: hover ? '#EFF6FF' : 'transparent',
          border: `1px solid ${hover ? '#DBEAFE' : '#e2e8f0'}`
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <MapPin className="w-4 h-4 transition-colors" style={{ color: iconColor }} />
        <div className="text-left">
          <div className="text-xs" style={{ color: '#64748b' }}>Current Hub</div>
          <div className="text-sm font-medium" style={{ color: '#0F172A' }}>
            {currentHub?.name || 'Select Hub'}
          </div>
        </div>
        <ChevronDown className={cn(
          'w-4 h-4 transition-transform',
          isOpen && 'rotate-180'
        )} style={{ color: iconColor }} />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 rounded-lg shadow-lg py-2 z-50 bg-white border border-[#e2e8f0]">
          <div className="px-3 py-2 border-b border-[#e2e8f0]">
            <p className="text-xs font-semibold uppercase" style={{ color: '#64748b' }}>Switch Hub</p>
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
                background: selectedHub === hub.id ? '#f8fafc' : 'transparent'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#EFF6FF'; }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = selectedHub === hub.id ? '#f8fafc' : 'transparent';
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm font-semibold" style={{ color: '#0F172A' }}>
                    {hub.name}
                  </div>
                  <div className="text-xs mt-1" style={{ color: '#64748b' }}>
                    ID: {hub.id}
                  </div>
                  {hub.serviceAreas && (
                    <div className="text-xs mt-1" style={{ color: '#64748b' }}>
                      {hub.serviceAreas.join(', ')}
                    </div>
                  )}
                </div>
                {selectedHub === hub.id && (
                  <span className="text-xs font-semibold" style={{ color: '#64748b' }}>Active</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}