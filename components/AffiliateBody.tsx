'use client';

import { useT } from '@/components/LanguageProvider';
import AffiliateFAQ from '@/components/AffiliateFAQ';
import Editable from '@/components/Editable';
import EditableLink from '@/components/EditableLink';
import { LINKS, EXTERNAL } from '@/lib/links';

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
              <Editable id="affiliatePage.hero.eyebrow">{t.hero.eyebrow}</Editable>
            </span>
            <h1 style={{ marginBottom: 24 }}>
              <Editable id="affiliatePage.hero.title_a">{t.hero.title_a}</Editable> <Editable className="gt" id="affiliatePage.hero.title_b">{t.hero.title_b}</Editable>
            </h1>
            <p className="hero-sub" style={{ marginBottom: 32 }}>
              <Editable id="affiliatePage.hero.sub">{t.hero.sub}</Editable>
            </p>
            <div className="hero-actions">
              <EditableLink id="affiliatePage.hero.cta" href={LINKS.getStarted} className="btn btn-p btn-lg" data-magnetic {...EXTERNAL}>{t.hero.cta}</EditableLink>
            </div>
          </div>

          <div className="reveal">
            <div className="aff-card" data-tilt style={{ transform: 'none', transition: 'all 0.5s' }}>
              <Editable as="div" className="pct" id="affiliatePage.hero.pct">{t.hero.pct}</Editable>
              <div className="pl"><Editable id="affiliatePage.hero.pl">{t.hero.pl}</Editable></div>
              <div className="arow">
                <div>
                  <Editable as="div" className="v gt" id="affiliatePage.hero.monthlyV">{t.hero.monthlyV}</Editable>
                  <div className="k"><Editable id="affiliatePage.hero.monthlyK">{t.hero.monthlyK}</Editable></div>
                </div>
                <div>
                  <Editable as="div" className="v gt" id="affiliatePage.hero.realtimeV">{t.hero.realtimeV}</Editable>
                  <div className="k"><Editable id="affiliatePage.hero.realtimeK">{t.hero.realtimeK}</Editable></div>
                </div>
                <div>
                  <Editable as="div" className="v gt" id="affiliatePage.hero.noCapV">{t.hero.noCapV}</Editable>
                  <div className="k"><Editable id="affiliatePage.hero.noCapK">{t.hero.noCapK}</Editable></div>
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
            <span className="idx"><Editable id="affiliatePage.how.idx">{t.how.idx}</Editable></span>
            <h2 className="h2"><Editable id="affiliatePage.how.title">{t.how.title}</Editable></h2>
            <p><Editable id="affiliatePage.how.sub">{t.how.sub}</Editable></p>
          </div>

          <div className="grid-3 reveal">
            {t.how.steps.map((step, i) => (
              <div className="tile" style={{ minHeight: '260px' }} key={i}>
                <div className="ic">
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--teal)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3><Editable id={`affiliatePage.how.steps.${i}.h`}>{step.h}</Editable></h3>
                <p><Editable id={`affiliatePage.how.steps.${i}.p`}>{step.p}</Editable></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Why Partner with Capital Chain? */}
      <section className="sec">
        <div className="wrap">
          <div className="shead reveal center">
            <span className="idx"><Editable id="affiliatePage.why.idx">{t.why.idx}</Editable></span>
            <h2 className="h2"><Editable id="affiliatePage.why.title">{t.why.title}</Editable></h2>
            <p><Editable id="affiliatePage.why.sub">{t.why.sub}</Editable></p>
          </div>

          <div className="bento reveal">
            {/* Tile 1: Big Feature */}
            <div className="tile big feature">
              <Editable as="div" className="big-num gt" id="affiliatePage.why.bigNum">{t.why.bigNum}</Editable>
              <h3><Editable id="affiliatePage.why.bigH">{t.why.bigH}</Editable></h3>
              <p><Editable id="affiliatePage.why.bigP">{t.why.bigP}</Editable></p>
            </div>

            {/* Tile 2: Medium */}
            <div className="tile med">
              <div className="ic">
                <svg viewBox="0 0 24 24">
                  <path d="M3 3v18h18M7 16l4-4 4 4 6-6" />
                </svg>
              </div>
              <h3><Editable id="affiliatePage.why.tiles.0.h">{t.why.tiles[0].h}</Editable></h3>
              <p><Editable id="affiliatePage.why.tiles.0.p">{t.why.tiles[0].p}</Editable></p>
            </div>

            {/* Tile 3: Medium */}
            <div className="tile med">
              <div className="ic">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 14a4 4 0 114-4 4 4 0 01-4 4z" />
                </svg>
              </div>
              <h3><Editable id="affiliatePage.why.tiles.1.h">{t.why.tiles[1].h}</Editable></h3>
              <p><Editable id="affiliatePage.why.tiles.1.p">{t.why.tiles[1].p}</Editable></p>
            </div>

            {/* Tile 4: Small */}
            <div className="tile sm">
              <div className="ic">
                <svg viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 114-4 4 4 0 01-4 4zm14 14v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
              </div>
              <h3><Editable id="affiliatePage.why.tiles.2.h">{t.why.tiles[2].h}</Editable></h3>
              <p><Editable id="affiliatePage.why.tiles.2.p">{t.why.tiles[2].p}</Editable></p>
            </div>

            {/* Tile 5: Small */}
            <div className="tile sm">
              <div className="ic">
                <svg viewBox="0 0 24 24">
                  <path d="M21 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <h3><Editable id="affiliatePage.why.tiles.3.h">{t.why.tiles[3].h}</Editable></h3>
              <p><Editable id="affiliatePage.why.tiles.3.p">{t.why.tiles[3].p}</Editable></p>
            </div>

            {/* Tile 6: Small */}
            <div className="tile sm">
              <div className="ic">
                <svg viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3><Editable id="affiliatePage.why.tiles.4.h">{t.why.tiles[4].h}</Editable></h3>
              <p><Editable id="affiliatePage.why.tiles.4.p">{t.why.tiles[4].p}</Editable></p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: FAQs */}
      <section className="sec band">
        <div className="wrap">
          <div className="faq-grid">
            <div className="reveal">
              <span className="idx"><Editable id="affiliatePage.faq.idx">{t.faq.idx}</Editable></span>
              <h2 className="h2"><Editable id="affiliatePage.faq.title">{t.faq.title}</Editable></h2>
              <p style={{ color: 'var(--dim)', marginTop: 12 }}><Editable id="affiliatePage.faq.sub">{t.faq.sub}</Editable></p>
            </div>

            <AffiliateFAQ />
          </div>
        </div>
      </section>
    </main>
  );
}
