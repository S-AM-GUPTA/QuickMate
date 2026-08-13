const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tasks = await prisma.task.findMany();
  let deletedCount = 0;
  
  for (const task of tasks) {
    const title = task.title.toLowerCase();
    const desc = task.description.toLowerCase();
    
    // Identifiers for junk tests based on user feedback and common test patterns
    if (
      title.includes('gggg') || 
      title.includes('hhhh') || 
      title === 'test' || 
      title === 'test task' || 
      title === 'asdf' ||
      title.includes('1234') ||
      desc.includes('gggg') ||
      desc.includes('asdf')
    ) {
      try {
        // Need to delete any related bids/payments/messages first if Prisma doesn't cascade
        // Assuming cascade is set up, but let's delete bids first just in case
        await prisma.bid.deleteMany({ where: { taskId: task.id } });
        await prisma.message.deleteMany({ where: { taskId: task.id } });
        await prisma.task.delete({ where: { id: task.id } });
        deletedCount++;
        console.log(`Deleted junk task: "${task.title}"`);
      } catch (err) {
        console.log(`Failed to delete "${task.title}": ${err.message}`);
      }
    }
  }
  console.log(`Deleted ${deletedCount} junk tasks in total.`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
