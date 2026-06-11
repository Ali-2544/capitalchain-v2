import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function parseAmount(s: string): number {
  const m = s.replace(/[,$\s]/g, '').match(/^([\d.]+)\s*([KkMmBb]?)/);
  if (!m) return 0;
  let v = parseFloat(m[1]) || 0;
  const suf = m[2].toLowerCase();
  if (suf === 'k') v *= 1e3;
  else if (suf === 'm') v *= 1e6;
  return Math.round(v);
}

// One unified payout list. minutesAgo controls feed order + "time ago".
const PAYOUTS = [
  { flag: '🇮🇳', country: 'India', traderName: 'Rashmeet Kaur', amount: '$2,140', accountSize: '$50,000', method: 'USDT (TRC-20)', minutesAgo: 8 },
  { flag: '🇩🇪', country: 'Germany', traderName: 'Nik Dolja', amount: '$1,680', accountSize: '$25,000', method: 'Bank transfer', minutesAgo: 14 },
  { flag: '🇦🇪', country: 'UAE', traderName: 'A. Rahman', amount: '$96,316', accountSize: '$200,000', method: 'USDT (TRC-20)', minutesAgo: 40 },
  { flag: '🇳🇱', country: 'Netherlands', traderName: 'Jasper Hof', amount: '$1,499', accountSize: '$100,000', method: 'USDT (TRC-20)', minutesAgo: 180 },
  { flag: '🇮🇳', country: 'India', traderName: 'Shreyas M V', amount: '$1,205', accountSize: '$10,000', method: 'USDT (TRC-20)', minutesAgo: 240 },
  { flag: '🇵🇰', country: 'Pakistan', traderName: 'Saim Ahmed', amount: '$940', accountSize: '$25,000', method: 'USDT (TRC-20)', minutesAgo: 250 },
  { flag: '🇲🇾', country: 'Malaysia', traderName: 'Jun Jye Ooi', amount: '$3,310', accountSize: '$100,000', method: 'Bank transfer', minutesAgo: 360 },
  { flag: '🇵🇰', country: 'Pakistan', traderName: 'U. Bin Hannan', amount: '$80,369', accountSize: '$100,000', method: 'USDT (TRC-20)', minutesAgo: 420 },
  { flag: '🇩🇪', country: 'Germany', traderName: 'B. Schneider', amount: '$80,517', accountSize: '$200,000', method: 'Bank transfer', minutesAgo: 480 },
  { flag: '🇬🇧', country: 'UK', traderName: 'O. Trish', amount: '$66,028', accountSize: '$100,000', method: 'USDT (TRC-20)', minutesAgo: 540 },
  { flag: '🇸🇬', country: 'Singapore', traderName: 'M. Chen', amount: '$58,940', accountSize: '$100,000', method: 'Bank transfer', minutesAgo: 600 },
  { flag: '🇵🇰', country: 'Pakistan', traderName: 'Shahyan Zahid', amount: '$3,020', accountSize: '$50,000', method: 'USDT (TRC-20)', minutesAgo: 680 },
  { flag: '🇺🇸', country: 'USA', traderName: 'Emmanuel A.', amount: '$3,589', accountSize: '$200,000', method: 'Bank transfer', minutesAgo: 760 },
  { flag: '🇹🇷', country: 'Turkey', traderName: 'Onur E.', amount: '$2,909', accountSize: '$50,000', method: 'USDT (TRC-20)', minutesAgo: 820 },
  { flag: '🇮🇩', country: 'Indonesia', traderName: 'Adi P.', amount: '$1,460', accountSize: '$25,000', method: 'USDT (TRC-20)', minutesAgo: 900 },
  { flag: '🇿🇦', country: 'South Africa', traderName: 'T. Mokoena', amount: '$1,310', accountSize: '$50,000', method: 'Bank transfer', minutesAgo: 1000 },
  { flag: '🇧🇷', country: 'Brazil', traderName: 'Carlos V.', amount: '$2,210', accountSize: '$50,000', method: 'USDT (TRC-20)', minutesAgo: 1100 },
  { flag: '🇪🇬', country: 'Egypt', traderName: 'Omar F.', amount: '$1,870', accountSize: '$25,000', method: 'USDT (TRC-20)', minutesAgo: 1200 },
  { flag: '🇸🇦', country: 'Saudi Arabia', traderName: 'K. Al Otaibi', amount: '$4,305', accountSize: '$200,000', method: 'Bank transfer', minutesAgo: 1300 },
  { flag: '🇰🇷', country: 'South Korea', traderName: 'Yuki T.', amount: '$2,450', accountSize: '$100,000', method: 'USDT (TRC-20)', minutesAgo: 1440 },
];

const PLANS = ['1 Step Nitro', '2 Step Plus', 'Instant Pro', 'Instant Plus', '1 Step Standard'];

async function main() {
  await prisma.payout.deleteMany();
  const now = Date.now();
  for (let i = 0; i < PAYOUTS.length; i++) {
    const p = PAYOUTS[i];
    await prisma.payout.create({
      data: {
        flag: p.flag,
        country: p.country,
        traderName: p.traderName,
        amount: p.amount,
        amountValue: parseAmount(p.amount),
        accountSize: p.accountSize,
        plan: PLANS[i % PLANS.length],
        method: p.method,
        createdAt: new Date(now - p.minutesAgo * 60_000),
      },
    });
  }
  console.log(`Seeded ${PAYOUTS.length} payouts.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
