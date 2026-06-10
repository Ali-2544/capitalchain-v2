import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Leaderboard: the biggest payouts, ranked. Derived from the same table.
export async function GET() {
  try {
    const rows = await prisma.payout.findMany({
      orderBy: { amountValue: 'desc' },
      take: 8,
      select: { id: true, flag: true, traderName: true, accountSize: true, amount: true },
    });
    const data = rows.map((r, i) => ({
      id: r.id,
      rank: i + 1,
      flag: r.flag,
      name: r.traderName,
      role: `${r.accountSize} · Operator`.replace(/^ · /, ''),
      amount: r.amount,
    }));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}
