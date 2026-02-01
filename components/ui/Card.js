import { cn } from '@/lib/utils';

export default function Card({ children, className, hover = false }) {
  return (
    <div
      className={cn(
        'rounded-xl transition-all duration-200',
        className
      )}
      style={{
        background: '#0F2A47',
        border: '1px solid rgba(226, 169, 75, 0.2)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
      }}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return (
    <div className={cn('px-6 py-5', className)} style={{
      borderBottom: '1px solid rgba(226, 169, 75, 0.2)',
      background: 'rgba(226, 169, 75, 0.05)'
    }}>
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
    <h3 className={cn('text-base tracking-tight', className)} style={{ 
      color: '#E2A94B',
      fontWeight: 600
    }}>
      {children}
    </h3>
  );
}
