'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Briefcase,
  MapPin,
  Calendar,
  Ticket,
  Edit,
  Trash2,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface ContactDetail {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  department?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  leadScore: number;
  leadStatus: string;
  company?: {
    id: string;
    name: string;
    website?: string;
  };
  tickets: Array<{
    id: string;
    ticketNumber: string;
    subject: string;
    status: string;
    priority: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

const leadStatusColors: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-800',
  CONTACTED: 'bg-purple-100 text-purple-800',
  QUALIFIED: 'bg-green-100 text-green-800',
  UNQUALIFIED: 'bg-gray-100 text-gray-800',
  CUSTOMER: 'bg-emerald-100 text-emerald-800',
};

const ticketStatusColors: Record<string, string> = {
  OPEN: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  WAITING_FOR_CUSTOMER: 'bg-orange-100 text-orange-800',
  RESOLVED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-800',
};

const priorityColors: Record<string, string> = {
  LOW: 'bg-gray-100 text-gray-800',
  MEDIUM: 'bg-blue-100 text-blue-800',
  HIGH: 'bg-orange-100 text-orange-800',
  URGENT: 'bg-red-100 text-red-800',
};

export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [contact, setContact] = useState<ContactDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchContact();
  }, [params.id]);

  const fetchContact = async () => {
    try {
      const response = await fetch(`/api/contacts/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setContact(data);
      }
    } catch (error) {
      console.error('Error fetching contact:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!contact) return;

    const confirmed = confirm(
      `Are you sure you want to delete ${contact.firstName} ${contact.lastName}? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/contacts/${contact.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/contacts');
      } else {
        alert('Failed to delete contact');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Failed to delete contact');
    } finally {
      setDeleting(false);
    }
  };

  const getLeadScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-gray-600';
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

  if (!contact) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500">Contact not found</p>
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
          onClick={() => router.push('/contacts')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Contacts
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">
                {contact.firstName} {contact.lastName}
              </h1>
              <Badge className={leadStatusColors[contact.leadStatus]}>
                {contact.leadStatus}
              </Badge>
            </div>
            {contact.jobTitle && (
              <p className="text-lg text-gray-600">{contact.jobTitle}</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/contacts/${contact.id}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={handleDelete}
              disabled={deleting}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a
                      href={`mailto:${contact.email}`}
                      className="font-medium hover:underline"
                    >
                      {contact.email}
                    </a>
                  </div>
                </div>

                {contact.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <a
                        href={`tel:${contact.phone}`}
                        className="font-medium hover:underline"
                      >
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                )}

                {contact.company && (
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Company</p>
                      <p className="font-medium">{contact.company.name}</p>
                    </div>
                  </div>
                )}

                {contact.department && (
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="font-medium">{contact.department}</p>
                    </div>
                  </div>
                )}
              </div>

              {(contact.address || contact.city || contact.state) && (
                <div className="pt-4 border-t">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">
                        {contact.address && <>{contact.address}<br /></>}
                        {contact.city && contact.state && (
                          <>{contact.city}, {contact.state} {contact.zipCode}</>
                        )}
                        {contact.country && <><br />{contact.country}</>}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tickets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="w-5 h-5" />
                Tickets ({contact.tickets.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {contact.tickets.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No tickets from this contact yet
                </p>
              ) : (
                <div className="space-y-3">
                  {contact.tickets.map((ticket) => (
                    <Link
                      key={ticket.id}
                      href={`/tickets/${ticket.id}`}
                      className="block"
                    >
                      <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-sm text-gray-500">
                                {ticket.ticketNumber}
                              </span>
                              <Badge className={ticketStatusColors[ticket.status]}>
                                {ticket.status.replace(/_/g, ' ')}
                              </Badge>
                              <Badge className={priorityColors[ticket.priority]}>
                                {ticket.priority}
                              </Badge>
                            </div>
                            <p className="font-medium">{ticket.subject}</p>
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(ticket.createdAt), {
                              addSuffix: true,
                            })}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Lead Information */}
          <Card>
            <CardHeader>
              <CardTitle>Lead Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Lead Score</label>
                <div className="flex items-baseline gap-2">
                  <p className={`text-3xl font-bold ${getLeadScoreColor(contact.leadScore)}`}>
                    {contact.leadScore}
                  </p>
                  <span className="text-sm text-gray-500">/ 100</span>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">Lead Status</label>
                <p className="font-medium">{contact.leadStatus}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500">Total Tickets</label>
                <p className="font-medium">{contact.tickets.length}</p>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium">
                  {formatDistanceToNow(new Date(contact.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium">
                  {formatDistanceToNow(new Date(contact.updatedAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
