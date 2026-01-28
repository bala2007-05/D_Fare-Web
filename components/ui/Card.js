import { cn } from '@/lib/utils';

export default function Card({ children, className, hover = false }) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-slate-200 shadow-card transition-all',
        hover && 'hover:shadow-card-hover hover:border-slate-300',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return (
    <div className={cn('px-6 py-4 border-b border-slate-200', className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }) {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }) {
  return (
    <h3 className={cn('text-base font-semibold text-slate-900', className)}>
      {children}
    </h3>
  );
}
