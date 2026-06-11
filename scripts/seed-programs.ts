// One-off idempotent seed for the Programs configurator (upsert by type+size).
// Run: npx tsx scripts/seed-programs.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SIZES = ['5K', '25K', '50K', '100K', '200K', '500K'];

type Cell = { fee: number; was: number; target: string; dd: string; daily: string };

const DATA: Record<string, { drawShared?: never; sizes: Record<string, Cell> }> = {
  '1step': {
    sizes: {
      '5K': { fee: 49, was: 59, target: '8%', dd: '10%', daily: '5%' },
      '25K': { fee: 189, was: 229, target: '8%', dd: '10%', daily: '5%' },
      '50K': { fee: 289, was: 349, target: '8%', dd: '10%', daily: '5%' },
      '100K': { fee: 489, was: 540, target: '8%', dd: '10%', daily: '5%' },
      '200K': { fee: 889, was: 999, target: '8%', dd: '10%', daily: '5%' },
      '500K': { fee: 1899, was: 2199, target: '8%', dd: '10%', daily: '5%' },
    },
  },
  '2step': {
    sizes: {
      '5K': { fee: 39, was: 49, target: '8% / 5%', dd: '12%', daily: '5%' },
      '25K': { fee: 149, was: 189, target: '8% / 5%', dd: '12%', daily: '5%' },
      '50K': { fee: 229, was: 289, target: '8% / 5%', dd: '12%', daily: '5%' },
      '100K': { fee: 389, was: 449, target: '8% / 5%', dd: '12%', daily: '5%' },
      '200K': { fee: 699, was: 799, target: '8% / 5%', dd: '12%', daily: '5%' },
      '500K': { fee: 1499, was: 1799, target: '8% / 5%', dd: '12%', daily: '5%' },
    },
  },
  instant: {
    sizes: {
      '5K': { fee: 199, was: 249, target: 'None', dd: '6%', daily: '4%' },
      '25K': { fee: 699, was: 849, target: 'None', dd: '6%', daily: '4%' },
      '50K': { fee: 1199, was: 1399, target: 'None', dd: '6%', daily: '4%' },
      '100K': { fee: 1999, was: 2399, target: 'None', dd: '6%', daily: '4%' },
      '200K': { fee: 3499, was: 3999, target: 'None', dd: '6%', daily: '4%' },
      '500K': { fee: 7999, was: 8999, target: 'None', dd: '6%', daily: '4%' },
    },
  },
};

async function main() {
  let n = 0;
  for (const [programType, prog] of Object.entries(DATA)) {
    for (const size of SIZES) {
      const c = prog.sizes[size];
      const fields = {
        sizeOrder: SIZES.indexOf(size),
        fee: c.fee,
        was: c.was,
        target: c.target,
        drawdown: c.dd,
        dailyLoss: c.daily,
        profitSplit: '100%',
        minDays: 'None',
        timeLimit: 'Unlimited',
        newsEas: 'Allowed',
        payouts: '4 cycles',
      };
      await prisma.programPlan.upsert({
        where: { programType_size: { programType, size } },
        update: fields,
        create: { programType, size, ...fields },
      });
      n++;
    }
  }
  console.log(`Seeded ${n} program plans.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
