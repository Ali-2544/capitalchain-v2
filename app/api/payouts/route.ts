import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'; // always live for polling

// Globe view: just enough to render a country pill + link to its certificate.
export async function GET() {
  try {
    const data = await prisma.payout.findMany({
      orderBy: { createdAt: 'desc' },
      take: 40,
      select: { id: true, flag: true, country: true, amount: true },
    });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]); // keep UI fallback if DB unreachable
  }
}
