'use client';

import { useState } from 'react';
import { useT } from './LanguageProvider';
import Editable from '@/components/Editable';

const SPLITS = [0.6, 0.7, 0.8, 1.0];
const fmt = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

// Account sizes — the exact money values offered in the Programs section
// (see ProgramsConfigurator SIZES). Kept in sync as a fixed list.
const SIZES = [3000, 5000, 10000, 25000, 50000, 100000];

const FEAT_ICONS = [
  <path key="0" d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2" />,
  <path key="1" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
];

// Evenly-spaced step dots under a slider, aligned to the 22px thumb's travel.
// Dots up to the current value are filled (teal).
function Ticks({ count, activeFrac }: { count: number; activeFrac: number }) {
  return (
    <div className="crow-ticks" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const frac = count <= 1 ? 0 : i / (count - 1);
        return (
          <span
            key={i}
            className={frac <= activeFrac + 1e-6 ? 'on' : undefined}
            style={{ left: `calc(11px + ${frac} * (100% - 22px))` }}
          />
        );
      })}
    </div>
  );
}

export default function Calculator() {
  const t = useT();
  const [acc, setAcc] = useState(4); // index into the size list (defaults to $50,000)
  const [ret, setRet] = useState(8); // monthly return %
  const [split, setSplit] = useState(3); // index into SPLITS

  const sizes = SIZES;
  const maxIdx = sizes.length - 1;
  const safeAcc = Math.min(acc, maxIdx);
  const size = sizes[safeAcc];
  const payout = size * (ret / 100) * SPLITS[split];

  return (
    <section className="sec" id="calc">
      <div className="wrap">
        <div className="calc-grid">
          <div className="reveal">
            <span className="idx"><Editable id="calc.idx">{t.calc.idx}</Editable></span>
            <h2 className="h2" style={{ marginBottom: 18 }}>
              <Editable id="calc.title_a">{t.calc.title_a}</Editable> <Editable className="gt" id="calc.title_b">{t.calc.title_b}</Editable>
            </h2>
            <p style={{ color: 'var(--dim)', fontSize: 18, maxWidth: '42ch' }}><Editable id="calc.sub">{t.calc.sub}</Editable></p>
            <div className="cfeat">
              {t.calc.feats.map((f, i) => (
                <div className="f" key={i}>
                  <div className="ic">
                    <svg viewBox="0 0 24 24">{FEAT_ICONS[i]}</svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1em', fontWeight: 600, margin: '0 0 3px' }}><Editable id={`calc.feats.${i}.h`}>{f.h}</Editable></h3>
                    <p><Editable id={`calc.feats.${i}.p`}>{f.p}</Editable></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="calc reveal">
            <div className="crow">
              <div className="top">
                <span className="lbl"><Editable id="calc.accountSize">{t.calc.accountSize}</Editable></span>
                <span className="out" id="accOut">
                  {fmt(size)}
                </span>
              </div>
              <div className="crow-slider">
                <input
                  type="range"
                  id="accSlider"
                  aria-label="Account size"
                  min="0"
                  max={maxIdx}
                  step="1"
                  value={safeAcc}
                  onChange={(e) => setAcc(+e.target.value)}
                />
                <Ticks count={sizes.length} activeFrac={maxIdx > 0 ? safeAcc / maxIdx : 0} />
              </div>
            </div>
            <div className="crow">
              <div className="top">
                <span className="lbl"><Editable id="calc.monthlyReturn">{t.calc.monthlyReturn}</Editable></span>
                <span className="out" id="retOut">
                  {ret}%
                </span>
              </div>
              <div className="crow-slider">
                <input
                  type="range"
                  id="retSlider"
                  aria-label="Monthly return"
                  min="2"
                  max="20"
                  step="1"
                  value={ret}
                  onChange={(e) => setRet(+e.target.value)}
                />
                <Ticks count={10} activeFrac={(ret - 2) / 18} />
              </div>
            </div>
            <div className="crow">
              <div className="top">
                <span className="lbl"><Editable id="calc.payoutCycle">{t.calc.payoutCycle}</Editable></span>
                <span className="out" id="splitOut">
                  {t.calc.cycles[split]}
                </span>
              </div>
              <div className="crow-slider">
                <input
                  type="range"
                  id="splitSlider"
                  aria-label="Payout cycle"
                  min="0"
                  max="3"
                  step="1"
                  value={split}
                  onChange={(e) => setSplit(+e.target.value)}
                />
                <Ticks count={SPLITS.length} activeFrac={split / 3} />
              </div>
            </div>
            <div className="cres">
              <div className="lbl">
                <Editable id="calc.yourPayout">{t.calc.yourPayout}</Editable>
                <span><Editable id="calc.payoutHint">{t.calc.payoutHint}</Editable></span>
              </div>
              <div className="payout" id="payoutOut">
                {fmt(payout)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
