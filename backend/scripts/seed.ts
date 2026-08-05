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
      title: 'Need 100 pages printed urgently',
      description: 'I need my lab manual printed and spiral bound by tomorrow morning. I will email the PDF.',
      budget: 150,
      category: 'Notes & Printouts',
      urgency: 'urgent' as any,
      status: 'OPEN' as any,
      latitude: 28.7041,
      longitude: 77.1025,
      address: 'Boys Hostel 3',
      scheduledTime: new Date(Date.now() + 86400000), // Tomorrow
      customerId: dummyCustomer.id,
    },
    {
      title: 'Pick up lunch from cafeteria',
      description: 'Can someone grab a Veg Thali from the main cafeteria and drop it at Library reading room? Im stuck studying.',
      budget: 80,
      category: 'Food Pickup',
      urgency: 'medium' as any,
      status: 'OPEN' as any,
      latitude: 28.7045,
      longitude: 77.1030,
      address: 'Central Library',
      scheduledTime: new Date(Date.now() + 3600000), // 1 hour from now
      customerId: dummyCustomer.id,
    },
    {
      title: 'Help moving mini fridge',
      description: 'Need help moving a mini fridge from 1st floor to 3rd floor in Girls Hostel 2.',
      budget: 200,
      category: 'Roommate Help',
      urgency: 'low' as any,
      status: 'OPEN' as any,
      latitude: 28.7035,
      longitude: 77.1015,
      address: 'Girls Hostel 2',
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
