import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Testing PostGIS and Prisma integration...');

  const dummyCustomerId = 'cust_test_123';
  const dummyHelperId = 'helper_test_123';

  // 1. Clean up potential old test data
  await prisma.bid.deleteMany({
    where: { task: { customerId: dummyCustomerId } },
  });
  await prisma.review.deleteMany({ where: { taskId: { in: [] } } }); // Cascade delete handles this, but let's be safe
  await prisma.message.deleteMany({
    where: { task: { customerId: dummyCustomerId } },
  });
  await prisma.task.deleteMany({ where: { customerId: dummyCustomerId } });
  await prisma.user.deleteMany({
    where: { id: { in: [dummyCustomerId, dummyHelperId] } },
  });

  console.log('Cleaned up previous test records.');

  // 2. Create a customer in New Delhi (Connaught Place area)
  // Lat: 28.6304, Lng: 77.2177
  const customer = await prisma.user.create({
    data: {
      id: dummyCustomerId,
      email: 'customer@test.com',
      name: 'Delhi Customer',
      role: 'customer',
      latitude: 28.6304,
      longitude: 77.2177,
    },
  });
  console.log('Created customer:', customer.name);

  // 3. Create a helper in New Delhi (nearby)
  // Lat: 28.6320, Lng: 77.2190 (~200m away)
  const helper = await prisma.user.create({
    data: {
      id: dummyHelperId,
      email: 'helper@test.com',
      name: 'Delhi Helper',
      role: 'helper',
      latitude: 28.632,
      longitude: 77.219,
    },
  });
  console.log('Created helper:', helper.name);

  // 4. Create two tasks:
  // Task A: Nearby in Delhi (Lat: 28.6350, Lng: 77.2210) - ~600m away
  // Task B: Far away in Mumbai (Lat: 19.0760, Lng: 72.8777) - ~1100km away
  const taskNearby = await prisma.task.create({
    data: {
      title: 'Errand in Delhi',
      description: 'Pick up groceries from Connaught Place',
      budget: 150,
      category: 'delivery',
      urgency: 'medium',
      status: 'OPEN',
      latitude: 28.635,
      longitude: 77.221,
      scheduledTime: new Date(Date.now() + 3600000), // 1 hour from now
      customerId: dummyCustomerId,
    },
  });
  console.log('Created nearby task:', taskNearby.title);

  const taskFar = await prisma.task.create({
    data: {
      title: 'Errand in Mumbai',
      description: 'Deliver document to Bandra West',
      budget: 500,
      category: 'delivery',
      urgency: 'medium',
      status: 'OPEN',
      latitude: 19.076,
      longitude: 72.8777,
      scheduledTime: new Date(Date.now() + 3600000),
      customerId: dummyCustomerId,
    },
  });
  console.log('Created far task:', taskFar.title);

  // 5. Query the database using PostGIS raw query
  // Target coordinates: Delhi Customer (28.6304, 77.2177)
  // Radius: 5000 meters (5km)
  const searchLat = 28.6304;
  const searchLng = 77.2177;
  const radiusMeters = 5000;

  console.log(
    `Querying open tasks within ${radiusMeters}m of lat=${searchLat}, lng=${searchLng}...`,
  );

  // Query tasks and compute distance using ST_DistanceSphere (or ST_Distance for geometry in meters, but ST_DistanceSphere handles lat/lng degrees to meters conversion directly)
  const nearbyTasks: any[] = await prisma.$queryRaw`
    SELECT id, title, budget, latitude, longitude,
           ST_DistanceSphere(coords, ST_MakePoint(${searchLng}, ${searchLat})) as "distanceMeters"
    FROM tasks
    WHERE status = 'OPEN'
      AND ST_DWithin(
        coords,
        ST_SetSRID(ST_MakePoint(${searchLng}, ${searchLat}), 4326),
        0.05 -- roughly ~5km in degrees for geometry type (approx 1 deg = 111km, so 0.05 deg = ~5.5km)
      )
    ORDER BY ST_DistanceSphere(coords, ST_MakePoint(${searchLng}, ${searchLat})) ASC
  `;

  console.log(`Found ${nearbyTasks.length} tasks nearby:`);
  for (const t of nearbyTasks) {
    console.log(
      `- [Task] ${t.title} (Budget: Rs.${t.budget}) is ${Math.round(t.distanceMeters)} meters away`,
    );
  }

  // 6. Assertions
  const foundNearby = nearbyTasks.find((t) => t.id === taskNearby.id);
  const foundFar = nearbyTasks.find((t) => t.id === taskFar.id);

  if (foundNearby && !foundFar) {
    console.log(
      'SUCCESS: Spatial query worked perfectly! Found nearby Delhi task and ignored Mumbai task.',
    );
  } else {
    console.error('FAILURE: Spatial query returned unexpected results.', {
      foundNearby,
      foundFar,
    });
  }

  // 7. Cleanup
  await prisma.task.deleteMany({ where: { customerId: dummyCustomerId } });
  await prisma.user.deleteMany({
    where: { id: { in: [dummyCustomerId, dummyHelperId] } },
  });
  console.log('Cleaned up test data.');
}

main()
  .catch((e) => {
    console.error('Error running test script:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
