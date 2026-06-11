'use client';

import { Fragment } from 'react';
import { useT } from './LanguageProvider';
import Editable from '@/components/Editable';

const Check = () => (
  <svg viewBox="0 0 24 24">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

// Render **bold** segments inside an otherwise plain translated string.
function rich(s: string) {
  return s.split('**').map((part, i) =>
    i % 2 === 1 ? <b key={i}>{part}</b> : <Fragment key={i}>{part}</Fragment>,
  );
}

const SPLITS = ['60%', '70%', '80%', '100%'];

export default function PayoutCycles() {
  const t = useT();
  return (
    <section className="sec band" id="payouts">
      <div className="wrap">
        <div className="shead center reveal">
          <span className="idx"><Editable id="payouts.idx">{t.payouts.idx}</Editable></span>
          <h2 className="h2">
            <Editable id="payouts.title_a">{t.payouts.title_a}</Editable> <Editable className="gt" id="payouts.title_b">{t.payouts.title_b}</Editable>
          </h2>
          <p><Editable id="payouts.sub">{t.payouts.sub}</Editable></p>
        </div>
        <div className="cycles">
          {t.payouts.cards.map((c, i) => {
            const best = i === t.payouts.cards.length - 1;
            return (
              <div className={`cyc reveal${best ? ' best' : ''}`} key={i} data-tilt>
                {best && <div className="badge"><Editable id="payouts.maxSplit">{t.payouts.maxSplit}</Editable></div>}
                <div className="cn"><Editable id={`payouts.cards.${i}.cn`}>{c.cn}</Editable></div>
                <div className="split">
                  <span>{SPLITS[i]}</span>
                </div>
                <div className="spl-l"><Editable id="payouts.split">{t.payouts.split}</Editable></div>
                <ul>
                  {c.items.map((item, j) => (
                    <li key={j}>
                      <Check />
                      {rich(item)}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
