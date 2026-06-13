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

// Cumulative-total milestones, in USD. Everything the page shows is derived from
// real payout history — no hand-maintained numbers.
const THRESHOLDS = [50e3, 100e3, 250e3, 500e3, 1e6, 2e6, 3e6, 5e6, 10e6, 25e6];

// Aggregate the Payout table into everything the /rewards dashboard shows.
export async function GET() {
  try {
    const rows = await prisma.payout.findMany({ orderBy: { createdAt: 'desc' }, take: 5000 });

    const count = rows.length;
    const totalRaw = rows.reduce((s, r) => s + (r.amountValue || 0), 0);
    const avgRaw = count ? totalRaw / count : 0;

    // Country breakdown (top 6 by total paid).
    const byCountry = new Map<string, { flag: string; sum: number }>();
    for (const r of rows) {
      const cur = byCountry.get(r.country) ?? { flag: r.flag, sum: 0 };
      cur.sum += r.amountValue || 0;
      if (!cur.flag) cur.flag = r.flag;
      byCountry.set(r.country, cur);
    }
    const rankedCountries = [...byCountry.entries()].sort((a, b) => b[1].sum - a[1].sum);
    const countries = rankedCountries
      .slice(0, 6)
      .map(([name, v]) => ({ flag: v.flag, name, amt: compact(v.sum) }));
    const busiest = rankedCountries[0]
      ? { flag: rankedCountries[0][1].flag, name: rankedCountries[0][0], amt: compact(rankedCountries[0][1].sum) }
      : null;

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

    // Two most recent payout amounts (for the hero "receipts").
    const receipts = rows.slice(0, 2).map((r) => '+' + r.amount);

    // Milestones: walk payouts oldest→newest, record the date the running total
    // first crossed each threshold. Show the latest few achieved + the next target.
    const asc = [...rows].sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
    let running = 0;
    const crossed: { th: number; date: Date }[] = [];
    const hit = new Set<number>();
    for (const r of asc) {
      running += r.amountValue || 0;
      for (const th of THRESHOLDS) {
        if (!hit.has(th) && running >= th) {
          hit.add(th);
          crossed.push({ th, date: r.createdAt });
        }
      }
    }
    const firstDate = asc.length ? fmtDate(asc[0].createdAt).toUpperCase() : '';
    const achieved = crossed.slice(-3).map((c) => ({ d: monthYear(c.date), a: compact(c.th), l: 'reached' }));
    const nextTh = THRESHOLDS.find((t) => t > totalRaw);
    const milestones = [
      ...achieved,
      ...(nextTh ? [{ d: 'On the horizon', a: compact(nextTh), l: 'next target', horizon: true }] : []),
    ];

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

    // Reward ledger — full set (capped) so the page can search / filter / page it.
    const ledger = rows.slice(0, 600).map((r) => ({
      id: r.id,
      ts: +new Date(r.createdAt),
      date: fmtDate(r.createdAt),
      flag: r.flag,
      trader: r.traderName,
      country: r.country,
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
      avgReward: compact(avgRaw),
      firstDate,
      countries,
      busiest,
      largest,
      receipts,
      milestones,
      rails: { crypto, bank },
      ledger,
    });
  } catch {
    return NextResponse.json(null); // RewardsBody keeps its fallback if DB is unreachable
  }
}
