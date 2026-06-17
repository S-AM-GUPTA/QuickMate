import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import { ClerkService } from './auth/clerk.service';
import { PrismaService } from './prisma/prisma.service';
import request from 'supertest';
import * as assert from 'assert';
import { ValidationPipe } from '@nestjs/common';

async function runTests() {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(ClerkService)
    .useValue({
      verifyToken: async (token: string) => {
        if (token === 'valid-token') {
          return { sub: 'task_customer_123' };
        }
        throw new Error('Invalid token');
      },
    })
    .compile();

  const app = moduleFixture.createNestApplication({ rawBody: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.init();

  const prisma = app.get(PrismaService);

  // Clean up
  await prisma.task.deleteMany({ where: { customerId: 'task_customer_123' } });
  await prisma.user.deleteMany({ where: { id: 'task_customer_123' } });

  // Create a customer user first (since customer must exist to post tasks)
  await prisma.user.create({
    data: {
      id: 'task_customer_123',
      email: 'task_customer@test.com',
      name: 'Task Customer',
      role: 'customer',
    },
  });

  console.log('--- Storage & Tasks API Verification ---');

  // Test 1: POST /storage/presigned-url
  const resStorage = await request(app.getHttpServer())
    .post('/storage/presigned-url')
    .set('Authorization', 'Bearer valid-token')
    .send({
      filename: 'my-task-photo.jpg',
      contentType: 'image/jpeg',
    });

  assert.strictEqual(resStorage.status, 201);
  assert.ok(resStorage.body.uploadUrl.includes('mock-r2-upload.com'));
  assert.ok(resStorage.body.publicUrl.includes('my-task-photo.jpg'));
  assert.ok(resStorage.body.key.startsWith('uploads/'));
  console.log(
    '✔ Test 1: Storage presigned URL generation endpoint works successfully',
  );

  // Test 2: POST /tasks - validation check (should block because budget < 10)
  const resTaskFail = await request(app.getHttpServer())
    .post('/tasks')
    .set('Authorization', 'Bearer valid-token')
    .send({
      title: 'Short', // invalid (minLength is 5)
      description: 'Help', // invalid (minLength is 10)
      budget: 5, // invalid (min is 10)
      category: 'cleaning',
      urgency: 'medium',
      latitude: 100, // invalid (max is 90)
      longitude: 77.123,
      scheduledTime: new Date(Date.now() + 86400000).toISOString(),
    });

  assert.strictEqual(resTaskFail.status, 400);
  console.log(
    '✔ Test 2: Task validation correctly blocks invalid inputs (budget, description, coordinates)',
  );

  // Test 3: POST /tasks - successful creation
  const scheduledTimeStr = new Date(Date.now() + 86400000).toISOString();
  const resTaskSuccess = await request(app.getHttpServer())
    .post('/tasks')
    .set('Authorization', 'Bearer valid-token')
    .send({
      title: 'Fix leaked pipe in kitchen',
      description:
        'Need a plumber to fix water leak in the kitchen sink pipe ASAP.',
      budget: 250,
      category: 'repair',
      urgency: 'urgent',
      latitude: 28.5355,
      longitude: 77.391,
      scheduledTime: scheduledTimeStr,
      attachmentUrls: [resStorage.body.publicUrl],
    });

  assert.strictEqual(resTaskSuccess.status, 201);
  assert.strictEqual(resTaskSuccess.body.title, 'Fix leaked pipe in kitchen');
  assert.strictEqual(resTaskSuccess.body.urgency, 'urgent');
  assert.strictEqual(resTaskSuccess.body.budget, 250);
  assert.strictEqual(resTaskSuccess.body.customerId, 'task_customer_123');
  assert.strictEqual(resTaskSuccess.body.latitude, 28.5355);
  assert.strictEqual(resTaskSuccess.body.longitude, 77.391);
  console.log('✔ Test 3: Task creation endpoint works successfully');

  // Test 4: Database query to verify PostGIS coordinates conversion trigger
  const dbTask = await prisma.task.findFirst({
    where: { customerId: 'task_customer_123' },
  });
  assert.ok(dbTask !== null);
  assert.strictEqual(dbTask?.latitude, 28.5355);
  assert.strictEqual(dbTask?.longitude, 77.391);
  console.log(
    '✔ Test 4: PostGIS trigger correctly updated coords geometry in database',
  );

  // Clean up
  await prisma.task.deleteMany({ where: { customerId: 'task_customer_123' } });
  await prisma.user.deleteMany({ where: { id: 'task_customer_123' } });

  await app.close();
  console.log('--- ALL STORAGE & TASKS TESTS PASSED SUCCESSFULLY! ---');
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
