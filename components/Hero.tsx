'use client';

import { useT } from './LanguageProvider';

export default function Hero() {
  const t = useT();
  return (
    <section className="hero">
      <div className="wrap">
        <h1 className="reveal">
          {t.hero.title_a} <span className="gt">{t.hero.title_traders}</span> {t.hero.title_to}{' '}
          <span className="gt">{t.hero.title_capital}</span>
        </h1>
        <p className="hero-sub reveal">{t.hero.sub}</p>
        <div className="hero-actions reveal">
          <a href="#programs" className="btn btn-p btn-lg" data-magnetic>
            {t.hero.cta}
          </a>
          <span className="trustline">
            <span className="av">
              <span />
              <span />
              <span />
            </span>
            {t.hero.trust}
          </span>
        </div>
      </div>
    </section>
  );
}
