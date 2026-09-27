import { AssignmentGroup, ClassificationRule, SystemNotification, SystemSettings, Ticket } from '../types';

const STORAGE_KEYS = {
  AUTH_USER: 'flowticket_auth_user',
  TICKETS: 'flowticket_tickets_v1',
  RULES: 'flowticket_rules_v1',
  GROUPS: 'flowticket_groups_v1',
  SETTINGS: 'flowticket_settings_v1',
  NOTIFICATIONS: 'flowticket_notifications_v1',
  INITIALIZED: 'flowticket_initialized_v1',
};

export const DEFAULT_GROUPS: AssignmentGroup[] = [
  {
    id: 'grp-service-desk',
    name: 'Service Desk',
    description: 'Tier-1 general IT support and manual ticket triage queue',
    lead: 'Sarah Jenkins',
    email: 'servicedesk@company.internal',
    memberCount: 8,
    status: 'Active',
  },
  {
    id: 'grp-network',
    name: 'Network Support',
    description: 'Wi-Fi, routers, switches, VPN, firewalls, and enterprise connectivity',
    lead: 'David Chen',
    email: 'network-ops@company.internal',
    memberCount: 5,
    status: 'Active',
  },
  {
    id: 'grp-hardware',
    name: 'Hardware Support',
    description: 'Laptops, desktop PCs, peripherals, monitors, printers, and workstation repairs',
    lead: 'Marcus Vance',
    email: 'hardware-desk@company.internal',
    memberCount: 6,
    status: 'Active',
  },
  {
    id: 'grp-application',
    name: 'Application Support',
    description: 'Business software, desktop applications, crash reports, and bug triage',
    lead: 'Elena Rostova',
    email: 'app-support@company.internal',
    memberCount: 7,
    status: 'Active',
  },
  {
    id: 'grp-email',
    name: 'Email Support',
    description: 'Exchange, Outlook, Gmail, distribution lists, and mailbox configurations',
    lead: 'Michael Scott',
    email: 'email-admin@company.internal',
    memberCount: 4,
    status: 'Active',
  },
  {
    id: 'grp-access',
    name: 'Identity & Access Support',
    description: 'SSO, Active Directory, credentials, IAM permissions, and password resets',
    lead: 'Amara Okafor',
    email: 'iam-ops@company.internal',
    memberCount: 5,
    status: 'Active',
  },
  {
    id: 'grp-security',
    name: 'Security Operations',
    description: 'Threat detection, phishing reports, malware remediation, and incident response',
    lead: 'Alexander Ross',
    email: 'secops@company.internal',
    memberCount: 6,
    status: 'Active',
  },
  {
    id: 'grp-hr',
    name: 'HR Support',
    description: 'Employee payroll inquiries, benefits, leave administration, and HR systems',
    lead: 'Priya Sharma',
    email: 'hr-support@company.internal',
    memberCount: 4,
    status: 'Active',
  },
];

export const DEFAULT_RULES: ClassificationRule[] = [
  {
    id: 'rule-network',
    category: 'Network',
    subcategories: ['Wi-Fi', 'Internet', 'VPN', 'Connectivity', 'DNS / Firewall'],
    keywords: [
      'wifi',
      'wi-fi',
      'internet',
      'network',
      'router',
      'connection',
      'connectivity',
      'ethernet',
      'vpn',
      'dns',
      'firewall',
      'offline',
      'bandwidth',
    ],
    defaultPriority: 'Medium',
    assignmentGroup: 'Network Support',
    isEnabled: true,
    matchCount: 142,
    description: 'Routes network, connectivity, Wi-Fi, and VPN inquiries directly to Network Support.',
  },
  {
    id: 'rule-hardware',
    category: 'Hardware',
    subcategories: ['Laptop', 'Workstation', 'Monitor', 'Printer / Scanner', 'Peripherals'],
    keywords: [
      'laptop',
      'computer',
      'desktop',
      'keyboard',
      'mouse',
      'monitor',
      'printer',
      'scanner',
      'hard disk',
      'hard drive',
      'ram',
      'screen',
      'battery',
      'charger',
      'docking station',
    ],
    defaultPriority: 'Medium',
    assignmentGroup: 'Hardware Support',
    isEnabled: true,
    matchCount: 98,
    description: 'Identifies hardware breakdowns, physical damage, and peripheral malfunctions.',
  },
  {
    id: 'rule-software',
    category: 'Software',
    subcategories: ['Crash / Error', 'Installation', 'Updates', 'Bug', 'License'],
    keywords: [
      'software',
      'application',
      'app',
      'program',
      'crash',
      'error',
      'install',
      'installation',
      'update',
      'bug',
      'application not working',
      'freeze',
      'license',
    ],
    defaultPriority: 'Medium',
    assignmentGroup: 'Application Support',
    isEnabled: true,
    matchCount: 165,
    description: 'Classifies desktop and cloud software errors, installation failures, and crashes.',
  },
  {
    id: 'rule-email',
    category: 'Email',
    subcategories: ['Outlook', 'Gmail', 'Mailbox', 'Sync', 'Spam Filter'],
    keywords: [
      'email',
      'mail',
      'outlook',
      'gmail',
      'mailbox',
      'send email',
      'receive email',
      'email account',
      'inbox',
      'exchange',
      'attachment',
    ],
    defaultPriority: 'Medium',
    assignmentGroup: 'Email Support',
    isEnabled: true,
    matchCount: 84,
    description: 'Routes corporate email delivery, client sync, and mailbox quota tickets.',
  },
  {
    id: 'rule-access',
    category: 'Access Management',
    subcategories: ['Account Locked', 'Password Reset', 'SSO / MFA', 'Role Permissions'],
    keywords: [
      'login',
      'password',
      'account',
      'locked',
      'access',
      'permission',
      'authentication',
      'username',
      'reset password',
      'cannot login',
      "can't login",
      'mfa',
      'credentials',
      '2fa',
    ],
    defaultPriority: 'Medium',
    assignmentGroup: 'Identity & Access Support',
    isEnabled: true,
    matchCount: 210,
    description: 'Handles account lockouts, credential resets, and IAM authorization requests.',
  },
  {
    id: 'rule-security',
    category: 'Security',
    subcategories: ['Phishing', 'Malware', 'Suspicious Activity', 'Data Breach', 'Compromised Credential'],
    keywords: [
      'virus',
      'malware',
      'phishing',
      'suspicious',
      'hacked',
      'security',
      'ransomware',
      'spam attack',
      'breach',
      'trojan',
      'compromised',
      'unauthorized',
    ],
    defaultPriority: 'Critical',
    assignmentGroup: 'Security Operations',
    isEnabled: true,
    matchCount: 52,
    description: 'High priority queue for security alerts, phishing attacks, and potential breaches.',
  },
  {
    id: 'rule-hr',
    category: 'HR',
    subcategories: ['Leave Administration', 'Payroll & Salary', 'Benefits', 'Employee Records'],
    keywords: [
      'leave',
      'salary',
      'payroll',
      'employee',
      'attendance',
      'hr',
      'holiday',
      'benefits',
      'payslip',
      'bonus',
      'tax form',
      'vacation',
    ],
    defaultPriority: 'Low',
    assignmentGroup: 'HR Support',
    isEnabled: true,
    matchCount: 67,
    description: 'Manages employee HR requests, payroll questions, and benefits inquiries.',
  },
];

export const DEFAULT_SETTINGS: SystemSettings = {
  autoClassificationEnabled: true,
  automaticAssignmentEnabled: true,
  confidenceThreshold: 70,
  defaultAssignmentGroup: 'Service Desk',
  darkMode: false,
  notifyOnCritical: true,
  requireApprovalBelowConfidence: true,
};

export const SAMPLE_TICKETS: Ticket[] = [
  {
    id: 'INC-1001',
    title: 'My laptop is not connecting to Wi-Fi',
    description: 'When I opened my Dell laptop in the 3rd floor conference room, it refused to connect to the corporate Wi-Fi network. Other devices seem to work fine, but my wireless connection keeps saying "No Internet Access" and drops every few seconds.',
    requesterName: 'Rachel Green',
    requesterEmail: 'rachel.green@company.internal',
    requesterDepartment: 'Marketing',
    category: 'Network',
    subcategory: 'Wi-Fi',
    priority: 'Medium',
    assignmentGroup: 'Network Support',
    assignedAgent: 'David Chen',
    status: 'In Progress',
    confidence: 94,
    matchedKeywords: ['laptop', 'connecting', 'wi-fi', 'network', 'connection', 'internet'],
    isAutoClassified: true,
    requiresManualReview: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    flowHistory: [
      { stepId: 'trg-1', name: 'Ticket Created', type: 'trigger', status: 'success', input: 'Ticket INC-1001 submitted by Rachel Green', output: 'Ingested into pipeline', timestamp: '10:15:02', durationMs: 2 },
      { stepId: 'act-1', name: 'Analyze Ticket Description', type: 'action', status: 'success', input: 'Extracted 6 candidate keywords', output: 'Keywords: laptop, wi-fi, network, connection', timestamp: '10:15:02', durationMs: 14 },
      { stepId: 'act-2', name: 'Classify Category', type: 'action', status: 'success', input: 'Matched rule "Network"', output: 'Category: Network (Wi-Fi)', timestamp: '10:15:02', durationMs: 8 },
      { stepId: 'act-3', name: 'Determine Priority', type: 'action', status: 'success', input: 'Impact keywords: none critical', output: 'Priority: Medium', timestamp: '10:15:02', durationMs: 5 },
      { stepId: 'act-4', name: 'Select Assignment Group', type: 'action', status: 'success', input: 'Category "Network" routing matrix', output: 'Target: Network Support', timestamp: '10:15:02', durationMs: 4 },
      { stepId: 'cnd-1', name: 'Confidence >= 70%?', type: 'condition', status: 'success', input: 'Calculated: 94%', output: 'Branch: YES (Above 70% threshold)', timestamp: '10:15:02', durationMs: 2 },
      { stepId: 'act-5', name: 'Automatically Assign Ticket', type: 'action', status: 'success', input: 'Assigning to Network Support', output: 'Assigned successfully to David Chen', timestamp: '10:15:03', durationMs: 9 },
    ],
    notes: [
      { id: 'n-1', author: 'David Chen', content: 'Requested user MAC address to check Aruba wireless controller logs.', createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), isInternal: false },
    ],
  },
  {
    id: 'INC-1002',
    title: 'Unable to login to my company account',
    description: 'I cannot login to my company account on Okta. It states my account is locked out due to multiple invalid password attempts. I need an urgent password reset as I have a customer presentation.',
    requesterName: 'Alex Mercer',
    requesterEmail: 'alex.mercer@company.internal',
    requesterDepartment: 'Sales',
    category: 'Access Management',
    subcategory: 'Account Locked',
    priority: 'High',
    assignmentGroup: 'Identity & Access Support',
    assignedAgent: 'Amara Okafor',
    status: 'In Progress',
    confidence: 96,
    matchedKeywords: ['unable', 'login', 'account', 'locked', 'password', 'cannot login'],
    isAutoClassified: true,
    requiresManualReview: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'INC-1003',
    title: 'Outlook is not sending emails',
    description: 'Microsoft Outlook is stuck in "Working Offline" mode. Any outgoing mail stays in the Outbox folder. Receiving email seems delayed as well.',
    requesterName: 'Samantha Ray',
    requesterEmail: 'samantha.ray@company.internal',
    requesterDepartment: 'Finance',
    category: 'Email',
    subcategory: 'Outlook',
    priority: 'Medium',
    assignmentGroup: 'Email Support',
    assignedAgent: 'Michael Scott',
    status: 'New',
    confidence: 91,
    matchedKeywords: ['outlook', 'sending', 'emails', 'mail', 'mailbox'],
    isAutoClassified: true,
    requiresManualReview: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
  },
  {
    id: 'INC-1004',
    title: 'Printer is not working on 4th floor finance area',
    description: 'The HP LaserJet shared printer on floor 4 gives an error code 50.4 Fuser Error on the screen and refuses to print any queued invoices. A red indicator is flashing.',
    requesterName: 'Thomas Anderson',
    requesterEmail: 'thomas.a@company.internal',
    requesterDepartment: 'Accounting',
    category: 'Hardware',
    subcategory: 'Printer / Scanner',
    priority: 'Medium',
    assignmentGroup: 'Hardware Support',
    assignedAgent: 'Marcus Vance',
    status: 'In Progress',
    confidence: 88,
    matchedKeywords: ['printer', 'working', 'screen', 'error'],
    isAutoClassified: true,
    requiresManualReview: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'INC-1005',
    title: 'Production server is down for all users',
    description: 'CRITICAL ALERT: The main production server cluster hosting our customer-facing portal has crashed. System down for all users worldwide. Error 503 Service Unavailable. Major outage affecting checkout checkout.',
    requesterName: 'DevOps Automated Monitor',
    requesterEmail: 'alerts@company.internal',
    requesterDepartment: 'Engineering',
    category: 'Network',
    subcategory: 'DNS / Firewall',
    priority: 'Critical',
    assignmentGroup: 'Network Support',
    assignedAgent: 'David Chen',
    status: 'In Progress',
    confidence: 98,
    matchedKeywords: ['production down', 'server down', 'all users', 'major outage', 'system down'],
    isAutoClassified: true,
    requiresManualReview: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: 'INC-1006',
    title: 'I think I clicked a phishing email',
    description: 'I received an email claiming to be from "Company HR Payroll" with an attached zip file. I opened it and entered my Windows credentials on a strange site. Now my desktop is showing suspicious powershell prompts.',
    requesterName: 'Laura Bailey',
    requesterEmail: 'laura.b@company.internal',
    requesterDepartment: 'Legal',
    category: 'Security',
    subcategory: 'Phishing',
    priority: 'Critical',
    assignmentGroup: 'Security Operations',
    assignedAgent: 'Alexander Ross',
    status: 'In Progress',
    confidence: 95,
    matchedKeywords: ['phishing', 'email', 'suspicious', 'credentials', 'security'],
    isAutoClassified: true,
    requiresManualReview: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: 'INC-1007',
    title: 'Requesting 3 days annual leave approval in payroll portal',
    description: 'I submitted my annual leave request for next month in the HR portal, but my line manager says the leave balance shows negative hours. Could HR check my payroll holiday accrual records?',
    requesterName: 'Kevin Malone',
    requesterEmail: 'kevin.m@company.internal',
    requesterDepartment: 'Operations',
    category: 'HR',
    subcategory: 'Leave Administration',
    priority: 'Low',
    assignmentGroup: 'HR Support',
    assignedAgent: 'Priya Sharma',
    status: 'Resolved',
    confidence: 92,
    matchedKeywords: ['leave', 'payroll', 'hr', 'holiday'],
    isAutoClassified: true,
    requiresManualReview: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'INC-1008',
    title: 'ERP application crashes immediately after latest update',
    description: 'Whenever I open the Oracle ERP desktop application after the recent patch update, an unhandled runtime error dialog appears and the application terminates instantly. Unable to post quarterly entries.',
    requesterName: 'Chloe Bennett',
    requesterEmail: 'chloe.b@company.internal',
    requesterDepartment: 'Accounting',
    category: 'Software',
    subcategory: 'Crash / Error',
    priority: 'High',
    assignmentGroup: 'Application Support',
    assignedAgent: 'Elena Rostova',
    status: 'In Progress',
    confidence: 93,
    matchedKeywords: ['application', 'crashes', 'update', 'error', 'application not working', 'bug'],
    isAutoClassified: true,
    requiresManualReview: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 190).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: 'INC-1009',
    title: 'Need password reset for SAP finance portal - account locked',
    description: 'My username is locked out in SAP GUI due to expired password. Please reset password and send a temporary passcode to my mobile number.',
    requesterName: 'Daniel Craig',
    requesterEmail: 'daniel.c@company.internal',
    requesterDepartment: 'Finance',
    category: 'Access Management',
    subcategory: 'Password Reset',
    priority: 'Medium',
    assignmentGroup: 'Identity & Access Support',
    assignedAgent: 'Amara Okafor',
    status: 'Resolved',
    confidence: 97,
    matchedKeywords: ['password reset', 'locked', 'account', 'username', 'password'],
    isAutoClassified: true,
    requiresManualReview: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'INC-1010',
    title: 'Second monitor screen flickering and going black periodically',
    description: 'My external Dell 27-inch monitor screen keeps going black for 3 seconds every few minutes. I swapped the HDMI cable with a colleague but the desktop display continues to glitch.',
    requesterName: 'Nathan Drake',
    requesterEmail: 'nathan.d@company.internal',
    requesterDepartment: 'Product',
    category: 'Hardware',
    subcategory: 'Monitor',
    priority: 'Low',
    assignmentGroup: 'Hardware Support',
    assignedAgent: 'Marcus Vance',
    status: 'New',
    confidence: 89,
    matchedKeywords: ['monitor', 'screen', 'desktop'],
    isAutoClassified: true,
    requiresManualReview: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
  {
    id: 'INC-1011',
    title: 'VPN disconnects every 10 minutes when working from home',
    description: 'The Cisco AnyConnect VPN client drops connection continuously during Zoom calls. Internet connection at home is 300 Mbps on ethernet, but VPN tunnels keep resetting.',
    requesterName: 'Zoe Saldana',
    requesterEmail: 'zoe.s@company.internal',
    requesterDepartment: 'Customer Success',
    category: 'Network',
    subcategory: 'VPN',
    priority: 'Medium',
    assignmentGroup: 'Network Support',
    assignedAgent: 'David Chen',
    status: 'In Progress',
    confidence: 92,
    matchedKeywords: ['vpn', 'disconnects', 'connection', 'internet', 'ethernet'],
    isAutoClassified: true,
    requiresManualReview: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: 'INC-1012',
    title: 'Suspicious ransomware warning pop-up detected on finance workstation',
    description: 'URGENT SECURITY ALERT: An employee computer in Accounting displays a red lock screen claiming files have been encrypted with a ransom demand. Disconnected from network immediately.',
    requesterName: 'Robert Langdon',
    requesterEmail: 'robert.l@company.internal',
    requesterDepartment: 'Internal Audit',
    category: 'Security',
    subcategory: 'Malware',
    priority: 'Critical',
    assignmentGroup: 'Security Operations',
    assignedAgent: 'Alexander Ross',
    status: 'In Progress',
    confidence: 99,
    matchedKeywords: ['ransomware', 'suspicious', 'security', 'computer', 'network'],
    isAutoClassified: true,
    requiresManualReview: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: 'INC-1013',
    title: 'Salary discrepancy on September payslip for overtime hours',
    description: 'My September salary transfer does not include approved weekend overtime hours from the payroll cycle. Requesting HR payroll team review.',
    requesterName: 'Peter Parker',
    requesterEmail: 'peter.p@company.internal',
    requesterDepartment: 'Design',
    category: 'HR',
    subcategory: 'Payroll & Salary',
    priority: 'Low',
    assignmentGroup: 'HR Support',
    assignedAgent: 'Priya Sharma',
    status: 'New',
    confidence: 86,
    matchedKeywords: ['salary', 'payslip', 'payroll', 'hr'],
    isAutoClassified: true,
    requiresManualReview: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
  },
  {
    id: 'INC-1014',
    title: 'General question regarding office visitor badge policy',
    description: 'Could someone clarify what the procedure is for registering an external vendor visiting on Friday? No technical issue, just inquiring about protocol.',
    requesterName: 'Gwen Stacy',
    requesterEmail: 'gwen.s@company.internal',
    requesterDepartment: 'HR',
    category: 'General IT',
    subcategory: 'Other',
    priority: 'Low',
    assignmentGroup: 'Service Desk',
    assignedAgent: undefined,
    status: 'New',
    confidence: 42,
    matchedKeywords: ['question', 'general inquiry'],
    isAutoClassified: true,
    requiresManualReview: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
  },
];

export const DEFAULT_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'Critical Incident Detected',
    message: 'INC-1005: Production server down for all users automatically routed to Network Support.',
    type: 'critical',
    timestamp: '12m ago',
    read: false,
    ticketId: 'INC-1005',
  },
  {
    id: 'notif-2',
    title: 'Security Alert Triggered',
    message: 'INC-1012: Ransomware warning reported on workstation. Flow routed to SecOps.',
    type: 'critical',
    timestamp: '45m ago',
    read: false,
    ticketId: 'INC-1012',
  },
  {
    id: 'notif-3',
    title: 'Low Confidence Ticket Queued',
    message: 'INC-1014 flagged for Service Desk manual triage (confidence 42% < 70%).',
    type: 'warning',
    timestamp: '2h ago',
    read: true,
    ticketId: 'INC-1014',
  },
];

// Safe LocalStorage API
export const storageService = {
  isAvailable(): boolean {
    try {
      const testKey = '__flowticket_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  },

  getItem<T>(key: string, fallback: T): T {
    try {
      if (!this.isAvailable()) return fallback;
      const raw = window.localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  setItem<T>(key: string, value: T): boolean {
    try {
      if (!this.isAvailable()) return false;
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  initializeDefaultsIfEmpty(): void {
    try {
      const isInit = this.getItem<boolean>(STORAGE_KEYS.INITIALIZED, false);
      if (!isInit) {
        this.setItem(STORAGE_KEYS.TICKETS, SAMPLE_TICKETS);
        this.setItem(STORAGE_KEYS.RULES, DEFAULT_RULES);
        this.setItem(STORAGE_KEYS.GROUPS, DEFAULT_GROUPS);
        this.setItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
        this.setItem(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
        this.setItem(STORAGE_KEYS.INITIALIZED, true);
      }
    } catch (e) {
      console.warn('Storage init fallback:', e);
    }
  },

  getTickets(): Ticket[] {
    const tickets = this.getItem<Ticket[]>(STORAGE_KEYS.TICKETS, []);
    return tickets.length > 0 ? tickets : SAMPLE_TICKETS;
  },

  saveTickets(tickets: Ticket[]): void {
    this.setItem(STORAGE_KEYS.TICKETS, tickets);
  },

  getRules(): ClassificationRule[] {
    const rules = this.getItem<ClassificationRule[]>(STORAGE_KEYS.RULES, []);
    return rules.length > 0 ? rules : DEFAULT_RULES;
  },

  saveRules(rules: ClassificationRule[]): void {
    this.setItem(STORAGE_KEYS.RULES, rules);
  },

  getGroups(): AssignmentGroup[] {
    const groups = this.getItem<AssignmentGroup[]>(STORAGE_KEYS.GROUPS, []);
    return groups.length > 0 ? groups : DEFAULT_GROUPS;
  },

  saveGroups(groups: AssignmentGroup[]): void {
    this.setItem(STORAGE_KEYS.GROUPS, groups);
  },

  getSettings(): SystemSettings {
    return this.getItem<SystemSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },

  saveSettings(settings: SystemSettings): void {
    this.setItem(STORAGE_KEYS.SETTINGS, settings);
  },

  getNotifications(): SystemNotification[] {
    return this.getItem<SystemNotification[]>(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
  },

  saveNotifications(notifs: SystemNotification[]): void {
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },

  getAuth(): any {
    return this.getItem(STORAGE_KEYS.AUTH_USER, null);
  },

  saveAuth(user: any): void {
    this.setItem(STORAGE_KEYS.AUTH_USER, user);
  },

  clearAuth(): void {
    try {
      if (this.isAvailable()) {
        window.localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      }
    } catch {
      // safe ignore
    }
  },

  resetAllToFactory(): void {
    try {
      if (this.isAvailable()) {
        window.localStorage.removeItem(STORAGE_KEYS.TICKETS);
        window.localStorage.removeItem(STORAGE_KEYS.RULES);
        window.localStorage.removeItem(STORAGE_KEYS.GROUPS);
        window.localStorage.removeItem(STORAGE_KEYS.SETTINGS);
        window.localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
        window.localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
      }
      this.initializeDefaultsIfEmpty();
    } catch {
      // safe fallback
    }
  },
};
