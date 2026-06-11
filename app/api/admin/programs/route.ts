import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { pickProgramFields } from '@/lib/programs';

export const dynamic = 'force-dynamic';

// List all plans (admin view).
export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  try {
    const rows = await prisma.programPlan.findMany({
      orderBy: [{ programType: 'asc' }, { sizeOrder: 'asc' }],
    });
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: 'Database not reachable.' }, { status: 503 });
  }
}

// Create a plan.
export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const data = pickProgramFields(body);
  if (!data.programType || !data.size) {
    return NextResponse.json({ error: 'Program type and size are required.' }, { status: 400 });
  }
  try {
    const created = await prisma.programPlan.create({
      data: {
        fee: 0,
        was: 0,
        target: '',
        drawdown: '',
        dailyLoss: '',
        ...data,
      } as never,
    });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Could not create (a plan for that type + size may already exist).' },
      { status: 409 },
    );
  }
}
