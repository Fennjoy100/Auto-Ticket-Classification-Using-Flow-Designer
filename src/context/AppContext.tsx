import React, { createContext, useContext, useEffect, useState } from 'react';
import { ClassifierEngine } from '../services/classifier';
import { INITIAL_FLOW_NODES } from '../services/flowEngine';
import {
  DEFAULT_GROUPS,
  DEFAULT_RULES,
  DEFAULT_SETTINGS,
  storageService,
} from '../services/storage';
import {
  AssignmentGroup,
  AuthUser,
  ClassificationResult,
  ClassificationRule,
  FlowNode,
  SystemNotification,
  SystemSettings,
  Ticket,
} from '../types';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface AppContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => boolean;
  demoLogin: () => void;
  logout: () => void;

  tickets: Ticket[];
  getTicketById: (id: string) => Ticket | undefined;
  createTicket: (data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => Ticket;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  deleteTicket: (id: string) => void;
  reclassifyTicket: (id: string) => ClassificationResult;
  classifyDraft: (title: string, description: string) => ClassificationResult;

  rules: ClassificationRule[];
  addRule: (rule: Omit<ClassificationRule, 'id' | 'matchCount'>) => void;
  updateRule: (id: string, updates: Partial<ClassificationRule>) => void;
  deleteRule: (id: string) => void;
  toggleRule: (id: string) => void;

  groups: AssignmentGroup[];
  addGroup: (group: Omit<AssignmentGroup, 'id'>) => void;
  updateGroup: (id: string, updates: Partial<AssignmentGroup>) => void;
  deleteGroup: (id: string) => void;

  settings: SystemSettings;
  updateSettings: (updates: Partial<SystemSettings>) => void;
  resetAllData: () => void;

  flowNodes: FlowNode[];
  updateFlowNode: (id: string, updates: Partial<FlowNode>) => void;

  notifications: SystemNotification[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  toasts: ToastItem[];
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  dismissToast: (id: string) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize storage once on mount
  useEffect(() => {
    storageService.initializeDefaultsIfEmpty();
  }, []);

  // State
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = storageService.getAuth();
    if (saved) return saved;
    // Default demo user logged in on initial load so the app works immediately
    const demoAdmin: AuthUser = {
      id: 'usr-admin',
      name: 'Devon Vance',
      email: 'admin@example.com',
      role: 'Administrator',
    };
    storageService.saveAuth(demoAdmin);
    return demoAdmin;
  });

  const [tickets, setTickets] = useState<Ticket[]>(() => storageService.getTickets());
  const [rules, setRules] = useState<ClassificationRule[]>(() => storageService.getRules());
  const [groups, setGroups] = useState<AssignmentGroup[]>(() => storageService.getGroups());
  const [settings, setSettings] = useState<SystemSettings>(() => storageService.getSettings());
  const [notifications, setNotifications] = useState<SystemNotification[]>(() =>
    storageService.getNotifications()
  );
  const [flowNodes, setFlowNodes] = useState<FlowNode[]>(INITIAL_FLOW_NODES);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Apply dark mode class to html element
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Toast helper
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth
  const login = (email: string, pass: string): boolean => {
    const trimmed = email.trim().toLowerCase();
    if ((trimmed === 'admin@example.com' && pass === 'admin123') || trimmed.length > 3) {
      const loggedUser: AuthUser = {
        id: 'usr-1',
        name: trimmed === 'admin@example.com' ? 'Devon Vance' : trimmed.split('@')[0],
        email: trimmed,
        role: 'Administrator',
      };
      setUser(loggedUser);
      storageService.saveAuth(loggedUser);
      showToast(`Welcome back, ${loggedUser.name}!`, 'success');
      return true;
    }
    showToast('Invalid credentials. Use admin@example.com / admin123', 'error');
    return false;
  };

  const demoLogin = () => {
    const adminUser: AuthUser = {
      id: 'usr-admin',
      name: 'Devon Vance',
      email: 'admin@example.com',
      role: 'Administrator',
    };
    setUser(adminUser);
    storageService.saveAuth(adminUser);
    showToast('Signed in with Demo Administrator account', 'success');
  };

  const logout = () => {
    setUser(null);
    storageService.clearAuth();
    showToast('You have been logged out safely.', 'info');
  };

  // Ticket operations
  const getTicketById = (id: string) => tickets.find((t) => t.id === id);

  const createTicket = (data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Ticket => {
    // Generate sequential ID
    const maxNum = tickets.reduce((max, t) => {
      const parts = t.id.split('-');
      const num = parseInt(parts[1], 10);
      return !isNaN(num) && num > max ? num : max;
    }, 1014);

    const newId = `INC-${maxNum + 1}`;
    const now = new Date().toISOString();

    // Run classifier if auto classification is enabled
    let classifiedCategory = data.category;
    let classifiedSubcategory = data.subcategory;
    let classifiedPriority = data.priority;
    let classifiedGroup = data.assignmentGroup;
    let confidence = data.confidence;
    let matchedKeywords = data.matchedKeywords || [];
    let flowHistory = data.flowHistory;
    let requiresManualReview = data.requiresManualReview ?? false;

    if (settings.autoClassificationEnabled) {
      const result = ClassifierEngine.classify(data.title, data.description, rules, settings);
      classifiedCategory = result.category;
      classifiedSubcategory = result.subcategory;
      classifiedPriority = result.priority;
      classifiedGroup = result.assignmentGroup;
      confidence = result.confidence;
      matchedKeywords = result.matchedKeywords;
      flowHistory = result.flowSteps;
      requiresManualReview = result.requiresManualReview;
    }

    const newTicket: Ticket = {
      ...data,
      id: newId,
      category: classifiedCategory,
      subcategory: classifiedSubcategory,
      priority: classifiedPriority,
      assignmentGroup: classifiedGroup,
      confidence,
      matchedKeywords,
      flowHistory,
      requiresManualReview,
      createdAt: now,
      updatedAt: now,
      isAutoClassified: settings.autoClassificationEnabled,
    };

    const nextTickets = [newTicket, ...tickets];
    setTickets(nextTickets);
    storageService.saveTickets(nextTickets);

    // If critical, generate notification
    if (newTicket.priority === 'Critical') {
      const newNotif: SystemNotification = {
        id: `notif-${Date.now()}`,
        title: 'Critical Incident Created',
        message: `${newTicket.id}: ${newTicket.title} routed to ${newTicket.assignmentGroup}`,
        type: 'critical',
        timestamp: 'Just now',
        read: false,
        ticketId: newTicket.id,
      };
      const nextNotifs = [newNotif, ...notifications];
      setNotifications(nextNotifs);
      storageService.saveNotifications(nextNotifs);
    }

    showToast(`Ticket ${newId} created and classified successfully!`, 'success');
    return newTicket;
  };

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    const nextTickets = tickets.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          ...updates,
          updatedAt: new Date().toISOString(),
          resolvedAt:
            updates.status === 'Resolved' || updates.status === 'Closed'
              ? t.resolvedAt || new Date().toISOString()
              : undefined,
        };
      }
      return t;
    });
    setTickets(nextTickets);
    storageService.saveTickets(nextTickets);
    showToast(`Ticket ${id} updated.`, 'info');
  };

  const deleteTicket = (id: string) => {
    const nextTickets = tickets.filter((t) => t.id !== id);
    setTickets(nextTickets);
    storageService.saveTickets(nextTickets);
    showToast(`Ticket ${id} was deleted.`, 'info');
  };

  const reclassifyTicket = (id: string): ClassificationResult => {
    const ticket = tickets.find((t) => t.id === id);
    if (!ticket) {
      throw new Error(`Ticket ${id} not found`);
    }

    const result = ClassifierEngine.classify(ticket.title, ticket.description, rules, settings);

    const nextTickets = tickets.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          category: result.category,
          subcategory: result.subcategory,
          priority: result.priority,
          assignmentGroup: result.assignmentGroup,
          confidence: result.confidence,
          matchedKeywords: result.matchedKeywords,
          isAutoClassified: true,
          requiresManualReview: result.requiresManualReview,
          flowHistory: result.flowSteps,
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    });

    setTickets(nextTickets);
    storageService.saveTickets(nextTickets);
    showToast(`Ticket ${id} reclassified: ${result.category} (${result.confidence}%)`, 'success');
    return result;
  };

  const classifyDraft = (title: string, description: string): ClassificationResult => {
    return ClassifierEngine.classify(title, description, rules, settings);
  };

  // Rule operations
  const addRule = (ruleData: Omit<ClassificationRule, 'id' | 'matchCount'>) => {
    const id = `rule-${ruleData.category.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString(36)}`;
    const newRule: ClassificationRule = {
      ...ruleData,
      id,
      matchCount: 0,
    };
    const nextRules = [...rules, newRule];
    setRules(nextRules);
    storageService.saveRules(nextRules);
    showToast(`Classification rule "${newRule.category}" added.`, 'success');
  };

  const updateRule = (id: string, updates: Partial<ClassificationRule>) => {
    const nextRules = rules.map((r) => (r.id === id ? { ...r, ...updates } : r));
    setRules(nextRules);
    storageService.saveRules(nextRules);
    showToast('Rule updated successfully.', 'info');
  };

  const deleteRule = (id: string) => {
    const nextRules = rules.filter((r) => r.id !== id);
    setRules(nextRules);
    storageService.saveRules(nextRules);
    showToast('Rule deleted.', 'info');
  };

  const toggleRule = (id: string) => {
    const nextRules = rules.map((r) => (r.id === id ? { ...r, isEnabled: !r.isEnabled } : r));
    setRules(nextRules);
    storageService.saveRules(nextRules);
    const updated = nextRules.find((r) => r.id === id);
    showToast(`Rule ${updated?.category} is now ${updated?.isEnabled ? 'active' : 'disabled'}.`, 'info');
  };

  // Group operations
  const addGroup = (groupData: Omit<AssignmentGroup, 'id'>) => {
    const id = `grp-${groupData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString(36)}`;
    const newGroup: AssignmentGroup = { ...groupData, id };
    const nextGroups = [...groups, newGroup];
    setGroups(nextGroups);
    storageService.saveGroups(nextGroups);
    showToast(`Assignment group "${newGroup.name}" created.`, 'success');
  };

  const updateGroup = (id: string, updates: Partial<AssignmentGroup>) => {
    const nextGroups = groups.map((g) => (g.id === id ? { ...g, ...updates } : g));
    setGroups(nextGroups);
    storageService.saveGroups(nextGroups);
    showToast('Assignment group updated.', 'info');
  };

  const deleteGroup = (id: string) => {
    const nextGroups = groups.filter((g) => g.id !== id);
    setGroups(nextGroups);
    storageService.saveGroups(nextGroups);
    showToast('Assignment group removed.', 'info');
  };

  // Settings
  const updateSettings = (updates: Partial<SystemSettings>) => {
    const nextSettings = { ...settings, ...updates };
    setSettings(nextSettings);
    storageService.saveSettings(nextSettings);
    showToast('Settings saved successfully.', 'success');
  };

  const resetAllData = () => {
    storageService.resetAllToFactory();
    setTickets(storageService.getTickets());
    setRules(DEFAULT_RULES);
    setGroups(DEFAULT_GROUPS);
    setSettings(DEFAULT_SETTINGS);
    setNotifications(storageService.getNotifications());
    showToast('System data reset to factory defaults.', 'warning');
  };

  // Flow Nodes
  const updateFlowNode = (id: string, updates: Partial<FlowNode>) => {
    setFlowNodes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updates } : n)));
    showToast('Flow node configuration updated.', 'info');
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    const next = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(next);
    storageService.saveNotifications(next);
  };

  const clearNotifications = () => {
    setNotifications([]);
    storageService.saveNotifications([]);
    showToast('All notifications cleared.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        demoLogin,
        logout,
        tickets,
        getTicketById,
        createTicket,
        updateTicket,
        deleteTicket,
        reclassifyTicket,
        classifyDraft,
        rules,
        addRule,
        updateRule,
        deleteRule,
        toggleRule,
        groups,
        addGroup,
        updateGroup,
        deleteGroup,
        settings,
        updateSettings,
        resetAllData,
        flowNodes,
        updateFlowNode,
        notifications,
        markNotificationRead,
        clearNotifications,
        toasts,
        showToast,
        dismissToast,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
