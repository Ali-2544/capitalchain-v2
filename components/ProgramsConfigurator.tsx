'use client';

import { useMemo, useState } from 'react';
import { useT } from './LanguageProvider';
import { useLiveData } from '@/lib/useLiveData';
import Editable from '@/components/Editable';

// One (program type × size) plan, as returned by /api/programs.
interface Plan {
  id?: number;
  programType: string;
  size: string;
  sizeOrder: number;
  fee: number;
  was: number;
  target: string;
  drawdown: string;
  dailyLoss: string;
  profitSplit: string;
  minDays: string;
  timeLimit: string;
  newsEas: string;
  payouts: string;
}

const SIZE_ORDER = ['5K', '25K', '50K', '100K', '200K', '500K'];

// Fallback shown only until /api/programs loads (or if the DB is empty), so the
// section always renders. Once the dashboard has plans, those drive everything.
const FALLBACK_DATA: Record<string, Record<string, { fee: number; was: number; target: string; dd: string; daily: string }>> = {
  '1step': {
    '5K': { fee: 49, was: 59, target: '8%', dd: '10%', daily: '5%' },
    '25K': { fee: 189, was: 229, target: '8%', dd: '10%', daily: '5%' },
    '50K': { fee: 289, was: 349, target: '8%', dd: '10%', daily: '5%' },
    '100K': { fee: 489, was: 540, target: '8%', dd: '10%', daily: '5%' },
    '200K': { fee: 889, was: 999, target: '8%', dd: '10%', daily: '5%' },
    '500K': { fee: 1899, was: 2199, target: '8%', dd: '10%', daily: '5%' },
  },
  '2step': {
    '5K': { fee: 39, was: 49, target: '8% / 5%', dd: '12%', daily: '5%' },
    '25K': { fee: 149, was: 189, target: '8% / 5%', dd: '12%', daily: '5%' },
    '50K': { fee: 229, was: 289, target: '8% / 5%', dd: '12%', daily: '5%' },
    '100K': { fee: 389, was: 449, target: '8% / 5%', dd: '12%', daily: '5%' },
    '200K': { fee: 699, was: 799, target: '8% / 5%', dd: '12%', daily: '5%' },
    '500K': { fee: 1499, was: 1799, target: '8% / 5%', dd: '12%', daily: '5%' },
  },
  instant: {
    '5K': { fee: 199, was: 249, target: 'None', dd: '6%', daily: '4%' },
    '25K': { fee: 699, was: 849, target: 'None', dd: '6%', daily: '4%' },
    '50K': { fee: 1199, was: 1399, target: 'None', dd: '6%', daily: '4%' },
    '100K': { fee: 1999, was: 2399, target: 'None', dd: '6%', daily: '4%' },
    '200K': { fee: 3499, was: 3999, target: 'None', dd: '6%', daily: '4%' },
    '500K': { fee: 7999, was: 8999, target: 'None', dd: '6%', daily: '4%' },
  },
};

const FALLBACK: Plan[] = Object.entries(FALLBACK_DATA).flatMap(([programType, sizes]) =>
  Object.entries(sizes).map(([size, c]) => ({
    programType,
    size,
    sizeOrder: SIZE_ORDER.indexOf(size),
    fee: c.fee,
    was: c.was,
    target: c.target,
    drawdown: c.dd,
    dailyLoss: c.daily,
    profitSplit: '100%',
    minDays: 'None',
    timeLimit: 'Unlimited',
    newsEas: 'Allowed',
    payouts: '4 cycles',
  })),
);

const TAB_IDS = ['1step', '2step', 'instant'] as const;

export default function ProgramsConfigurator() {
  const t = useT();
  const plans = useLiveData<Plan>('/api/programs', FALLBACK);
  const [tab, setTab] = useState<string>('1step');
  const [size, setSize] = useState('100K');

  // Group plans by program type, each ordered by sizeOrder.
  const byType = useMemo(() => {
    const src = plans.length ? plans : FALLBACK;
    const by: Record<string, Plan[]> = {};
    for (const p of src) (by[p.programType] ??= []).push(p);
    for (const k of Object.keys(by)) by[k].sort((a, b) => a.sizeOrder - b.sizeOrder);
    return by;
  }, [plans]);

  // Translate known keyword values so the spec list stays localized.
  const loc = (v: string) => {
    switch (v) {
      case 'None':
        return t.programs.none;
      case 'Unlimited':
        return t.programs.unlimited;
      case 'Allowed':
        return t.programs.allowed;
      case '4 cycles':
        return t.programs.cycles4;
      default:
        return v;
    }
  };

  // Only show tabs that actually have plans, and always resolve to a valid one,
  // so clicking a tab can never collapse the configurator.
  const availableTabs = TAB_IDS.filter((id) => (byType[id]?.length ?? 0) > 0);
  const activeTab = (availableTabs as string[]).includes(tab) ? tab : availableTabs[0] ?? '1step';
  const sizes = byType[activeTab] ?? [];
  const active = sizes.find((s) => s.size === size) ?? sizes[0];

  // Guard: if the active tab has no plans yet, show nothing breakable.
  if (!active) {
    return (
      <section className="sec band" id="programs">
        <div className="wrap">
          <div className="shead reveal">
            <div>
              <span className="idx"><Editable id="programs.idx">{t.programs.idx}</Editable></span>
              <h2 className="h2">
                <Editable id="programs.title_a">{t.programs.title_a}</Editable> <Editable className="gt" id="programs.title_b">{t.programs.title_b}</Editable>
              </h2>
            </div>
            <p><Editable id="programs.sub">{t.programs.sub}</Editable></p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="sec band" id="programs">
      <div className="wrap">
        <div className="shead reveal">
          <div>
            <span className="idx"><Editable id="programs.idx">{t.programs.idx}</Editable></span>
            <h2 className="h2">
              <Editable id="programs.title_a">{t.programs.title_a}</Editable> <Editable className="gt" id="programs.title_b">{t.programs.title_b}</Editable>
            </h2>
          </div>
          <p><Editable id="programs.sub">{t.programs.sub}</Editable></p>
        </div>
        <div className="config">
          <div className="reveal">
            <div className="seg">
              {availableTabs.map((id) => (
                <button
                  key={id}
                  className={id === activeTab ? 'active' : undefined}
                  data-tab={id}
                  onClick={() => setTab(id)}
                >
                  {t.programs.tabs[id]}
                </button>
              ))}
            </div>
            <div className="seg-note" id="segNote">
              {t.programs.notes[activeTab as (typeof TAB_IDS)[number]]}
            </div>
            <div className="size-track" id="sizeRow">
              {sizes.map((s) => (
                <button
                  key={s.size}
                  className={`size-pill ${s.size === active.size ? 'active' : ''}`}
                  data-s={s.size}
                  onClick={() => setSize(s.size)}
                >
                  ${s.size}
                </button>
              ))}
            </div>
            <div className="spec-list" id="specList">
              <div className="r">
                <span className="k"><Editable id="programs.spec.target">{t.programs.spec.target}</Editable></span>
                <span className="v">{loc(active.target)}</span>
              </div>
              <div className="r">
                <span className="k"><Editable id="programs.spec.dd">{t.programs.spec.dd}</Editable></span>
                <span className="v">{active.drawdown}</span>
              </div>
              <div className="r">
                <span className="k"><Editable id="programs.spec.daily">{t.programs.spec.daily}</Editable></span>
                <span className="v">{active.dailyLoss}</span>
              </div>
              <div className="r">
                <span className="k"><Editable id="programs.spec.split">{t.programs.spec.split}</Editable></span>
                <span className="v ok">{active.profitSplit}</span>
              </div>
              <div className="r">
                <span className="k"><Editable id="programs.spec.minDays">{t.programs.spec.minDays}</Editable></span>
                <span className="v ok">{loc(active.minDays)}</span>
              </div>
              <div className="r">
                <span className="k"><Editable id="programs.spec.timeLimit">{t.programs.spec.timeLimit}</Editable></span>
                <span className="v ok">{loc(active.timeLimit)}</span>
              </div>
              <div className="r">
                <span className="k"><Editable id="programs.spec.news">{t.programs.spec.news}</Editable></span>
                <span className="v ok">{loc(active.newsEas)}</span>
              </div>
              <div className="r">
                <span className="k"><Editable id="programs.spec.payouts">{t.programs.spec.payouts}</Editable></span>
                <span className="v">{loc(active.payouts)}</span>
              </div>
            </div>
          </div>
          <div className="buy reveal">
            <div className="cap"><Editable id="programs.balance">{t.programs.balance}</Editable></div>
            <div className="acct" id="buyAcct">
              ${active.size.replace('K', '')}
              <span>K</span>
            </div>
            <div>
              <span className="was" id="buyWas">
                ${active.was}
              </span>
              <div className="now" id="buyNow">
                <span className="gt">${active.fee}</span>
                <small><Editable id="programs.oneTime">{t.programs.oneTime}</Editable></small>
              </div>
            </div>
            <div className="refund"><Editable id="programs.refund">{t.programs.refund}</Editable></div>
            <a href="#" className="btn btn-p btn-lg" data-magnetic>
              <Editable id="programs.cta">{t.programs.cta}</Editable>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
