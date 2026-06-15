'use client';

import { useState } from 'react';
import { sanitizeHtml } from '@/lib/blogs';
import type { TermsItem } from '@/lib/terms';

interface LegalBodyProps {
  eyebrow: string;
  titleA: string;
  titleB: string;
  sub: string;
  items: TermsItem[];
}

// Shared layout for the legal/policy pages — same design as the Terms of Use
// page (hero + sticky contents list on the left, selected section on the right).
// Content is data-driven so each policy just supplies its own sections.
export default function LegalBody({ eyebrow, titleA, titleB, sub, items }: LegalBodyProps) {
  const [active, setActive] = useState(items[0]?.id ?? 1);
  const item = items.find((x) => x.id === active) ?? items[0];

  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div className="wrap">
          <span className="eyebrow reveal">
            <span className="dot" />
            {eyebrow}
          </span>
          <h1 className="reveal">
            {titleA} <span className="gt">{titleB}</span>
          </h1>
          <p className="hero-sub reveal" style={{ maxWidth: '680px' }}>
            {sub}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="sec band">
        <div className="wrap terms-grid">
          <aside className="reveal" style={{ position: 'sticky', top: '100px' }}>
            <div className="tile" style={{ padding: '20px' }}>
              <h4 className="terms-toc-h">Contents</h4>
              <nav className="terms-toc">
                {items.map((x) => (
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
