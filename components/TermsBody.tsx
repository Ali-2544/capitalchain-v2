'use client';

import { useState } from 'react';
import { useT } from '@/components/LanguageProvider';
import Editable from '@/components/Editable';
import { TERMS } from '@/lib/terms';
import { sanitizeHtml } from '@/lib/blogs';

// Terms of Use — content migrated from the old site (see lib/terms.ts).
// Clickable contents list on the left, the selected section on the right.
export default function TermsBody() {
  const t = useT().termsPage;
  const [active, setActive] = useState(1);
  const item = TERMS.find((x) => x.id === active) ?? TERMS[0];

  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div className="wrap">
          <span className="eyebrow reveal">
            <span className="dot" />
            <Editable id="termsPage.eyebrow">{t.eyebrow}</Editable>
          </span>
          <h1 className="reveal">
            <Editable id="termsPage.title_a">{t.title_a}</Editable>{' '}
            <Editable className="gt" id="termsPage.title_b">{t.title_b}</Editable>
          </h1>
          <p className="hero-sub reveal" style={{ maxWidth: '680px' }}>
            <Editable id="termsPage.sub">{t.sub}</Editable>
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="sec band">
        <div className="wrap terms-grid">
          <aside className="reveal" style={{ position: 'sticky', top: '100px' }}>
            <div className="tile" style={{ padding: '20px' }}>
              <h2 className="terms-toc-h">Contents</h2>
              <nav className="terms-toc">
                {TERMS.map((x) => (
                  <button
                    key={x.id}
                    type="button"
                    className={`terms-nav-link${x.id === active ? ' on' : ''}`}
                    onClick={() => setActive(x.id)}
                  >
                    <span className="terms-toc-num">{x.id}</span>
                    <span>{x.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          <div className="reveal">
            <article className="tile terms-panel" style={{ padding: '40px' }}>
              <h3 className="terms-panel-h">
                <span className="gt">{item.id}.</span> {item.title}
              </h3>
              <div
                className="terms-html"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.html) }}
              />
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
