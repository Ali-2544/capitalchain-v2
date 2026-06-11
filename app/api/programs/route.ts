import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'; // always live for polling

// Programs configurator: every (type × size) plan, ordered for the UI.
export async function GET() {
  try {
    const rows = await prisma.programPlan.findMany({
      orderBy: [{ programType: 'asc' }, { sizeOrder: 'asc' }],
    });
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json([]); // keep the UI fallback if the DB is unreachable
  }
}
