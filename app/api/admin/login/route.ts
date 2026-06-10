import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, sessionToken } from '@/lib/auth';

export async function POST(req: Request) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json({ error: 'ADMIN_PASSWORD is not configured on the server.' }, { status: 500 });
  }
  const body = (await req.json().catch(() => ({}))) as { password?: string };
  if (body.password !== expected) {
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}
