import clsx from 'clsx';
export function cn(...inputs) {
  return clsx(inputs);
}
export function formatTime(isoString) {
  if (!isoString) return '-';
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
export function formatDateTime(isoString) {
  if (!isoString) return '-';
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
export function formatRelativeTime(isoString) {
  if (!isoString) return '-';
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
export function getStatusColor(status) {
  const colors = {
    online: 'text-white border-current',
    busy: 'text-white border-current',
    offline: 'text-white border-current',
    pending: 'text-white border-current',
    in_progress: 'text-white border-current',
    completed: 'text-white border-current',
    operational: 'text-white border-current',
    warning: 'text-white border-current',
    critical: 'text-white border-current',
  };
  const bgColors = {
    online: 'rgba(37, 99, 235, 0.2)',
    busy: 'rgba(37, 99, 235, 0.15)',
    offline: 'rgba(255, 255, 255, 0.1)',
    pending: 'rgba(255, 255, 255, 0.1)',
    in_progress: 'rgba(37, 99, 235, 0.2)',
    completed: 'rgba(37, 99, 235, 0.2)',
    operational: 'rgba(37, 99, 235, 0.2)',
    warning: 'rgba(245, 158, 11, 0.2)',
    critical: 'rgba(239, 68, 68, 0.2)',
  };
  return colors[status] || 'text-white border-current';
}
export function getPriorityColor(priority) {
  const colors = {
    urgent: 'text-danger-600',
    high: 'text-warning-600',
    normal: 'text-slate-600',
    low: 'text-slate-400',
  };
  return colors[priority] || 'text-slate-600';
}
export function getWorkloadColor(score) {
  if (score >= 8) return 'text-danger-600';
  if (score >= 6) return 'text-warning-600';
  return 'text-success-600';
}
export function calculateFairnessScore(workloads) {
  if (!workloads || workloads.length === 0) return 0;
  const values = workloads.map(w => w.workload);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  const fairnessScore = Math.max(0, 100 - (stdDev * 10));
  return Math.round(fairnessScore);
}
export function truncate(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
export function capitalize(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}
export function formatStatus(status) {
  return capitalize(status.replace(/_/g, ' '));
}