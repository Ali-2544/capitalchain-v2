import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const NO_STORE = { 'Cache-Control': 'no-store, must-revalidate' };

// All content overrides, as a flat map keyed by "<locale>::<key>".
// The frontend merges these over the i18n dictionary. `no-store` so freshly
// saved edits show immediately and no CDN serves a stale map.
export async function GET() {
  try {
    const rows = await prisma.content.findMany();
    const map: Record<string, { type: string; value: string }> = {};
    for (const r of rows) map[`${r.locale}::${r.key}`] = { type: r.type, value: r.value };
    return NextResponse.json(map, { headers: NO_STORE });
  } catch {
    return NextResponse.json({}, { headers: NO_STORE }); // no overrides → pure i18n fallback
  }
}
