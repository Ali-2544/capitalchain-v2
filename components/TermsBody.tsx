'use client';

import { useT } from '@/components/LanguageProvider';

// NOTE: Terms is legal text. These translations still need native/legal review
// before publishing — track via the weekly report's "Remaining" item.
export default function TermsBody() {
  const t = useT().termsPage;
  const sectionIds = ['intro', 'rules', 'prohibited', 'payouts', 'refund', 'risk'] as const;
  const bodySections = [t.intro, t.rules, t.prohibited, t.payouts, t.refund, t.risk];

  return (
    <main>
      {/* Hero Section */}
      <section className="hero">
        <div className="wrap">
          <span className="eyebrow reveal">
            <span className="dot" />
            {t.eyebrow}
          </span>
          <h1 className="reveal">
            {t.title_a} <span className="gt">{t.title_b}</span>
          </h1>
          <p className="hero-sub reveal" style={{ maxWidth: '680px' }}>
            {t.sub}
          </p>
        </div>
      </section>

      {/* Content Section with Sticky Sidebar Grid */}
      <section className="sec band">
        <div className="wrap terms-grid">
          {/* Sticky Left Sidebar Table of Contents */}
          <aside className="reveal" style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="tile" style={{ padding: '24px' }}>
              <h4 style={{ fontFamily: 'var(--fd)', fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', textTransform: 'uppercase', color: 'var(--teal)' }}>
                {t.toc}
              </h4>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {t.nav.map((label, i) => (
                  <a key={i} href={`#${sectionIds[i]}`} className="terms-nav-link">
                    {label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Right Column Content Cards */}
          <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {bodySections.map((sec, i) => (
              <div key={sectionIds[i]} id={sectionIds[i]} className="tile" style={{ padding: '40px' }}>
                <h3 style={{ fontFamily: 'var(--fd)', fontSize: '24px', color: 'var(--text)', marginBottom: '20px' }}>
                  {sec.h}
                </h3>
                {'p_a' in sec ? (
                  <>
                    <p style={{ color: 'var(--dim)', fontSize: '15px', lineHeight: 1.7, marginBottom: '16px' }}>
                      {sec.p_a}
                    </p>
                    <p style={{ color: 'var(--dim)', fontSize: '15px', lineHeight: 1.7 }}>
                      {sec.p_b}
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ color: 'var(--dim)', fontSize: '15px', lineHeight: 1.7, marginBottom: '16px' }}>
                      {sec.p}
                    </p>
                    <ul style={{ color: 'var(--dim)', fontSize: '15px', lineHeight: 1.8, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {sec.items.map((item, j) => (
                        <li key={j}>
                          <strong>{item.b}</strong>{item.t}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
