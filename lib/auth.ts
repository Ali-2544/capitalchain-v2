import { cookies } from 'next/headers';
import crypto from 'crypto';

export const ADMIN_COOKIE = 'cc_admin';

/** Opaque session value derived from the admin password (never stores the raw password). */
export function sessionToken(): string {
  const pw = process.env.ADMIN_PASSWORD ?? '';
  return crypto.createHash('sha256').update('capitalchain::' + pw).digest('hex');
}

/** True when the request carries a valid admin session cookie. */
export async function isAuthed(): Promise<boolean> {
  if (!process.env.ADMIN_PASSWORD) return false; // not configured
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === sessionToken();
}
