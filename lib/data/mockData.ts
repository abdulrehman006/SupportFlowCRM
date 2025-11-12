// Mock data for SupportFlowCRM Dashboard
// This file contains realistic static data for Module 1

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SUPERVISOR' | 'AGENT';
  image?: string;
  isActive: boolean;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  leadScore: number;
  leadStatus: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'UNQUALIFIED' | 'CUSTOMER';
  createdAt: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_CUSTOMER' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category: 'BUG' | 'FEATURE_REQUEST' | 'QUESTION' | 'ISSUE' | 'TECHNICAL_SUPPORT' | 'BILLING';
  contactId: string;
  contactName: string;
  assignedToId?: string;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

export interface Activity {
  id: string;
  type: string;
  action: string;
  userId: string;
  userName: string;
  userImage?: string;
  ticketId?: string;
  ticketNumber?: string;
  details?: string;
  createdAt: string;
}

export interface DashboardMetrics {
  totalOpenTickets: number;
  pendingTickets: number;
  resolvedThisWeek: number;
  averageResolutionTime: string;
  customerSatisfaction: number;
  firstResponseTime: string;
  activeCustomers: number;
  totalContacts: number;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@supportflowcrm.com',
    role: 'ADMIN',
    isActive: true,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@supportflowcrm.com',
    role: 'SUPERVISOR',
    isActive: true,
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike.c@supportflowcrm.com',
    role: 'AGENT',
    isActive: true,
  },
  {
    id: '4',
    name: 'Emma Davis',
    email: 'emma.d@supportflowcrm.com',
    role: 'AGENT',
    isActive: true,
  },
  {
    id: '5',
    name: 'James Wilson',
    email: 'james.w@supportflowcrm.com',
    role: 'AGENT',
    isActive: true,
  },
];

// Mock Contacts
export const mockContacts: Contact[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@techcorp.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Inc.',
    leadScore: 85,
    leadStatus: 'CUSTOMER',
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: '2',
    firstName: 'Alice',
    lastName: 'Brown',
    email: 'alice.b@innovate.io',
    phone: '+1 (555) 234-5678',
    company: 'Innovate Solutions',
    leadScore: 72,
    leadStatus: 'QUALIFIED',
    createdAt: '2025-02-20T14:30:00Z',
  },
  {
    id: '3',
    firstName: 'Robert',
    lastName: 'Martinez',
    email: 'robert.m@startup.com',
    phone: '+1 (555) 345-6789',
    company: 'Startup Labs',
    leadScore: 45,
    leadStatus: 'CONTACTED',
    createdAt: '2025-03-10T09:15:00Z',
  },
  {
    id: '4',
    firstName: 'Linda',
    lastName: 'Taylor',
    email: 'linda.t@enterprise.com',
    phone: '+1 (555) 456-7890',
    company: 'Enterprise Corp',
    leadScore: 90,
    leadStatus: 'CUSTOMER',
    createdAt: '2024-12-05T16:45:00Z',
  },
  {
    id: '5',
    firstName: 'David',
    lastName: 'Anderson',
    email: 'david.a@business.net',
    phone: '+1 (555) 567-8901',
    company: 'Business Networks',
    leadScore: 60,
    leadStatus: 'QUALIFIED',
    createdAt: '2025-03-15T11:20:00Z',
  },
];

// Mock Tickets
export const mockTickets: Ticket[] = [
  {
    id: '1',
    ticketNumber: 'T-0001',
    subject: 'Unable to login to dashboard',
    description: 'I keep getting "Invalid credentials" error when trying to log in.',
    status: 'OPEN',
    priority: 'HIGH',
    category: 'TECHNICAL_SUPPORT',
    contactId: '1',
    contactName: 'John Smith',
    assignedToId: '3',
    assignedToName: 'Mike Chen',
    createdAt: '2025-11-11T08:30:00Z',
    updatedAt: '2025-11-11T08:30:00Z',
  },
  {
    id: '2',
    ticketNumber: 'T-0002',
    subject: 'Feature request: Dark mode',
    description: 'It would be great to have a dark mode option for the dashboard.',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    category: 'FEATURE_REQUEST',
    contactId: '2',
    contactName: 'Alice Brown',
    assignedToId: '4',
    assignedToName: 'Emma Davis',
    createdAt: '2025-11-10T14:20:00Z',
    updatedAt: '2025-11-11T09:15:00Z',
  },
  {
    id: '3',
    ticketNumber: 'T-0003',
    subject: 'Billing discrepancy on invoice #12345',
    description: 'The amount charged doesn\'t match what was quoted.',
    status: 'WAITING_FOR_CUSTOMER',
    priority: 'URGENT',
    category: 'BILLING',
    contactId: '4',
    contactName: 'Linda Taylor',
    assignedToId: '5',
    assignedToName: 'James Wilson',
    createdAt: '2025-11-09T10:00:00Z',
    updatedAt: '2025-11-10T16:30:00Z',
  },
  {
    id: '4',
    ticketNumber: 'T-0004',
    subject: 'How to export reports?',
    description: 'I can\'t find the export button for my monthly reports.',
    status: 'RESOLVED',
    priority: 'LOW',
    category: 'QUESTION',
    contactId: '3',
    contactName: 'Robert Martinez',
    assignedToId: '3',
    assignedToName: 'Mike Chen',
    createdAt: '2025-11-08T11:45:00Z',
    updatedAt: '2025-11-09T14:20:00Z',
  },
  {
    id: '5',
    ticketNumber: 'T-0005',
    subject: 'Data export fails with error',
    description: 'Getting "Export failed" error when trying to download customer data.',
    status: 'OPEN',
    priority: 'HIGH',
    category: 'BUG',
    contactId: '5',
    contactName: 'David Anderson',
    assignedToId: '4',
    assignedToName: 'Emma Davis',
    createdAt: '2025-11-11T07:00:00Z',
    updatedAt: '2025-11-11T07:00:00Z',
  },
  {
    id: '6',
    ticketNumber: 'T-0006',
    subject: 'Account setup assistance needed',
    description: 'Need help setting up multiple user accounts for my team.',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    category: 'TECHNICAL_SUPPORT',
    contactId: '1',
    contactName: 'John Smith',
    assignedToId: '5',
    assignedToName: 'James Wilson',
    createdAt: '2025-11-10T15:30:00Z',
    updatedAt: '2025-11-11T10:00:00Z',
  },
  {
    id: '7',
    ticketNumber: 'T-0007',
    subject: 'API documentation request',
    description: 'Where can I find the API documentation for integrations?',
    status: 'RESOLVED',
    priority: 'LOW',
    category: 'QUESTION',
    contactId: '2',
    contactName: 'Alice Brown',
    assignedToId: '3',
    assignedToName: 'Mike Chen',
    createdAt: '2025-11-07T09:00:00Z',
    updatedAt: '2025-11-08T11:30:00Z',
  },
  {
    id: '8',
    ticketNumber: 'T-0008',
    subject: 'Dashboard loading very slowly',
    description: 'The dashboard takes 30+ seconds to load. This started yesterday.',
    status: 'OPEN',
    priority: 'URGENT',
    category: 'ISSUE',
    contactId: '4',
    contactName: 'Linda Taylor',
    createdAt: '2025-11-11T06:45:00Z',
    updatedAt: '2025-11-11T06:45:00Z',
  },
  {
    id: '9',
    ticketNumber: 'T-0009',
    subject: 'Request for additional storage',
    description: 'Our current plan is almost at capacity. Need to upgrade storage.',
    status: 'WAITING_FOR_CUSTOMER',
    priority: 'MEDIUM',
    category: 'BILLING',
    contactId: '3',
    contactName: 'Robert Martinez',
    assignedToId: '5',
    assignedToName: 'James Wilson',
    createdAt: '2025-11-10T13:15:00Z',
    updatedAt: '2025-11-11T08:00:00Z',
  },
  {
    id: '10',
    ticketNumber: 'T-0010',
    subject: 'Password reset not working',
    description: 'The password reset email never arrives in my inbox.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    category: 'TECHNICAL_SUPPORT',
    contactId: '5',
    contactName: 'David Anderson',
    assignedToId: '4',
    assignedToName: 'Emma Davis',
    createdAt: '2025-11-11T09:30:00Z',
    updatedAt: '2025-11-11T10:15:00Z',
  },
];

// Mock Activities
export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'ticket_created',
    action: 'created ticket',
    userId: '1',
    userName: 'John Smith',
    ticketId: '1',
    ticketNumber: 'T-0001',
    details: 'Unable to login to dashboard',
    createdAt: '2025-11-11T08:30:00Z',
  },
  {
    id: '2',
    type: 'ticket_assigned',
    action: 'assigned ticket to Mike Chen',
    userId: '2',
    userName: 'Sarah Johnson',
    ticketId: '1',
    ticketNumber: 'T-0001',
    createdAt: '2025-11-11T08:35:00Z',
  },
  {
    id: '3',
    type: 'status_changed',
    action: 'changed status from Open to In Progress',
    userId: '4',
    userName: 'Emma Davis',
    ticketId: '2',
    ticketNumber: 'T-0002',
    createdAt: '2025-11-11T09:15:00Z',
  },
  {
    id: '4',
    type: 'comment_added',
    action: 'added a comment',
    userId: '3',
    userName: 'Mike Chen',
    ticketId: '4',
    ticketNumber: 'T-0004',
    details: 'The export button is located in the top-right corner of the reports page.',
    createdAt: '2025-11-09T12:30:00Z',
  },
  {
    id: '5',
    type: 'ticket_resolved',
    action: 'resolved ticket',
    userId: '3',
    userName: 'Mike Chen',
    ticketId: '4',
    ticketNumber: 'T-0004',
    createdAt: '2025-11-09T14:20:00Z',
  },
  {
    id: '6',
    type: 'ticket_created',
    action: 'created ticket',
    userId: '5',
    userName: 'David Anderson',
    ticketId: '5',
    ticketNumber: 'T-0005',
    details: 'Data export fails with error',
    createdAt: '2025-11-11T07:00:00Z',
  },
  {
    id: '7',
    type: 'priority_changed',
    action: 'changed priority from Medium to High',
    userId: '2',
    userName: 'Sarah Johnson',
    ticketId: '5',
    ticketNumber: 'T-0005',
    createdAt: '2025-11-11T07:15:00Z',
  },
  {
    id: '8',
    type: 'ticket_assigned',
    action: 'assigned ticket to Emma Davis',
    userId: '2',
    userName: 'Sarah Johnson',
    ticketId: '5',
    ticketNumber: 'T-0005',
    createdAt: '2025-11-11T07:20:00Z',
  },
  {
    id: '9',
    type: 'status_changed',
    action: 'changed status from In Progress to Waiting for Customer',
    userId: '5',
    userName: 'James Wilson',
    ticketId: '3',
    ticketNumber: 'T-0003',
    createdAt: '2025-11-10T16:30:00Z',
  },
  {
    id: '10',
    type: 'ticket_created',
    action: 'created ticket',
    userId: '4',
    userName: 'Linda Taylor',
    ticketId: '8',
    ticketNumber: 'T-0008',
    details: 'Dashboard loading very slowly',
    createdAt: '2025-11-11T06:45:00Z',
  },
];

// Dashboard Metrics
export const mockDashboardMetrics: DashboardMetrics = {
  totalOpenTickets: 4,
  pendingTickets: 3,
  resolvedThisWeek: 8,
  averageResolutionTime: '2.5 hours',
  customerSatisfaction: 4.7,
  firstResponseTime: '18 mins',
  activeCustomers: 42,
  totalContacts: 127,
};

// Chart Data
export const ticketsByStatusData = [
  { name: 'Open', value: 4, color: '#3B82F6' },
  { name: 'In Progress', value: 3, color: '#F59E0B' },
  { name: 'Waiting', value: 2, color: '#EF4444' },
  { name: 'Resolved', value: 2, color: '#10B981' },
  { name: 'Closed', value: 0, color: '#6B7280' },
];

export const ticketsByPriorityData = [
  { name: 'Low', count: 2 },
  { name: 'Medium', count: 4 },
  { name: 'High', count: 3 },
  { name: 'Urgent', count: 2 },
];

export const ticketsTrendData = [
  { date: 'Nov 5', open: 2, resolved: 1 },
  { date: 'Nov 6', open: 3, resolved: 2 },
  { date: 'Nov 7', open: 4, resolved: 3 },
  { date: 'Nov 8', open: 5, resolved: 4 },
  { date: 'Nov 9', open: 4, resolved: 5 },
  { date: 'Nov 10', open: 3, resolved: 3 },
  { date: 'Nov 11', open: 4, resolved: 2 },
];

export const agentPerformanceData = [
  { name: 'Mike Chen', resolved: 12, avgTime: 2.1 },
  { name: 'Emma Davis', resolved: 10, avgTime: 2.4 },
  { name: 'James Wilson', resolved: 8, avgTime: 3.2 },
];

export const resolutionTimeData = [
  { date: 'Nov 5', avgTime: 2.8 },
  { date: 'Nov 6', avgTime: 2.5 },
  { date: 'Nov 7', avgTime: 2.3 },
  { date: 'Nov 8', avgTime: 2.6 },
  { date: 'Nov 9', avgTime: 2.4 },
  { date: 'Nov 10', avgTime: 2.2 },
  { date: 'Nov 11', avgTime: 2.5 },
];

// Helper functions
export function getTicketsByAgent(agentId: string): Ticket[] {
  return mockTickets.filter(ticket => ticket.assignedToId === agentId);
}

export function getTicketsByStatus(status: Ticket['status']): Ticket[] {
  return mockTickets.filter(ticket => ticket.status === status);
}

export function getTicketsByPriority(priority: Ticket['priority']): Ticket[] {
  return mockTickets.filter(ticket => ticket.priority === priority);
}

export function getRecentActivities(limit: number = 10): Activity[] {
  return mockActivities.slice(0, limit);
}

export function getUserById(id: string): User | undefined {
  return mockUsers.find(user => user.id === id);
}

export function getContactById(id: string): Contact | undefined {
  return mockContacts.find(contact => contact.id === id);
}

export function getTicketById(id: string): Ticket | undefined {
  return mockTickets.find(ticket => ticket.id === id);
}
