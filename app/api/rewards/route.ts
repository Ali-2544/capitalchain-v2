import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Compact money: 5_330_215 -> "$5.33M", 922_000 -> "$922K", 480 -> "$480".
function compact(n: number): string {
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M';
  if (n >= 1e3) return '$' + Math.round(n / 1e3) + 'K';
  return '$' + Math.round(n);
}
const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

// Crypto rails are detected from the payout `method` string.
const CRYPTO_RE = /usdt|usdc|trc|erc|bep|btc|eth|bnb|sol|ltc|xrp|crypto|chain|wallet/i;

function fmtDate(d: Date) {
  return new Date(d).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}
function monthYear(d: Date) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// Aggregate the Payout table into everything the /rewards dashboard shows.
export async function GET() {
  try {
    const rows = await prisma.payout.findMany({ orderBy: { createdAt: 'desc' }, take: 2000 });

    const count = rows.length;
    const totalRaw = rows.reduce((s, r) => s + (r.amountValue || 0), 0);

    // Country breakdown (top 6 by total paid).
    const byCountry = new Map<string, { flag: string; sum: number }>();
    for (const r of rows) {
      const cur = byCountry.get(r.country) ?? { flag: r.flag, sum: 0 };
      cur.sum += r.amountValue || 0;
      if (!cur.flag) cur.flag = r.flag;
      byCountry.set(r.country, cur);
    }
    const countries = [...byCountry.entries()]
      .sort((a, b) => b[1].sum - a[1].sum)
      .slice(0, 6)
      .map(([name, v]) => ({ flag: v.flag, name, amt: compact(v.sum) }));

    // Largest single reward.
    const top = rows.reduce<(typeof rows)[number] | null>(
      (best, r) => (!best || (r.amountValue || 0) > (best.amountValue || 0) ? r : best),
      null,
    );
    const largest = top
      ? {
          amt: top.amount,
          meta: [top.traderName, top.country, monthYear(top.createdAt)].filter(Boolean).join(' · '),
        }
      : null;

    // Crypto vs bank rails.
    const split = (predicate: (m: string) => boolean) => {
      const grp = rows.filter((r) => predicate(r.method || ''));
      const sum = grp.reduce((s, r) => s + (r.amountValue || 0), 0);
      const max = grp.reduce((m, r) => Math.max(m, r.amountValue || 0), 0);
      const c = grp.length;
      return {
        amt: compact(sum),
        avg: compact(c ? sum / c : 0),
        max: compact(max),
        count: c,
        pct: totalRaw ? +((sum / totalRaw) * 100).toFixed(1) : 0,
      };
    };
    const crypto = split((m) => CRYPTO_RE.test(m));
    const bank = split((m) => !CRYPTO_RE.test(m));

    // Reward ledger — most recent payouts.
    const ledger = rows.slice(0, 12).map((r) => ({
      id: r.id,
      date: fmtDate(r.createdAt),
      flag: r.flag,
      trader: r.traderName,
      size: r.accountSize || '—',
      plan: r.plan || r.method || '—',
      amt: r.amount,
      txUrl: r.txUrl || '',
    }));

    return NextResponse.json({
      count,
      countriesCount: byCountry.size,
      totalCompact: compact(totalRaw),
      totalExact: money(totalRaw),
      countries,
      largest,
      rails: { crypto, bank },
      ledger,
    });
  } catch {
    return NextResponse.json(null); // RewardsBody keeps its fallback if DB is unreachable
  }
}
