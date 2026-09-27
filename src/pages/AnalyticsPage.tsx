import React from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bot,
  CheckCircle2,
  Clock,
  PieChart,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { MetricCard } from '../components/common/MetricCard';
import { useApp } from '../context/AppContext';

export const AnalyticsPage: React.FC = () => {
  const { tickets, groups, rules } = useApp();

  const total = tickets.length;
  const autoClassified = tickets.filter((t) => t.isAutoClassified).length;
  const manualReview = tickets.filter((t) => t.requiresManualReview).length;
  const resolvedCount = tickets.filter(
    (t) => t.status === 'Resolved' || t.status === 'Closed'
  ).length;

  const autoClassifiedRate = total > 0 ? ((autoClassified / total) * 100).toFixed(1) : '0';
  const resolutionRate = total > 0 ? ((resolvedCount / total) * 100).toFixed(1) : '0';

  const totalConfidence = tickets.reduce((sum, t) => sum + (t.confidence || 0), 0);
  const avgConfidence = total > 0 ? (totalConfidence / total).toFixed(1) : '0';

  // Category counts
  const catMap: Record<string, number> = {};
  tickets.forEach((t) => {
    catMap[t.category] = (catMap[t.category] || 0) + 1;
  });
  const categoriesList = Object.entries(catMap).sort((a, b) => b[1] - a[1]);

  // Priority counts
  const prioCounts = {
    Critical: tickets.filter((t) => t.priority === 'Critical').length,
    High: tickets.filter((t) => t.priority === 'High').length,
    Medium: tickets.filter((t) => t.priority === 'Medium').length,
    Low: tickets.filter((t) => t.priority === 'Low').length,
  };

  // Group counts
  const groupMap: Record<string, number> = {};
  tickets.forEach((t) => {
    groupMap[t.assignmentGroup] = (groupMap[t.assignmentGroup] || 0) + 1;
  });
  const groupsList = Object.entries(groupMap).sort((a, b) => b[1] - a[1]);

  // Top keywords
  const keywordMap: Record<string, number> = {};
  tickets.forEach((t) => {
    (t.matchedKeywords || []).forEach((kw) => {
      keywordMap[kw] = (keywordMap[kw] || 0) + 1;
    });
  });
  const topKeywords = Object.entries(keywordMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          ITSM Automation & Classifier Analytics
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Performance telemetry, confidence distributions, and queue balance metrics calculated from active storage
        </p>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Auto-Classification Rate"
          value={`${autoClassifiedRate}%`}
          subtitle={`${autoClassified} of ${total} tickets processed`}
          icon={Bot}
          highlight="indigo"
          trend={{ value: '+4.2% this week', isPositive: true }}
        />
        <MetricCard
          title="Average Confidence"
          value={`${avgConfidence}%`}
          subtitle="Model certainty score"
          icon={Sparkles}
          highlight="success"
          trend={{ value: 'Consistently > 85%', isPositive: true }}
        />
        <MetricCard
          title="Manual Review Queue"
          value={manualReview}
          subtitle="Routed to Service Desk"
          icon={AlertTriangle}
          highlight={manualReview > 0 ? 'warning' : 'default'}
        />
        <MetricCard
          title="Resolution Rate"
          value={`${resolutionRate}%`}
          subtitle={`${resolvedCount} resolved incidents`}
          icon={CheckCircle2}
          highlight="success"
        />
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Volume Breakdown */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              Incidents by Category
            </h3>
            <span className="text-xs font-mono text-slate-400">Total: {total}</span>
          </div>

          <div className="space-y-3 pt-2">
            {categoriesList.map(([cat, count]) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{cat}</span>
                    <span className="font-mono text-slate-500">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
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

        {/* Priority & Severity Distribution */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <PieChart className="w-4 h-4 text-rose-500" />
              Priority Severity Matrix
            </h3>
            <span className="text-xs font-mono text-slate-400">Impact Ratio</span>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                <span className="font-semibold text-rose-800 dark:text-rose-300">Critical Outages</span>
              </div>
              <span className="font-mono font-bold text-rose-700 dark:text-rose-300">
                {prioCounts.Critical} ({total > 0 ? Math.round((prioCounts.Critical / total) * 100) : 0}%)
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50/60 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span className="font-semibold text-orange-800 dark:text-orange-300">High Priority</span>
              </div>
              <span className="font-mono font-bold text-orange-700 dark:text-orange-300">
                {prioCounts.High} ({total > 0 ? Math.round((prioCounts.High / total) * 100) : 0}%)
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="font-semibold text-amber-800 dark:text-amber-300">Medium Operational</span>
              </div>
              <span className="font-mono font-bold text-amber-700 dark:text-amber-300">
                {prioCounts.Medium} ({total > 0 ? Math.round((prioCounts.Medium / total) * 100) : 0}%)
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Low / Requests</span>
              </div>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {prioCounts.Low} ({total > 0 ? Math.round((prioCounts.Low / total) * 100) : 0}%)
              </span>
            </div>
          </div>
        </div>

        {/* Group Workload Share */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-500" />
              Queue Workload Distribution
            </h3>
            <span className="text-xs font-mono text-slate-400">{groupsList.length} queues</span>
          </div>

          <div className="space-y-2 text-xs">
            {groupsList.map(([grp, count]) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div
                  key={grp}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800"
                >
                  <span className="font-medium text-slate-800 dark:text-slate-200">{grp}</span>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-slate-400 text-[11px]">{pct}%</span>
                    <span className="font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600">
                      {count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Matched Keywords Cloud */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-500" />
              Top Extracted Keyword Signals
            </h3>
            <span className="text-xs font-mono text-slate-400">NLP Insights</span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Most frequent domain terminology detected in incident descriptions triggering classification nodes.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {topKeywords.map(([kw, count]) => (
              <div
                key={kw}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
              >
                <span className="font-mono text-slate-800 dark:text-slate-200 font-medium">
                  &quot;{kw}&quot;
                </span>
                <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded">
                  {count}x
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
