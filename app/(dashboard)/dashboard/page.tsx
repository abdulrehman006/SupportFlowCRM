'use client';

import { useEffect, useState } from 'react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TicketIcon,
  Clock,
  TrendingUp,
  Users,
  Star,
  Timer,
  UserCheck,
  Database,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Status colors for pie chart
const STATUS_COLORS: Record<string, string> = {
  'OPEN': '#3B82F6',
  'IN PROGRESS': '#F59E0B',
  'WAITING FOR CUSTOMER': '#EF4444',
  'RESOLVED': '#10B981',
  'CLOSED': '#6B7280',
};

interface DashboardData {
  metrics: {
    totalOpenTickets: number;
    pendingTickets: number;
    resolvedThisWeek: number;
    averageResolutionTime: string;
    customerSatisfaction: number;
    firstResponseTime: string;
    activeCustomers: number;
    totalContacts: number;
    totalCompanies: number;
    totalTickets: number;
  };
  charts: {
    ticketsByStatus: Array<{ name: string; value: number }>;
    ticketsByPriority: Array<{ name: string; value: number }>;
    ticketsOverTime: Array<{ date: string; count: number }>;
    topAgents: Array<{ name: string; resolved: number }>;
  };
  activities: Array<{
    id: string;
    type: string;
    action: string;
    description: string;
    userName: string;
    userImage: string | null;
    ticketNumber: string | null;
    createdAt: string;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard/metrics');
      if (response.ok) {
        const dashboardData = await response.json();
        setData(dashboardData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-500">Failed to load dashboard data</div>
      </div>
    );
  }

  const { metrics, charts, activities } = data;

  // Add colors to status data
  const ticketsByStatusWithColors = charts.ticketsByStatus.map((item) => ({
    ...item,
    color: STATUS_COLORS[item.name] || '#6B7280',
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back! Here's what's happening with your support tickets.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Open Tickets"
          value={metrics.totalOpenTickets}
          description="Tickets requiring attention"
          icon={TicketIcon}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
          trend={{ value: 12, isPositive: false }}
        />
        <MetricCard
          title="Pending Tickets"
          value={metrics.pendingTickets}
          description="Awaiting customer response"
          icon={Clock}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
          trend={{ value: 5, isPositive: true }}
        />
        <MetricCard
          title="Resolved This Week"
          value={metrics.resolvedThisWeek}
          description="Tickets closed successfully"
          icon={TrendingUp}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
          trend={{ value: 18, isPositive: true }}
        />
        <MetricCard
          title="Avg Resolution Time"
          value={metrics.averageResolutionTime}
          description="Average time to resolve"
          icon={Timer}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
        />
      </div>

      {/* Second Row Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Customer Satisfaction"
          value={`${metrics.customerSatisfaction}/5.0`}
          description="Average rating from customers"
          icon={Star}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-100"
        />
        <MetricCard
          title="First Response Time"
          value={metrics.firstResponseTime}
          description="Average first response"
          icon={Clock}
          iconColor="text-cyan-600"
          iconBgColor="bg-cyan-100"
        />
        <MetricCard
          title="Active Customers"
          value={metrics.activeCustomers}
          description="Customers with open tickets"
          icon={UserCheck}
          iconColor="text-indigo-600"
          iconBgColor="bg-indigo-100"
        />
        <MetricCard
          title="Total Contacts"
          value={metrics.totalContacts}
          description="Contacts in database"
          icon={Database}
          iconColor="text-pink-600"
          iconBgColor="bg-pink-100"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Tickets by Status - Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tickets by Status</CardTitle>
          </CardHeader>
          <CardContent>
            {ticketsByStatusWithColors.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ticketsByStatusWithColors}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ticketsByStatusWithColors.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No ticket data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tickets by Priority - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tickets by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            {charts.ticketsByPriority.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={charts.ticketsByPriority}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No priority data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tickets Over Time - Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Tickets Created (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          {charts.ticketsOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={charts.ticketsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#3B82F6" name="Tickets Created" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No trend data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Agents Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Top Agents by Resolved Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {charts.topAgents.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={charts.topAgents}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="resolved" fill="#10B981" name="Tickets Resolved" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No agent performance data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-medium">
                    {activity.userName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.userName}</span>{' '}
                      {activity.description}
                      {activity.ticketNumber && (
                        <span className="font-medium text-blue-600 ml-1">
                          #{activity.ticketNumber}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No recent activity
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
