// SupportFlowCRM - Module 3 Seed Data
// Seeds contacts, companies, tickets, and related data

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Module 3 database seed...');

  // Get existing users
  const admin = await prisma.user.findUnique({ where: { email: 'admin@supportflowcrm.com' } });
  const john = await prisma.user.findUnique({ where: { email: 'john@supportflowcrm.com' } });
  const emma = await prisma.user.findUnique({ where: { email: 'emma@supportflowcrm.com' } });

  if (!admin || !john || !emma) {
    console.error('❌ Users not found. Run the main seed first.');
    return;
  }

  // Create Companies
  console.log('\n📦 Creating companies...');

  const acmeCorp = await prisma.company.upsert({
    where: { name: 'Acme Corporation' },
    update: {},
    create: {
      name: 'Acme Corporation',
      website: 'https://acmecorp.example.com',
      industry: 'Technology',
      size: '500-1000',
      revenue: '$50M-$100M',
      description: 'Leading technology solutions provider',
      customerSince: new Date('2023-01-15'),
      healthScore: 85,
    },
  });

  const techStartup = await prisma.company.upsert({
    where: { name: 'TechStartup Inc' },
    update: {},
    create: {
      name: 'TechStartup Inc',
      website: 'https://techstartup.example.com',
      industry: 'SaaS',
      size: '50-100',
      revenue: '$5M-$10M',
      description: 'Fast-growing SaaS startup',
      customerSince: new Date('2024-03-01'),
      healthScore: 92,
    },
  });

  const retailCo = await prisma.company.upsert({
    where: { name: 'Retail Solutions Co' },
    update: {},
    create: {
      name: 'Retail Solutions Co',
      website: 'https://retailsolutions.example.com',
      industry: 'Retail',
      size: '1000+',
      revenue: '$100M+',
      description: 'Enterprise retail management solutions',
      customerSince: new Date('2022-06-10'),
      healthScore: 78,
    },
  });

  console.log(`✅ Created ${[acmeCorp, techStartup, retailCo].length} companies`);

  // Create Contacts
  console.log('\n👥 Creating contacts...');

  const contacts = await Promise.all([
    prisma.contact.upsert({
      where: { email: 'sarah.johnson@acmecorp.com' },
      update: {},
      create: {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@acmecorp.com',
        phone: '+1 (555) 123-4567',
        jobTitle: 'CTO',
        department: 'Technology',
        companyId: acmeCorp.id,
        leadScore: 95,
        leadStatus: 'CUSTOMER',
        address: '123 Tech Street',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'USA',
        linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
      },
    }),
    prisma.contact.upsert({
      where: { email: 'michael.chen@techstartup.com' },
      update: {},
      create: {
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@techstartup.com',
        phone: '+1 (555) 234-5678',
        jobTitle: 'CEO',
        department: 'Executive',
        companyId: techStartup.id,
        leadScore: 88,
        leadStatus: 'CUSTOMER',
        city: 'New York',
        state: 'NY',
        country: 'USA',
      },
    }),
    prisma.contact.upsert({
      where: { email: 'emily.davis@retailsolutions.com' },
      update: {},
      create: {
        firstName: 'Emily',
        lastName: 'Davis',
        email: 'emily.davis@retailsolutions.com',
        phone: '+1 (555) 345-6789',
        jobTitle: 'Operations Manager',
        department: 'Operations',
        companyId: retailCo.id,
        leadScore: 72,
        leadStatus: 'CUSTOMER',
        city: 'Chicago',
        state: 'IL',
        country: 'USA',
      },
    }),
    prisma.contact.upsert({
      where: { email: 'david.wilson@acmecorp.com' },
      update: {},
      create: {
        firstName: 'David',
        lastName: 'Wilson',
        email: 'david.wilson@acmecorp.com',
        phone: '+1 (555) 456-7890',
        jobTitle: 'Product Manager',
        department: 'Product',
        companyId: acmeCorp.id,
        leadScore: 68,
        leadStatus: 'CUSTOMER',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
      },
    }),
    prisma.contact.upsert({
      where: { email: 'lisa.martinez@prospect.com' },
      update: {},
      create: {
        firstName: 'Lisa',
        lastName: 'Martinez',
        email: 'lisa.martinez@prospect.com',
        phone: '+1 (555) 567-8901',
        jobTitle: 'Marketing Director',
        department: 'Marketing',
        leadScore: 65,
        leadStatus: 'QUALIFIED',
        city: 'Austin',
        state: 'TX',
        country: 'USA',
      },
    }),
  ]);

  console.log(`✅ Created ${contacts.length} contacts`);

  // Create Tags
  console.log('\n🏷️  Creating tags...');

  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: 'urgent' },
      update: {},
      create: { name: 'urgent', color: '#EF4444' },
    }),
    prisma.tag.upsert({
      where: { name: 'bug' },
      update: {},
      create: { name: 'bug', color: '#F59E0B' },
    }),
    prisma.tag.upsert({
      where: { name: 'feature-request' },
      update: {},
      create: { name: 'feature-request', color: '#8B5CF6' },
    }),
    prisma.tag.upsert({
      where: { name: 'vip' },
      update: {},
      create: { name: 'vip', color: '#FBBF24' },
    }),
  ]);

  console.log(`✅ Created ${tags.length} tags`);

  // Create Tickets
  console.log('\n🎫 Creating tickets...');

  const ticket1 = await prisma.ticket.create({
    data: {
      ticketNumber: 'T-0001',
      subject: 'Unable to login to dashboard',
      description: 'User reports that they cannot access their dashboard after the recent update. Getting a 401 error.',
      status: 'OPEN',
      priority: 'HIGH',
      category: 'TECHNICAL_SUPPORT',
      contactId: contacts[0].id,
      companyId: acmeCorp.id,
      assignedToId: john.id,
      createdById: admin.id,
    },
  });

  const ticket2 = await prisma.ticket.create({
    data: {
      ticketNumber: 'T-0002',
      subject: 'Feature request: Dark mode',
      description: 'Would love to have a dark mode option for the application interface.',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      category: 'FEATURE_REQUEST',
      contactId: contacts[1].id,
      companyId: techStartup.id,
      assignedToId: emma.id,
      createdById: admin.id,
    },
  });

  const ticket3 = await prisma.ticket.create({
    data: {
      ticketNumber: 'T-0003',
      subject: 'Billing inquiry for last month',
      description: 'Can you please clarify the charges on last month\'s invoice? Some items are unclear.',
      status: 'WAITING_FOR_CUSTOMER',
      priority: 'LOW',
      category: 'BILLING',
      contactId: contacts[2].id,
      companyId: retailCo.id,
      assignedToId: john.id,
      createdById: admin.id,
    },
  });

  const ticket4 = await prisma.ticket.create({
    data: {
      ticketNumber: 'T-0004',
      subject: 'Dashboard loading very slow',
      description: 'The analytics dashboard takes over 30 seconds to load. This started happening after yesterday.',
      status: 'OPEN',
      priority: 'URGENT',
      category: 'BUG',
      contactId: contacts[3].id,
      companyId: acmeCorp.id,
      assignedToId: emma.id,
      createdById: admin.id,
    },
  });

  const ticket5 = await prisma.ticket.create({
    data: {
      ticketNumber: 'T-0005',
      subject: 'Question about API rate limits',
      description: 'What are the current API rate limits for our plan? We are hitting some restrictions.',
      status: 'RESOLVED',
      priority: 'MEDIUM',
      category: 'QUESTION',
      contactId: contacts[0].id,
      companyId: acmeCorp.id,
      assignedToId: john.id,
      createdById: admin.id,
      resolvedAt: new Date(),
    },
  });

  console.log(`✅ Created 5 tickets`);

  // Add Comments to Tickets
  console.log('\n💬 Adding comments to tickets...');

  await prisma.comment.createMany({
    data: [
      {
        content: 'I\'ve looked into this issue. It appears to be related to session expiry. Working on a fix.',
        isInternal: true,
        ticketId: ticket1.id,
        userId: john.id,
      },
      {
        content: 'Thanks for reporting this. We\'ll investigate and get back to you shortly.',
        isInternal: false,
        ticketId: ticket1.id,
        userId: john.id,
      },
      {
        content: 'Great suggestion! We\'ve added this to our roadmap for Q2.',
        isInternal: false,
        ticketId: ticket2.id,
        userId: emma.id,
      },
      {
        content: 'I\'ve sent you a detailed breakdown of the invoice via email. Please review and let me know if you have any questions.',
        isInternal: false,
        ticketId: ticket3.id,
        userId: john.id,
      },
    ],
  });

  console.log('✅ Added comments to tickets');

  // Create Activities
  console.log('\n📊 Creating activity logs...');

  await prisma.activity.createMany({
    data: [
      {
        type: 'ticket',
        action: 'created',
        description: 'Ticket T-0001 created',
        userId: admin.id,
        ticketId: ticket1.id,
      },
      {
        type: 'ticket',
        action: 'assigned',
        description: 'Ticket T-0001 assigned to John Doe',
        userId: admin.id,
        ticketId: ticket1.id,
      },
      {
        type: 'ticket',
        action: 'commented',
        description: 'Comment added to ticket T-0001',
        userId: john.id,
        ticketId: ticket1.id,
      },
      {
        type: 'ticket',
        action: 'resolved',
        description: 'Ticket T-0005 marked as resolved',
        userId: john.id,
        ticketId: ticket5.id,
      },
    ],
  });

  console.log('✅ Created activity logs');

  console.log('\n🎉 Module 3 seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   Companies: 3`);
  console.log(`   Contacts: ${contacts.length}`);
  console.log(`   Tags: ${tags.length}`);
  console.log(`   Tickets: 5`);
  console.log(`   Comments: 4`);
  console.log(`   Activities: 4`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
