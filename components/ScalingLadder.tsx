'use client';

import { useT } from './LanguageProvider';
import Editable from '@/components/Editable';

// Plain strings so each amount is inline-editable via <Editable>.
const AMTS = ['$100K', '$200K', '$400K', '$1M', '$2M'];

export default function ScalingLadder() {
  const t = useT();
  return (
    <section className="sec band" id="scaling">
      <div className="wrap">
        <div className="shead reveal">
          <div>
            <span className="idx"><Editable id="scaling.idx">{t.scaling.idx}</Editable></span>
            <h2 className="h2">
              <Editable id="scaling.title_a">{t.scaling.title_a}</Editable> <Editable className="gt" id="scaling.title_b">{t.scaling.title_b}</Editable>
            </h2>
          </div>
          <p><Editable id="scaling.sub">{t.scaling.sub}</Editable></p>
        </div>
        <div className="ladder">
          {t.scaling.rungs.map((lv, i) => {
            const peak = i === t.scaling.rungs.length - 1;
            return (
              <div className={`rung reveal${peak ? ' peak' : ''}`} key={i}>
                <div className="lv"><Editable id={`scaling.rungs.${i}`}>{lv}</Editable></div>
                <div className="amt"><Editable id={`scaling.amt.${i}`}>{AMTS[i]}</Editable></div>
              </div>
            );
          })}
        </div>
        <div className="ladder-note"><Editable id="scaling.note">{t.scaling.note}</Editable></div>
      </div>
    </section>
  );
}
