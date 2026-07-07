import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function markDemoTasks() {
  console.log('Starting demo tasks marking script...');

  try {
    // Fetch all tasks
    const tasks = await prisma.task.findMany();
    console.log(`Found ${tasks.length} total tasks.`);

    let updatedCount = 0;

    for (const task of tasks) {
      if (!task.title.startsWith('[DEMO TASK]')) {
        await prisma.task.update({
          where: { id: task.id },
          data: { title: `[DEMO TASK] ${task.title}` }
        });
        updatedCount++;
      }
    }

    console.log(`Successfully marked ${updatedCount} tasks as demo.`);
  } catch (error) {
    console.error('Error marking demo tasks:', error);
  } finally {
    await prisma.$disconnect();
  }
}

markDemoTasks();
