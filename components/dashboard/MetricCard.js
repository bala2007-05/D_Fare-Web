import Card, { CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
export default function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue,
  color = 'blue',
  subtitle 
}) {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-3.5 h-3.5" />;
    if (trend === 'down') return <TrendingDown className="w-3.5 h-3.5" />;
    return <Minus className="w-3.5 h-3.5" />;
  };
  return (
    <Card className="animate-fade-in hover:shadow-card-hover transition-shadow duration-200">
      <CardContent className="py-6 px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold mb-2 uppercase tracking-wide" style={{ color: '#1F4FD8' }}>{title}</p>
            <div className="flex items-baseline gap-2 mb-2">
              <h3 className="text-3xl font-bold tabular-nums" style={{ color: '#0f172a' }}>{value}</h3>
              {trendValue && (
                <div className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: '#1F4FD8' }}>
                  {getTrendIcon()}
                  <span>{trendValue}</span>
                </div>
              )}
            </div>
            {subtitle && (
              <p className="text-xs font-medium" style={{ color: '#64748b' }}>{subtitle}</p>
            )}
          </div>
          {Icon && (
            <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{
              background: '#EFF6FF',
              color: '#1F4FD8'
            }}>
              <Icon className="w-7 h-7" strokeWidth={2} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}