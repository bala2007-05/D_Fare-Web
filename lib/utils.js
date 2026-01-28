import clsx from 'clsx';

// Utility for merging CSS classes
export function cn(...inputs) {
  return clsx(inputs);
}

// Format date/time helpers
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

// Status badge color mapping
export function getStatusColor(status) {
  const colors = {
    online: 'bg-success-100 text-success-700 border-success-200',
    busy: 'bg-warning-100 text-warning-700 border-warning-200',
    offline: 'bg-slate-100 text-slate-600 border-slate-200',
    pending: 'bg-slate-100 text-slate-700 border-slate-200',
    in_progress: 'bg-primary-100 text-primary-700 border-primary-200',
    completed: 'bg-success-100 text-success-700 border-success-200',
    operational: 'bg-success-100 text-success-700 border-success-200',
    warning: 'bg-warning-100 text-warning-700 border-warning-200',
    critical: 'bg-danger-100 text-danger-700 border-danger-200',
  };
  return colors[status] || 'bg-slate-100 text-slate-600 border-slate-200';
}

// Priority color mapping
export function getPriorityColor(priority) {
  const colors = {
    urgent: 'text-danger-600',
    high: 'text-warning-600',
    normal: 'text-slate-600',
    low: 'text-slate-400',
  };
  return colors[priority] || 'text-slate-600';
}

// Format workload score with color
export function getWorkloadColor(score) {
  if (score >= 8) return 'text-danger-600';
  if (score >= 6) return 'text-warning-600';
  return 'text-success-600';
}

// Calculate fairness score based on workload distribution
export function calculateFairnessScore(workloads) {
  if (!workloads || workloads.length === 0) return 0;
  
  const values = workloads.map(w => w.workload);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  // Lower standard deviation = higher fairness
  // Map to 0-100 scale (inverse relationship)
  const fairnessScore = Math.max(0, 100 - (stdDev * 10));
  return Math.round(fairnessScore);
}

// Truncate text with ellipsis
export function truncate(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Capitalize first letter
export function capitalize(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Format status text
export function formatStatus(status) {
  return capitalize(status.replace(/_/g, ' '));
}
