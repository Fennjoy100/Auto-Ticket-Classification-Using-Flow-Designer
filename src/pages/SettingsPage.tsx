import React, { useState } from 'react';
import {
  AlertTriangle,
  Check,
  Download,
  Moon,
  RefreshCcw,
  Save,
  Shield,
  Sliders,
  Sun,
  Upload,
} from 'lucide-react';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useApp } from '../context/AppContext';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetAllData, groups, showToast, tickets, rules } =
    useApp();

  const [autoClassify, setAutoClassify] = useState(settings.autoClassificationEnabled);
  const [autoAssign, setAutoAssign] = useState(settings.automaticAssignmentEnabled);
  const [threshold, setThreshold] = useState(settings.confidenceThreshold);
  const [defaultGroup, setDefaultGroup] = useState(settings.defaultAssignmentGroup);
  const [darkMode, setDarkMode] = useState(settings.darkMode);
  const [notifyCritical, setNotifyCritical] = useState(settings.notifyOnCritical);

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      autoClassificationEnabled: autoClassify,
      automaticAssignmentEnabled: autoAssign,
      confidenceThreshold: Number(threshold),
      defaultAssignmentGroup: defaultGroup,
      darkMode,
      notifyOnCritical: notifyCritical,
    });
  };

  const handleExportJSON = () => {
    try {
      const exportData = {
        exportedAt: new Date().toISOString(),
        version: '1.2.0',
        settings,
        tickets,
        rules,
        groups,
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `flowticket-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Export file downloaded successfully', 'success');
    } catch {
      showToast('Export failed. Please check storage state.', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          System & Flow Automation Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configure rule thresholds, automation toggles, appearance, and local persistence
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Classification Engine Toggles */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-500" />
            <h2 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Classifier Engine Behaviors
            </h2>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-4">
            {/* Auto Classification ON/OFF */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <label className="text-xs font-medium text-slate-900 dark:text-white block">
                  Automatic Ticket Classification
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Analyze incoming incident titles and descriptions through the Flow Designer rules
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAutoClassify(!autoClassify)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  autoClassify ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    autoClassify ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Automatic Assignment ON/OFF */}
            <div className="flex items-center justify-between pt-4">
              <div>
                <label className="text-xs font-medium text-slate-900 dark:text-white block">
                  Automatic Assignment Routing
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Directly dispatch high-confidence incidents into resolver team queues
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAutoAssign(!autoAssign)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  autoAssign ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    autoAssign ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Confidence Threshold Slider */}
            <div className="pt-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-medium text-slate-900 dark:text-white block">
                    Confidence Gate Threshold ({threshold}%)
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Tickets scoring below this value branch to the Service Desk for manual review
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-900">
                  {threshold}%
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="95"
                step="5"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>40% (Lenient)</span>
                <span>70% (Standard)</span>
                <span>95% (Strict)</span>
              </div>
            </div>

            {/* Default Assignment Group */}
            <div className="pt-4">
              <label className="text-xs font-medium text-slate-900 dark:text-white block mb-1">
                Default Fallback Assignment Group
              </label>
              <select
                value={defaultGroup}
                onChange={(e) => setDefaultGroup(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none"
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.name}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Display & Notifications */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" />
            <h2 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Interface & Notifications
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-medium text-slate-900 dark:text-white block">
                  Dark Mode Theme
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Toggle high-contrast enterprise dark mode for low-light environments
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  darkMode ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    darkMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="text-xs font-medium text-slate-900 dark:text-white block">
                  Notify on Critical Outages
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Push urgent alerts into the notification bell whenever a Critical incident arrives
                </p>
              </div>
              <button
                type="button"
                onClick={() => setNotifyCritical(!notifyCritical)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notifyCritical ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notifyCritical ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>

      {/* Section 3: Data Management & Factory Reset */}
      <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
          Local Storage Management
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          FlowTicket stores all configurations, rules, and incidents purely in browser localStorage. No external database or credentials are utilized.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Configuration (JSON)</span>
          </button>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Reset All to Default Sample Data</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={() => {
          resetAllData();
          setShowResetConfirm(false);
        }}
        title="Reset All Local Data"
        message="This will reset all tickets, classification rules, groups, and settings back to the initial 14 sample tickets and default configurations. Proceed?"
        confirmLabel="Reset Everything"
        isDestructive={true}
      />
    </div>
  );
};
