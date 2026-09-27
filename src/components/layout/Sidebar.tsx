import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  CheckSquare,
  GitBranch,
  Layers,
  LayoutDashboard,
  PlusCircle,
  Settings,
  Ticket,
  Users,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose }) => {
  const { tickets, rules } = useApp();

  const openTicketsCount = tickets.filter(
    (t) => t.status === 'New' || t.status === 'In Progress'
  ).length;
  const activeRulesCount = rules.filter((r) => r.isEnabled).length;

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Tickets', href: '/tickets', icon: Ticket, badge: openTicketsCount },
    { name: 'Create Ticket', href: '/tickets/create', icon: PlusCircle },
    { name: 'Flow Designer', href: '/flow-designer', icon: GitBranch, highlight: true },
    { name: 'Classification Rules', href: '/rules', icon: Layers, badge: activeRulesCount },
    { name: 'Assignment Groups', href: '/groups', icon: Users },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 group-hover:bg-indigo-500 transition-colors">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-white tracking-tight">FlowTicket</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                v1.2
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium truncate max-w-[150px]">
              ITSM Flow Automation
            </p>
          </div>
        </NavLink>
        {mobileOpen && (
          <button
            onClick={onMobileClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Core Operations
        </div>

        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={() => mobileOpen && onMobileClose()}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              } ${item.highlight && !isActive ? 'border border-indigo-500/30 bg-indigo-950/20 text-indigo-200' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? 'text-white'
                        : item.highlight
                        ? 'text-indigo-400'
                        : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                      isActive
                        ? 'bg-indigo-700 text-white'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Engine Status Card */}
      <div className="p-3 mx-3 mb-4 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-medium text-slate-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Classifier Engine
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-semibold">Active</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Keywords & priority inference active in browser environment.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={onMobileClose}
            aria-hidden="true"
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
