'use client';

import { useT } from '@/components/LanguageProvider';
import ContactForm from '@/components/ContactForm';
import Editable from '@/components/Editable';
import EditableLink from '@/components/EditableLink';
import { LINKS, EXTERNAL } from '@/lib/links';

export default function ContactBody() {
  const t = useT().contactPage;

  return (
    <main>
      {/* Section 1: Hero */}
      <section className="hero">
        <div className="wrap">
          <span className="eyebrow reveal">
            <span className="dot" />
            <Editable id="contactPage.hero.eyebrow">{t.hero.eyebrow}</Editable>
          </span>
          <h1 className="reveal">
            <Editable id="contactPage.hero.title_a">{t.hero.title_a}</Editable> <Editable className="gt" id="contactPage.hero.title_b">{t.hero.title_b}</Editable>
          </h1>
          <p className="hero-sub reveal" style={{ maxWidth: '640px' }}>
            <Editable id="contactPage.hero.sub">{t.hero.sub}</Editable>
          </p>
        </div>
      </section>

      {/* Section 2: Main Grid Form and Bento Cards */}
      <section className="sec band">
        <div className="wrap grid-2">
          {/* Left Column: Form */}
          <div className="reveal">
            <ContactForm />
          </div>

          {/* Right Column: Support Cards */}
          <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Card 1: Direct Support */}
            <div className="tile" style={{ padding: '30px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                <div className="ic" style={{ margin: 0, padding: '8px', background: 'rgba(25,230,214,0.1)', borderRadius: '10px' }}>
                  <svg viewBox="0 0 24 24" style={{ width: '24px', height: '24px', stroke: 'var(--teal)', strokeWidth: 2, fill: 'none' }}>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <h2 style={{ fontFamily: 'var(--fd)', fontSize: '20px', fontWeight: 600, margin: 0 }}><Editable id="contactPage.direct.title">{t.direct.title}</Editable></h2>
              </div>
              <p style={{ color: 'var(--dim)', fontSize: '14.5px', marginBottom: '16px', lineHeight: 1.6 }}>
                <Editable id="contactPage.direct.body">{t.direct.body}</Editable>
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
                <span style={{ color: 'var(--text)', fontWeight: 600 }}><Editable id="contactPage.direct.email">support@capitalchain.co</Editable></span>
                <span style={{ fontSize: '12px', background: 'rgba(25,230,214,0.1)', color: 'var(--teal)', padding: '4px 10px', borderRadius: '20px' }}><Editable id="contactPage.direct.badge">{t.direct.badge}</Editable></span>
              </div>
            </div>

            {/* Card 2: Discord Support */}
            <div className="tile" style={{ padding: '30px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                <div className="ic" style={{ margin: 0, padding: '8px', background: 'rgba(25,230,214,0.1)', borderRadius: '10px' }}>
                  <svg viewBox="0 0 24 24" style={{ width: '24px', height: '24px', fill: 'var(--teal)' }}>
                    <path d="M20.3 4.4A19.8 19.8 0 0015.4 3l-.3.5a14.6 14.6 0 014.4 1.4 12.6 12.6 0 00-15 0A14.6 14.6 0 018.9 3.5L8.6 3a19.8 19.8 0 00-4.9 1.4C.6 9 0 13.5.3 17.9a19.9 19.9 0 006 3l.5-1.3a13 13 0 01-1.9-.9l.4-.3a14.2 14.2 0 0012.4 0l.4.3a13 13 0 01-1.9.9l.5 1.3a19.9 19.9 0 006-3c.4-5.1-.7-9.6-2.8-13.5zM8.3 15.3c-1.2 0-2.1-1.1-2.1-2.4S7.1 10.5 8.3 10.5s2.1 1.1 2.1 2.4-.9 2.4-2.1 2.4zm7.4 0c-1.2 0-2.1-1.1-2.1-2.4s.9-2.4 2.1-2.4 2.1 1.1 2.1 2.4-.9 2.4-2.1 2.4z" />
                  </svg>
                </div>
                <h2 style={{ fontFamily: 'var(--fd)', fontSize: '20px', fontWeight: 600, margin: 0 }}><Editable id="contactPage.discord.title">{t.discord.title}</Editable></h2>
              </div>
              <p style={{ color: 'var(--dim)', fontSize: '14.5px', marginBottom: '16px', lineHeight: 1.6 }}>
                <Editable id="contactPage.discord.body">{t.discord.body}</Editable>
              </p>
              <EditableLink id="contactPage.discord.cta" href={LINKS.discord} className="btn btn-p" style={{ width: '100%', justifyContent: 'center' }} {...EXTERNAL}>{t.discord.cta}</EditableLink>
            </div>

            {/* Card 3: Partnerships */}
            <div className="tile" style={{ padding: '30px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                <div className="ic" style={{ margin: 0, padding: '8px', background: 'rgba(25,230,214,0.1)', borderRadius: '10px' }}>
                  <svg viewBox="0 0 24 24" style={{ width: '24px', height: '24px', stroke: 'var(--teal)', strokeWidth: 2, fill: 'none' }}>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h2 style={{ fontFamily: 'var(--fd)', fontSize: '20px', fontWeight: 600, margin: 0 }}><Editable id="contactPage.business.title">{t.business.title}</Editable></h2>
              </div>
              <p style={{ color: 'var(--dim)', fontSize: '14.5px', lineHeight: 1.6 }}>
                <Editable id="contactPage.business.body">{t.business.body}</Editable> <strong style={{ color: 'var(--text)' }}><Editable id="contactPage.business.email">partners@capitalchain.co</Editable></strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Location / Map */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap reveal">
          <div className="about-location-card">
            <div className="loc-content">
              <div className="loc-pin">
                <svg viewBox="0 0 24 24">
                  <path d="M12 21s-7-6.3-7-11a7 7 0 0114 0c0 4.7-7 11-7 11z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </div>
              <span className="idx" style={{ color: 'var(--teal)' }}><Editable id="contactPage.location.hq">{t.location.hq}</Editable></span>
              <h3><Editable id="contactPage.location.addr_a">{t.location.addr_a}</Editable><br /><Editable id="contactPage.location.addr_b">{t.location.addr_b}</Editable></h3>
              <p style={{ color: 'var(--dim)', fontSize: 16, marginBottom: 30 }}>
                <Editable id="contactPage.location.body">{t.location.body}</Editable>
              </p>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                <EditableLink id="contactPage.location.maps" href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-p"
                >{t.location.maps}</EditableLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
