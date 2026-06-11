'use client';

import { useT } from './LanguageProvider';
import Editable from '@/components/Editable';

const ICONS = [
  <path key="0" d="M12 1v22M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6" />,
  <path key="1" d="M3 12h4l3-9 4 18 3-9h4" />,
  <path key="2" d="M22 10L12 5 2 10l10 5 10-5zM6 12v5c0 1 3 3 6 3s6-2 6-3v-5" />,
  <path key="3" d="M21 12a9 9 0 11-6.2-8.6M22 4l-9 9-3-3" />,
];

export default function WhoWeAre() {
  const t = useT();
  return (
    <section className="sec" id="about">
      <div className="wrap">
        <div className="shead reveal">
          <div>
            <span className="idx"><Editable id="who.idx">{t.who.idx}</Editable></span>
            <h2 className="h2">
              <Editable id="who.title_a">{t.who.title_a}</Editable> <Editable className="gt" id="who.title_b">{t.who.title_b}</Editable>
            </h2>
          </div>
          <p><Editable id="who.sub">{t.who.sub}</Editable></p>
        </div>
        <div className="svc-grid">
          {t.who.cards.map((c, i) => (
            <div className="tile reveal" data-tilt key={i}>
              <div className="ic">
                <svg viewBox="0 0 24 24">{ICONS[i]}</svg>
              </div>
              <h3><Editable id={`who.cards.${i}.h`}>{c.h}</Editable></h3>
              <p><Editable id={`who.cards.${i}.p`}>{c.p}</Editable></p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
