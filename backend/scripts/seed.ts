import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  console.log('Wiping old tasks and reviews...');
  await prisma.review.deleteMany({});
  await prisma.task.deleteMany({});

  // Create dummy users
  const dummyCustomer = await prisma.user.upsert({
    where: { email: 'student@campus.edu' },
    update: {},
    create: {
      id: 'dummy_customer_1',
      email: 'student@campus.edu',
      name: 'Rahul Sharma',
      role: 'customer',
      phone: '+91 9876543211',
      isVerified: true,
      walletBalance: 500.0,
      latitude: 28.7041,
      longitude: 77.1025,
      rating: 4.8
    },
  });

  const dummyHelper = await prisma.user.upsert({
    where: { email: 'helper@campus.edu' },
    update: {},
    create: {
      id: 'dummy_helper_1',
      email: 'helper@campus.edu',
      name: 'Amit Kumar',
      role: 'helper',
      phone: '+91 9876543212',
      isVerified: true,
      walletBalance: 1200.0,
      latitude: 28.7042,
      longitude: 77.1026,
      rating: 4.9
    },
  });

  console.log('Created dummy users.');

  // Create dummy tasks
  const tasks = [
    {
      title: 'Deep clean 2BHK apartment',
      description: 'Need a thorough deep cleaning of a 2BHK apartment before moving in. Includes all bathrooms, kitchen, and balcony.',
      budget: 1200,
      category: 'Cleaning',
      urgency: 'medium' as any,
      status: 'OPEN' as any,
      latitude: 28.6139,
      longitude: 77.2090,
      address: 'Prestige Apartments, Sector 42',
      scheduledTime: new Date(Date.now() + 86400000), // Tomorrow
      customerId: dummyCustomer.id,
    },
    {
      title: 'Fix leaky kitchen sink',
      description: 'The kitchen sink pipe is leaking at the joint. Needs someone with plumbing tools to seal or replace the pipe section.',
      budget: 450,
      category: 'Handyman',
      urgency: 'urgent' as any,
      status: 'OPEN' as any,
      latitude: 28.6145,
      longitude: 77.2100,
      address: 'Omaxe Residency, Block C',
      scheduledTime: new Date(Date.now() + 3600000), // 1 hour from now
      customerId: dummyCustomer.id,
    },
    {
      title: 'Help moving heavy furniture',
      description: 'Need two people to help move a heavy teakwood dining table and a sofa set down one flight of stairs.',
      budget: 600,
      category: 'Errands',
      urgency: 'low' as any,
      status: 'OPEN' as any,
      latitude: 28.6150,
      longitude: 77.2085,
      address: 'DLF Phase 3, Villa 14',
      scheduledTime: new Date(Date.now() + 172800000), // 2 days from now
      customerId: dummyCustomer.id,
    }
  ];

  for (const t of tasks) {
    await prisma.task.create({ data: t });
    console.log(`Created task: ${t.title}`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
