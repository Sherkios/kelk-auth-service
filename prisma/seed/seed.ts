import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin', 10);
  const userPassword = await bcrypt.hash('user', 10);

  await prisma.user.createMany({
    data: [
      {
        login: 'admin',
        email: 'sherkios@mail.ru',
        password: adminPassword,
        role: 'ADMIN',
        username: 'admin',
      },
      {
        login: 'user',
        email: 'user@mail.ru',
        password: userPassword,
        role: 'USER',
        username: 'user',
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e: unknown) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
