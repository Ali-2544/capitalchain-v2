import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

try {
  const rows = await prisma.content.findMany({
    where: {
      OR: [
        { key: { startsWith: 'nav.' } },
        { key: { startsWith: 'finalCta.' } },
      ],
    },
    orderBy: [{ key: 'asc' }, { locale: 'asc' }],
    select: { key: true, locale: true, value: true },
  });
  console.log(JSON.stringify(rows, null, 2));
} finally {
  await prisma.$disconnect();
}
