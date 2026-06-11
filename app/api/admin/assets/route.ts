import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB per image
const ALLOWED = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'];

// Upload an image (cover or inline) — accepts a base64 data URL { dataUrl }.
// Stores the bytes as an Asset and returns its public URL.
export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { dataUrl?: string };
  const dataUrl = body.dataUrl ?? '';
  const m = /^data:([^;,]+);base64,(.+)$/.exec(dataUrl);
  if (!m) return NextResponse.json({ error: 'Expected a base64 data URL.' }, { status: 400 });

  const mime = m[1];
  if (!ALLOWED.includes(mime)) {
    return NextResponse.json({ error: `Unsupported image type: ${mime}` }, { status: 415 });
  }

  const data = Buffer.from(m[2], 'base64');
  if (data.length > MAX_BYTES) {
    return NextResponse.json({ error: 'Image too large (max 5 MB).' }, { status: 413 });
  }

  try {
    const asset = await prisma.asset.create({ data: { mime, data } });
    return NextResponse.json({ id: asset.id, url: `/api/assets/${asset.id}` }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Database not reachable.' }, { status: 503 });
  }
}
