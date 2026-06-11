import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// All content overrides, as a flat map keyed by "<locale>::<key>".
// The frontend merges these over the i18n dictionary.
export async function GET() {
  try {
    const rows = await prisma.content.findMany();
    const map: Record<string, { type: string; value: string }> = {};
    for (const r of rows) map[`${r.locale}::${r.key}`] = { type: r.type, value: r.value };
    return NextResponse.json(map);
  } catch {
    return NextResponse.json({}); // no overrides → pure i18n fallback
  }
}
