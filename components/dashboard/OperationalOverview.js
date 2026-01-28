'use client';

import { Users, ClipboardList, CheckCircle2, AlertCircle, Activity } from 'lucide-react';
import MetricCard from './MetricCard';
import { operationalMetrics } from '@/lib/mockData';

export default function OperationalOverview() {
  const metrics = [
    {
      title: 'Drivers Online',
      value: operationalMetrics.driversOnline,
      icon: Users,
      color: 'blue',
      trend: 'up',
      trendValue: '+3',
      subtitle: 'Currently active',
    },
    {
      title: 'Active Tasks',
      value: operationalMetrics.activeTasks,
      icon: Activity,
      color: 'yellow',
      trend: 'neutral',
      subtitle: 'In progress',
    },
    {
      title: 'Pending Tasks',
      value: operationalMetrics.pendingTasks,
      icon: ClipboardList,
      color: 'slate',
      trend: 'down',
      trendValue: '-2',
      subtitle: 'Awaiting assignment',
    },
    {
      title: 'Completed Today',
      value: operationalMetrics.completedTasks,
      icon: CheckCircle2,
      color: 'green',
      trend: 'up',
      trendValue: '+12',
      subtitle: `${operationalMetrics.successRate}% success rate`,
    },
    {
      title: 'System Health',
      value: operationalMetrics.systemHealth,
      icon: AlertCircle,
      color: 'green',
      subtitle: `Avg response: ${operationalMetrics.avgResponseTime}`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
}
