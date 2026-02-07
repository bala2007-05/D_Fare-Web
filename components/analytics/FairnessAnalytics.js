'use client';
import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import Card, { CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { fairnessData } from '@/lib/mockData';
import { calculateFairnessScore } from '@/lib/utils';
import { DRIVERS } from '@/components/drivers/driverMonitoringData';
import { computeOrderEffort } from '@/components/drivers/fairassignment';
const HUB_LAT = 11.0168;
const HUB_LNG = 76.9558;
const EFFORT_OPTIONS = { hubLat: HUB_LAT, hubLng: HUB_LNG };
function useWorkloadFromOrders(orders = [], drivers = []) {
  return useMemo(() => {
    const driverSource = drivers.length > 0 ? drivers : DRIVERS;
    const list = driverSource.map((d) => ({
      driverId: d.driverId ?? d.id,
      driverName: d.name ?? d.driverId ?? d.id ?? 'Unknown',
      workload: 0,
      tasks: 0,
    }));
    const byDriverId = new Map(list.map((x) => [x.driverId, x]));
    for (const order of orders) {
      const driverId = order.assignedDriver ?? order.assigned_driver ?? null;
      if (!driverId) continue;
      let row = byDriverId.get(driverId);
      if (!row) {
        row = { driverId, driverName: driverId, workload: 0, tasks: 0 };
        byDriverId.set(driverId, row);
        list.push(row);
      }
      const effort = computeOrderEffort(order, EFFORT_OPTIONS);
      row.workload += effort;
      row.tasks += 1;
    }
    return list.sort((a, b) => (b.tasks !== a.tasks ? b.tasks - a.tasks : b.workload - a.workload));
  }, [orders, drivers]);
}
export default function FairnessAnalytics({ orders = [], drivers = [] }) {
  const workloadDistribution = useWorkloadFromOrders(orders, drivers);
  const hasData = workloadDistribution.length > 0 && workloadDistribution.some((d) => d.tasks > 0);
  const fallback = fairnessData.workloadDistribution;
  const distribution = hasData ? workloadDistribution : fallback;
  const currentFairnessScore = calculateFairnessScore(distribution);
  const workloads = distribution.map((d) => d.workload);
  const minWorkload = workloads.length ? Math.min(...workloads) : 0;
  const maxWorkload = workloads.length ? Math.max(...workloads) : 0;
  const avgWorkload =
    workloads.length ? workloads.reduce((a, b) => a + b, 0) / workloads.length : 0;
  const workloadDistributionOption = {
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: {
        color: '#334155',
        fontSize: 12,
      },
      formatter: (params) => {
        const data = params[0];
        const row = distribution[data.dataIndex];
        if (!row) return '';
        return `
          <div style="padding: 4px 8px;">
            <div style="font-weight: 600; margin-bottom: 4px;">${row.driverName}</div>
            <div style="color: #64748b;">Effort Score (from packages): <strong>${Number(data.value).toFixed(1)}</strong></div>
            <div style="color: #64748b;">Tasks: <strong>${row.tasks}</strong></div>
          </div>
        `;
      },
    },
    xAxis: {
      type: 'category',
      data: distribution.map((d) => d.driverName.split(' ')[0]),
      axisLabel: {
        color: '#64748b',
        fontSize: 11,
        rotate: 45,
      },
      axisLine: {
        lineStyle: {
          color: '#e2e8f0',
        },
      },
    },
    yAxis: {
      type: 'value',
      name: 'Effort Score',
      nameTextStyle: {
        color: '#64748b',
        fontSize: 11,
      },
      axisLabel: {
        color: '#64748b',
        fontSize: 11,
      },
      splitLine: {
        lineStyle: {
          color: '#f1f5f9',
        },
      },
    },
    series: [
      {
        data: distribution.map((d) => ({
          value: Math.round(d.workload * 10) / 10,
          itemStyle: {
            color: d.workload >= 8 ? '#ef4444' : d.workload >= 6 ? '#f59e0b' : '#22c55e',
          },
        })),
        type: 'bar',
        barWidth: '50%',
        label: {
          show: true,
          position: 'top',
          color: '#64748b',
          fontSize: 10,
          formatter: '{c}',
        },
      },
    ],
  };
  const fairnessTrendOption = {
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: {
        color: '#334155',
        fontSize: 12,
      },
      formatter: (params) => {
        const data = params[0];
        return `
          <div style="padding: 4px 8px;">
            <div style="font-weight: 600; margin-bottom: 4px;">Time: ${data.name}</div>
            <div style="color: #64748b;">Fairness Score: <strong>${data.value}%</strong></div>
          </div>
        `;
      },
    },
    xAxis: {
      type: 'category',
      data: fairnessData.fairnessTrend.map(d => d.time),
      boundaryGap: false,
      axisLabel: {
        color: '#64748b',
        fontSize: 11,
      },
      axisLine: {
        lineStyle: {
          color: '#e2e8f0',
        },
      },
    },
    yAxis: {
      type: 'value',
      name: 'Fairness %',
      min: 80,
      max: 100,
      nameTextStyle: {
        color: '#64748b',
        fontSize: 11,
      },
      axisLabel: {
        color: '#64748b',
        fontSize: 11,
        formatter: '{value}%',
      },
      splitLine: {
        lineStyle: {
          color: '#f1f5f9',
        },
      },
    },
    series: [
      {
        data: fairnessData.fairnessTrend.map(d => d.fairnessScore),
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          color: '#0ea5e9',
          width: 2,
        },
        itemStyle: {
          color: '#0ea5e9',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(14, 165, 233, 0.2)',
              },
              {
                offset: 1,
                color: 'rgba(14, 165, 233, 0.02)',
              },
            ],
          },
        },
      },
    ],
  };
  const driverEffortOption = {
    grid: {
      left: '15%',
      right: '10%',
      bottom: '3%',
      top: '3%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: {
        color: '#334155',
        fontSize: 12,
      },
    },
    xAxis: {
      type: 'value',
      name: 'Tasks (orders assigned)',
      nameTextStyle: {
        color: '#64748b',
        fontSize: 11,
      },
      axisLabel: {
        color: '#64748b',
        fontSize: 11,
      },
      splitLine: {
        lineStyle: {
          color: '#f1f5f9',
        },
      },
    },
    yAxis: {
      type: 'category',
      data: distribution.map((d) => d.driverName.split(' ')[0]),
      axisLabel: {
        color: '#64748b',
        fontSize: 11,
      },
      axisLine: {
        lineStyle: {
          color: '#e2e8f0',
        },
      },
    },
    series: [
      {
        data: distribution.map((d) => d.tasks),
        type: 'bar',
        barWidth: '60%',
        itemStyle: {
          color: '#0ea5e9',
          borderRadius: [0, 4, 4, 0],
        },
        label: {
          show: true,
          position: 'right',
          color: '#64748b',
          fontSize: 10,
        },
      },
    ],
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Fairness Score Summary */}
      <Card className="lg:col-span-2">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-600 mb-1">
                Current Fairness Score
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-success-600">
                  {currentFairnessScore}%
                </span>
                <span className="text-sm text-slate-500">
                  Excellent distribution
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-600 mb-2">
                Workload variance is minimal across all active drivers
              </div>
              <div className="flex items-center justify-end gap-4 text-xs text-slate-500">
                <div>
                  <span className="font-medium text-slate-700">Min: </span>
                  {minWorkload.toFixed(1)}
                </div>
                <div>
                  <span className="font-medium text-slate-700">Avg: </span>
                  {avgWorkload.toFixed(1)}
                </div>
                <div>
                  <span className="font-medium text-slate-700">Max: </span>
                  {maxWorkload.toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Workload Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Workload Distribution</CardTitle>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Current workload scores across active drivers
          </p>
        </CardHeader>
        <CardContent>
          <ReactECharts 
            option={workloadDistributionOption} 
            style={{ height: '320px' }}
            opts={{ renderer: 'svg' }}
          />
        </CardContent>
      </Card>
      {/* Fairness Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Fairness Trend (Today)</CardTitle>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
            System fairness score over time
          </p>
        </CardHeader>
        <CardContent>
          <ReactECharts 
            option={fairnessTrendOption} 
            style={{ height: '320px' }}
            opts={{ renderer: 'svg' }}
          />
        </CardContent>
      </Card>
      {/* Driver Effort Comparison */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Driver Effort Comparison</CardTitle>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Number of orders assigned to each driver
          </p>
        </CardHeader>
        <CardContent>
          <ReactECharts 
            option={driverEffortOption} 
            style={{ height: '380px' }}
            opts={{ renderer: 'svg' }}
          />
        </CardContent>
      </Card>
    </div>
  );
}