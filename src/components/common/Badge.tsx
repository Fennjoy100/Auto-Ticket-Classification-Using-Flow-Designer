import React from 'react';
import { Priority, TicketStatus } from '../../types';

interface PriorityBadgeProps {
  priority: Priority;
  showIcon?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  switch (priority) {
    case 'Critical':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
          Critical
        </span>
      );
    case 'High':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-900/60 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          High
        </span>
      );
    case 'Medium':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Medium
        </span>
      );
    case 'Low':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Low
        </span>
      );
  }
};

interface StatusBadgeProps {
  status: TicketStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'New':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/60 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          New
        </span>
      );
    case 'In Progress':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/60 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          In Progress
        </span>
      );
    case 'Pending':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          Pending
        </span>
      );
    case 'Resolved':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Resolved
        </span>
      );
    case 'Closed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Closed
        </span>
      );
  }
};

interface ConfidenceMeterProps {
  score: number;
  size?: 'sm' | 'md';
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ score, size = 'md' }) => {
  let color = 'text-emerald-600 dark:text-emerald-400';
  let barColor = 'bg-emerald-500';
  let label = 'Strong';

  if (score < 50) {
    color = 'text-rose-600 dark:text-rose-400';
    barColor = 'bg-rose-500';
    label = 'Low';
  } else if (score < 70) {
    color = 'text-amber-600 dark:text-amber-400';
    barColor = 'bg-amber-500';
    label = 'Moderate';
  } else if (score < 90) {
    color = 'text-blue-600 dark:text-blue-400';
    barColor = 'bg-blue-500';
    label = 'Good';
  }

  if (size === 'sm') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className={`h-full ${barColor}`} style={{ width: `${score}%` }} />
        </div>
        <span className={`text-xs font-mono font-medium ${color}`}>{score}%</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${barColor}`} style={{ width: `${score}%` }} />
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className={`text-sm font-semibold font-mono ${color}`}>{score}%</span>
        <span className="text-[11px] text-slate-400 capitalize">({label})</span>
      </div>
    </div>
  );
};
