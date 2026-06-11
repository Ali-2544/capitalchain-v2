'use client';

import { useT } from './LanguageProvider';
import Editable from '@/components/Editable';

export default function WhyBento() {
  const t = useT();
  return (
    <section className="sec" id="why">
      <div className="wrap">
        <div className="shead reveal">
          <div>
            <span className="idx"><Editable id="why.idx">{t.why.idx}</Editable></span>
            <h2 className="h2">
              <Editable id="why.title_a">{t.why.title_a}</Editable> <Editable className="gt" id="why.title_b">{t.why.title_b}</Editable>
            </h2>
          </div>
          <p><Editable id="why.sub">{t.why.sub}</Editable></p>
        </div>
        <div className="bento">
          <div className="tile feature big reveal" data-tilt>
            <Editable as="div" className="big-num gt" id="why.keep.num">{t.why.keep.num}</Editable>
            <h3><Editable id="why.keep.h">{t.why.keep.h}</Editable></h3>
            <p><Editable id="why.keep.p">{t.why.keep.p}</Editable></p>
          </div>
          <div className="tile sm reveal" data-tilt>
            <div className="ic">
              <svg viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2" />
              </svg>
            </div>
            <h3><Editable id="why.support.h">{t.why.support.h}</Editable></h3>
            <p><Editable id="why.support.p">{t.why.support.p}</Editable></p>
          </div>
          <div className="tile sm reveal" data-tilt>
            <div className="ic">
              <svg viewBox="0 0 24 24">
                <path d="M21 12a9 9 0 11-6.2-8.6M22 4l-9 9-3-3" />
              </svg>
            </div>
            <h3><Editable id="why.flexible.h">{t.why.flexible.h}</Editable></h3>
            <p><Editable id="why.flexible.p">{t.why.flexible.p}</Editable></p>
          </div>
          <div className="tile med reveal" data-tilt>
            <div className="ic">
              <svg viewBox="0 0 24 24">
                <path d="M3 12h4l3-9 4 18 3-9h4" />
              </svg>
            </div>
            <h3><Editable id="why.raw.h">{t.why.raw.h}</Editable></h3>
            <p><Editable id="why.raw.p">{t.why.raw.p}</Editable></p>
          </div>
        </div>
      </div>
    </section>
  );
}
