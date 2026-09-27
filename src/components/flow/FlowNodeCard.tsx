import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  Flag,
  GitFork,
  ScanText,
  Tag,
  Ticket,
  UserCheck,
  Users,
} from 'lucide-react';
import { FlowNode } from '../../types';

interface FlowNodeCardProps {
  node: FlowNode;
  isSelected?: boolean;
  isActiveStep?: boolean;
  executionStatus?: 'pending' | 'running' | 'success' | 'warning' | 'failed' | 'skipped';
  onClick?: () => void;
}

export const FlowNodeCard: React.FC<FlowNodeCardProps> = ({
  node,
  isSelected,
  isActiveStep,
  executionStatus,
  onClick,
}) => {
  const getIcon = () => {
    switch (node.icon) {
      case 'Ticket':
        return <Ticket className="w-4 h-4" />;
      case 'ScanText':
        return <ScanText className="w-4 h-4" />;
      case 'Tag':
        return <Tag className="w-4 h-4" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-4 h-4" />;
      case 'Users':
        return <Users className="w-4 h-4" />;
      case 'GitFork':
        return <GitFork className="w-4 h-4" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'UserCheck':
        return <UserCheck className="w-4 h-4" />;
      case 'Database':
        return <Database className="w-4 h-4" />;
      case 'Flag':
        return <Flag className="w-4 h-4" />;
      default:
        return <Ticket className="w-4 h-4" />;
    }
  };

  const typeColorMap = {
    trigger: {
      badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      icon: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
    },
    action: {
      badge: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      icon: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
    },
    condition: {
      badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      icon: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
    },
    end: {
      badge: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
      icon: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    },
  };

  const styleConfig = typeColorMap[node.type];

  return (
    <div
      onClick={onClick}
      className={`relative w-72 rounded-xl p-3.5 bg-white dark:bg-slate-900 border transition-all cursor-pointer text-left ${
        isSelected
          ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
      } ${
        isActiveStep ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-950 scale-[1.02]' : ''
      } ${!node.isEnabled ? 'opacity-60 grayscale-[40%]' : ''}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${styleConfig.icon}`}>
            {getIcon()}
          </div>
          <span
            className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${styleConfig.badge}`}
          >
            {node.type}
          </span>
        </div>

        {/* Execution status indicator if running */}
        {executionStatus && (
          <div className="flex items-center gap-1 text-[11px] font-mono">
            {executionStatus === 'running' && (
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            )}
            {executionStatus === 'success' && (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            )}
            {executionStatus === 'warning' && (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            )}
            {executionStatus === 'skipped' && (
              <span className="text-slate-400 text-[10px]">SKIPPED</span>
            )}
          </div>
        )}

        {!executionStatus && (
          <span
            className={`w-2 h-2 rounded-full ${
              node.isEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
            }`}
            title={node.isEnabled ? 'Active' : 'Disabled'}
          />
        )}
      </div>

      {/* Content */}
      <h4 className="text-xs font-semibold text-slate-900 dark:text-white leading-snug">
        {node.title}
      </h4>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
        {node.subtitle}
      </p>
    </div>
  );
};
