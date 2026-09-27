import React, { useState } from 'react';
import {
  AlertCircle,
  Check,
  Edit2,
  Filter,
  Layers,
  PlusCircle,
  Power,
  RotateCcw,
  Search,
  Sparkles,
  Tag,
  Trash2,
  Users,
} from 'lucide-react';
import { PriorityBadge } from '../components/common/Badge';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Modal } from '../components/common/Modal';
import { useApp } from '../context/AppContext';
import { ClassificationRule, Priority } from '../types';

export const RulesPage: React.FC = () => {
  const { rules, addRule, updateRule, deleteRule, toggleRule, groups } = useApp();

  const [search, setSearch] = useState('');
  const [ruleModalOpen, setRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<ClassificationRule | null>(null);
  const [deleteRuleId, setDeleteRuleId] = useState<string | null>(null);

  // Form State
  const [category, setCategory] = useState('');
  const [subcategoriesText, setSubcategoriesText] = useState('');
  const [keywordsText, setKeywordsText] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [assignmentGroup, setAssignmentGroup] = useState('Network Support');
  const [description, setDescription] = useState('');

  // Rule test simulator state
  const [testText, setTestText] = useState('');
  const [testResult, setTestResult] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingRule(null);
    setCategory('');
    setSubcategoriesText('');
    setKeywordsText('');
    setPriority('Medium');
    setAssignmentGroup(groups[0]?.name || 'Service Desk');
    setDescription('');
    setRuleModalOpen(true);
  };

  const openEditModal = (rule: ClassificationRule) => {
    setEditingRule(rule);
    setCategory(rule.category);
    setSubcategoriesText(rule.subcategories.join(', '));
    setKeywordsText(rule.keywords.join(', '));
    setPriority(rule.defaultPriority);
    setAssignmentGroup(rule.assignmentGroup);
    setDescription(rule.description || '');
    setRuleModalOpen(true);
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category.trim() || !keywordsText.trim()) return;

    const keywords = keywordsText
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const subcategories = subcategoriesText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (editingRule) {
      updateRule(editingRule.id, {
        category: category.trim(),
        subcategories: subcategories.length > 0 ? subcategories : ['General'],
        keywords,
        defaultPriority: priority,
        assignmentGroup,
        description: description.trim(),
      });
    } else {
      addRule({
        category: category.trim(),
        subcategories: subcategories.length > 0 ? subcategories : ['General'],
        keywords,
        defaultPriority: priority,
        assignmentGroup,
        isEnabled: true,
        description: description.trim(),
      });
    }

    setRuleModalOpen(false);
  };

  const handleRunRuleTest = () => {
    if (!testText.trim()) return;
    const lower = testText.toLowerCase();
    const matchedRules: { category: string; matched: string[] }[] = [];

    rules.forEach((r) => {
      if (!r.isEnabled) return;
      const matched = r.keywords.filter((kw) => lower.includes(kw.toLowerCase().trim()));
      if (matched.length > 0) {
        matchedRules.push({ category: r.category, matched });
      }
    });

    if (matchedRules.length === 0) {
      setTestResult('No matching active rules. Fallback to General IT (Service Desk).');
    } else {
      const summary = matchedRules
        .map((m) => `${m.category} (matched: ${m.matched.join(', ')})`)
        .join(' | ');
      setTestResult(`Rule Match: ${summary}`);
    }
  };

  const filteredRules = rules.filter(
    (r) =>
      r.category.toLowerCase().includes(search.toLowerCase()) ||
      r.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase())) ||
      r.assignmentGroup.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Classification Rules
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Taxonomy and keyword routing definitions executed by the Flow Designer
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Rule</span>
        </button>
      </div>

      {/* Interactive Keyword Tester Sandbox */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
            Rule Matcher Sandbox
          </h3>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRunRuleTest()}
            placeholder="Type sample text (e.g. 'printer is broken and paper jammed') to test which rule fires..."
            className="flex-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <button
            onClick={handleRunRuleTest}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 rounded-lg transition-colors shrink-0"
          >
            Test
          </button>
        </div>
        {testResult && (
          <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-xs font-mono text-indigo-700 dark:text-indigo-300">
            {testResult}
          </div>
        )}
      </div>

      {/* Rules Table / Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Table Filter Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search category, keywords, or group..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
            />
          </div>
          <span className="text-xs font-mono text-slate-400">
            {filteredRules.length} rules configured
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Category & Subcategories</th>
                <th className="py-3 px-4 font-semibold">Keywords Matrix</th>
                <th className="py-3 px-4 font-semibold">Default Priority</th>
                <th className="py-3 px-4 font-semibold">Target Assignment Group</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {filteredRules.map((rule) => (
                <tr
                  key={rule.id}
                  className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                    !rule.isEnabled ? 'opacity-50' : ''
                  }`}
                >
                  <td className="py-3 px-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors ${
                        rule.isEnabled
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <Power className="w-3 h-3" />
                      <span>{rule.isEnabled ? 'Active' : 'Disabled'}</span>
                    </button>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-900 dark:text-white block">
                      {rule.category}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5 line-clamp-1">
                      {rule.subcategories.join(', ')}
                    </span>
                  </td>

                  <td className="py-3 px-4 max-w-md">
                    <div className="flex flex-wrap gap-1">
                      {rule.keywords.map((kw) => (
                        <span
                          key={kw}
                          className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <PriorityBadge priority={rule.defaultPriority} />
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-800 dark:text-slate-200">
                    {rule.assignmentGroup}
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(rule)}
                        className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Rule"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteRuleId(rule.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Delete Rule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Rule Modal */}
      <Modal
        isOpen={ruleModalOpen}
        onClose={() => setRuleModalOpen(false)}
        title={editingRule ? 'Edit Classification Rule' : 'Create Classification Rule'}
        subtitle="Define category taxonomy, keyword token matchers, and routing target"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveRule} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Network, Hardware, Security"
              className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
              Subcategories (comma-separated)
            </label>
            <input
              type="text"
              value={subcategoriesText}
              onChange={(e) => setSubcategoriesText(e.target.value)}
              placeholder="e.g. Wi-Fi, VPN, Firewall, DNS"
              className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
              Keywords (comma-separated tokens) *
            </label>
            <textarea
              rows={3}
              required
              value={keywordsText}
              onChange={(e) => setKeywordsText(e.target.value)}
              placeholder="wifi, internet, router, connection, connectivity, vpn, dns..."
              className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                Default Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                Target Assignment Group
              </label>
              <select
                value={assignmentGroup}
                onChange={(e) => setAssignmentGroup(e.target.value)}
                className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none"
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.name}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
              Rule Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief explanation of when this rule applies..."
              className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setRuleModalOpen(false)}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
            >
              {editingRule ? 'Save Changes' : 'Create Rule'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Rule Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteRuleId)}
        onClose={() => setDeleteRuleId(null)}
        onConfirm={() => {
          if (deleteRuleId) {
            deleteRule(deleteRuleId);
            setDeleteRuleId(null);
          }
        }}
        title="Delete Classification Rule"
        message="Are you sure you want to delete this classification rule? Newly submitted tickets will no longer match this taxonomy."
        confirmLabel="Delete Rule"
        isDestructive={true}
      />
    </div>
  );
};
