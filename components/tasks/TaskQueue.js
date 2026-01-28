'use client';

import { useState, useMemo } from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import Card, { CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { tasks } from '@/lib/mockData';
import { formatDateTime, formatRelativeTime, formatStatus, getPriorityColor, cn } from '@/lib/utils';

const tabs = [
  { id: 'pending', label: 'Pending', state: 'pending' },
  { id: 'active', label: 'Active', state: 'in_progress' },
  { id: 'completed', label: 'Completed', state: 'completed' },
];

export default function TaskQueue() {
  const [activeTab, setActiveTab] = useState('active');

  const filteredTasks = useMemo(() => {
    const currentTab = tabs.find(t => t.id === activeTab);
    return tasks.filter(task => task.state === currentTab.state);
  }, [activeTab]);

  const getTabCount = (tabId) => {
    const tab = tabs.find(t => t.id === tabId);
    return tasks.filter(task => task.state === tab.state).length;
  };

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle>Task Queue Monitoring</CardTitle>
        
        {/* Tabs */}
        <div className="flex items-center gap-2 mt-4 border-b border-slate-200">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const count = getTabCount(tab.id);
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-4 py-2.5 text-sm font-medium border-b-2 transition-all',
                  isActive
                    ? 'border-primary-600 text-primary-700'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                )}
              >
                {tab.label}
                <span className={cn(
                  'ml-2 px-2 py-0.5 rounded-full text-xs font-semibold',
                  isActive 
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-slate-100 text-slate-600'
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {filteredTasks.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No tasks found"
            description={`There are no ${activeTab} tasks at the moment`}
          />
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full">
              <thead className="bg-slate-50 border-y border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Task ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Assigned Driver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Created
                  </th>
                  {activeTab === 'completed' && (
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Completed
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredTasks.map((task) => (
                  <tr 
                    key={task.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono font-medium text-slate-900">
                        {task.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-600 truncate max-w-[200px]">
                          {task.pickup}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="text-slate-900 font-medium truncate max-w-[200px]">
                          {task.dropoff}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        'text-sm font-medium capitalize',
                        getPriorityColor(task.priority)
                      )}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {task.assignedDriver || (
                        <span className="text-slate-400">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={task.state}>
                        {formatStatus(task.state)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs">
                        <div className="text-slate-900 font-medium">
                          {formatDateTime(task.createdTime)}
                        </div>
                        <div className="text-slate-500">
                          {formatRelativeTime(task.createdTime)}
                        </div>
                      </div>
                    </td>
                    {activeTab === 'completed' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-slate-600">
                          {formatDateTime(task.completionTime)}
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {task.estimatedDuration}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
