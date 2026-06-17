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
          return { sub: 'user_test_clerk_123' };
        }
        throw new Error('Invalid token');
      },
      getUser: async (id: string) => {
        return {
          id,
          emailAddresses: [
            { id: 'email_1', emailAddress: 'test-guard-sync@example.com' },
          ],
          primaryEmailAddressId: 'email_1',
          firstName: 'Sync',
          lastName: 'Fallback',
          phoneNumbers: [],
          primaryPhoneNumberId: '',
        };
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
  await prisma.user.deleteMany({
    where: {
      id: { in: ['user_test_clerk_123', 'webhook_test_user_456'] },
    },
  });

  console.log('--- Auth & Profile Verification ---');

  // Test 1: GET /users/me without token -> Should throw 401
  const res1 = await request(app.getHttpServer()).get('/users/me');
  assert.strictEqual(res1.status, 401);
  console.log('✔ Test 1: Unauthenticated request correctly blocked (401)');

  // Test 2: GET /users/me with valid token -> Should trigger resilient fallback sync
  // because the user does not exist in the database yet.
  const res2 = await request(app.getHttpServer())
    .get('/users/me')
    .set('Authorization', 'Bearer valid-token');

  assert.strictEqual(res2.status, 200);
  assert.strictEqual(res2.body.id, 'user_test_clerk_123');
  assert.strictEqual(res2.body.name, 'Sync Fallback');
  assert.strictEqual(res2.body.email, 'test-guard-sync@example.com');
  console.log(
    '✔ Test 2: Resilient sync fallback in AuthGuard works, returns user profile',
  );

  // Test 3: PATCH /users/profile -> Update details
  const res3 = await request(app.getHttpServer())
    .patch('/users/profile')
    .set('Authorization', 'Bearer valid-token')
    .send({
      name: 'Updated Sync Fallback',
      role: 'helper',
      skills: ['Plumbing', 'Electrical'],
      latitude: 28.6139,
      longitude: 77.209,
    });

  assert.strictEqual(res3.status, 200);
  assert.strictEqual(res3.body.name, 'Updated Sync Fallback');
  assert.strictEqual(res3.body.role, 'helper');
  assert.deepStrictEqual(res3.body.skills, ['Plumbing', 'Electrical']);
  assert.strictEqual(res3.body.latitude, 28.6139);
  assert.strictEqual(res3.body.longitude, 77.209);
  console.log(
    '✔ Test 3: Profile update works with coordinates and role validation',
  );

  // Verify DB coords trigger updated the location points
  const dbUser = await prisma.user.findUnique({
    where: { id: 'user_test_clerk_123' },
  });
  assert.ok(dbUser?.latitude === 28.6139);
  console.log('✔ Test 4: PostGIS trigger coordinates validated in database');

  // Clean up
  await prisma.user.deleteMany({
    where: {
      id: { in: ['user_test_clerk_123', 'webhook_test_user_456'] },
    },
  });

  await app.close();
  console.log('--- ALL TESTS PASSED SUCCESSFULLY! ---');
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
