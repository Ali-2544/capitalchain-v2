import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Auth gate that does NOT touch the database, so /admin login works even before
// the DB is configured.
export async function GET() {
  return NextResponse.json({ authed: await isAuthed() });
}
