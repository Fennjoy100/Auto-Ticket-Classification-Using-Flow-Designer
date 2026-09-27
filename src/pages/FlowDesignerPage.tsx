import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  GitBranch,
  Info,
  Layers,
  Play,
  RotateCcw,
  Settings,
  Sparkles,
  Zap,
} from 'lucide-react';
import { FlowCanvas } from '../components/flow/FlowCanvas';
import { FlowTestModal } from '../components/flow/FlowTestModal';
import { useApp } from '../context/AppContext';

export const FlowDesignerPage: React.FC = () => {
  const { flowNodes, rules, settings } = useApp();
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  const activeNodesCount = flowNodes.filter((n) => n.isEnabled).length;
  const activeRulesCount = rules.filter((r) => r.isEnabled).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Visual Flow Designer
            </h1>
            <span className="text-[10px] font-mono uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">
              Pipeline Active
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automated ticket routing orchestrator: triggers, NLP taxonomy classifier, priority rules, and threshold branch conditions
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsTestModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Test Flow Pipeline</span>
          </button>
        </div>
      </div>

      {/* Flow Summary Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-400 text-[10px] uppercase font-mono block">
            Configured Nodes
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
              {activeNodesCount}
            </span>
            <span className="text-slate-400 text-[11px]">/ {flowNodes.length} active</span>
          </div>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-400 text-[10px] uppercase font-mono block">
            Classification Rules
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
              {activeRulesCount}
            </span>
            <span className="text-slate-400 text-[11px]">rules attached</span>
          </div>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-400 text-[10px] uppercase font-mono block">
            Confidence Gate
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {settings.confidenceThreshold}%
            </span>
            <span className="text-slate-400 text-[11px]">threshold</span>
          </div>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-400 text-[10px] uppercase font-mono block">
            Fallback Queue
          </span>
          <div className="mt-1 font-semibold text-slate-900 dark:text-white truncate">
            {settings.defaultAssignmentGroup}
          </div>
        </div>
      </div>

      {/* Interactive Flow Canvas */}
      <FlowCanvas />

      {/* Information Helper */}
      <div className="p-4 bg-slate-100/70 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-3">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-slate-900 dark:text-white">
            How Flow Designer Executes
          </span>
          <p className="leading-relaxed">
            Every submitted ticket initiates at &quot;Ticket Created&quot; and flows linearly through text analysis, category rule matching, severity priority detection, and team assignment resolution. At the &quot;Confidence &ge; 70%&quot; condition gate, tickets with high confidence are automatically assigned to resolver teams, while ambiguous tickets branch to the Service Desk manual triage queue. Click any node to inspect parameters, or click &quot;Test Flow Pipeline&quot; to simulate execution.
          </p>
        </div>
      </div>

      {/* Global Runner Modal */}
      <FlowTestModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
      />
    </div>
  );
};
