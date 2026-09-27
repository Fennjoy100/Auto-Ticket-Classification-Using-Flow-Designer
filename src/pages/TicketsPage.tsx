import React, { useMemo, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowDownUp,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreVertical,
  PlusCircle,
  RefreshCw,
  Search,
  Trash2,
  Eye,
  Edit,
  Sparkles,
} from 'lucide-react';
import { PriorityBadge, StatusBadge, ConfidenceMeter } from '../components/common/Badge';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Modal } from '../components/common/Modal';
import { useApp } from '../context/AppContext';
import { Priority, Ticket, TicketStatus } from '../types';

export const TicketsPage: React.FC = () => {
  const { tickets, deleteTicket, updateTicket, reclassifyTicket } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters & Sorting State
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'All');
  const [priorityFilter, setPriorityFilter] = useState<string>(
    searchParams.get('priority') || 'All'
  );
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'All');
  const [groupFilter, setGroupFilter] = useState<string>(
    searchParams.get('group') || 'All'
  );

  const [sortField, setSortField] = useState<'createdAt' | 'priority' | 'confidence' | 'id'>(
    'createdAt'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals state
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
  const [quickEditTicket, setQuickEditTicket] = useState<Ticket | null>(null);
  const [editStatus, setEditStatus] = useState<TicketStatus>('New');
  const [editPriority, setEditPriority] = useState<Priority>('Medium');

  // Sync url param if changes
  useEffect(() => {
    const qParam = searchParams.get('q');
    if (qParam !== null && qParam !== query) {
      setQuery(qParam);
    }
    const statusParam = searchParams.get('status');
    if (statusParam && statusParam !== statusFilter) {
      setStatusFilter(statusParam);
    }
    const prioParam = searchParams.get('priority');
    if (prioParam && prioParam !== priorityFilter) {
      setPriorityFilter(prioParam);
    }
  }, [searchParams]);

  // Unique categories & groups for dropdowns
  const categories = useMemo(() => {
    return Array.from(new Set(tickets.map((t) => t.category))).sort();
  }, [tickets]);

  const groups = useMemo(() => {
    return Array.from(new Set(tickets.map((t) => t.assignmentGroup))).sort();
  }, [tickets]);

  // Filtering & Sorting
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      if (categoryFilter !== 'All' && t.category !== categoryFilter) return false;
      if (priorityFilter !== 'All' && t.priority !== priorityFilter) return false;
      if (statusFilter !== 'All' && t.status !== statusFilter) return false;
      if (groupFilter !== 'All' && t.assignmentGroup !== groupFilter) return false;

      if (query.trim()) {
        const q = query.toLowerCase();
        const matches =
          t.id.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.requesterName.toLowerCase().includes(q) ||
          t.matchedKeywords?.some((k) => k.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [tickets, categoryFilter, priorityFilter, statusFilter, groupFilter, query]);

  const sortedTickets = useMemo(() => {
    const priorityWeights: Record<Priority, number> = {
      Critical: 4,
      High: 3,
      Medium: 2,
      Low: 1,
    };

    return [...filteredTickets].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'createdAt') {
        comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortField === 'priority') {
        comparison = priorityWeights[b.priority] - priorityWeights[a.priority];
      } else if (sortField === 'confidence') {
        comparison = b.confidence - a.confidence;
      } else if (sortField === 'id') {
        comparison = b.id.localeCompare(a.id);
      }
      return sortOrder === 'asc' ? -comparison : comparison;
    });
  }, [filteredTickets, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedTickets.length / pageSize) || 1;
  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedTickets.slice(start, start + pageSize);
  }, [sortedTickets, currentPage, pageSize]);

  const toggleSort = (field: 'createdAt' | 'priority' | 'confidence' | 'id') => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleQuickEditSave = () => {
    if (quickEditTicket) {
      updateTicket(quickEditTicket.id, {
        status: editStatus,
        priority: editPriority,
      });
      setQuickEditTicket(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Incident Tickets
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Displaying {filteredTickets.length} of {tickets.length} total incidents
          </p>
        </div>

        <Link
          to="/tickets/create"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Ticket</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Filter by ID, keywords, requester, title..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category */}
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Priority */}
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>

            {/* Group */}
            <select
              value={groupFilter}
              onChange={(e) => {
                setGroupFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="All">All Groups</option>
              {groups.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            {(query ||
              categoryFilter !== 'All' ||
              priorityFilter !== 'All' ||
              statusFilter !== 'All' ||
              groupFilter !== 'All') && (
              <button
                onClick={() => {
                  setQuery('');
                  setCategoryFilter('All');
                  setPriorityFilter('All');
                  setStatusFilter('All');
                  setGroupFilter('All');
                  setSearchParams({});
                  setCurrentPage(1);
                }}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline px-1"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Ticket Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th
                  onClick={() => toggleSort('id')}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Ticket ID</span>
                    <ArrowDownUp className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold">Short Description</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th
                  onClick={() => toggleSort('priority')}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Priority</span>
                    <ArrowDownUp className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Assignment Group</th>
                <th
                  onClick={() => toggleSort('confidence')}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Confidence</span>
                    <ArrowDownUp className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('createdAt')}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Created</span>
                    <ArrowDownUp className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {paginatedTickets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No tickets match the selected filters.
                  </td>
                </tr>
              ) : (
                paginatedTickets.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      <Link
                        to={`/tickets/${t.id}`}
                        className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        {t.id}
                      </Link>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate font-medium text-slate-900 dark:text-slate-100">
                      <Link
                        to={`/tickets/${t.id}`}
                        className="hover:underline decoration-indigo-500"
                      >
                        {t.title}
                      </Link>
                      <div className="text-[11px] text-slate-400 truncate">
                        By {t.requesterName}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {t.category}
                      </span>
                      <span className="text-[11px] text-slate-400 block">{t.subcategory}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-800 dark:text-slate-200">
                      {t.assignmentGroup}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <ConfidenceMeter score={t.confidence} size="sm" />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-400 text-[11px] font-mono">
                      {new Date(t.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/tickets/${t.id}`}
                          title="View Ticket Details & Flow"
                          className="p-1 rounded text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => {
                            setQuickEditTicket(t);
                            setEditStatus(t.status);
                            setEditPriority(t.priority);
                          }}
                          title="Quick Edit"
                          className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => reclassifyTicket(t.id)}
                          title="Reclassify Ticket with Flow Engine"
                          className="p-1 rounded text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setTicketToDelete(t.id)}
                          title="Delete Ticket"
                          className="p-1 rounded text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sortedTickets.length)} of {sortedTickets.length} results
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(ticketToDelete)}
        onClose={() => setTicketToDelete(null)}
        onConfirm={() => {
          if (ticketToDelete) {
            deleteTicket(ticketToDelete);
            setTicketToDelete(null);
          }
        }}
        title="Delete Incident Ticket"
        message={`Are you sure you want to permanently delete ticket ${ticketToDelete}? This action cannot be reversed.`}
        confirmLabel="Delete Ticket"
        isDestructive={true}
      />

      {/* Quick Edit Modal */}
      <Modal
        isOpen={Boolean(quickEditTicket)}
        onClose={() => setQuickEditTicket(null)}
        title={`Quick Edit: ${quickEditTicket?.id}`}
        subtitle={quickEditTicket?.title}
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
              Ticket Status
            </label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as TicketStatus)}
              className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
              Priority Override
            </label>
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as Priority)}
              className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4">
            <button
              onClick={() => setQuickEditTicket(null)}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={handleQuickEditSave}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
