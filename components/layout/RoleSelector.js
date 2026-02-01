'use client';

import { User } from 'lucide-react';
import { useRole } from '@/lib/roleContext';

export default function RoleSelector() {
  const { roleLabel } = useRole();

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{
      background: 'rgba(226, 169, 75, 0.15)',
      border: '1px solid rgba(226, 169, 75, 0.3)'
    }}>
      <User className="w-4 h-4" style={{ color: '#E2A94B' }} />
      <div className="text-left">
        <div className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Viewing as</div>
        <div className="text-sm font-semibold" style={{ color: '#E2A94B' }}>{roleLabel}</div>
      </div>
    </div>
  );
}
