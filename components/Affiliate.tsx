'use client';

import { useT } from './LanguageProvider';
import Editable from '@/components/Editable';

export default function Affiliate() {
  const t = useT();
  return (
    <section className="sec" id="affiliate">
      <div className="wrap">
        <div className="aff">
          <div className="reveal">
            <span className="idx"><Editable id="affiliate.idx">{t.affiliate.idx}</Editable></span>
            <h2 className="h2" style={{ marginBottom: 18 }}>
              <Editable id="affiliate.title_a">{t.affiliate.title_a}</Editable> <Editable className="gt" id="affiliate.title_b">{t.affiliate.title_b}</Editable>
            </h2>
            <p style={{ color: 'var(--dim)', fontSize: 18, maxWidth: '44ch', marginBottom: 30 }}>
              <Editable id="affiliate.sub">{t.affiliate.sub}</Editable>
            </p>
            <a href="#" className="btn btn-p btn-lg" data-magnetic>
              <Editable id="affiliate.cta">{t.affiliate.cta}</Editable>
            </a>
          </div>
          <div className="aff-card reveal" data-tilt>
            <div className="pct">15%</div>
            <div className="pl"><Editable id="affiliate.pct">{t.affiliate.pct}</Editable></div>
            <div className="arow">
              <div>
                <Editable as="div" className="v gt" id="affiliate.monthly">{t.affiliate.monthly}</Editable>
                <div className="k"><Editable id="affiliate.payouts">{t.affiliate.payouts}</Editable></div>
              </div>
              <div>
                <Editable as="div" className="v gt" id="affiliate.realtime">{t.affiliate.realtime}</Editable>
                <div className="k"><Editable id="affiliate.dashboard">{t.affiliate.dashboard}</Editable></div>
              </div>
              <div>
                <Editable as="div" className="v gt" id="affiliate.noCap">{t.affiliate.noCap}</Editable>
                <div className="k"><Editable id="affiliate.earnings">{t.affiliate.earnings}</Editable></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
