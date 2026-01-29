'use client';

import { User, ChevronDown } from 'lucide-react';
import { useRole, ROLES, ROLE_LABELS } from '@/lib/roleContext';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function RoleSelector() {
  const { currentRole, setCurrentRole, roleLabel } = useRole();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles = [
    { value: ROLES.ADMIN, label: ROLE_LABELS[ROLES.ADMIN], color: 'text-danger-600' },
    { value: ROLES.DISPATCHER, label: ROLE_LABELS[ROLES.DISPATCHER], color: 'text-primary-600' },
    { value: ROLES.MONITOR, label: ROLE_LABELS[ROLES.MONITOR], color: 'text-slate-600' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
      >
        <User className="w-4 h-4 text-slate-600" />
        <div className="text-left">
          <div className="text-xs text-slate-500">Viewing as</div>
          <div className="text-sm font-medium text-slate-900">{roleLabel}</div>
        </div>
        <ChevronDown className={cn(
          'w-4 h-4 text-slate-400 transition-transform',
          isOpen && 'rotate-180'
        )} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
          <div className="px-3 py-2 border-b border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase">Switch Role</p>
            <p className="text-xs text-slate-400 mt-1">Demo mode - no authentication required</p>
          </div>
          {roles.map((role) => (
            <button
              key={role.value}
              onClick={() => {
                setCurrentRole(role.value);
                setIsOpen(false);
              }}
              className={cn(
                'w-full px-3 py-2 text-left hover:bg-slate-50 transition-colors flex items-center justify-between',
                currentRole === role.value && 'bg-primary-50'
              )}
            >
              <span className={cn(
                'text-sm font-medium',
                currentRole === role.value ? 'text-primary-700' : 'text-slate-700'
              )}>
                {role.label}
              </span>
              {currentRole === role.value && (
                <span className="text-xs text-primary-600 font-semibold">Current</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
