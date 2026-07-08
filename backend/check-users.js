const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.findMany({ select: { id: true, name: true, role: true } })
  .then(users => console.log(users))
  .finally(() => prisma.$disconnect());
