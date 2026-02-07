import { cn } from '@/lib/utils';
export default function Card({ children, className, hover = false }) {
  return (
    <div
      className={cn(
        'rounded-xl transition-all duration-200',
        className
      )}
      style={{
        background: '#ffffff',
        border: '1px solid #DBEAFE',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
      }}
    >
      {children}
    </div>
  );
}
export function CardHeader({ children, className }) {
  return (
    <div className={cn('px-6 py-5', className)} style={{
      borderBottom: '1px solid #DBEAFE',
      background: '#EFF6FF'
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
      color: '#0F172A',
      fontWeight: 600
    }}>
      {children}
    </h3>
  );
}