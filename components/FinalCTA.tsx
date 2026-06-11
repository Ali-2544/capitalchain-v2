'use client';

import { useT } from './LanguageProvider';
import Editable from '@/components/Editable';

export default function FinalCTA() {
  const t = useT();
  return (
    <section className="final">
      <div className="wrap">
        <h2>
          <Editable id="finalCta.title_a">{t.finalCta.title_a}</Editable>
          <br />
          <Editable id="finalCta.title_b">{t.finalCta.title_b}</Editable> <Editable className="gt" id="finalCta.title_c">{t.finalCta.title_c}</Editable>
        </h2>
        <p><Editable id="finalCta.sub">{t.finalCta.sub}</Editable></p>
        <div className="final-actions">
          <a href="/#programs" className="btn btn-p btn-lg" data-magnetic>
            <Editable id="finalCta.buy">{t.finalCta.buy}</Editable>
          </a>
          <a href="/#how" className="btn btn-lg">
            <Editable id="finalCta.how">{t.finalCta.how}</Editable>
          </a>
        </div>
      </div>
    </section>
  );
}
