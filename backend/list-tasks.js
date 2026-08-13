const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tasks = await prisma.task.findMany();
  console.log('All Task Titles:');
  for (const task of tasks) {
    console.log(`- ${task.title}`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
