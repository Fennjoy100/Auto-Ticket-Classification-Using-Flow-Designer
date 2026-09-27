import React, { useState } from 'react';
import {
  AlertTriangle,
  Edit2,
  Mail,
  PlusCircle,
  Shield,
  Trash2,
  User,
  Users,
} from 'lucide-react';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Modal } from '../components/common/Modal';
import { useApp } from '../context/AppContext';
import { AssignmentGroup } from '../types';

export const GroupsPage: React.FC = () => {
  const { groups, addGroup, updateGroup, deleteGroup, tickets } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<AssignmentGroup | null>(null);
  const [deleteGroupId, setDeleteGroupId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [lead, setLead] = useState('');
  const [email, setEmail] = useState('');
  const [memberCount, setMemberCount] = useState(5);
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const openCreateModal = () => {
    setEditingGroup(null);
    setName('');
    setDescription('');
    setLead('');
    setEmail('');
    setMemberCount(4);
    setStatus('Active');
    setModalOpen(true);
  };

  const openEditModal = (grp: AssignmentGroup) => {
    setEditingGroup(grp);
    setName(grp.name);
    setDescription(grp.description);
    setLead(grp.lead);
    setEmail(grp.email);
    setMemberCount(grp.memberCount);
    setStatus(grp.status);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingGroup) {
      updateGroup(editingGroup.id, {
        name: name.trim(),
        description: description.trim(),
        lead: lead.trim() || 'Unassigned Lead',
        email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '-')}@company.internal`,
        memberCount: Number(memberCount) || 1,
        status,
      });
    } else {
      addGroup({
        name: name.trim(),
        description: description.trim(),
        lead: lead.trim() || 'Unassigned Lead',
        email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '-')}@company.internal`,
        memberCount: Number(memberCount) || 1,
        status,
      });
    }

    setModalOpen(false);
  };

  // Helper to count open tickets for a group
  const getOpenTicketCount = (groupName: string) => {
    return tickets.filter(
      (t) =>
        t.assignmentGroup.toLowerCase() === groupName.toLowerCase() &&
        (t.status === 'New' || t.status === 'In Progress' || t.status === 'Pending')
    ).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Assignment Groups
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Support queues and resolver teams targeted by automated routing rules
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Support Group</span>
        </button>
      </div>

      {/* Grid of Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {groups.map((group) => {
          const openCount = getOpenTicketCount(group.name);

          return (
            <div
              key={group.id}
              className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {group.name}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {group.memberCount} active agents
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono rounded ${
                      group.status === 'Active'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {group.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed my-3 line-clamp-2">
                  {group.description}
                </p>

                {/* Open Ticket Metric */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg flex items-center justify-between text-xs mb-3">
                  <span className="text-slate-500 dark:text-slate-400">Open Tickets:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                    {openCount}
                  </span>
                </div>

                {/* Lead Contact */}
                <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <div className="flex items-center gap-2 truncate">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">Lead: {group.lead}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate font-mono text-[11px]">{group.email}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => openEditModal(group)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Edit Group"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                {groups.length > 1 && (
                  <button
                    onClick={() => setDeleteGroupId(group.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Delete Group"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Group Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingGroup ? 'Edit Assignment Group' : 'Create Assignment Group'}
        subtitle="Manage resolver tier properties and contact details"
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
              Group Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Network Support"
              className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
              Description *
            </label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Scope of work and responsibilities..."
              className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                Team Lead Name
              </label>
              <input
                type="text"
                value={lead}
                onChange={(e) => setLead(e.target.value)}
                placeholder="e.g. David Chen"
                className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                Active Member Count
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={memberCount}
                onChange={(e) => setMemberCount(parseInt(e.target.value, 10))}
                className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                Dispatch Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="team-ops@company.internal"
                className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                Group Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive')}
                className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
            >
              {editingGroup ? 'Save Changes' : 'Create Group'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Group Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteGroupId)}
        onClose={() => setDeleteGroupId(null)}
        onConfirm={() => {
          if (deleteGroupId) {
            deleteGroup(deleteGroupId);
            setDeleteGroupId(null);
          }
        }}
        title="Remove Assignment Group"
        message="Are you sure you want to delete this assignment group? Existing tickets assigned to this team will remain in history."
        confirmLabel="Delete Group"
        isDestructive={true}
      />
    </div>
  );
};
