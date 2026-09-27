import React from 'react';
import { Power, Settings, ShieldCheck, Tag } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FlowNode } from '../../types';
import { Modal } from '../common/Modal';

interface NodeDetailModalProps {
  node: FlowNode | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({
  node,
  isOpen,
  onClose,
}) => {
  const { updateFlowNode } = useApp();

  if (!node) return null;

  const handleToggle = () => {
    updateFlowNode(node.id, { isEnabled: !node.isEnabled });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={node.title}
      subtitle={`Node ID: ${node.id} · Type: ${node.type.toUpperCase()}`}
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* Status & Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xs font-semibold text-slate-900 dark:text-white">
              Node Execution Status
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {node.isEnabled
                ? 'Active in live automation pipeline'
                : 'Disabled - bypassed during execution'}
            </div>
          </div>

          <button
            onClick={handleToggle}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              node.isEnabled
                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            {node.isEnabled ? 'Disable Step' : 'Enable Step'}
          </button>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
            Function Description
          </label>
          <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            {node.subtitle}. Evaluates payload inputs, runs domain classification heuristics, and passes state downstream.
          </p>
        </div>

        {/* Config Parameters */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Configured Parameters
            </h4>
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-200 dark:divide-slate-800">
            {Object.entries(node.config || {}).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between p-2.5 text-xs bg-white dark:bg-slate-900"
              >
                <span className="font-mono text-slate-500 dark:text-slate-400">{key}</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {typeof value === 'boolean'
                    ? value
                      ? 'true'
                      : 'false'
                    : String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Input / Output Schema Preview */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Input Schema
            </span>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block">
              payload: &#123; rawText, context &#125;
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Output Schema
            </span>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block">
              result: &#123; status, metadata &#125;
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </Modal>
  );
};
