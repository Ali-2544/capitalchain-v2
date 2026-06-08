import type { Metadata } from 'next';
import PromoBar from '@/components/PromoBar';
import Nav from '@/components/Nav';
import Ticker from '@/components/Ticker';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Rewards — CapitalChain',
  description:
    'Every reward Capital Chain has ever paid, logged in real time with on-chain proof for every crypto transaction. No press releases. No audits. Just receipts.',
};

// TODO: replace placeholders with the real reward ledger feed.
const LEDGER = [
  { date: 'Jun 05, 2026', flag: '🇦🇪', trader: 'Owais A.', size: '$200,000.00', plan: '2 Step Plus', amt: '$2,129', tx: 'bd5cac…d8ef' },
  { date: 'Jun 05, 2026', flag: '🇩🇪', trader: 'Akash S.', size: '$25,000.00', plan: 'Instant Plus', amt: '$777', tx: '942ddf…ce5c' },
  { date: 'Jun 05, 2026', flag: '🇮🇳', trader: 'Manuel B.', size: '$100,000.00', plan: '1 Step Nitro', amt: '$1,294', tx: '4a51c3…85a3' },
  { date: 'Jun 05, 2026', flag: '🇧🇩', trader: 'Shreyas D.', size: '$10,000.00', plan: 'Instant Plus', amt: '$402', tx: 'cdc7f1…b745' },
  { date: 'Jun 04, 2026', flag: '🇮🇳', trader: 'Anurag M.', size: '$10,000.00', plan: 'Instant Standard', amt: '$184', tx: 'f54c1a…4e66' },
  { date: 'Jun 04, 2026', flag: '🇺🇸', trader: 'Emmanuel A.', size: '$200,000.00', plan: '1 Step Nitro', amt: '$3,589', tx: 'feb92b…3b11' },
  { date: 'Jun 04, 2026', flag: '🇸🇬', trader: 'Jun O.', size: '$100,000.00', plan: 'Instant Plus', amt: '$3,574', tx: 'd5d093…83c4' },
  { date: 'Jun 04, 2026', flag: '🇵🇰', trader: 'Tanvir A.', size: '$100,000.00', plan: 'Instant Pro', amt: '$1,130', tx: '30c363…fc1e' },
  { date: 'Jun 04, 2026', flag: '🇲🇾', trader: 'Lukas D.', size: '$25,000.00', plan: '1 Step Nitro', amt: '$491', tx: '9ebbe…54b4' },
  { date: 'Jun 04, 2026', flag: '🇹🇷', trader: 'Onur E.', size: '$50,000.00', plan: '1 Step Nitro', amt: '$2,909', tx: '72e8b…17c4' },
];

const COUNTRIES = [
  { flag: '🇨🇦', name: 'Canada', amt: '$202K' },
  { flag: '🇮🇳', name: 'India', amt: '$922K' },
  { flag: '🇻🇳', name: 'Vietnam', amt: '$254K' },
  { flag: '🇮🇩', name: 'Indonesia', amt: '$166K' },
  { flag: '🇦🇺', name: 'Australia', amt: '$49K' },
];

export default function Rewards() {
  return (
    <>
      <PromoBar />
      <Nav />
      <main className="rw-dash">
        <div className="wrap">
          {/* Status bar */}
          <div className="rw-statusbar reveal">
            <span className="rw-tag">
              [ CAPITAL CHAIN · VERIFIED REWARDS ]
              <span className="rw-live">
                <span className="lr-dot" /> LIVE
              </span>
            </span>
            <span className="rw-status-meta">
              <span>SYNC <b>CONTINUOUS</b></span>
              <span>AUDIT <b>ON-CHAIN LEDGER</b></span>
              <span>RECORDS <b>3,621</b></span>
            </span>
          </div>

          {/* Hero + stats */}
          <div className="rw-top reveal">
            <div className="rw-hero-card">
              <span className="rw-tag">[ REAL RECEIPTS · REAL TRADERS ]</span>
              <div className="rw-receipts">
                <span className="rw-receipt">+$1,800</span>
                <span className="rw-receipt alt">+$640</span>
              </div>
              <h1 className="rw-h1">
                Real Rewards.
                <br />
                <span className="gt">Verified Live.</span>
              </h1>
              <p>
                Every reward Capital Chain has ever made, logged in real time with on-chain
                verification for every crypto transaction. No press releases. Just receipts.
              </p>
              <a href="/#programs" className="btn btn-p" data-magnetic>
                View Programs ↗
              </a>
            </div>

            <div className="rw-right">
              <div className="rw-statbar">
                <div className="rw-statbox">
                  <span className="rw-tag">[ PAID TO TRADERS ]</span>
                  <div className="v gt">$5.33M+</div>
                  <div className="s">ALL-TIME · ALL RAILS</div>
                </div>
                <div className="rw-statbox">
                  <span className="rw-tag">[ REWARDS COMPLETED ]</span>
                  <div className="v gt">3,621</div>
                  <div className="s">SINCE LAUNCH</div>
                </div>
                <div className="rw-statbox">
                  <span className="rw-tag">[ AVG TIME TO PAY ]</span>
                  <div className="v gt">1hr 28min</div>
                  <div className="s">99.2% UNDER THE SLA</div>
                </div>
              </div>

              {/* Milestones */}
              <div className="rw-panel rw-miles-panel">
                <div className="rw-panel-head">
                  <span className="rw-tag">[ MILESTONES ]</span>
                  <span className="rw-tag muted">SINCE LAUNCH</span>
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
                    <div className="l">First rewards processed</div>
                  </div>
                  <div className="rw-mile">
                    <div className="d">DEC 2024</div>
                    <div className="a gt">$1M</div>
                    <div className="l">412 rewards · 28 countries</div>
                  </div>
                  <div className="rw-mile">
                    <div className="d">FEB 2026</div>
                    <div className="a gt">$3M</div>
                    <div className="l">Daily record ($142K / 24h)</div>
                  </div>
                  <div className="rw-mile">
                    <div className="d">ON THE HORIZON</div>
                    <div className="a muted">$6M</div>
                    <div className="l">Next milestone, in reach</div>
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
                  <span className="lr-dot" /> LIVE NOW · JUN 05, 2026 · CURRENT TOTAL
                </span>
                <div className="rw-total-num gt">$5,330,215.08</div>
                <div className="rw-total-row">
                  <span>
                    <b>3,621</b> REWARDS
                  </span>
                  <span>
                    <b>99.2%</b> UNDER 1HR SLA
                  </span>
                  <span>
                    <b>160+</b> COUNTRIES
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mid: globe + hall of fame + rails */}
          <div className="rw-mid reveal">
            <div className="rw-panel rw-globe">
              <span className="rw-tag">[ GLOBAL REACH ]</span>
              <div className="rw-globe-list">
                {COUNTRIES.map((c) => (
                  <span className="rw-country" key={c.name}>
                    <span className="f">{c.flag}</span>
                    <span className="n">{c.name}</span>
                    <span className="a gt">{c.amt}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="rw-panel">
              <div className="rw-panel-head">
                <span className="rw-tag">[ HALL OF FAME ]</span>
                <span className="rw-tag muted">RECORDS</span>
              </div>
              <div className="rw-records">
                <div className="rw-rec">
                  <div>
                    <div className="t">Largest single reward</div>
                    <div className="m">Shivam S. · India · Feb 2026</div>
                  </div>
                  <div className="amt gt">$40,513</div>
                </div>
                <div className="rw-rec">
                  <div>
                    <div className="t">Fastest reward</div>
                    <div className="m">Nauman N. · United Kingdom</div>
                  </div>
                  <div className="amt gt">7 sec</div>
                </div>
                <div className="rw-rec">
                  <div>
                    <div className="t">Single-day record</div>
                    <div className="m">16 traders · May 01, 2026</div>
                  </div>
                  <div className="amt gt">$61,570</div>
                </div>
                <div className="rw-rec">
                  <div>
                    <div className="t">Latest milestone</div>
                    <div className="m">Live · last activity just now</div>
                  </div>
                  <div className="amt gt">$5.33M</div>
                </div>
              </div>
            </div>

            <div className="rw-panel">
              <div className="rw-panel-head">
                <span className="rw-tag">[ REWARD RAILS ]</span>
                <span className="rw-tag muted">BREAKDOWN</span>
              </div>
              <div className="rw-rail">
                <div className="rw-rail-head">
                  <span>CRYPTO · 22.8% of paid</span>
                  <span className="amt gt">$1.22M</span>
                </div>
                <div className="rw-bar">
                  <span style={{ width: '22.8%' }} />
                </div>
                <div className="rw-rail-meta">
                  <span>AVG $681</span>
                  <span>1,787</span>
                  <span>MAX $9K</span>
                </div>
              </div>
              <div className="rw-rail">
                <div className="rw-rail-head">
                  <span>BANK &amp; CARDS · 77.2% of paid</span>
                  <span className="amt gt">$4.11M</span>
                </div>
                <div className="rw-bar">
                  <span style={{ width: '77.2%' }} />
                </div>
                <div className="rw-rail-meta">
                  <span>AVG $2K</span>
                  <span>1,834</span>
                  <span>MAX $41K</span>
                </div>
              </div>
              <div className="rw-balance">
                <span style={{ width: '22.8%' }} className="c" />
                <span style={{ width: '77.2%' }} className="r" />
              </div>
            </div>
          </div>

          {/* Live reward stream */}
          <div className="rw-panel rw-stream reveal">
            <span className="rw-tag">[ LIVE REWARD STREAM ]</span>
            <Ticker />
          </div>

          {/* Reward ledger */}
          <div className="rw-panel rw-ledger-panel reveal">
            <div className="rw-panel-head">
              <span className="rw-tag">
                [ REWARD LEDGER ] <span className="muted">// EVERY REWARD SINCE LAUNCH · AUG 9 2024 → PRESENT</span>
              </span>
              <span className="rw-tag muted">SHOWING 1–10 OF 3,621</span>
            </div>
            <div className="rw-ledger-controls">
              <select className="rw-input" defaultValue="all" aria-label="Date range">
                <option value="all">All time</option>
                <option value="30">Last 30 days</option>
                <option value="7">Last 7 days</option>
                <option value="24">Last 24 hours</option>
              </select>
              <input className="rw-input grow" placeholder="Initials search — e.g. AR or A.R." aria-label="Initials search" />
              <button className="rw-input rw-reset" type="button">Reset</button>
            </div>
            <div className="rw-ledger-wrap">
              <table className="rw-ledger">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Trader</th>
                    <th>Account size</th>
                    <th>Plan</th>
                    <th>Amount</th>
                    <th>Transaction</th>
                  </tr>
                </thead>
                <tbody>
                  {LEDGER.map((r) => (
                    <tr key={r.tx}>
                      <td>{r.date}</td>
                      <td>
                        <span className="rw-flag">{r.flag}</span> {r.trader}
                      </td>
                      <td>{r.size}</td>
                      <td>{r.plan}</td>
                      <td className="amt gt">{r.amt}</td>
                      <td className="tx">{r.tx} ↗</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="rw-ledger-foot">
              <span>MAX 10 ROWS · LIVE LEDGER FEED</span>
              <span className="rw-pager">
                <b>1–10</b>
                <button type="button">‹ Prev</button>
                <button type="button">Next ›</button>
                <span className="muted">FILTER STATE // DEFAULT</span>
              </span>
            </div>
          </div>

          {/* Methodology */}
          <div className="rw-method reveal">
            <div className="rw-panel">
              <span className="rw-tag">[ METHODOLOGY ]</span>
              <h3>How the ledger works</h3>
              <p>
                Reward data is pulled live from the Capital Chain ledger via realtime sync. Trader
                identities are anonymised to initials; crypto transactions are independently
                verifiable on the public blockchain.
              </p>
            </div>
            <div className="rw-panel">
              <span className="rw-tag">[ WHY THIS MATTERS ]</span>
              <h3>Proof, not press releases</h3>
              <p>
                Most prop firms publish self-reported totals. We expose both rails — crypto and bank —
                at the transaction level, with on-chain proof for every crypto reward. No audit fees.
                Just a ledger.
              </p>
            </div>
            <div className="rw-panel">
              <span className="rw-tag">[ LAST UPDATE ]</span>
              <div className="rw-update">
                <div className="rw-update-row">
                  <span>SYNC</span>
                  <b>JUN 05, 2026</b>
                </div>
                <div className="rw-update-row">
                  <span>NEXT</span>
                  <b>CONTINUOUS</b>
                </div>
                <div className="rw-update-row">
                  <span>AUDIT</span>
                  <b className="gt">ON-CHAIN</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <FinalCTA />
      <Footer />
    </>
  );
}
