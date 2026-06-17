import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  console.log('Connecting to database...');
  const result = await prisma.$queryRaw`SELECT 1+1 as result`;
  console.log('Query result:', result);
}
main()
  .catch((err) => console.error('Connection error:', err))
  .finally(() => prisma.$disconnect());
