'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Building2, Globe, Users, Ticket } from 'lucide-react';
import { CreateCompanyDialog } from '@/components/companies/CreateCompanyDialog';

interface Company {
  id: string;
  name: string;
  website?: string;
  industry?: string;
  size?: string;
  _count: {
    contacts: number;
    tickets: number;
  };
  createdAt: string;
}

export default function CompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies');
      if (response.ok) {
        const data = await response.json();
        setCompanies(data);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (company.industry || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading companies...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Companies</h1>
          <p className="text-gray-500">Manage your business accounts</p>
        </div>
        <CreateCompanyDialog onSuccess={fetchCompanies} />
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="text-center py-12 text-gray-500">
                No companies found matching your criteria
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredCompanies.map((company) => (
            <Card
              key={company.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/companies/${company.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-5 h-5 text-gray-400" />
                      <CardTitle className="text-xl">{company.name}</CardTitle>
                    </div>
                    {company.industry && (
                      <p className="text-sm text-gray-600">{company.industry}</p>
                    )}
                    {company.size && (
                      <p className="text-xs text-gray-500">{company.size}</p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {company.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-blue-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {company.website}
                    </a>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{company._count.contacts} contacts</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Ticket className="w-4 h-4" />
                    <span>{company._count.tickets} tickets</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary */}
      {filteredCompanies.length > 0 && (
        <Card>
          <CardContent className="py-4">
            <p className="text-center text-gray-600">
              Showing <span className="font-semibold">{filteredCompanies.length}</span> of{' '}
              <span className="font-semibold">{companies.length}</span> companies
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
