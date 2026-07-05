import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@quickmate.com';
  
  // Demote everyone except the specific admin
  const result = await prisma.user.updateMany({
    where: {
      email: {
        not: adminEmail
      }
    },
    data: {
      role: 'customer'
    }
  });

  console.log(`Successfully demoted ${result.count} users back to customer role.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
