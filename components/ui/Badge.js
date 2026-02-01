import { cn, getStatusColor } from '@/lib/utils';

export default function Badge({ children, variant = 'default', className, dot = false }) {
  const baseStyles = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors';
  
  const getVariantStyles = () => {
    if (variant === 'default') return { color: 'white', background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' };
    
    const bgMap = {
      online: 'rgba(226, 169, 75, 0.25)',
      busy: 'rgba(226, 169, 75, 0.15)',
      offline: 'rgba(255, 255, 255, 0.1)',
      pending: 'rgba(255, 255, 255, 0.1)',
      in_progress: 'rgba(226, 169, 75, 0.2)',
      completed: 'rgba(226, 169, 75, 0.25)',
      operational: 'rgba(226, 169, 75, 0.25)',
      warning: 'rgba(226, 169, 75, 0.15)',
      critical: 'rgba(255, 100, 100, 0.2)',
    };
    
    return {
      color: 'white',
      background: bgMap[variant] || 'rgba(255,255,255,0.1)',
      borderColor: 'rgba(226, 169, 75, 0.3)'
    };
  };

  const styles = getVariantStyles();

  return (
    <span className={cn(baseStyles, className)} style={styles}>
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full animate-pulse-soft" style={{ background: '#E2A94B' }} />
      )}
      {children}
    </span>
  );
}
