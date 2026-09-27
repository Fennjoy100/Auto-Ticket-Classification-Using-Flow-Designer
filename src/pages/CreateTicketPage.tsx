import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock,
  HelpCircle,
  PlusCircle,
  RotateCcw,
  Sparkles,
  Ticket as TicketIcon,
} from 'lucide-react';
import { PriorityBadge } from '../components/common/Badge';
import { useApp } from '../context/AppContext';
import { Priority, TicketStatus } from '../types';

export const CreateTicketPage: React.FC = () => {
  const { createTicket, classifyDraft, settings, groups } = useApp();
  const navigate = useNavigate();

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requesterName, setRequesterName] = useState('Sarah Conner');
  const [requesterEmail, setRequesterEmail] = useState('sarah.conner@company.internal');
  const [requesterDepartment, setRequesterDepartment] = useState('Operations');

  // Classification Fields (can be auto-filled or manually adjusted)
  const [category, setCategory] = useState('General IT');
  const [subcategory, setSubcategory] = useState('Other');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [assignmentGroup, setAssignmentGroup] = useState(
    settings.defaultAssignmentGroup || 'Service Desk'
  );
  const [status, setStatus] = useState<TicketStatus>('New');

  // Classifier preview state
  const [hasAutoClassified, setHasAutoClassified] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [matchedKeywords, setMatchedKeywords] = useState<string[]>([]);
  const [executionSteps, setExecutionSteps] = useState<any[]>([]);

  // Sample templates for easy testing
  const templates = [
    {
      label: 'Wi-Fi Connection Failure',
      title: 'Office Wi-Fi disconnecting frequently on 2nd floor',
      desc: 'Employees on the second floor cannot connect to the corporate Wi-Fi network. Internet connectivity drops every 5 minutes and router DHCP errors are visible.',
    },
    {
      label: 'Production Server Crash',
      title: 'Production server down for all users in EU region',
      desc: 'CRITICAL: The production server database has crashed. System down for all users with major outage affecting transactions.',
    },
    {
      label: 'Password Reset Request',
      title: 'Locked out of company account and cannot login',
      desc: 'My account was locked after entering wrong password. Please reset password and clear the login lockout.',
    },
    {
      label: 'Phishing Email Attack',
      title: 'Suspicious phishing email with malware attachment reported',
      desc: 'Employee received a fake invoice asking for bank credentials. Possible phishing or ransomware threat on workstation.',
    },
    {
      label: 'Payroll Question',
      title: 'Question regarding overtime salary payment on payslip',
      desc: 'Inquiring about weekend overtime hours on my recent HR payroll payslip statement.',
    },
  ];

  const handleApplyTemplate = (tpl: (typeof templates)[0]) => {
    setTitle(tpl.title);
    setDescription(tpl.desc);
    // Auto-run classification preview
    const result = classifyDraft(tpl.title, tpl.desc);
    setCategory(result.category);
    setSubcategory(result.subcategory);
    setPriority(result.priority);
    setAssignmentGroup(result.assignmentGroup);
    setConfidence(result.confidence);
    setMatchedKeywords(result.matchedKeywords);
    setExecutionSteps(result.flowSteps);
    setHasAutoClassified(true);
  };

  const handleAutoClassifyClick = () => {
    if (!title.trim() && !description.trim()) {
      return;
    }
    const result = classifyDraft(title, description);
    setCategory(result.category);
    setSubcategory(result.subcategory);
    setPriority(result.priority);
    setAssignmentGroup(result.assignmentGroup);
    setConfidence(result.confidence);
    setMatchedKeywords(result.matchedKeywords);
    setExecutionSteps(result.flowSteps);
    setHasAutoClassified(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTicket = createTicket({
      title,
      description,
      requesterName,
      requesterEmail,
      requesterDepartment,
      category,
      subcategory,
      priority,
      assignmentGroup,
      status,
      confidence: confidence || 75,
      matchedKeywords,
      isAutoClassified: settings.autoClassificationEnabled,
      requiresManualReview: confidence < settings.confidenceThreshold,
      flowHistory: executionSteps.length > 0 ? executionSteps : undefined,
    });

    navigate(`/tickets/${newTicket.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Create Incident Ticket
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Submit an IT request. Flow Designer automatically categorizes, prioritizes, and routes the ticket.
        </p>
      </div>

      {/* Quick Templates Bar */}
      <div className="p-3.5 bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/50 rounded-xl">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-indigo-900 dark:text-indigo-300">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Quick Test Scenarios (Click to Pre-fill & Classify):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {templates.map((tpl) => (
            <button
              key={tpl.label}
              type="button"
              onClick={() => handleApplyTemplate(tpl)}
              className="px-2.5 py-1 text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors shadow-xs"
            >
              {tpl.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Requester Information */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
            1. Requester Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                Requester Name *
              </label>
              <input
                type="text"
                required
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                Requester Email *
              </label>
              <input
                type="email"
                required
                value={requesterEmail}
                onChange={(e) => setRequesterEmail(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                Department
              </label>
              <input
                type="text"
                value={requesterDepartment}
                onChange={(e) => setRequesterDepartment(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        </div>

        {/* Incident Details */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              2. Incident Description
            </h2>
            <button
              type="button"
              onClick={handleAutoClassifyClick}
              disabled={!title.trim() && !description.trim()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 rounded-lg border border-indigo-200 dark:border-indigo-800 transition-colors disabled:opacity-40"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Auto Classify Ticket</span>
            </button>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
              Short Description / Summary *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Wi-Fi router on 2nd floor disconnected and internet is down"
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
              Detailed Description *
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide exact symptoms, error codes, affected users, and systems involved..."
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Automated Classification Section */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                3. Flow Routing & Classification
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {settings.autoClassificationEnabled
                  ? 'Automatically inferred by flow rules. You may override manually if needed.'
                  : 'Manual classification mode (Auto classification is disabled in Settings).'}
              </p>
            </div>

            {hasAutoClassified && (
              <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                Confidence: {confidence}%
              </span>
            )}
          </div>

          {matchedKeywords.length > 0 && (
            <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs">
              <span className="text-slate-400">Matched keywords:</span>
              <div className="flex flex-wrap gap-1">
                {matchedKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="font-mono text-[11px] bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600"
                  >
                    &quot;{kw}&quot;
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white font-medium focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                Subcategory
              </label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white font-medium focus:outline-none"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                Assignment Group
              </label>
              <select
                value={assignmentGroup}
                onChange={(e) => setAssignmentGroup(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white font-medium focus:outline-none"
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

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => navigate('/tickets')}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit & Dispatch Incident</span>
          </button>
        </div>
      </form>
    </div>
  );
};
