'use client';

import { useEffect, useState } from 'react';
import { useT } from '@/components/LanguageProvider';
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
            {t.statusTag}
            <span className="rw-live">
              <span className="lr-dot" /> {t.live}
            </span>
          </span>
          <span className="rw-status-meta">
            <span>{t.sync} <b>{t.syncVal}</b></span>
            <span>{t.audit} <b>{t.auditVal}</b></span>
            <span>{t.records} <b>{count}</b></span>
          </span>
        </div>

        {/* Hero + stats */}
        <div className="rw-top reveal">
          <div className="rw-hero-card">
            <span className="rw-tag">{t.heroTag}</span>
            <div className="rw-receipts">
              <span className="rw-receipt">+$1,800</span>
              <span className="rw-receipt alt">+$640</span>
            </div>
            <h1 className="rw-h1">
              {t.heroTitle_a}
              <br />
              <span className="gt">{t.heroTitle_b}</span>
            </h1>
            <p>{t.heroP}</p>
            <a href="/#programs" className="btn btn-p" data-magnetic>
              {t.heroCta}
            </a>
          </div>

          <div className="rw-right">
            <div className="rw-statbar">
              <div className="rw-statbox">
                <span className="rw-tag">{t.statPaidTag}</span>
                <div className="v gt">{data.totalCompact}+</div>
                <div className="s">{t.statPaidSub}</div>
              </div>
              <div className="rw-statbox">
                <span className="rw-tag">{t.statRewardsTag}</span>
                <div className="v gt">{count}</div>
                <div className="s">{t.statRewardsSub}</div>
              </div>
              <div className="rw-statbox">
                <span className="rw-tag">{t.statAvgTag}</span>
                <div className="v gt">1hr 28min</div>
                <div className="s">{t.statAvgSub}</div>
              </div>
            </div>

            {/* Milestones (since-launch narrative) */}
            <div className="rw-panel rw-miles-panel">
              <div className="rw-panel-head">
                <span className="rw-tag">{t.milestonesTag}</span>
                <span className="rw-tag muted">{t.sinceLaunch}</span>
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
                  <div className="d">AUG 9, 2024</div>
                  <div className="a gt">$50K</div>
                  <div className="l">{t.miles[0].l}</div>
                </div>
                <div className="rw-mile">
                  <div className="d">DEC 2024</div>
                  <div className="a gt">$1M</div>
                  <div className="l">{t.miles[1].l}</div>
                </div>
                <div className="rw-mile">
                  <div className="d">FEB 2026</div>
                  <div className="a gt">$3M</div>
                  <div className="l">{t.miles[2].l}</div>
                </div>
                <div className="rw-mile">
                  <div className="d">{t.onHorizon}</div>
                  <div className="a muted">$6M</div>
                  <div className="l">{t.miles[3].l}</div>
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
                <span className="lr-dot" /> {t.liveNow}
              </span>
              <div className="rw-total-num gt">{data.totalExact}</div>
              <div className="rw-total-row">
                <span>
                  <b>{count}</b> {t.rewardsLabel}
                </span>
                <span>
                  <b>99.2%</b> {t.slaLabel}
                </span>
                <span>
                  <b>{data.countriesCount}+</b> {t.countriesLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mid: globe + hall of fame + rails */}
        <div className="rw-mid reveal">
          <div className="rw-panel rw-globe">
            <span className="rw-tag">{t.reachTag}</span>
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
              <span className="rw-tag">{t.fameTag}</span>
              <span className="rw-tag muted">{t.recordsLabel}</span>
            </div>
            <div className="rw-records">
              <div className="rw-rec">
                <div>
                  <div className="t">{t.fame[0].t}</div>
                  <div className="m">{data.largest?.meta || t.fame[0].m}</div>
                </div>
                <div className="amt gt">{data.largest?.amt || '—'}</div>
              </div>
              <div className="rw-rec">
                <div>
                  <div className="t">{t.fame[1].t}</div>
                  <div className="m">{t.fame[1].m}</div>
                </div>
                <div className="amt gt">7 sec</div>
              </div>
              <div className="rw-rec">
                <div>
                  <div className="t">{t.fame[2].t}</div>
                  <div className="m">{t.fame[2].m}</div>
                </div>
                <div className="amt gt">$61,570</div>
              </div>
              <div className="rw-rec">
                <div>
                  <div className="t">{t.fame[3].t}</div>
                  <div className="m">{t.fame[3].m}</div>
                </div>
                <div className="amt gt">{data.totalCompact}</div>
              </div>
            </div>
          </div>

          <div className="rw-panel">
            <div className="rw-panel-head">
              <span className="rw-tag">{t.railsTag}</span>
              <span className="rw-tag muted">{t.breakdown}</span>
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
                <span>{t.avg} {crypto.avg}</span>
                <span>{crypto.count.toLocaleString('en-US')}</span>
                <span>{t.max} {crypto.max}</span>
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
                <span>{t.avg} {bank.avg}</span>
                <span>{bank.count.toLocaleString('en-US')}</span>
                <span>{t.max} {bank.max}</span>
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
          <span className="rw-tag">{t.streamTag}</span>
          <Ticker />
        </div>

        {/* Reward ledger */}
        <div className="rw-panel rw-ledger-panel reveal">
          <div className="rw-panel-head">
            <span className="rw-tag">
              {t.ledgerTag} <span className="muted">{t.ledgerScope}</span>
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
            <button className="rw-input rw-reset" type="button">{t.reset}</button>
          </div>
          <div className="rw-ledger-wrap">
            <table className="rw-ledger">
              <thead>
                <tr>
                  <th>{t.thDate}</th>
                  <th>{t.thTrader}</th>
                  <th>{t.thSize}</th>
                  <th>{t.thPlan}</th>
                  <th>{t.thAmount}</th>
                  <th>{t.thTx}</th>
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
                        <a href={`/certificate/${r.id}`} target="_blank" rel="noreferrer">{t.thTx} ↗</a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="rw-ledger-foot">
            <span>{t.ledgerFoot}</span>
            <span className="rw-pager">
              <b>1–{shownTo}</b>
              <button type="button">{t.prev}</button>
              <button type="button">{t.next}</button>
              <span className="muted">{t.filterState}</span>
            </span>
          </div>
        </div>

        {/* Methodology */}
        <div className="rw-method reveal">
          <div className="rw-panel">
            <span className="rw-tag">{t.methodTag}</span>
            <h3>{t.methodH}</h3>
            <p>{t.methodP}</p>
          </div>
          <div className="rw-panel">
            <span className="rw-tag">{t.whyTag}</span>
            <h3>{t.whyH}</h3>
            <p>{t.whyP}</p>
          </div>
          <div className="rw-panel">
            <span className="rw-tag">{t.updateTag}</span>
            <div className="rw-update">
              <div className="rw-update-row">
                <span>{t.updateSync}</span>
                <b>{t.updateNextVal}</b>
              </div>
              <div className="rw-update-row">
                <span>{t.updateNext}</span>
                <b>{t.updateNextVal}</b>
              </div>
              <div className="rw-update-row">
                <span>{t.updateAudit}</span>
                <b className="gt">{t.updateAuditVal}</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
