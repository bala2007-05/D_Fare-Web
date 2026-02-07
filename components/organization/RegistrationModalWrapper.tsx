'use client';
import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import OrganizationWizard from './OrganizationWizard';
interface RegistrationModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
}
export default function RegistrationModalWrapper({ isOpen, onClose }: RegistrationModalWrapperProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );
  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0, 0, 0, 0.3)', minHeight: '100vh' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-h-[90vh] overflow-hidden rounded-lg bg-white flex flex-col"
        style={{
          width: '100%',
          maxWidth: '720px',
          border: '1px solid #DBEAFE',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[#EFF6FF]"
          style={{ color: '#64748b' }}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="registration-flow flex-1 min-h-0 overflow-y-auto p-6 pt-12">
          <OrganizationWizard onComplete={onClose} />
        </div>
      </div>
    </div>
  );
}