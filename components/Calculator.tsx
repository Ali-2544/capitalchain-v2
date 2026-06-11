'use client';

import { useMemo, useState } from 'react';
import { useT } from './LanguageProvider';
import { useLiveData } from '@/lib/useLiveData';

const SPLITS = [0.6, 0.7, 0.8, 1.0];
const fmt = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

// "5K" -> 5000 · "100K" -> 100000 · "2M" -> 2000000
function parseSize(s: string): number {
  const m = /^([\d.]+)\s*([KkMm]?)/.exec(String(s).replace(/[,$\s]/g, ''));
  if (!m) return 0;
  let v = parseFloat(m[1]) || 0;
  const suf = m[2].toLowerCase();
  if (suf === 'k') v *= 1e3;
  else if (suf === 'm') v *= 1e6;
  return Math.round(v);
}

// Fallback account sizes (mirrors the Programs section) until /api/programs loads.
const FALLBACK_SIZES = ['5K', '25K', '50K', '100K', '200K', '500K'].map((size, sizeOrder) => ({ size, sizeOrder }));

const FEAT_ICONS = [
  <path key="0" d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2" />,
  <path key="1" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
];

export default function Calculator() {
  const t = useT();
  // Account sizes come from the Programs data — the same sizes the dashboard manages.
  const plans = useLiveData<{ size: string; sizeOrder: number }>('/api/programs', FALLBACK_SIZES);
  const [acc, setAcc] = useState(2); // index into the size list
  const [ret, setRet] = useState(8); // monthly return %
  const [split, setSplit] = useState(3); // index into SPLITS

  // Distinct account sizes, sorted ascending.
  const sizes = useMemo(() => {
    const set = new Set<number>();
    for (const p of plans) {
      const v = parseSize(p.size);
      if (v) set.add(v);
    }
    const arr = [...set].sort((a, b) => a - b);
    return arr.length ? arr : FALLBACK_SIZES.map((f) => parseSize(f.size));
  }, [plans]);

  const maxIdx = sizes.length - 1;
  const safeAcc = Math.min(acc, maxIdx);
  const size = sizes[safeAcc];
  const payout = size * (ret / 100) * SPLITS[split];

  return (
    <section className="sec">
      <div className="wrap">
        <div className="calc-grid">
          <div className="reveal">
            <span className="idx">{t.calc.idx}</span>
            <h2 className="h2" style={{ marginBottom: 18 }}>
              {t.calc.title_a} <span className="gt">{t.calc.title_b}</span>
            </h2>
            <p style={{ color: 'var(--dim)', fontSize: 18, maxWidth: '42ch' }}>{t.calc.sub}</p>
            <div className="cfeat">
              {t.calc.feats.map((f, i) => (
                <div className="f" key={i}>
                  <div className="ic">
                    <svg viewBox="0 0 24 24">{FEAT_ICONS[i]}</svg>
                  </div>
                  <div>
                    <h4>{f.h}</h4>
                    <p>{f.p}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="calc reveal">
            <div className="crow">
              <div className="top">
                <span className="lbl">{t.calc.accountSize}</span>
                <span className="out" id="accOut">
                  {fmt(size)}
                </span>
              </div>
              <input
                type="range"
                id="accSlider"
                min="0"
                max={maxIdx}
                step="1"
                value={safeAcc}
                onChange={(e) => setAcc(+e.target.value)}
              />
            </div>
            <div className="crow">
              <div className="top">
                <span className="lbl">{t.calc.monthlyReturn}</span>
                <span className="out" id="retOut">
                  {ret}%
                </span>
              </div>
              <input
                type="range"
                id="retSlider"
                min="2"
                max="20"
                step="1"
                value={ret}
                onChange={(e) => setRet(+e.target.value)}
              />
            </div>
            <div className="crow">
              <div className="top">
                <span className="lbl">{t.calc.payoutCycle}</span>
                <span className="out" id="splitOut">
                  {t.calc.cycles[split]}
                </span>
              </div>
              <input
                type="range"
                id="splitSlider"
                min="0"
                max="3"
                step="1"
                value={split}
                onChange={(e) => setSplit(+e.target.value)}
              />
            </div>
            <div className="cres">
              <div className="lbl">
                {t.calc.yourPayout}
                <span>{t.calc.payoutHint}</span>
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
