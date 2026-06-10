import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Live Rewards feed: recent payouts with the detail fields the feed shows.
export async function GET() {
  try {
    const rows = await prisma.payout.findMany({
      orderBy: { createdAt: 'desc' },
      take: 30,
      select: {
        id: true,
        flag: true,
        traderName: true,
        country: true,
        amount: true,
        method: true,
        createdAt: true,
      },
    });
    // expose traderName as `name` for the feed component
    return NextResponse.json(rows.map(({ traderName, ...r }) => ({ ...r, name: traderName })));
  } catch {
    return NextResponse.json([]);
  }
}
