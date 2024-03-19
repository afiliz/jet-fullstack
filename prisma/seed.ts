import { PrismaClient } from '@prisma/client';
import { jets } from './seeds/jets';

const prisma = new PrismaClient();

async function seed() {
  await prisma.jets.createMany({
    data: jets,
  });
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });