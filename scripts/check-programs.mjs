import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

try {
  const programs = await prisma.programPlan.findMany({
    orderBy: [{ programType: 'asc' }, { sizeOrder: 'asc' }],
    select: { id: true, programType: true, size: true, sizeOrder: true, fee: true },
  });
  console.log('PROGRAM PLANS:', JSON.stringify(programs, null, 2));
  console.log('COUNT:', programs.length);
} finally {
  await prisma.$disconnect();
}
