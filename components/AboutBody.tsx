'use client';

import Image from 'next/image';
import { useT } from '@/components/LanguageProvider';

export default function AboutBody() {
  const t = useT().aboutPage;

  return (
    <main>
      {/* Section 1: Hero-like Split Grid (About Capital Chain) */}
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
            <p className="hero-sub" style={{ marginBottom: 20 }}>
              {t.hero.sub_a}
            </p>
            <p className="hero-sub" style={{ fontSize: '18px' }}>
              {t.hero.sub_b}
            </p>
          </div>
          <div className="reveal" style={{ position: 'relative', width: '100%', height: '420px', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--line)', boxShadow: '0 20px 48px -16px var(--glow)' }}>
            <Image
              src="/about_booth.png"
              alt="Capital Chain Expo Booth"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        </div>
      </section>

      {/* Section 2: Capital Chain Vision */}
      <section className="sec band">
        <div className="wrap grid-2">
          <div className="reveal">
            <span className="idx">{t.vision.idx}</span>
            <h2 className="h2" style={{ marginBottom: 24 }}>
              {t.vision.title_a} <span className="gt">{t.vision.title_b}</span>
            </h2>
            <p style={{ color: 'var(--dim)', fontSize: 18, marginBottom: 32 }}>
              {t.vision.intro}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 30 }}>
              {t.vision.pillars.map((pillar, i) => (
                <div key={i} style={{ border: '1px solid var(--line)', borderRadius: '16px', padding: '20px 24px', background: 'var(--surface)' }}>
                  <h3 style={{ fontFamily: 'var(--fd)', fontSize: '20px', marginBottom: '6px', color: 'var(--teal)' }}>{pillar.h}</h3>
                  <p style={{ color: 'var(--dim)', fontSize: '14.5px' }}>{pillar.p}</p>
                </div>
              ))}
            </div>

            <p style={{ color: 'var(--dim)', fontSize: 15, lineHeight: 1.6 }}>
              {t.vision.outro}
            </p>
          </div>

          <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ position: 'relative', width: '100%', height: '240px', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--line)' }}>
              <Image
                src="/about_community.png"
                alt="Traders Networking"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div style={{ position: 'relative', width: '100%', height: '240px', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--line)' }}>
              <Image
                src="/about_mission.png"
                alt="Capital Chain Corporate Meeting"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Community Over Everything */}
      <section className="sec">
        <div className="wrap">
          <div className="shead reveal center">
            <span className="idx">{t.community.idx}</span>
            <h2 className="h2">
              {t.community.title_a} <span className="gt">{t.community.title_b}</span>
            </h2>
            <p>{t.community.sub}</p>
          </div>

          <div className="grid-2 reveal" style={{ gap: 48, marginBottom: 48 }}>
            <div style={{ position: 'relative', width: '100%', height: '420px', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--line)' }}>
              <Image
                src="/about_community.png"
                alt="Capital Chain Expo Crowd"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24 }}>
              <p style={{ color: 'var(--dim)', fontSize: 18, lineHeight: 1.6 }}>
                {t.community.p_a}
              </p>
              <p style={{ color: 'var(--dim)', fontSize: 18, lineHeight: 1.6 }}>
                {t.community.p_b}
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
                <a href="/#community" className="btn btn-p" data-magnetic>{t.community.joinCta}</a>
                <a href="/#programs" className="btn">{t.community.coursesCta}</a>
                <a href="/#community" className="btn">{t.community.chatCta}</a>
              </div>
            </div>
          </div>

          <div className="reveal" style={{ textAlign: 'center', borderTop: '1px solid var(--line)', paddingTop: 40, marginTop: 40 }}>
            <h3 style={{ fontFamily: 'var(--fd)', fontSize: '28px', color: 'var(--teal)', fontWeight: 600 }}>
              {t.community.banner_a} <span className="gt">{t.community.banner_b}</span>
            </h3>
          </div>
        </div>
      </section>

      {/* Section 4: Our Mission */}
      <section className="sec band">
        <div className="wrap grid-2">
          <div className="reveal">
            <span className="idx">{t.mission.idx}</span>
            <h2 className="h2" style={{ marginBottom: 30 }}>
              {t.mission.title_a} <span className="gt">{t.mission.title_b}</span>
            </h2>
            <div className="about-mission-cols">
              {t.mission.cols.map((col, i) => (
                <div key={i}>
                  <h4 style={{ fontFamily: 'var(--fd)', fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
                    {col.h}
                  </h4>
                  <p style={{ color: 'var(--dim)', fontSize: 14.5, lineHeight: 1.6 }}>
                    {col.p}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal" style={{ position: 'relative', width: '100%', height: '360px', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--line)' }}>
            <Image
              src="/about_mission.png"
              alt="Capital Chain Logo Roundtable"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* Section 5: Who are we? */}
      <section className="sec">
        <div className="wrap">
          <div className="shead reveal" style={{ marginBottom: 40 }}>
            <div>
              <span className="idx">{t.members.idx}</span>
              <h2 className="h2">{t.members.title}</h2>
            </div>
            <p style={{ maxWidth: '480px' }}>
              {t.members.sub}
            </p>
          </div>

          {/* Team Stat Cards */}
          <div className="trust reveal" style={{ borderLeft: '1px solid var(--line)', borderRight: '1px solid var(--line)', background: 'var(--surface)', borderRadius: '20px', overflow: 'hidden', marginBottom: 40 }}>
            <div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', padding: 0 }}>
              {t.members.stats.map((stat, i) => (
                <div key={i} className="st" style={{ borderRight: i < t.members.stats.length - 1 ? '1px solid var(--line)' : 'none', padding: '30px 24px' }}>
                  <div className="v gt">{stat.v}</div>
                  <div className="k">{stat.k}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Office / Location */}
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
              <span className="idx" style={{ color: 'var(--teal)' }}>{t.location.hq}</span>
              <h3>{t.location.addr_a}<br />{t.location.addr_b}</h3>
              <p style={{ color: 'var(--dim)', fontSize: 16, marginBottom: 30 }}>
                {t.location.body}
              </p>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                <a href="/#community" className="btn btn-p" data-magnetic>{t.location.contactCta}</a>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                >
                  {t.location.mapsCta}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
