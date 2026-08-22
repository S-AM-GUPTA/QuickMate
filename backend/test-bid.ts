import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { BidsService } from './src/bids/bids.service';
import { PrismaService } from './src/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const bidsService = app.get(BidsService);
  const prisma = app.get(PrismaService);

  // 1. Get any open task
  const task = await prisma.task.findFirst({ where: { status: 'OPEN' } });
  if (!task) {
    console.log('No open task found');
    return;
  }

  // 2. Get any helper user
  const helper = await prisma.user.findFirst({ where: { role: 'helper' } });
  if (!helper) {
    console.log('No helper found');
    return;
  }

  // 3. Try placing a bid
  try {
    const bid = await bidsService.placeBid(helper.id, {
      taskId: task.id,
      proposedAmount: 500,
      estimatedCompletionTime: new Date().toISOString(),
      note: "Test bid"
    });
    console.log('Bid created successfully:', bid);
  } catch (err) {
    console.error('Error placing bid:', err);
  }

  await app.close();
}
bootstrap();
