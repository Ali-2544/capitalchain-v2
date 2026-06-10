import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/auth';
import { RESOURCES, isResource, pickFields } from '@/lib/resources';

export const dynamic = 'force-dynamic';

// Update a row.
export async function PUT(req: Request, { params }: { params: Promise<{ resource: string; id: string }> }) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { resource, id } = await params;
  if (!isResource(resource)) return NextResponse.json({ error: 'not found' }, { status: 404 });
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const data = pickFields(resource, body);
  try {
    const updated = await RESOURCES[resource].delegate.update({ where: { id: Number(id) }, data });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Database not reachable. Run the DB setup.' }, { status: 503 });
  }
}

// Delete a row.
export async function DELETE(_req: Request, { params }: { params: Promise<{ resource: string; id: string }> }) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { resource, id } = await params;
  if (!isResource(resource)) return NextResponse.json({ error: 'not found' }, { status: 404 });
  try {
    await RESOURCES[resource].delegate.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Database not reachable. Run the DB setup.' }, { status: 503 });
  }
}
