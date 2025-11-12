// TypeScript type definitions for SupportFlowCRM

export type UserRole = 'ADMIN' | 'SUPERVISOR' | 'AGENT';

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_CUSTOMER' | 'RESOLVED' | 'CLOSED';

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type TicketCategory = 'BUG' | 'FEATURE_REQUEST' | 'QUESTION' | 'ISSUE' | 'TECHNICAL_SUPPORT' | 'BILLING';

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'UNQUALIFIED' | 'CUSTOMER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
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
  leadStatus: LeadStatus;
  createdAt: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
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

export interface ChartDataPoint {
  name: string;
  value?: number;
  count?: number;
  color?: string;
}
