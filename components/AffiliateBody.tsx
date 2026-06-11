'use client';

import { useT } from '@/components/LanguageProvider';
import AffiliateFAQ from '@/components/AffiliateFAQ';

export default function AffiliateBody() {
  const t = useT().affiliatePage;

  return (
    <main>
      {/* Section 1: Hero Section */}
      <section className="hero">
        <div className="wrap grid-2">
          <div className="reveal">
            <span className="eyebrow">
              <span className="dot" />
              {t.hero.eyebrow}
            </span>
            <h1 style={{ marginBottom: 24 }}>
              {t.hero.title_a} <span className="gt">{t.hero.title_b}</span>
            </h1>
            <p className="hero-sub" style={{ marginBottom: 32 }}>
              {t.hero.sub}
            </p>
            <div className="hero-actions">
              <a href="#" className="btn btn-p btn-lg" data-magnetic>
                {t.hero.cta}
              </a>
            </div>
          </div>

          <div className="reveal">
            <div className="aff-card" data-tilt style={{ transform: 'none', transition: 'all 0.5s' }}>
              <div className="pct">{t.hero.pct}</div>
              <div className="pl">{t.hero.pl}</div>
              <div className="arow">
                <div>
                  <div className="v gt">{t.hero.monthlyV}</div>
                  <div className="k">{t.hero.monthlyK}</div>
                </div>
                <div>
                  <div className="v gt">{t.hero.realtimeV}</div>
                  <div className="k">{t.hero.realtimeK}</div>
                </div>
                <div>
                  <div className="v gt">{t.hero.noCapV}</div>
                  <div className="k">{t.hero.noCapK}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: How It Works */}
      <section className="sec band">
        <div className="wrap">
          <div className="shead reveal center">
            <span className="idx">{t.how.idx}</span>
            <h2 className="h2">{t.how.title}</h2>
            <p>{t.how.sub}</p>
          </div>

          <div className="grid-3 reveal">
            {t.how.steps.map((step, i) => (
              <div className="tile" style={{ minHeight: '260px' }} key={i}>
                <div className="ic">
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--teal)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3>{step.h}</h3>
                <p>{step.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Why Partner with Capital Chain? */}
      <section className="sec">
        <div className="wrap">
          <div className="shead reveal center">
            <span className="idx">{t.why.idx}</span>
            <h2 className="h2">{t.why.title}</h2>
            <p>{t.why.sub}</p>
          </div>

          <div className="bento reveal">
            {/* Tile 1: Big Feature */}
            <div className="tile big feature">
              <div className="big-num gt">{t.why.bigNum}</div>
              <h3>{t.why.bigH}</h3>
              <p>{t.why.bigP}</p>
            </div>

            {/* Tile 2: Medium */}
            <div className="tile med">
              <div className="ic">
                <svg viewBox="0 0 24 24">
                  <path d="M3 3v18h18M7 16l4-4 4 4 6-6" />
                </svg>
              </div>
              <h3>{t.why.tiles[0].h}</h3>
              <p>{t.why.tiles[0].p}</p>
            </div>

            {/* Tile 3: Medium */}
            <div className="tile med">
              <div className="ic">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 14a4 4 0 114-4 4 4 0 01-4 4z" />
                </svg>
              </div>
              <h3>{t.why.tiles[1].h}</h3>
              <p>{t.why.tiles[1].p}</p>
            </div>

            {/* Tile 4: Small */}
            <div className="tile sm">
              <div className="ic">
                <svg viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 114-4 4 4 0 01-4 4zm14 14v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
              </div>
              <h3>{t.why.tiles[2].h}</h3>
              <p>{t.why.tiles[2].p}</p>
            </div>

            {/* Tile 5: Small */}
            <div className="tile sm">
              <div className="ic">
                <svg viewBox="0 0 24 24">
                  <path d="M21 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <h3>{t.why.tiles[3].h}</h3>
              <p>{t.why.tiles[3].p}</p>
            </div>

            {/* Tile 6: Small */}
            <div className="tile sm">
              <div className="ic">
                <svg viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3>{t.why.tiles[4].h}</h3>
              <p>{t.why.tiles[4].p}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: FAQs */}
      <section className="sec band">
        <div className="wrap">
          <div className="faq-grid">
            <div className="reveal">
              <span className="idx">{t.faq.idx}</span>
              <h2 className="h2">{t.faq.title}</h2>
              <p style={{ color: 'var(--dim)', marginTop: 12 }}>{t.faq.sub}</p>
            </div>

            <AffiliateFAQ />
          </div>
        </div>
      </section>
    </main>
  );
}
