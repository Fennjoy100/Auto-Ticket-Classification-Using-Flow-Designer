import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  Sparkles,
  Ticket as TicketIcon,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ClassificationResult, FlowExecutionStep, Ticket } from '../../types';
import { Modal } from '../common/Modal';
import { PriorityBadge } from '../common/Badge';

interface FlowTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlowTestModal: React.FC<FlowTestModalProps> = ({ isOpen, onClose }) => {
  const { tickets, classifyDraft, rules, settings } = useApp();

  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || '');
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Execution simulation state
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [executedSteps, setExecutedSteps] = useState<FlowExecutionStep[]>([]);
  const [testResult, setTestResult] = useState<ClassificationResult | null>(null);

  const handleStartSimulation = async () => {
    let titleToTest = '';
    let descToTest = '';

    if (isCustomMode) {
      if (!customTitle.trim()) {
        return;
      }
      titleToTest = customTitle;
      descToTest = customDescription;
    } else {
      const ticket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];
      if (!ticket) return;
      titleToTest = ticket.title;
      descToTest = ticket.description;
    }

    setIsRunning(true);
    setTestResult(null);
    setExecutedSteps([]);
    setCurrentStepIndex(-1);

    // Compute classification result
    const result = classifyDraft(titleToTest, descToTest);

    // Step-by-step delay simulation
    for (let i = 0; i < result.flowSteps.length; i++) {
      setCurrentStepIndex(i);
      setExecutedSteps((prev) => [...prev, result.flowSteps[i]]);
      await new Promise((resolve) => setTimeout(resolve, 280));
    }

    setTestResult(result);
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStepIndex(-1);
    setExecutedSteps([]);
    setTestResult(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isRunning ? () => {} : onClose}
      title="Test Classification Flow Engine"
      subtitle="Run an incident simulation through the automated Flow Designer pipeline"
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Input Selection Header */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              1. Select Test Source
            </span>
            <div className="flex items-center gap-1 p-0.5 bg-slate-200 dark:bg-slate-700 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setIsCustomMode(false);
                  handleReset();
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  !isCustomMode
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Sample Ticket
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCustomMode(true);
                  handleReset();
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  isCustomMode
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Custom Text
              </button>
            </div>
          </div>

          {!isCustomMode ? (
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                Choose Existing Incident
              </label>
              <select
                value={selectedTicketId}
                onChange={(e) => {
                  setSelectedTicketId(e.target.value);
                  handleReset();
                }}
                disabled={isRunning}
                className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {tickets.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.id}: {t.title} ({t.category} - {t.priority})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                  Incident Title / Subject
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Wi-Fi router on 2nd floor disconnected and internet is down"
                  disabled={isRunning}
                  className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                  Detailed Description
                </label>
                <textarea
                  rows={2}
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="e.g. Several engineers cannot access cloud repos and the office VPN drops continuously..."
                  disabled={isRunning}
                  className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          )}

          {/* Action Trigger */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-[11px] text-slate-400">
              Active rules: {rules.filter((r) => r.isEnabled).length} · Confidence threshold:{' '}
              {settings.confidenceThreshold}%
            </div>
            <div className="flex items-center gap-2">
              {testResult && (
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isRunning}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}
              <button
                type="button"
                onClick={handleStartSimulation}
                disabled={isRunning || (isCustomMode && !customTitle.trim())}
                className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors"
              >
                <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
                {isRunning ? 'Running Pipeline...' : 'Test Flow'}
              </button>
            </div>
          </div>
        </div>

        {/* Step by Step Execution Feed */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              2. Flow Step Execution Logs
            </h4>
            {executedSteps.length > 0 && (
              <span className="text-xs font-mono text-slate-400">
                {executedSteps.length} steps executed
              </span>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4 space-y-2 max-h-64 overflow-y-auto font-mono text-xs">
            {executedSteps.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs font-sans">
                Click &quot;Test Flow&quot; to execute each automation node in real-time.
              </div>
            ) : (
              executedSteps.map((step, idx) => (
                <div
                  key={step.stepId}
                  className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all ${
                    idx === currentStepIndex && isRunning
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 ring-1 ring-indigo-500'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/60'
                  }`}
                >
                  <div className="shrink-0 pt-0.5">
                    {step.status === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {step.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        +{step.durationMs}ms
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      Input: {step.input}
                    </div>
                    <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium truncate mt-0.5">
                      Output: {step.output}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Final Result Card */}
        {testResult && (
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Flow Executed Successfully
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Execution Time: {testResult.executionTimeMs}ms</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-slate-400 text-[10px] uppercase font-mono block">
                  Category
                </span>
                <span className="font-bold text-slate-900 dark:text-white mt-1 block">
                  {testResult.category}
                </span>
                <span className="text-[11px] text-slate-400">
                  Sub: {testResult.subcategory}
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-slate-400 text-[10px] uppercase font-mono block">
                  Priority
                </span>
                <div className="mt-1">
                  <PriorityBadge priority={testResult.priority} />
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-slate-400 text-[10px] uppercase font-mono block">
                  Assignment Group
                </span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 mt-1 block truncate">
                  {testResult.assignmentGroup}
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-slate-400 text-[10px] uppercase font-mono block">
                  Confidence
                </span>
                <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 block">
                  {testResult.confidence}%
                </span>
              </div>
            </div>

            {testResult.matchedKeywords.length > 0 && (
              <div className="pt-1">
                <span className="text-xs text-slate-500 dark:text-slate-400 mr-2">
                  Matched keywords:
                </span>
                <div className="inline-flex flex-wrap gap-1.5 mt-1">
                  {testResult.matchedKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="px-2 py-0.5 text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700"
                    >
                      &quot;{kw}&quot;
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
