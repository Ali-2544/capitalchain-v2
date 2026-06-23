'use client';

import { useEffect, useMemo, useState } from 'react';
import { useT } from '@/components/LanguageProvider';
import Editable from '@/components/Editable';
import EditableLink from '@/components/EditableLink';
import Ticker from '@/components/Ticker';
import { LINKS } from '@/lib/links';

interface LedgerRow {
  id: number;
  ts: number;
  date: string;
  flag: string;
  trader: string;
  country: string;
  size: string;
  plan: string;
  amt: string;
  txUrl?: string;
}
interface Rail {
  amt: string;
  avg: string;
  max: string;
  count: number;
  pct: number;
}
interface Milestone {
  d: string;
  a: string;
  l: string;
  horizon?: boolean;
}
interface RewardsData {
  count: number;
  countriesCount: number;
  totalCompact: string;
  totalExact: string;
  avgReward: string;
  firstDate: string;
  countries: { flag: string; name: string; amt: string }[];
  busiest: { flag: string; name: string; amt: string } | null;
  largest: { amt: string; meta: string } | null;
  receipts: string[];
  milestones: Milestone[];
  rails: { crypto: Rail; bank: Rail };
  ledger: LedgerRow[];
}

// Shown until /api/rewards loads (or if the DB is empty), so the page never breaks.
const FALLBACK: RewardsData = {
  count: 0,
  countriesCount: 0,
  totalCompact: '$0',
  totalExact: '$0',
  avgReward: '$0',
  firstDate: '',
  countries: [],
  busiest: null,
  largest: null,
  receipts: [],
  milestones: [],
  rails: {
    crypto: { amt: '$0', avg: '$0', max: '$0', count: 0, pct: 0 },
    bank: { amt: '$0', avg: '$0', max: '$0', count: 0, pct: 0 },
  },
  ledger: [],
};

const PAGE_SIZE = 10;
const RANGES: Record<string, number> = { '24': 24 * 3600e3, '7': 7 * 86400e3, '30': 30 * 86400e3 };

export default function RewardsBody() {
  const t = useT().rewardsPage;
  const [data, setData] = useState<RewardsData>(FALLBACK);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch('/api/rewards', { cache: 'no-store' });
        if (!res.ok) return;
        const json = (await res.json()) as RewardsData | null;
        if (alive && json && typeof json.count === 'number') setData(json);
      } catch {
        /* keep current data on error */
      }
    };
    load();
    const id = setInterval(load, 30_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const count = data.count.toLocaleString('en-US');
  const { crypto } = data.rails;

  // Ledger controls — real search, date-range filter and pagination.
  const [query, setQuery] = useState('');
  const [range, setRange] = useState('all');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const span = RANGES[range];
    const now = Date.now();
    return data.ledger.filter((r) => {
      if (span && now - r.ts > span) return false;
      if (q && !`${r.trader} ${r.country} ${r.plan} ${r.size}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [data.ledger, query, range]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);
  const from = filtered.length ? safePage * PAGE_SIZE + 1 : 0;
  const to = safePage * PAGE_SIZE + pageRows.length;

  const resetFilters = () => {
    setQuery('');
    setRange('all');
    setPage(0);
  };

  return (
    <main className="rw-dash">
      <div className="wrap">
        {/* Status bar */}
        <div className="rw-statusbar reveal">
          <span className="rw-tag">
            <Editable id="rewardsPage.statusTag">{t.statusTag}</Editable>
            <span className="rw-live">
              <span className="lr-dot" /> <Editable id="rewardsPage.live">{t.live}</Editable>
            </span>
          </span>
          <span className="rw-status-meta">
            <span><Editable id="rewardsPage.sync">{t.sync}</Editable> <b><Editable id="rewardsPage.syncVal">{t.syncVal}</Editable></b></span>
            <span><Editable id="rewardsPage.audit">{t.audit}</Editable> <b><Editable id="rewardsPage.auditVal">{t.auditVal}</Editable></b></span>
            <span><Editable id="rewardsPage.records">{t.records}</Editable> <b>{count}</b></span>
          </span>
        </div>

        {/* Hero + stats */}
        <div className="rw-top reveal">
          <div className="rw-hero-card">
            <span className="rw-tag"><Editable id="rewardsPage.heroTag">{t.heroTag}</Editable></span>
            <div className="rw-receipts">
              {(data.receipts.length ? data.receipts : ['+$0', '+$0']).slice(0, 2).map((r, i) => (
                <span className={`rw-receipt${i ? ' alt' : ''}`} key={i}>{r}</span>
              ))}
            </div>
            <h1 className="rw-h1">
              <Editable id="rewardsPage.heroTitle_a">{t.heroTitle_a}</Editable>
              <br />
              <Editable className="gt" id="rewardsPage.heroTitle_b">{t.heroTitle_b}</Editable>
            </h1>
            <p><Editable id="rewardsPage.heroP">{t.heroP}</Editable></p>
            <EditableLink id="rewardsPage.heroCta" href={LINKS.programs} className="btn btn-p" data-magnetic>{t.heroCta}</EditableLink>
          </div>

          <div className="rw-right">
            <div className="rw-statbar">
              <div className="rw-statbox">
                <span className="rw-tag"><Editable id="rewardsPage.statPaidTag">{t.statPaidTag}</Editable></span>
                <div className="v gt">{data.totalCompact}+</div>
                <div className="s"><Editable id="rewardsPage.statPaidSub">{t.statPaidSub}</Editable></div>
              </div>
              <div className="rw-statbox">
                <span className="rw-tag"><Editable id="rewardsPage.statRewardsTag">{t.statRewardsTag}</Editable></span>
                <div className="v gt">{count}</div>
                <div className="s"><Editable id="rewardsPage.statRewardsSub">{t.statRewardsSub}</Editable></div>
              </div>
              <div className="rw-statbox">
                <span className="rw-tag">Avg reward</span>
                <div className="v gt">{data.avgReward}</div>
                <div className="s">per funded payout</div>
              </div>
            </div>

            {/* Milestones (since-launch narrative) */}
            <div className="rw-panel rw-miles-panel">
              <div className="rw-panel-head">
                <span className="rw-tag"><Editable id="rewardsPage.milestonesTag">{t.milestonesTag}</Editable></span>
                <span className="rw-tag muted"><Editable id="rewardsPage.sinceLaunch">{t.sinceLaunch}</Editable></span>
              </div>
              <svg className="rw-spark" viewBox="0 0 600 90" preserveAspectRatio="none">
                <polyline
                  points="0,80 150,64 300,40 450,20 600,8"
                  fill="none"
                  stroke="url(#rwspark)"
                  strokeWidth="2.5"
                />
                <defs>
                  <linearGradient id="rwspark" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#9fd8cd" />
                    <stop offset="1" stopColor="#0fa89c" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="rw-mile-row">
                {(data.milestones.length ? data.milestones : [{ d: '—', a: '$0', l: '' }]).map((m, i) => (
                  <div className="rw-mile" key={i}>
                    <div className="d">{m.d}</div>
                    <div className={m.horizon ? 'a muted' : 'a gt'}>{m.a}</div>
                    <div className="l">{m.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live total */}
            <div className="rw-panel rw-total">
              <span className="rw-corner tl" />
              <span className="rw-corner tr" />
              <span className="rw-corner bl" />
              <span className="rw-corner br" />
              <span className="rw-tag center">
                <span className="lr-dot" /> <Editable id="rewardsPage.liveNow">{t.liveNow}</Editable>
              </span>
              <div className="rw-total-num gt">{data.totalExact}</div>
              <div className="rw-total-row">
                <span>
                  <b>{count}</b> <Editable id="rewardsPage.rewardsLabel">{t.rewardsLabel}</Editable>
                </span>
                <span>
                  <b>{data.avgReward}</b> avg reward
                </span>
                <span>
                  <b>{data.countriesCount}+</b> <Editable id="rewardsPage.countriesLabel">{t.countriesLabel}</Editable>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mid: globe + hall of fame + rails */}
        <div className="rw-mid reveal">
          <div className="rw-panel rw-globe">
            <span className="rw-tag"><Editable id="rewardsPage.reachTag">{t.reachTag}</Editable></span>
            <div className="rw-globe-list">
              {data.countries.map((c, i) => (
                <span className="rw-country" key={i}>
                  <span className="f">{c.flag}</span>
                  <span className="n">{c.name}</span>
                  <span className="a gt">{c.amt}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="rw-panel">
            <div className="rw-panel-head">
              <span className="rw-tag"><Editable id="rewardsPage.fameTag">{t.fameTag}</Editable></span>
              <span className="rw-tag muted"><Editable id="rewardsPage.recordsLabel">{t.recordsLabel}</Editable></span>
            </div>
            <div className="rw-records">
              <div className="rw-rec">
                <div>
                  <div className="t"><Editable id="rewardsPage.fame.0.t">{t.fame[0].t}</Editable></div>
                  <div className="m">{data.largest?.meta || '—'}</div>
                </div>
                <div className="amt gt">{data.largest?.amt || '—'}</div>
              </div>
              <div className="rw-rec">
                <div>
                  <div className="t">Average reward</div>
                  <div className="m">across all {count} payouts</div>
                </div>
                <div className="amt gt">{data.avgReward}</div>
              </div>
              <div className="rw-rec">
                <div>
                  <div className="t">Most rewarded country</div>
                  <div className="m">{data.busiest ? `${data.busiest.flag} ${data.busiest.name}` : '—'}</div>
                </div>
                <div className="amt gt">{data.busiest?.amt || '—'}</div>
              </div>
              <div className="rw-rec">
                <div>
                  <div className="t"><Editable id="rewardsPage.fame.3.t">{t.fame[3].t}</Editable></div>
                  <div className="m">since launch</div>
                </div>
                <div className="amt gt">{data.totalCompact}</div>
              </div>
            </div>
          </div>

          <div className="rw-panel">
            <div className="rw-panel-head">
              <span className="rw-tag"><Editable id="rewardsPage.railsTag">{t.railsTag}</Editable></span>
              <span className="rw-tag muted"><Editable id="rewardsPage.breakdown">{t.breakdown}</Editable></span>
            </div>
            <div className="rw-rail">
              <div className="rw-rail-head">
                <span>{t.cryptoRail.replace(/[\d.]+%/, crypto.pct + '%')}</span>
                <span className="amt gt">{crypto.amt}</span>
              </div>
              <div className="rw-bar">
                <span style={{ width: `${crypto.pct}%` }} />
              </div>
              <div className="rw-rail-meta">
                <span><Editable id="rewardsPage.avg">{t.avg}</Editable> {crypto.avg}</span>
                <span>{crypto.count.toLocaleString('en-US')}</span>
                <span><Editable id="rewardsPage.max">{t.max}</Editable> {crypto.max}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live reward stream */}
        <div className="rw-panel rw-stream reveal">
          <span className="rw-tag"><Editable id="rewardsPage.streamTag">{t.streamTag}</Editable></span>
          <Ticker />
        </div>

        {/* Reward ledger */}
        <div className="rw-panel rw-ledger-panel reveal">
          <div className="rw-panel-head">
            <span className="rw-tag">
              <Editable id="rewardsPage.ledgerTag">{t.ledgerTag}</Editable> <span className="muted">{data.firstDate ? t.ledgerScope.replace('AUG 9 2024', data.firstDate) : t.ledgerScope}</span>
            </span>
            <span className="rw-tag muted">Showing {from}–{to} of {filtered.length.toLocaleString('en-US')}</span>
          </div>
          <div className="rw-ledger-controls">
            <select
              className="rw-input"
              value={range}
              onChange={(e) => { setRange(e.target.value); setPage(0); }}
              aria-label={t.thDate}
            >
              <option value="all">{t.rangeAll}</option>
              <option value="30">{t.range30}</option>
              <option value="7">{t.range7}</option>
              <option value="24">{t.range24}</option>
            </select>
            <input
              className="rw-input grow"
              placeholder={t.searchPh}
              aria-label={t.searchPh}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(0); }}
            />
            <button className="rw-input rw-reset" type="button" onClick={resetFilters}>{t.reset}</button>
          </div>
          <div className="rw-ledger-wrap">
            <table className="rw-ledger">
              <thead>
                <tr>
                  <th><Editable id="rewardsPage.thDate">{t.thDate}</Editable></th>
                  <th><Editable id="rewardsPage.thTrader">{t.thTrader}</Editable></th>
                  <th><Editable id="rewardsPage.thSize">{t.thSize}</Editable></th>
                  <th><Editable id="rewardsPage.thPlan">{t.thPlan}</Editable></th>
                  <th><Editable id="rewardsPage.thAmount">{t.thAmount}</Editable></th>
                  <th><Editable id="rewardsPage.thTx">{t.thTx}</Editable></th>
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--dim)' }}>
                      {data.ledger.length === 0 ? '—' : 'No rewards match your filters.'}
                    </td>
                  </tr>
                ) : (
                  pageRows.map((r) => (
                    <tr key={r.id}>
                      <td>{r.date}</td>
                      <td>
                        <span className="rw-flag">{r.flag}</span> {r.trader}
                      </td>
                      <td>{r.size}</td>
                      <td>{r.plan}</td>
                      <td className="amt gt">{r.amt}</td>
                      <td className="tx">
                        {r.txUrl ? (
                          <a href={r.txUrl} target="_blank" rel="noreferrer"><Editable id="rewardsPage.thTx">{t.thTx}</Editable> ↗</a>
                        ) : null}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="rw-ledger-foot">
            <span><Editable id="rewardsPage.ledgerFoot">{t.ledgerFoot}</Editable></span>
            <span className="rw-pager">
              <b>{from}–{to}</b>
              <button type="button" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={safePage <= 0}>{t.prev}</button>
              <button type="button" onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))} disabled={safePage >= pageCount - 1}>{t.next}</button>
              <span className="muted">Page {safePage + 1} / {pageCount}</span>
            </span>
          </div>
        </div>

        {/* Methodology */}
        <div className="rw-method reveal">
          <div className="rw-panel">
            <span className="rw-tag"><Editable id="rewardsPage.methodTag">{t.methodTag}</Editable></span>
            <h2><Editable id="rewardsPage.methodH">{t.methodH}</Editable></h2>
            <p><Editable id="rewardsPage.methodP">{t.methodP}</Editable></p>
          </div>
          <div className="rw-panel">
            <span className="rw-tag"><Editable id="rewardsPage.whyTag">{t.whyTag}</Editable></span>
            <h2><Editable id="rewardsPage.whyH">{t.whyH}</Editable></h2>
            <p><Editable id="rewardsPage.whyP">{t.whyP}</Editable></p>
          </div>
          <div className="rw-panel">
            <span className="rw-tag"><Editable id="rewardsPage.updateTag">{t.updateTag}</Editable></span>
            <div className="rw-update">
              <div className="rw-update-row">
                <span><Editable id="rewardsPage.updateSync">{t.updateSync}</Editable></span>
                <b><Editable id="rewardsPage.updateNextVal">{t.updateNextVal}</Editable></b>
              </div>
              <div className="rw-update-row">
                <span><Editable id="rewardsPage.updateNext">{t.updateNext}</Editable></span>
                <b><Editable id="rewardsPage.updateNextVal">{t.updateNextVal}</Editable></b>
              </div>
              <div className="rw-update-row">
                <span><Editable id="rewardsPage.updateAudit">{t.updateAudit}</Editable></span>
                <Editable as="b" className="gt" id="rewardsPage.updateAuditVal">{t.updateAuditVal}</Editable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
