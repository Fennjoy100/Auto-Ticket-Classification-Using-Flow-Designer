import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  Clock,
  GitBranch,
  Layers,
  PlusCircle,
  ShieldAlert,
  Sparkles,
  Ticket as TicketIcon,
  Users,
} from 'lucide-react';
import { PriorityBadge, StatusBadge, ConfidenceMeter } from '../components/common/Badge';
import { MetricCard } from '../components/common/MetricCard';
import { useApp } from '../context/AppContext';

export const DashboardPage: React.FC = () => {
  const { tickets, rules, groups, settings } = useApp();
  const navigate = useNavigate();

  // Metrics
  const totalTickets = tickets.length;
  const newTickets = tickets.filter((t) => t.status === 'New').length;
  const inProgressTickets = tickets.filter((t) => t.status === 'In Progress').length;
  const resolvedTickets = tickets.filter(
    (t) => t.status === 'Resolved' || t.status === 'Closed'
  ).length;
  const criticalTickets = tickets.filter(
    (t) => t.priority === 'Critical' && t.status !== 'Resolved' && t.status !== 'Closed'
  ).length;
  const autoClassifiedCount = tickets.filter((t) => t.isAutoClassified).length;
  const pendingAssignmentCount = tickets.filter(
    (t) => !t.assignedAgent || t.requiresManualReview
  ).length;
  const autoClassificationRate =
    totalTickets > 0 ? Math.round((autoClassifiedCount / totalTickets) * 100) : 0;

  // Category breakdown
  const categoryCounts: Record<string, number> = {};
  tickets.forEach((t) => {
    categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
  });
  const topCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);

  // Priority breakdown
  const priorityCounts = {
    Critical: tickets.filter((t) => t.priority === 'Critical').length,
    High: tickets.filter((t) => t.priority === 'High').length,
    Medium: tickets.filter((t) => t.priority === 'Medium').length,
    Low: tickets.filter((t) => t.priority === 'Low').length,
  };

  // Group breakdown
  const groupCounts: Record<string, number> = {};
  tickets.forEach((t) => {
    groupCounts[t.assignmentGroup] = (groupCounts[t.assignmentGroup] || 0) + 1;
  });
  const sortedGroups = Object.entries(groupCounts).sort((a, b) => b[1] - a[1]);

  // Status breakdown
  const statusCounts = {
    New: newTickets,
    'In Progress': inProgressTickets,
    Resolved: resolvedTickets,
  };

  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            ITSM Service Operations Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time automated incident classification and routing powered by Flow Designer
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/flow-designer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 rounded-lg transition-colors"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Open Flow Designer</span>
          </Link>
          <Link
            to="/tickets/create"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Ticket</span>
          </Link>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <MetricCard
          title="Total Tickets"
          value={totalTickets}
          subtitle="All incidents"
          icon={TicketIcon}
          onClick={() => navigate('/tickets')}
        />
        <MetricCard
          title="New Tickets"
          value={newTickets}
          subtitle="Unassigned queue"
          icon={Clock}
          highlight="indigo"
          onClick={() => navigate('/tickets?status=New')}
        />
        <MetricCard
          title="In Progress"
          value={inProgressTickets}
          subtitle="Active resolution"
          icon={Bot}
          onClick={() => navigate('/tickets?status=In%20Progress')}
        />
        <MetricCard
          title="Resolved"
          value={resolvedTickets}
          subtitle="Completed tickets"
          icon={CheckCircle2}
          highlight="success"
          onClick={() => navigate('/tickets?status=Resolved')}
        />
        <MetricCard
          title="Critical Alerts"
          value={criticalTickets}
          subtitle="Urgent action required"
          icon={ShieldAlert}
          highlight={criticalTickets > 0 ? 'danger' : 'default'}
          onClick={() => navigate('/tickets?priority=Critical')}
        />
        <MetricCard
          title="Auto Classified"
          value={`${autoClassificationRate}%`}
          subtitle={`${autoClassifiedCount} of ${totalTickets} tickets`}
          icon={Sparkles}
          highlight="indigo"
        />
        <MetricCard
          title="Pending Triage"
          value={pendingAssignmentCount}
          subtitle="Requires agent review"
          icon={AlertTriangle}
          highlight={pendingAssignmentCount > 0 ? 'warning' : 'default'}
        />
      </div>

      {/* Visual Charts & Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Tickets by Category */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                Tickets by Category
              </h3>
              <p className="text-[11px] text-slate-400">Classification volume distribution</p>
            </div>
            <span className="text-xs font-mono text-slate-500">{topCategories.length} categories</span>
          </div>

          <div className="space-y-3">
            {topCategories.map(([category, count]) => {
              const pct = totalTickets > 0 ? Math.round((count / totalTickets) * 100) : 0;
              return (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{category}</span>
                    <span className="font-mono text-slate-500">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Priority & Status Breakdown */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                  Tickets by Priority
                </h3>
                <p className="text-[11px] text-slate-400">Severity distribution ratio</p>
              </div>
              <span className="text-xs font-mono text-slate-500">4 Levels</span>
            </div>

            {/* Visual Segmented Bar */}
            <div className="w-full h-4 rounded-lg overflow-hidden flex bg-slate-100 dark:bg-slate-800 mb-4">
              <div
                style={{ width: `${(priorityCounts.Critical / totalTickets) * 100}%` }}
                className="bg-rose-500"
                title={`Critical: ${priorityCounts.Critical}`}
              />
              <div
                style={{ width: `${(priorityCounts.High / totalTickets) * 100}%` }}
                className="bg-orange-500"
                title={`High: ${priorityCounts.High}`}
              />
              <div
                style={{ width: `${(priorityCounts.Medium / totalTickets) * 100}%` }}
                className="bg-amber-500"
                title={`Medium: ${priorityCounts.Medium}`}
              />
              <div
                style={{ width: `${(priorityCounts.Low / totalTickets) * 100}%` }}
                className="bg-slate-400"
                title={`Low: ${priorityCounts.Low}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 flex items-center justify-between">
                <span className="text-rose-700 dark:text-rose-300 font-medium">Critical</span>
                <span className="font-mono font-bold text-rose-700 dark:text-rose-300">
                  {priorityCounts.Critical}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40 flex items-center justify-between">
                <span className="text-orange-700 dark:text-orange-300 font-medium">High</span>
                <span className="font-mono font-bold text-orange-700 dark:text-orange-300">
                  {priorityCounts.High}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 flex items-center justify-between">
                <span className="text-amber-700 dark:text-amber-300 font-medium">Medium</span>
                <span className="font-mono font-bold text-amber-700 dark:text-amber-300">
                  {priorityCounts.Medium}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Low</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {priorityCounts.Low}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Status Breakdown
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> New: {statusCounts.New}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" /> In Progress:{' '}
                {statusCounts['In Progress']}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Resolved:{' '}
                {statusCounts.Resolved}
              </span>
            </div>
          </div>
        </div>

        {/* Chart 3: Assignment Group Workload */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                Assignment Groups
              </h3>
              <p className="text-[11px] text-slate-400">Queue allocation workload</p>
            </div>
            <Link
              to="/groups"
              className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {sortedGroups.slice(0, 5).map(([grp, count]) => {
              const pct = totalTickets > 0 ? Math.round((count / totalTickets) * 100) : 0;
              return (
                <div
                  key={grp}
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 truncate max-w-[180px]">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                      {grp}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-[11px] text-slate-400">{pct}%</span>
                    <span className="font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600">
                      {count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Incidents Table */}
      <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Recently Ingested Incidents
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live queue updated by flow classification rules
            </p>
          </div>
          <Link
            to="/tickets"
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
          >
            <span>All Tickets ({totalTickets})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="pb-3 font-semibold">Ticket ID</th>
                <th className="pb-3 font-semibold">Subject</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Priority</th>
                <th className="pb-3 font-semibold">Assignment Group</th>
                <th className="pb-3 font-semibold">Confidence</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {recentTickets.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">
                    <Link to={`/tickets/${t.id}`} className="hover:text-indigo-600 transition-colors">
                      {t.id}
                    </Link>
                  </td>
                  <td className="py-3 max-w-xs truncate font-medium text-slate-900 dark:text-slate-100">
                    {t.title}
                  </td>
                  <td className="py-3">
                    <span className="text-slate-800 dark:text-slate-200 font-medium">
                      {t.category}
                    </span>
                    <span className="text-slate-400 text-[11px] block">{t.subcategory}</span>
                  </td>
                  <td className="py-3">
                    <PriorityBadge priority={t.priority} />
                  </td>
                  <td className="py-3 font-medium text-slate-800 dark:text-slate-200">
                    {t.assignmentGroup}
                  </td>
                  <td className="py-3">
                    <ConfidenceMeter score={t.confidence} size="sm" />
                  </td>
                  <td className="py-3">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      to={`/tickets/${t.id}`}
                      className="px-2.5 py-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
                    >
                      View Flow
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
