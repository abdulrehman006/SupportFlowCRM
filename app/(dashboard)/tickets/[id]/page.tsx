'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowLeft,
  Clock,
  User,
  Building2,
  Mail,
  AlertCircle,
  MessageSquare,
  Activity as ActivityIcon,
  Send
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TicketDetail {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  contact: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  company?: {
    id: string;
    name: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  comments: Array<{
    id: string;
    content: string;
    isInternal: boolean;
    createdAt: string;
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
    };
  }>;
  tags: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  activities: Array<{
    id: string;
    type: string;
    action: string;
    description: string;
    createdAt: string;
    user: {
      id: string;
      name: string;
    };
  }>;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  resolvedAt?: string;
  closedAt?: string;
}

const statusColors: Record<string, string> = {
  OPEN: 'bg-blue-100 text-blue-800 border-blue-200',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  WAITING_FOR_CUSTOMER: 'bg-orange-100 text-orange-800 border-orange-200',
  RESOLVED: 'bg-green-100 text-green-800 border-green-200',
  CLOSED: 'bg-gray-100 text-gray-800 border-gray-200',
};

const priorityColors: Record<string, string> = {
  LOW: 'bg-gray-100 text-gray-800 border-gray-200',
  MEDIUM: 'bg-blue-100 text-blue-800 border-blue-200',
  HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
  URGENT: 'bg-red-100 text-red-800 border-red-200',
};

const statusOptions = [
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'WAITING_FOR_CUSTOMER', label: 'Waiting for Customer' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CLOSED', label: 'Closed' },
];

export default function TicketDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, [params.id]);

  const fetchTicket = async () => {
    try {
      const response = await fetch(`/api/tickets/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setTicket(data);
      }
    } catch (error) {
      console.error('Error fetching ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!ticket) return;

    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/tickets/${ticket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedTicket = await response.json();
        setTicket(updatedTicket);
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !ticket) return;

    setSubmittingComment(true);
    try {
      const response = await fetch(`/api/tickets/${ticket.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          isInternal,
        }),
      });

      if (response.ok) {
        setNewComment('');
        setIsInternal(false);
        fetchTicket(); // Refresh ticket to get new comment
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500">Ticket not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/tickets')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tickets
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{ticket.ticketNumber}</h1>
              <Badge className={statusColors[ticket.status]}>
                {ticket.status.replace(/_/g, ' ')}
              </Badge>
              <Badge className={priorityColors[ticket.priority]}>
                {ticket.priority}
              </Badge>
            </div>
            <h2 className="text-xl text-gray-600">{ticket.subject}</h2>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={ticket.status}
              onValueChange={handleStatusChange}
              disabled={updatingStatus}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Update Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Details */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>

              {ticket.tags && ticket.tags.length > 0 && (
                <div className="flex gap-2 mt-4">
                  {ticket.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      style={{ backgroundColor: `${tag.color}20`, borderColor: tag.color }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Comments ({ticket.comments?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing Comments */}
              {!ticket.comments || ticket.comments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No comments yet</p>
              ) : (
                <div className="space-y-4">
                  {ticket.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`p-4 rounded-lg border ${
                        comment.isInternal
                          ? 'bg-yellow-50 border-yellow-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                          {comment.user.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{comment.user.name}</span>
                            {comment.isInternal && (
                              <Badge variant="outline" className="text-xs">
                                Internal Note
                              </Badge>
                            )}
                            <span className="text-sm text-gray-500">
                              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment Form */}
              <form onSubmit={handleSubmitComment} className="space-y-3 mt-6 pt-6 border-t">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="rounded"
                    />
                    <span>Internal note (not visible to customer)</span>
                  </label>
                  <Button
                    type="submit"
                    disabled={!newComment.trim() || submittingComment}
                  >
                    {submittingComment ? (
                      'Posting...'
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Post Comment
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ActivityIcon className="w-5 h-5" />
                Activity Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!ticket.activities || ticket.activities.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No activity yet</p>
              ) : (
                <div className="space-y-3">
                  {ticket.activities.map((activity) => (
                    <div key={activity.id} className="flex gap-3 text-sm">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500"></div>
                      <div className="flex-1">
                        <p className="text-gray-700">
                          <span className="font-semibold">{activity.user.name}</span>{' '}
                          {activity.description}
                        </p>
                        <p className="text-gray-500 text-xs mt-0.5">
                          {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ticket Info */}
          <Card>
            <CardHeader>
              <CardTitle>Ticket Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Category</label>
                <p className="font-medium">{ticket.category.replace(/_/g, ' ')}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Created
                </label>
                <p className="font-medium">
                  {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-500">Last Updated</label>
                <p className="font-medium">
                  {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
                </p>
              </div>

              {ticket.resolvedAt && (
                <div>
                  <label className="text-sm text-gray-500">Resolved</label>
                  <p className="font-medium">
                    {formatDistanceToNow(new Date(ticket.resolvedAt), { addSuffix: true })}
                  </p>
                </div>
              )}

              {ticket.closedAt && (
                <div>
                  <label className="text-sm text-gray-500">Closed</label>
                  <p className="font-medium">
                    {formatDistanceToNow(new Date(ticket.closedAt), { addSuffix: true })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ticket.contact ? (
                <div>
                  <p className="font-semibold">
                    {ticket.contact.firstName} {ticket.contact.lastName}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Mail className="w-3 h-3" />
                    <a
                      href={`mailto:${ticket.contact.email}`}
                      className="hover:underline"
                    >
                      {ticket.contact.email}
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No contact information</p>
              )}

              {ticket.company && (
                <div className="pt-3 border-t">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Building2 className="w-3 h-3" />
                    <span>{ticket.company.name}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assigned Agent */}
          <Card>
            <CardHeader>
              <CardTitle>Assigned To</CardTitle>
            </CardHeader>
            <CardContent>
              {ticket.assignedTo ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {ticket.assignedTo.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{ticket.assignedTo.name}</p>
                    <p className="text-sm text-gray-600">{ticket.assignedTo.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Unassigned</p>
              )}
            </CardContent>
          </Card>

          {/* Created By */}
          <Card>
            <CardHeader>
              <CardTitle>Created By</CardTitle>
            </CardHeader>
            <CardContent>
              {ticket.createdBy ? (
                <div>
                  <p className="font-semibold">{ticket.createdBy.name}</p>
                  <p className="text-sm text-gray-600">{ticket.createdBy.email}</p>
                </div>
              ) : (
                <p className="text-gray-500">Unknown</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
