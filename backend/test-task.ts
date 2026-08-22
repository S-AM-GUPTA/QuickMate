import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { TasksService } from './src/tasks/tasks.service';
import { PrismaService } from './src/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const tasksService = app.get(TasksService);
  const prisma = app.get(PrismaService);

  const customer = await prisma.user.findFirst({ where: { role: 'customer' } });
  if (!customer) { console.log('No customer'); return; }

  try {
    const task = await tasksService.createTask(customer.id, {
      title: "Test Task Upload",
      description: "Test task description long enough to pass validation.",
      budget: 500,
      category: "Tech",
      urgency: "medium" as any,
      latitude: 28.6,
      longitude: 77.2,
      address: "Delhi",
      scheduledTime: new Date().toISOString()
    });
    console.log('Task created:', task);
  } catch (err) {
    console.error('Error creating task:', err);
  }

  await app.close();
}
bootstrap();
