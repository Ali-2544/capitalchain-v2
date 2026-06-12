import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, sessionToken } from '@/lib/auth';

// Whether the request actually arrived over HTTPS. A `Secure` cookie is dropped
// by the browser over plain HTTP (e.g. HTTP staging), so only mark it Secure on
// real HTTPS — otherwise the admin session never sticks.
function isHttps(req: Request): boolean {
  const proto = req.headers.get('x-forwarded-proto');
  if (proto) return proto.split(',')[0].trim() === 'https';
  try {
    return new URL(req.url).protocol === 'https:';
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json({ error: 'ADMIN_PASSWORD is not configured on the server.' }, { status: 500 });
  }
  const body = (await req.json().catch(() => ({}))) as { password?: string };
  if (body.password !== expected) {
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  res.cookies.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: isHttps(req), // only Secure on real HTTPS, so HTTP staging works too
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}
