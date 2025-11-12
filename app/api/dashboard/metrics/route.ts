// SupportFlowCRM - Dashboard Metrics API
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get ticket counts by status
    const [
      totalOpenTickets,
      inProgressTickets,
      waitingTickets,
      resolvedThisWeek,
      totalTickets,
      totalContacts,
      totalCompanies,
    ] = await Promise.all([
      prisma.ticket.count({ where: { status: 'OPEN' } }),
      prisma.ticket.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.ticket.count({ where: { status: 'WAITING_FOR_CUSTOMER' } }),
      prisma.ticket.count({
        where: {
          status: 'RESOLVED',
          resolvedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      }),
      prisma.ticket.count(),
      prisma.contact.count(),
      prisma.company.count(),
    ]);

    // Calculate average resolution time (in days)
    const resolvedTickets = await prisma.ticket.findMany({
      where: {
        status: 'RESOLVED',
        resolvedAt: { not: null },
      },
      select: {
        createdAt: true,
        resolvedAt: true,
      },
      take: 100, // Last 100 resolved tickets
    });

    let averageResolutionTime = 0;
    if (resolvedTickets.length > 0) {
      const totalResolutionTime = resolvedTickets.reduce((acc, ticket) => {
        const created = new Date(ticket.createdAt).getTime();
        const resolved = new Date(ticket.resolvedAt!).getTime();
        return acc + (resolved - created);
      }, 0);
      averageResolutionTime = totalResolutionTime / resolvedTickets.length / (1000 * 60 * 60 * 24); // Convert to days
    }

    // Get ticket distribution by status
    const ticketsByStatus = await prisma.ticket.groupBy({
      by: ['status'],
      _count: true,
    });

    // Get ticket distribution by priority
    const ticketsByPriority = await prisma.ticket.groupBy({
      by: ['priority'],
      _count: true,
    });

    // Get recent activities
    const recentActivities = await prisma.activity.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        ticket: {
          select: {
            ticketNumber: true,
          },
        },
      },
    });

    // Get tickets created over time (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const ticketsOverTime = await prisma.$queryRaw<Array<{ date: Date; count: bigint }>>`
      SELECT DATE("createdAt") as date, COUNT(*)::int as count
      FROM tickets
      WHERE "createdAt" >= ${thirtyDaysAgo}
      GROUP BY DATE("createdAt")
      ORDER BY DATE("createdAt") ASC
    `;

    // Get top agents by tickets resolved
    const topAgents = await prisma.user.findMany({
      where: {
        assignedTickets: {
          some: {
            status: 'RESOLVED',
          },
        },
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            assignedTickets: {
              where: {
                status: 'RESOLVED',
              },
            },
          },
        },
      },
      orderBy: {
        assignedTickets: {
          _count: 'desc',
        },
      },
      take: 5,
    });

    const metrics = {
      totalOpenTickets,
      pendingTickets: inProgressTickets + waitingTickets,
      resolvedThisWeek,
      averageResolutionTime: `${averageResolutionTime.toFixed(1)} days`,
      customerSatisfaction: 4.5, // This would come from a survey system
      firstResponseTime: '2.5 hours', // This would be calculated from first comment timestamp
      activeCustomers: totalContacts,
      totalContacts,
      totalCompanies,
      totalTickets,
    };

    const charts = {
      ticketsByStatus: ticketsByStatus.map((item) => ({
        name: item.status.replace(/_/g, ' '),
        value: item._count,
      })),
      ticketsByPriority: ticketsByPriority.map((item) => ({
        name: item.priority,
        value: item._count,
      })),
      ticketsOverTime: ticketsOverTime.map((item) => ({
        date: item.date.toISOString().split('T')[0],
        count: Number(item.count),
      })),
      topAgents: topAgents.map((agent) => ({
        name: agent.name,
        resolved: agent._count.assignedTickets,
      })),
    };

    const activities = recentActivities.map((activity) => ({
      id: activity.id,
      type: activity.type,
      action: activity.action,
      description: activity.description,
      userName: activity.user.name,
      userImage: activity.user.image,
      ticketNumber: activity.ticket?.ticketNumber,
      createdAt: activity.createdAt,
    }));

    return NextResponse.json({
      metrics,
      charts,
      activities,
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}
