'use client';

import { useEffect, useState } from 'react';
import { useT } from '@/components/LanguageProvider';
import Editable from '@/components/Editable';
import Ticker from '@/components/Ticker';

interface LedgerRow {
  id: number;
  date: string;
  flag: string;
  trader: string;
  size: string;
  plan: string;
  amt: string;
}
interface Rail {
  amt: string;
  avg: string;
  max: string;
  count: number;
  pct: number;
}
interface RewardsData {
  count: number;
  countriesCount: number;
  totalCompact: string;
  totalExact: string;
  countries: { flag: string; name: string; amt: string }[];
  largest: { amt: string; meta: string } | null;
  rails: { crypto: Rail; bank: Rail };
  ledger: LedgerRow[];
}

// Shown until /api/rewards loads (or if the DB is empty), so the page never breaks.
const FALLBACK: RewardsData = {
  count: 0,
  countriesCount: 0,
  totalCompact: '$0',
  totalExact: '$0',
  countries: [],
  largest: null,
  rails: {
    crypto: { amt: '$0', avg: '$0', max: '$0', count: 0, pct: 0 },
    bank: { amt: '$0', avg: '$0', max: '$0', count: 0, pct: 0 },
  },
  ledger: [],
};

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
  const shownTo = Math.min(data.ledger.length || 0, 12);
  const { crypto, bank } = data.rails;

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
              <span className="rw-receipt"><Editable id="rewardsPage.receipt0">+$1,800</Editable></span>
              <span className="rw-receipt alt"><Editable id="rewardsPage.receipt1">+$640</Editable></span>
            </div>
            <h1 className="rw-h1">
              <Editable id="rewardsPage.heroTitle_a">{t.heroTitle_a}</Editable>
              <br />
              <Editable className="gt" id="rewardsPage.heroTitle_b">{t.heroTitle_b}</Editable>
            </h1>
            <p><Editable id="rewardsPage.heroP">{t.heroP}</Editable></p>
            <a href="/#programs" className="btn btn-p" data-magnetic>
              <Editable id="rewardsPage.heroCta">{t.heroCta}</Editable>
            </a>
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
                <span className="rw-tag"><Editable id="rewardsPage.statAvgTag">{t.statAvgTag}</Editable></span>
                <div className="v gt"><Editable id="rewardsPage.statAvgVal">1hr 28min</Editable></div>
                <div className="s"><Editable id="rewardsPage.statAvgSub">{t.statAvgSub}</Editable></div>
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
                <div className="rw-mile">
                  <div className="d"><Editable id="rewardsPage.miles.0.d">AUG 9, 2024</Editable></div>
                  <div className="a gt"><Editable id="rewardsPage.miles.0.a">$50K</Editable></div>
                  <div className="l"><Editable id="rewardsPage.miles.0.l">{t.miles[0].l}</Editable></div>
                </div>
                <div className="rw-mile">
                  <div className="d"><Editable id="rewardsPage.miles.1.d">DEC 2024</Editable></div>
                  <div className="a gt"><Editable id="rewardsPage.miles.1.a">$1M</Editable></div>
                  <div className="l"><Editable id="rewardsPage.miles.1.l">{t.miles[1].l}</Editable></div>
                </div>
                <div className="rw-mile">
                  <div className="d"><Editable id="rewardsPage.miles.2.d">FEB 2026</Editable></div>
                  <div className="a gt"><Editable id="rewardsPage.miles.2.a">$3M</Editable></div>
                  <div className="l"><Editable id="rewardsPage.miles.2.l">{t.miles[2].l}</Editable></div>
                </div>
                <div className="rw-mile">
                  <div className="d"><Editable id="rewardsPage.onHorizon">{t.onHorizon}</Editable></div>
                  <div className="a muted"><Editable id="rewardsPage.miles.3.a">$6M</Editable></div>
                  <div className="l"><Editable id="rewardsPage.miles.3.l">{t.miles[3].l}</Editable></div>
                </div>
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
                  <b><Editable id="rewardsPage.slaPct">99.2%</Editable></b> <Editable id="rewardsPage.slaLabel">{t.slaLabel}</Editable>
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
                  <div className="m">{data.largest?.meta || <Editable id="rewardsPage.fame.0.m">{t.fame[0].m}</Editable>}</div>
                </div>
                <div className="amt gt">{data.largest?.amt || '—'}</div>
              </div>
              <div className="rw-rec">
                <div>
                  <div className="t"><Editable id="rewardsPage.fame.1.t">{t.fame[1].t}</Editable></div>
                  <div className="m"><Editable id="rewardsPage.fame.1.m">{t.fame[1].m}</Editable></div>
                </div>
                <div className="amt gt"><Editable id="rewardsPage.fame.1.amt">7 sec</Editable></div>
              </div>
              <div className="rw-rec">
                <div>
                  <div className="t"><Editable id="rewardsPage.fame.2.t">{t.fame[2].t}</Editable></div>
                  <div className="m"><Editable id="rewardsPage.fame.2.m">{t.fame[2].m}</Editable></div>
                </div>
                <div className="amt gt"><Editable id="rewardsPage.fame.2.amt">$61,570</Editable></div>
              </div>
              <div className="rw-rec">
                <div>
                  <div className="t"><Editable id="rewardsPage.fame.3.t">{t.fame[3].t}</Editable></div>
                  <div className="m"><Editable id="rewardsPage.fame.3.m">{t.fame[3].m}</Editable></div>
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
            <div className="rw-rail">
              <div className="rw-rail-head">
                <span>{t.bankRail.replace(/[\d.]+%/, bank.pct + '%')}</span>
                <span className="amt gt">{bank.amt}</span>
              </div>
              <div className="rw-bar">
                <span style={{ width: `${bank.pct}%` }} />
              </div>
              <div className="rw-rail-meta">
                <span><Editable id="rewardsPage.avg">{t.avg}</Editable> {bank.avg}</span>
                <span>{bank.count.toLocaleString('en-US')}</span>
                <span><Editable id="rewardsPage.max">{t.max}</Editable> {bank.max}</span>
              </div>
            </div>
            <div className="rw-balance">
              <span style={{ width: `${crypto.pct}%` }} className="c" />
              <span style={{ width: `${bank.pct}%` }} className="r" />
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
              <Editable id="rewardsPage.ledgerTag">{t.ledgerTag}</Editable> <span className="muted"><Editable id="rewardsPage.ledgerScope">{t.ledgerScope}</Editable></span>
            </span>
            <span className="rw-tag muted">{t.showing.replace('1–10', `1–${shownTo}`).replace('3,621', count)}</span>
          </div>
          <div className="rw-ledger-controls">
            <select className="rw-input" defaultValue="all" aria-label={t.thDate}>
              <option value="all">{t.rangeAll}</option>
              <option value="30">{t.range30}</option>
              <option value="7">{t.range7}</option>
              <option value="24">{t.range24}</option>
            </select>
            <input className="rw-input grow" placeholder={t.searchPh} aria-label={t.searchPh} />
            <button className="rw-input rw-reset" type="button"><Editable id="rewardsPage.reset">{t.reset}</Editable></button>
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
                {data.ledger.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--dim)' }}>—</td>
                  </tr>
                ) : (
                  data.ledger.map((r) => (
                    <tr key={r.id}>
                      <td>{r.date}</td>
                      <td>
                        <span className="rw-flag">{r.flag}</span> {r.trader}
                      </td>
                      <td>{r.size}</td>
                      <td>{r.plan}</td>
                      <td className="amt gt">{r.amt}</td>
                      <td className="tx">
                        <a href={`/certificate/${r.id}`} target="_blank" rel="noreferrer"><Editable id="rewardsPage.thTx">{t.thTx}</Editable> ↗</a>
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
              <b>1–{shownTo}</b>
              <button type="button"><Editable id="rewardsPage.prev">{t.prev}</Editable></button>
              <button type="button"><Editable id="rewardsPage.next">{t.next}</Editable></button>
              <span className="muted"><Editable id="rewardsPage.filterState">{t.filterState}</Editable></span>
            </span>
          </div>
        </div>

        {/* Methodology */}
        <div className="rw-method reveal">
          <div className="rw-panel">
            <span className="rw-tag"><Editable id="rewardsPage.methodTag">{t.methodTag}</Editable></span>
            <h3><Editable id="rewardsPage.methodH">{t.methodH}</Editable></h3>
            <p><Editable id="rewardsPage.methodP">{t.methodP}</Editable></p>
          </div>
          <div className="rw-panel">
            <span className="rw-tag"><Editable id="rewardsPage.whyTag">{t.whyTag}</Editable></span>
            <h3><Editable id="rewardsPage.whyH">{t.whyH}</Editable></h3>
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
