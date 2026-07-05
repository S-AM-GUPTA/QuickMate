import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const emailToPromote = 'test@example.com'; // This might need to be changed to the actual logged-in user
  
  // Let's just promote all users in the DB for local dev purposes, or specifically user_customer_123
  const user = await prisma.user.findFirst();
  
  if (!user) {
    console.log('No users found in database to promote.');
    return;
  }

  // We promote the specific hardcoded user if it exists, otherwise just the first user we find
  const targetId = user.id;

  await prisma.user.updateMany({
    data: { role: 'admin' },
  });

  console.log('Successfully promoted all local users to admin for testing the Admin panel.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
