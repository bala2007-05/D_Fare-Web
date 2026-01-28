import { cn, getStatusColor } from '@/lib/utils';

export default function Badge({ children, variant = 'default', className, dot = false }) {
  const baseStyles = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors';
  
  const variantStyles = variant === 'default' 
    ? 'bg-slate-100 text-slate-700 border-slate-200' 
    : getStatusColor(variant);

  return (
    <span className={cn(baseStyles, variantStyles, className)}>
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-soft" />
      )}
      {children}
    </span>
  );
}
