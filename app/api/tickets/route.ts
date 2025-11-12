// SupportFlowCRM - Tickets API Routes
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/tickets - List all tickets
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const assignedToId = searchParams.get('assignedTo');

    const where: any = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assignedToId) where.assignedToId = assignedToId;

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

// POST /api/tickets - Create new ticket
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      subject,
      description,
      priority,
      category,
      contactId,
      companyId,
      assignedToId,
    } = body;

    // Validation
    if (!subject || !description || !contactId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the next ticket number
    const lastTicket = await prisma.ticket.findFirst({
      orderBy: { ticketNumber: 'desc' },
      select: { ticketNumber: true },
    });

    let nextNumber = 1;
    if (lastTicket) {
      const lastNumber = parseInt(lastTicket.ticketNumber.split('-')[1]);
      nextNumber = lastNumber + 1;
    }
    const ticketNumber = `T-${String(nextNumber).padStart(4, '0')}`;

    // Create ticket
    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        subject,
        description,
        priority: priority || 'MEDIUM',
        category: category || 'ISSUE',
        contactId,
        companyId,
        assignedToId,
        createdById: session.user.id,
      },
      include: {
        contact: true,
        company: true,
        assignedTo: true,
        createdBy: true,
      },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        type: 'ticket',
        action: 'created',
        description: `Ticket ${ticketNumber} created`,
        userId: session.user.id,
        ticketId: ticket.id,
      },
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json(
      { error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
}
