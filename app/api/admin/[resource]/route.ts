import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/auth';
import { RESOURCES, isResource, pickFields } from '@/lib/resources';

export const dynamic = 'force-dynamic';

// List rows (admin view — includes ids/timestamps).
export async function GET(_req: Request, { params }: { params: Promise<{ resource: string }> }) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { resource } = await params;
  if (!isResource(resource)) return NextResponse.json({ error: 'not found' }, { status: 404 });
  const r = RESOURCES[resource];
  try {
    const data = await r.delegate.findMany({ orderBy: r.orderBy });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Database not reachable. Run the DB setup.' }, { status: 503 });
  }
}

// Create a row.
export async function POST(req: Request, { params }: { params: Promise<{ resource: string }> }) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { resource } = await params;
  if (!isResource(resource)) return NextResponse.json({ error: 'not found' }, { status: 404 });
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const data = pickFields(resource, body);
  try {
    const created = await RESOURCES[resource].delegate.create({ data });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Database not reachable. Run the DB setup.' }, { status: 503 });
  }
}
