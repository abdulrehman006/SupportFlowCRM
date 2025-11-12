// SupportFlowCRM - Database Seed File
// Creates initial admin user and demo data

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Hash password
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@supportflowcrm.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@supportflowcrm.com',
      password: hashedPassword,
      role: 'ADMIN',
      phone: '+1 (555) 123-4567',
      bio: 'System Administrator',
      isActive: true,
      emailNotifications: true,
      timezone: 'America/New_York',
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create supervisor user
  const supervisor = await prisma.user.upsert({
    where: { email: 'supervisor@supportflowcrm.com' },
    update: {},
    create: {
      name: 'Sarah Wilson',
      email: 'supervisor@supportflowcrm.com',
      password: hashedPassword,
      role: 'SUPERVISOR',
      phone: '+1 (555) 234-5678',
      bio: 'Customer Support Supervisor',
      isActive: true,
      emailNotifications: true,
      timezone: 'America/New_York',
    },
  });

  console.log('✅ Supervisor user created:', supervisor.email);

  // Create agent users
  const agent1 = await prisma.user.upsert({
    where: { email: 'john@supportflowcrm.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@supportflowcrm.com',
      password: hashedPassword,
      role: 'AGENT',
      phone: '+1 (555) 345-6789',
      bio: 'Senior Support Agent',
      isActive: true,
      emailNotifications: true,
      timezone: 'America/New_York',
    },
  });

  console.log('✅ Agent user created:', agent1.email);

  const agent2 = await prisma.user.upsert({
    where: { email: 'emma@supportflowcrm.com' },
    update: {},
    create: {
      name: 'Emma Johnson',
      email: 'emma@supportflowcrm.com',
      password: hashedPassword,
      role: 'AGENT',
      phone: '+1 (555) 456-7890',
      bio: 'Support Agent',
      isActive: true,
      emailNotifications: true,
      timezone: 'America/Los_Angeles',
    },
  });

  console.log('✅ Agent user created:', agent2.email);

  const agent3 = await prisma.user.upsert({
    where: { email: 'mike@supportflowcrm.com' },
    update: {},
    create: {
      name: 'Mike Chen',
      email: 'mike@supportflowcrm.com',
      password: hashedPassword,
      role: 'AGENT',
      phone: '+1 (555) 567-8901',
      bio: 'Support Agent',
      isActive: true,
      emailNotifications: true,
      timezone: 'America/Chicago',
    },
  });

  console.log('✅ Agent user created:', agent3.email);

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📝 Login credentials:');
  console.log('   Admin: admin@supportflowcrm.com / admin123');
  console.log('   Supervisor: supervisor@supportflowcrm.com / admin123');
  console.log('   Agent: john@supportflowcrm.com / admin123');
  console.log('   Agent: emma@supportflowcrm.com / admin123');
  console.log('   Agent: mike@supportflowcrm.com / admin123');
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
