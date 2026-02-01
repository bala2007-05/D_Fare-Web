export default function Footer() {
  return (
    <footer className="mt-auto" style={{
      background: 'transparent',
      borderTop: '1px solid rgba(226, 169, 75, 0.2)'
    }}>
      <div className="max-w-[1800px] mx-auto px-6 py-6">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          {/* Product Info */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold" style={{ color: '#0F2A47' }}>D-FARE Management Dashboard</span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
            <span style={{ color: '#0F2A47' }}>v2.0.0 Enterprise Edition</span>
          </div>
          
          {/* Description */}
          <p className="text-xs" style={{ color: '#0F2A47' }}>
            AI-powered fair dispatch system with role-based access control
          </p>
          
          {/* Copyright & Links */}
          <div className="flex items-center gap-4 text-xs mt-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <span>© 2026 D-FARE Systems</span>
            <span>•</span>
            <a href="#" className="transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}
               onMouseEnter={(e) => e.target.style.color = '#E2A94B'}
               onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.4)'}>Privacy</a>
            <span>•</span>
            <a href="#" className="transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}
               onMouseEnter={(e) => e.target.style.color = '#E2A94B'}
               onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.4)'}>Terms</a>
            <span>•</span>
            <a href="#" className="transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}
               onMouseEnter={(e) => e.target.style.color = '#E2A94B'}
               onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.4)'}>Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
