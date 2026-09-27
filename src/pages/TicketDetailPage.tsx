import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  GitBranch,
  Mail,
  MessageSquare,
  RefreshCw,
  Send,
  ShieldCheck,
  Tag,
  Trash2,
  User,
  Users,
} from 'lucide-react';
import { ConfidenceMeter, PriorityBadge, StatusBadge } from '../components/common/Badge';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useApp } from '../context/AppContext';
import { Priority, TicketNote, TicketStatus } from '../types';

export const TicketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tickets, updateTicket, deleteTicket, reclassifyTicket, groups, user } = useApp();

  const ticket = tickets.find((t) => t.id === id);

  const [isReclassifying, setIsReclassifying] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');

  if (!ticket) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
          Ticket Not Found
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          The requested ticket ID &quot;{id}&quot; does not exist or may have been deleted.
        </p>
        <Link
          to="/tickets"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Ticket List</span>
        </Link>
      </div>
    );
  }

  const handleStatusChange = (newStatus: TicketStatus) => {
    updateTicket(ticket.id, { status: newStatus });
  };

  const handlePriorityChange = (newPriority: Priority) => {
    updateTicket(ticket.id, { priority: newPriority });
  };

  const handleGroupChange = (newGroup: string) => {
    updateTicket(ticket.id, { assignmentGroup: newGroup });
  };

  const handleReclassify = async () => {
    setIsReclassifying(true);
    await new Promise((resolve) => setTimeout(resolve, 350));
    reclassifyTicket(ticket.id);
    setIsReclassifying(false);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newNote: TicketNote = {
      id: `note-${Date.now()}`,
      author: user?.name || 'Administrator',
      content: newNoteText.trim(),
      createdAt: new Date().toISOString(),
      isInternal: false,
    };

    const updatedNotes = [...(ticket.notes || []), newNote];
    updateTicket(ticket.id, { notes: updatedNotes });
    setNewNoteText('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/tickets"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                {ticket.id}
              </span>
              <PriorityBadge priority={ticket.priority} />
              <StatusBadge status={ticket.status} />
            </div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {ticket.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReclassify}
            disabled={isReclassifying}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 rounded-lg border border-indigo-200 dark:border-indigo-800 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReclassifying ? 'animate-spin' : ''}`} />
            <span>{isReclassifying ? 'Reclassifying...' : 'Reclassify Ticket'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
            title="Delete Ticket"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Details Left, Meta Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Description & Flow Execution History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Detailed Description Card */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h2 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Incident Description
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-lg border border-slate-100 dark:border-slate-800">
              {ticket.description}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Created:{' '}
                {new Date(ticket.createdAt).toLocaleString([], {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Last Updated:{' '}
                {new Date(ticket.updatedAt).toLocaleString([], {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          {/* Flow Execution History (Audit Trail) */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-indigo-500" />
                <h2 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                  Flow Execution History
                </h2>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {ticket.flowHistory?.length || 0} executed nodes
              </span>
            </div>

            {ticket.flowHistory && ticket.flowHistory.length > 0 ? (
              <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 before:z-0">
                {ticket.flowHistory.map((step) => (
                  <div key={step.stepId} className="relative z-10 flex items-start gap-3 text-xs">
                    <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-500 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {step.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {step.timestamp} (+{step.durationMs}ms)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        Input: {step.input}
                      </div>
                      <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                        Output: {step.output}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-center text-xs text-slate-400">
                No archived flow run found. Click &quot;Reclassify Ticket&quot; to execute the live Flow Designer on this ticket.
              </div>
            )}
          </div>

          {/* Activity Comments / Notes */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-400" />
              <h2 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                Activity Notes ({ticket.notes?.length || 0})
              </h2>
            </div>

            <div className="space-y-3">
              {(ticket.notes || []).map((note) => (
                <div
                  key={note.id}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {note.author}
                    </span>
                    <span className="font-mono">
                      {new Date(note.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Post a work note or status comment..."
                className="flex-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                type="submit"
                disabled={!newNoteText.trim()}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column (1 span): Metadata & Assignment Controls */}
        <div className="space-y-6">
          {/* Classification Summary Card */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Automated Classification
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 text-[11px] block">Category</span>
                <span className="font-semibold text-slate-900 dark:text-white text-sm">
                  {ticket.category}
                </span>
                <span className="text-slate-400 text-[11px] block mt-0.5">
                  Subcategory: {ticket.subcategory}
                </span>
              </div>

              <div>
                <span className="text-slate-400 text-[11px] block mb-1">Priority</span>
                <PriorityBadge priority={ticket.priority} />
              </div>

              <div>
                <span className="text-slate-400 text-[11px] block mb-1">
                  Confidence Score
                </span>
                <ConfidenceMeter score={ticket.confidence} />
              </div>

              {ticket.matchedKeywords?.length > 0 && (
                <div>
                  <span className="text-slate-400 text-[11px] block mb-1">
                    Matched Keywords
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {ticket.matchedKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="px-2 py-0.5 font-mono text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700"
                      >
                        &quot;{kw}&quot;
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Assignment & Status Controls */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Assignment & Triage
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 text-[11px] block mb-1">Ticket Status</label>
                <select
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Pending">Pending</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 text-[11px] block mb-1">Priority Override</label>
                <select
                  value={ticket.priority}
                  onChange={(e) => handlePriorityChange(e.target.value as Priority)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 text-[11px] block mb-1">Assignment Group</label>
                <select
                  value={ticket.assignmentGroup}
                  onChange={(e) => handleGroupChange(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white focus:outline-none"
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.name}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-slate-400 text-[11px] block">Assigned Resolver</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {ticket.assignedAgent || 'Unassigned (Queue Pending)'}
                </span>
              </div>
            </div>
          </div>

          {/* Requester Profile Card */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h2 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Requester Profile
            </h2>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-200">
                {ticket.requesterName.slice(0, 2).toUpperCase()}
              </div>
              <div className="text-xs">
                <div className="font-semibold text-slate-900 dark:text-white">
                  {ticket.requesterName}
                </div>
                <div className="text-slate-400 text-[11px]">{ticket.requesterDepartment || 'Employee'}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">{ticket.requesterEmail}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          deleteTicket(ticket.id);
          navigate('/tickets');
        }}
        title="Delete Incident Ticket"
        message={`Are you sure you want to permanently delete ticket ${ticket.id}? This will remove all associated logs and history.`}
        confirmLabel="Delete Ticket"
        isDestructive={true}
      />
    </div>
  );
};
