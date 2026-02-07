export default function Footer() {
  return (
    <footer className="mt-auto" style={{
      background: 'transparent',
      borderTop: '1px solid #DBEAFE'
    }}>
      <div className="max-w-[1800px] mx-auto px-6 py-6">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          {/* Product Info */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold" style={{ color: '#0f172a' }}>D-FARE Management Dashboard</span>
            <span style={{ color: '#94a3b8' }}>•</span>
            <span style={{ color: '#0f172a' }}>v2.0.0 Enterprise Edition</span>
          </div>
          {/* Description */}
          <p className="text-xs" style={{ color: '#475569' }}>
            AI-powered fair dispatch system with role-based access control
          </p>
          {/* Copyright & Links */}
          <div className="flex items-center gap-4 text-xs mt-2" style={{ color: '#64748b' }}>
            <span>© 2026 D-FARE Systems</span>
            <span>•</span>
            <a href="#" className="transition-colors hover:underline" style={{ color: '#64748b' }}
               onMouseEnter={(e) => e.target.style.color = '#1F4FD8'}
               onMouseLeave={(e) => e.target.style.color = '#64748b'}>Privacy</a>
            <span>•</span>
            <a href="#" className="transition-colors hover:underline" style={{ color: '#64748b' }}
               onMouseEnter={(e) => e.target.style.color = '#1F4FD8'}
               onMouseLeave={(e) => e.target.style.color = '#64748b'}>Terms</a>
            <span>•</span>
            <a href="#" className="transition-colors hover:underline" style={{ color: '#64748b' }}
               onMouseEnter={(e) => e.target.style.color = '#1F4FD8'}
               onMouseLeave={(e) => e.target.style.color = '#64748b'}>Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}