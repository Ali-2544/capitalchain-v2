'use client';

import { useT } from './LanguageProvider';
import Editable from '@/components/Editable';

// TODO: replace with real verified testimonials — names, accounts and payouts are placeholders.
const META = [
  { nm: 'Evgeny M.', size: '$100K', pay: '$36,393' },
  { nm: 'Mac Ting', size: '$200K', pay: '$50,400' },
  { nm: 'Nipong', size: '$50K', pay: '$12,656' },
  { nm: 'Aisha N.', size: '$100K', pay: '$41,210' },
];

export default function Testimonials() {
  const t = useT();
  return (
    <section className="sec" id="reviews">
      <div className="wrap">
        <div className="shead reveal">
          <div>
            <span className="idx"><Editable id="testimonials.idx">{t.testimonials.idx}</Editable></span>
            <h2 className="h2">
              <Editable id="testimonials.title_a">{t.testimonials.title_a}</Editable> <Editable className="gt" id="testimonials.title_b">{t.testimonials.title_b}</Editable>
            </h2>
          </div>
          <p><Editable id="testimonials.sub">{t.testimonials.sub}</Editable></p>
        </div>
      </div>
      <div className="wrap">
        <div className="hscroll">
          {META.map((m, i) => (
            <div className="hcard rev reveal" key={m.nm}>
              <div className="stars">★★★★★</div>
              <p><Editable id={`testimonials.reviews.${i}`}>{t.testimonials.reviews[i]}</Editable></p>
              <div className="who">
                <span className="av" />
                <div>
                  <div className="nm"><Editable id={`testimonials.cards.${i}.nm`}>{m.nm}</Editable></div>
                  <div className="l">
                    <Editable id={`testimonials.cards.${i}.size`}>{m.size}</Editable> ·{' '}
                    <Editable id="testimonials.funded">{t.testimonials.funded}</Editable>
                  </div>
                </div>
                <span className="pay"><Editable id={`testimonials.cards.${i}.pay`}>{m.pay}</Editable></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
