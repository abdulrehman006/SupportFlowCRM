'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Plus, Mail, Phone, Building2, Ticket } from 'lucide-react';
import { CreateContactDialog } from '@/components/contacts/CreateContactDialog';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  department?: string;
  leadScore: number;
  leadStatus: string;
  company?: {
    id: string;
    name: string;
  };
  _count: {
    tickets: number;
  };
  createdAt: string;
}

const leadStatusColors: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-800',
  CONTACTED: 'bg-purple-100 text-purple-800',
  QUALIFIED: 'bg-green-100 text-green-800',
  UNQUALIFIED: 'bg-gray-100 text-gray-800',
  CUSTOMER: 'bg-emerald-100 text-emerald-800',
};

export default function ContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts');
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch =
      contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.company?.name || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !statusFilter || statusFilter === 'ALL' || contact.leadStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getLeadScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 font-semibold';
    if (score >= 50) return 'text-yellow-600 font-semibold';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading contacts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contacts</h1>
          <p className="text-gray-500">Manage your customer contacts and leads</p>
        </div>
        <CreateContactDialog onSuccess={fetchContacts} />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Lead Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="CONTACTED">Contacted</SelectItem>
                <SelectItem value="QUALIFIED">Qualified</SelectItem>
                <SelectItem value="UNQUALIFIED">Unqualified</SelectItem>
                <SelectItem value="CUSTOMER">Customer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContacts.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="text-center py-12 text-gray-500">
                No contacts found matching your criteria
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <Card
              key={contact.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/contacts/${contact.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">
                      {contact.firstName} {contact.lastName}
                    </CardTitle>
                    {contact.jobTitle && (
                      <p className="text-sm text-gray-600">{contact.jobTitle}</p>
                    )}
                    {contact.department && (
                      <p className="text-xs text-gray-500">{contact.department}</p>
                    )}
                  </div>
                  <Badge className={leadStatusColors[contact.leadStatus]}>
                    {contact.leadStatus}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a
                      href={`mailto:${contact.email}`}
                      className="hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {contact.email}
                    </a>
                  </div>

                  {contact.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <a
                        href={`tel:${contact.phone}`}
                        className="hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {contact.phone}
                      </a>
                    </div>
                  )}

                  {contact.company && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span>{contact.company.name}</span>
                    </div>
                  )}
                </div>

                {/* Lead Score & Tickets */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <div>
                    <p className="text-xs text-gray-500">Lead Score</p>
                    <p className={`text-lg ${getLeadScoreColor(contact.leadScore)}`}>
                      {contact.leadScore}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Ticket className="w-4 h-4" />
                    <span>{contact._count.tickets} tickets</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary */}
      {filteredContacts.length > 0 && (
        <Card>
          <CardContent className="py-4">
            <p className="text-center text-gray-600">
              Showing <span className="font-semibold">{filteredContacts.length}</span> of{' '}
              <span className="font-semibold">{contacts.length}</span> contacts
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
