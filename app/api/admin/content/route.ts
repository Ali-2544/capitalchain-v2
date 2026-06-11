import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sanitizeHtml } from '@/lib/blogs';

export const dynamic = 'force-dynamic';

const LOCALES = ['en', 'ar', 'hi', 'es', 'bn', 'ur', 'fr'];
const TYPES = ['text', 'html', 'image'];

interface Body {
  key?: string;
  locale?: string;
  type?: string;
  value?: string;
}

// Upsert one content override for a (key, locale). Admin only.
export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as Body;

  const key = (body.key ?? '').trim();
  const locale = (body.locale ?? '').trim();
  const type = TYPES.includes(body.type ?? '') ? (body.type as string) : 'text';
  if (!key || !LOCALES.includes(locale)) {
    return NextResponse.json({ error: 'key and a valid locale are required.' }, { status: 400 });
  }

  // HTML values are sanitized; text/image stored as-is.
  const value = type === 'html' ? sanitizeHtml(body.value ?? '') : (body.value ?? '');

  try {
    const saved = await prisma.content.upsert({
      where: { key_locale: { key, locale } },
      update: { type, value },
      create: { key, locale, type, value },
    });
    return NextResponse.json(saved);
  } catch {
    return NextResponse.json({ error: 'Database not reachable.' }, { status: 503 });
  }
}

// Reset an override (revert to the i18n fallback) for a (key, locale).
export async function DELETE(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key') ?? '';
  const locale = searchParams.get('locale') ?? '';
  if (!key || !locale) return NextResponse.json({ error: 'key and locale required' }, { status: 400 });
  try {
    await prisma.content.deleteMany({ where: { key, locale } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Database not reachable.' }, { status: 503 });
  }
}
