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
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
      >
        <MapPin className="w-4 h-4 text-slate-600" />
        <div className="text-left">
          <div className="text-xs text-slate-500">Current Hub</div>
          <div className="text-sm font-medium text-slate-900">
            {currentHub?.name || 'Select Hub'}
          </div>
        </div>
        <ChevronDown className={cn(
          'w-4 h-4 text-slate-400 transition-transform',
          isOpen && 'rotate-180'
        )} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
          <div className="px-3 py-2 border-b border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase">Switch Hub</p>
          </div>
          {providerData.hubs.map((hub) => (
            <button
              key={hub.id}
              onClick={() => {
                switchHub(hub.id);
                setIsOpen(false);
              }}
              className={cn(
                'w-full px-3 py-3 text-left hover:bg-slate-50 transition-colors',
                selectedHub === hub.id && 'bg-primary-50'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className={cn(
                    'text-sm font-semibold',
                    selectedHub === hub.id ? 'text-primary-700' : 'text-slate-900'
                  )}>
                    {hub.name}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    ID: {hub.id}
                  </div>
                  {hub.serviceAreas && (
                    <div className="text-xs text-slate-400 mt-1">
                      {hub.serviceAreas.join(', ')}
                    </div>
                  )}
                </div>
                {selectedHub === hub.id && (
                  <span className="text-xs text-primary-600 font-semibold">Active</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
