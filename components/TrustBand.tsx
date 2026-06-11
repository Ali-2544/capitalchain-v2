'use client';

// TODO: replace with real verified figures (paid-to-traders, funded accounts,
// countries, Trustpilot score). Numbers below are illustrative placeholders.
import { useT } from './LanguageProvider';
import Editable from '@/components/Editable';

export default function TrustBand() {
  const t = useT();
  return (
    <div className="trust">
      <div className="wrap">
        <div className="st reveal">
          <div className="v">
            <span className="u">$</span>
            <span data-count="0" data-suffix="M+">
              0
            </span>
          </div>
          <div className="k"><Editable id="trust.paid">{t.trust.paid}</Editable></div>
        </div>
        <div className="st reveal">
          <div className="v">
            <span data-count="0" data-suffix="K+">
              0
            </span>
          </div>
          <div className="k"><Editable id="trust.funded">{t.trust.funded}</Editable></div>
        </div>
        <div className="st reveal">
          <div className="v">
            <span data-count="0" data-suffix="+">
              0
            </span>
          </div>
          <div className="k"><Editable id="trust.countries">{t.trust.countries}</Editable></div>
        </div>
        <div className="st reveal">
          <div className="v">0.0</div>
          <div className="tp">
            <span className="stars">★★★★★</span>
            <span className="tx"><Editable id="trust.trustpilot">{t.trust.trustpilot}</Editable></span>
          </div>
          <div className="k"><Editable id="trust.reviews">{t.trust.reviews}</Editable></div>
        </div>
      </div>
    </div>
  );
}
