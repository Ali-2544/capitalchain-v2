// One-off: normalize existing payout money fields to "$x,xxx" (USD only).
// Run: npx tsx scripts/normalize-usd.ts
import { PrismaClient } from '@prisma/client';
import { usd, parseAmount } from '../lib/resources';

const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.payout.findMany();
  let n = 0;
  for (const r of rows) {
    const amount = usd(r.amount);
    const accountSize = usd(r.accountSize);
    if (amount !== r.amount || accountSize !== r.accountSize) {
      await prisma.payout.update({
        where: { id: r.id },
        data: { amount, accountSize, amountValue: parseAmount(amount) },
      });
      n++;
    }
  }
  console.log(`Normalized ${n} of ${rows.length} payouts.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
