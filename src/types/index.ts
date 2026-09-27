export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

export type TicketStatus = 'New' | 'In Progress' | 'Pending' | 'Resolved' | 'Closed';

export interface ClassificationResult {
  category: string;
  subcategory: string;
  priority: Priority;
  assignmentGroup: string;
  confidence: number; // 0 - 100
  matchedKeywords: string[];
  executionTimeMs: number;
  flowSteps: FlowExecutionStep[];
  ruleMatchedId?: string;
  requiresManualReview: boolean;
}

export interface FlowExecutionStep {
  stepId: string;
  name: string;
  type: 'trigger' | 'action' | 'condition';
  status: 'success' | 'warning' | 'skipped' | 'failed';
  input: string;
  output: string;
  timestamp: string;
  durationMs: number;
}

export interface Ticket {
  id: string; // e.g., 'INC-1001'
  title: string;
  description: string;
  requesterName: string;
  requesterEmail: string;
  requesterDepartment?: string;
  category: string;
  subcategory: string;
  priority: Priority;
  assignmentGroup: string;
  assignedAgent?: string;
  status: TicketStatus;
  confidence: number; // 0 - 100
  matchedKeywords: string[];
  isAutoClassified: boolean;
  requiresManualReview: boolean;
  createdAt: string; // ISO string
  updatedAt: string;
  resolvedAt?: string;
  flowHistory?: FlowExecutionStep[];
  notes?: TicketNote[];
}

export interface TicketNote {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  isInternal: boolean;
}

export interface ClassificationRule {
  id: string;
  category: string;
  subcategories: string[];
  keywords: string[];
  defaultPriority: Priority;
  assignmentGroup: string;
  isEnabled: boolean;
  matchCount?: number;
  description?: string;
}

export interface AssignmentGroup {
  id: string;
  name: string;
  description: string;
  lead: string;
  email: string;
  memberCount: number;
  status: 'Active' | 'Inactive';
}

export interface FlowNode {
  id: string;
  title: string;
  subtitle: string;
  type: 'trigger' | 'action' | 'condition' | 'end';
  icon: string;
  isEnabled: boolean;
  config: Record<string, any>;
  x?: number;
  y?: number;
}

export interface SystemSettings {
  autoClassificationEnabled: boolean;
  automaticAssignmentEnabled: boolean;
  confidenceThreshold: number; // e.g. 70
  defaultAssignmentGroup: string;
  darkMode: boolean;
  notifyOnCritical: boolean;
  requireApprovalBelowConfidence: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'Administrator' | 'IT Support Lead' | 'Agent';
  avatarUrl?: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  timestamp: string;
  read: boolean;
  ticketId?: string;
}
