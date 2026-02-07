import { cn, getStatusColor } from '@/lib/utils';
export default function Badge({ children, variant = 'default', className, dot = false }) {
  const baseStyles = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors';
  const getVariantStyles = () => {
    if (variant === 'default') return { color: '#0F172A', background: '#EFF6FF', borderColor: '#DBEAFE' };
    const bgMap = {
      online: 'rgba(31, 79, 216, 0.15)',
      busy: 'rgba(31, 79, 216, 0.12)',
      offline: '#EFF6FF',
      pending: '#EFF6FF',
      in_progress: 'rgba(31, 79, 216, 0.15)',
      completed: 'rgba(31, 79, 216, 0.15)',
      operational: 'rgba(31, 79, 216, 0.15)',
      warning: 'rgba(245, 158, 11, 0.2)',
      critical: 'rgba(239, 68, 68, 0.2)',
    };
    return {
      color: '#0F172A',
      background: bgMap[variant] || '#EFF6FF',
      borderColor: '#DBEAFE'
    };
  };
  const styles = getVariantStyles();
  return (
    <span className={cn(baseStyles, className)} style={styles}>
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full animate-pulse-soft" style={{ background: '#1F4FD8' }} />
      )}
      {children}
    </span>
  );
}