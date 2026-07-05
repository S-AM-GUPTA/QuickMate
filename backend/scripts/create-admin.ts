import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@quickmate.com';
  const password = 'securepassword123';
  
  // Check if admin already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  
  if (existingUser) {
    console.log(`Admin user ${email} already exists. Updating password and role...`);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword, role: 'admin' },
    });
    console.log('Admin account updated.');
    return;
  }

  // Create new admin user
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  await prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      email,
      name: 'Super Admin',
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
      phone: '0000000000'
    },
  });

  console.log(`Successfully created secure admin account: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
