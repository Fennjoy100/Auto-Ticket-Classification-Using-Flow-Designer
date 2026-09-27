import { FlowNode } from '../types';

export interface FlowConnection {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
  conditionBranch?: 'yes' | 'no' | 'default';
}

export const INITIAL_FLOW_NODES: FlowNode[] = [
  {
    id: 'node-trigger',
    title: 'Ticket Created',
    subtitle: 'Event: Ingestion API / Web Portal',
    type: 'trigger',
    icon: 'Ticket',
    isEnabled: true,
    config: {
      source: 'All Channels (Web, Email, API)',
      debounceMs: 50,
      validateSchema: true,
    },
    x: 320,
    y: 40,
  },
  {
    id: 'node-analyze',
    title: 'Analyze Ticket Description',
    subtitle: 'NLP tokenizer & keyword extraction',
    type: 'action',
    icon: 'ScanText',
    isEnabled: true,
    config: {
      caseSensitive: false,
      removeStopwords: true,
      minWordLength: 3,
      extractPhrases: true,
    },
    x: 320,
    y: 170,
  },
  {
    id: 'node-category',
    title: 'Classify Category',
    subtitle: 'Rule matrix & domain taxonomy',
    type: 'action',
    icon: 'Tag',
    isEnabled: true,
    config: {
      fallbackCategory: 'General IT',
      activeRulesOnly: true,
      maxCategoryMatches: 1,
    },
    x: 320,
    y: 300,
  },
  {
    id: 'node-priority',
    title: 'Determine Priority',
    subtitle: 'Impact & urgency calculation',
    type: 'action',
    icon: 'AlertTriangle',
    isEnabled: true,
    config: {
      defaultPriority: 'Medium',
      escalateOnMultipleImpacts: true,
      criticalAlertKeywords: true,
    },
    x: 320,
    y: 430,
  },
  {
    id: 'node-assignment',
    title: 'Select Assignment Group',
    subtitle: 'Resolver queue & tier routing',
    type: 'action',
    icon: 'Users',
    isEnabled: true,
    config: {
      routingStrategy: 'Category Direct Mapping',
      fallbackGroup: 'Service Desk',
    },
    x: 320,
    y: 560,
  },
  {
    id: 'node-condition',
    title: 'Confidence >= 70%?',
    subtitle: 'Quality assurance threshold gate',
    type: 'condition',
    icon: 'GitFork',
    isEnabled: true,
    config: {
      thresholdPercentage: 70,
      autoRoutingRequiresGroupMatch: true,
    },
    x: 320,
    y: 690,
  },
  {
    id: 'node-auto-assign',
    title: 'Automatically Assign Ticket',
    subtitle: 'Direct dispatch to resolver team',
    type: 'action',
    icon: 'CheckCircle2',
    isEnabled: true,
    config: {
      notifyAssignees: true,
      setTicketStatus: 'In Progress',
    },
    x: 140,
    y: 840,
  },
  {
    id: 'node-manual-review',
    title: 'Send to Service Desk for Manual Review',
    subtitle: 'Flag for human triage queue',
    type: 'action',
    icon: 'UserCheck',
    isEnabled: true,
    config: {
      priorityOverride: 'Unchanged',
      tagManualReview: true,
    },
    x: 500,
    y: 840,
  },
  {
    id: 'node-update-ticket',
    title: 'Update Ticket Record',
    subtitle: 'Persist state & log flow audit',
    type: 'action',
    icon: 'Database',
    isEnabled: true,
    config: {
      auditLogging: true,
      dispatchWebhook: false,
    },
    x: 320,
    y: 990,
  },
  {
    id: 'node-end',
    title: 'Flow Completed',
    subtitle: 'Workflow completed successfully',
    type: 'end',
    icon: 'Flag',
    isEnabled: true,
    config: {
      trackLatencyMetrics: true,
    },
    x: 320,
    y: 1120,
  },
];

export const INITIAL_FLOW_CONNECTIONS: FlowConnection[] = [
  { id: 'c-1', sourceId: 'node-trigger', targetId: 'node-analyze' },
  { id: 'c-2', sourceId: 'node-analyze', targetId: 'node-category' },
  { id: 'c-3', sourceId: 'node-category', targetId: 'node-priority' },
  { id: 'c-4', sourceId: 'node-priority', targetId: 'node-assignment' },
  { id: 'c-5', sourceId: 'node-assignment', targetId: 'node-condition' },
  { id: 'c-6', sourceId: 'node-condition', targetId: 'node-auto-assign', label: 'YES (≥ 70%)', conditionBranch: 'yes' },
  { id: 'c-7', sourceId: 'node-condition', targetId: 'node-manual-review', label: 'NO (< 70%)', conditionBranch: 'no' },
  { id: 'c-8', sourceId: 'node-auto-assign', targetId: 'node-update-ticket' },
  { id: 'c-9', sourceId: 'node-manual-review', targetId: 'node-update-ticket' },
  { id: 'c-10', sourceId: 'node-update-ticket', targetId: 'node-end' },
];
