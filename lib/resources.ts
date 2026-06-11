import { prisma } from './prisma';
import { countryToFlag } from './flags';

// Single managed resource now: every payout lives in one table.
export type ResourceName = 'payouts';

interface Delegate {
  findMany(args?: unknown): Promise<unknown[]>;
  create(args: unknown): Promise<unknown>;
  update(args: unknown): Promise<unknown>;
  delete(args: unknown): Promise<unknown>;
}

interface ResourceDef {
  delegate: Delegate;
  orderBy: Record<string, 'asc' | 'desc'>;
  fields: string[];
}

export const RESOURCES: Record<ResourceName, ResourceDef> = {
  payouts: {
    delegate: prisma.payout as unknown as Delegate,
    orderBy: { createdAt: 'desc' },
    fields: ['flag', 'country', 'traderName', 'amount', 'accountSize', 'plan', 'method'],
  },
};

export function isResource(x: string): x is ResourceName {
  return x === 'payouts';
}

/** "$2,140" -> 2140 · "$867K" -> 867000 · "$5.33M" -> 5330000 (for sorting/leaderboard). */
export function parseAmount(s: string): number {
  const m = s.replace(/[,$\s]/g, '').match(/^([\d.]+)\s*([KkMmBb]?)/);
  if (!m) return 0;
  let v = parseFloat(m[1]) || 0;
  const suf = m[2].toLowerCase();
  if (suf === 'k') v *= 1e3;
  else if (suf === 'm') v *= 1e6;
  else if (suf === 'b') v *= 1e9;
  return Math.round(v);
}

/**
 * Normalize a money field to a USD display string (we only pay in USD):
 *  "2140" -> "$2,140" · "$10000" -> "$10,000" · "1000000" -> "$1,000,000"
 *  "$867K" / "867K" -> "$867K" (suffixed values keep their form) · "" -> ""
 */
export function usd(s: string): string {
  let v = (s ?? '').trim();
  if (!v) return '';
  v = v.replace(/^\$+\s*/, ''); // strip any leading $ the admin already typed
  const digits = v.replace(/,/g, '');
  if (/^\d+(\.\d+)?$/.test(digits)) v = Number(digits).toLocaleString('en-US'); // pure number → add commas
  return '$' + v;
}

/** Keep only writable fields; auto-derive amountValue from amount. */
export function pickFields(_name: ResourceName, body: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const f of RESOURCES.payouts.fields) {
    if (body[f] === undefined || body[f] === null) continue;
    out[f] = String(body[f]);
  }
  // We only pay in USD — force the $ prefix (and commas) on money fields.
  if (typeof out.amount === 'string') out.amount = usd(out.amount);
  if (typeof out.accountSize === 'string') out.accountSize = usd(out.accountSize);
  if (typeof out.amount === 'string') out.amountValue = parseAmount(out.amount);
  // Flag is derived from the country name — admins never type the emoji.
  // Keep any explicitly-provided flag only if the country can't be resolved.
  if (typeof out.country === 'string') {
    const derived = countryToFlag(out.country);
    if (derived) out.flag = derived;
  }
  return out;
}
