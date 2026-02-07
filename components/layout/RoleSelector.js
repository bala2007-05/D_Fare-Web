'use client';
import { useEffect, useRef, useState } from 'react';
import { User, ChevronDown } from 'lucide-react';
export default function RoleSelector({ onNavigate }) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const wrapRef = useRef(null);
  useEffect(() => {
    function onDocMouseDown(e) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, []);
  const iconColor = hover || open ? '#1F4FD8' : '#64748b';
  const borderColor = hover || open ? '#DBEAFE' : '#e2e8f0';
  const bg = hover || open ? '#EFF6FF' : 'transparent';
  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors border"
        style={{ background: bg, borderColor }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <User className="w-4 h-4" style={{ color: iconColor }} />
        <div className="text-left leading-tight">
          <div className="text-xs" style={{ color: '#64748b' }}>Profile</div>
          <div className="text-sm font-semibold" style={{ color: '#0F172A' }}>Account</div>
        </div>
        <ChevronDown className="w-4 h-4 transition-transform" style={{ color: iconColor, transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-56 rounded-lg border bg-white shadow-lg overflow-hidden z-50"
          style={{ borderColor: '#e2e8f0' }}
          role="menu"
        >
          {[
            { label: 'Profile', tab: 'Profile' },
            { label: 'Subscription', tab: 'Subscription' },
            { label: 'Settings', tab: 'Settings' },
          ].map((item) => (
            <button
              key={item.tab}
              type="button"
              className="w-full text-left px-4 py-3 text-sm transition-colors"
              style={{ color: '#0f172a', background: 'transparent' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              onClick={() => {
                setOpen(false);
                if (typeof onNavigate === 'function') onNavigate(item.tab);
              }}
              role="menuitem"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}