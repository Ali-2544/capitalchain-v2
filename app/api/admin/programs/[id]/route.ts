import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { pickProgramFields } from '@/lib/programs';

export const dynamic = 'force-dynamic';

// Update a plan.
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const data = pickProgramFields(body);
  try {
    const updated = await prisma.programPlan.update({ where: { id: Number(id) }, data });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: 'Could not update (not found, duplicate type+size, or DB unreachable).' },
      { status: 409 },
    );
  }
}

// Delete a plan.
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { id } = await params;
  try {
    await prisma.programPlan.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Could not delete.' }, { status: 503 });
  }
}
