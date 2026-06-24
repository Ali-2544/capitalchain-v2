'use client';

import { useT } from '@/components/LanguageProvider';
import Editable from '@/components/Editable';
import EditableLink from '@/components/EditableLink';
import EditableImage from '@/components/EditableImage';
import { LINKS, EXTERNAL } from '@/lib/links';

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
              <Editable id="aboutPage.hero.eyebrow">{t.hero.eyebrow}</Editable>
            </span>
            <h1 style={{ marginBottom: 24 }}>
              <Editable id="aboutPage.hero.title_a">{t.hero.title_a}</Editable> <Editable className="gt" id="aboutPage.hero.title_b">{t.hero.title_b}</Editable>
            </h1>
            <p className="hero-sub" style={{ marginBottom: 20 }}>
              <Editable id="aboutPage.hero.sub_a">{t.hero.sub_a}</Editable>
            </p>
            <p className="hero-sub" style={{ fontSize: '18px' }}>
              <Editable id="aboutPage.hero.sub_b">{t.hero.sub_b}</Editable>
            </p>
          </div>
          <div className="reveal" style={{ position: 'relative', width: '100%', height: '420px', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--line)', boxShadow: '0 20px 48px -16px var(--glow)' }}>
            <EditableImage id="aboutPage.img.booth" src="/about_booth.png" alt="Capital Chain Expo Booth" fill sizes="(max-width: 768px) 100vw, 50vw" priority />
          </div>
        </div>
      </section>

      {/* Section 2: Capital Chain Vision */}
      <section className="sec band">
        <div className="wrap grid-2">
          <div className="reveal">
            <span className="idx"><Editable id="aboutPage.vision.idx">{t.vision.idx}</Editable></span>
            <h2 className="h2" style={{ marginBottom: 24 }}>
              <Editable id="aboutPage.vision.title_a">{t.vision.title_a}</Editable> <Editable className="gt" id="aboutPage.vision.title_b">{t.vision.title_b}</Editable>
            </h2>
            <p style={{ color: 'var(--dim)', fontSize: 18, marginBottom: 32 }}>
              <Editable id="aboutPage.vision.intro">{t.vision.intro}</Editable>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 30 }}>
              {t.vision.pillars.map((pillar, i) => (
                <div key={i} style={{ border: '1px solid var(--line)', borderRadius: '16px', padding: '20px 24px', background: 'var(--surface)' }}>
                  <h3 style={{ fontFamily: 'var(--fd)', fontSize: '20px', marginBottom: '6px', color: 'var(--teal)' }}><Editable id={`aboutPage.vision.pillars.${i}.h`}>{pillar.h}</Editable></h3>
                  <p style={{ color: 'var(--dim)', fontSize: '14.5px' }}><Editable id={`aboutPage.vision.pillars.${i}.p`}>{pillar.p}</Editable></p>
                </div>
              ))}
            </div>

            <p style={{ color: 'var(--dim)', fontSize: 15, lineHeight: 1.6 }}>
              <Editable id="aboutPage.vision.outro">{t.vision.outro}</Editable>
            </p>
          </div>

          <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ position: 'relative', width: '100%', height: '240px', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--line)' }}>
              <EditableImage id="aboutPage.img.vision1" src="/about_community.png" alt="Traders Networking" fill sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
            <div style={{ position: 'relative', width: '100%', height: '240px', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--line)' }}>
              <EditableImage id="aboutPage.img.vision2" src="/about_mission.png" alt="Capital Chain Corporate Meeting" fill sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Community Over Everything */}
      <section className="sec">
        <div className="wrap">
          <div className="shead reveal center">
            <span className="idx"><Editable id="aboutPage.community.idx">{t.community.idx}</Editable></span>
            <h2 className="h2">
              <Editable id="aboutPage.community.title_a">{t.community.title_a}</Editable> <Editable className="gt" id="aboutPage.community.title_b">{t.community.title_b}</Editable>
            </h2>
            <p><Editable id="aboutPage.community.sub">{t.community.sub}</Editable></p>
          </div>

          <div className="grid-2 reveal" style={{ gap: 48, marginBottom: 48 }}>
            <div style={{ position: 'relative', width: '100%', height: '420px', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--line)' }}>
              <EditableImage id="aboutPage.img.community" src="/about_community.png" alt="Capital Chain Expo Crowd" fill sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24 }}>
              <p style={{ color: 'var(--dim)', fontSize: 18, lineHeight: 1.6 }}>
                <Editable id="aboutPage.community.p_a">{t.community.p_a}</Editable>
              </p>
              <p style={{ color: 'var(--dim)', fontSize: 18, lineHeight: 1.6 }}>
                <Editable id="aboutPage.community.p_b">{t.community.p_b}</Editable>
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
                <EditableLink id="aboutPage.community.joinCta" href={LINKS.discord} className="btn btn-p" data-magnetic {...EXTERNAL}>{t.community.joinCta}</EditableLink>
                <EditableLink id="aboutPage.community.coursesCta" href={LINKS.checkout} className="btn" {...EXTERNAL}>{t.community.coursesCta}</EditableLink>
                <EditableLink id="aboutPage.community.chatCta" href={LINKS.telegramCommunity} className="btn" {...EXTERNAL}>{t.community.chatCta}</EditableLink>
              </div>
            </div>
          </div>

          <div className="reveal" style={{ textAlign: 'center', borderTop: '1px solid var(--line)', paddingTop: 40, marginTop: 40 }}>
            <h3 style={{ fontFamily: 'var(--fd)', fontSize: '28px', color: 'var(--teal)', fontWeight: 600 }}>
              <Editable id="aboutPage.community.banner_a">{t.community.banner_a}</Editable> <Editable className="gt" id="aboutPage.community.banner_b">{t.community.banner_b}</Editable>
            </h3>
          </div>
        </div>
      </section>

      {/* Section 4: Our Mission */}
      <section className="sec band">
        <div className="wrap grid-2">
          <div className="reveal">
            <span className="idx"><Editable id="aboutPage.mission.idx">{t.mission.idx}</Editable></span>
            <h2 className="h2" style={{ marginBottom: 30 }}>
              <Editable id="aboutPage.mission.title_a">{t.mission.title_a}</Editable> <Editable className="gt" id="aboutPage.mission.title_b">{t.mission.title_b}</Editable>
            </h2>
            <div className="about-mission-cols">
              {t.mission.cols.map((col, i) => (
                <div key={i}>
                  <h3 style={{ fontFamily: 'var(--fd)', fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
                    <Editable id={`aboutPage.mission.cols.${i}.h`}>{col.h}</Editable>
                  </h3>
                  <p style={{ color: 'var(--dim)', fontSize: 14.5, lineHeight: 1.6 }}>
                    <Editable id={`aboutPage.mission.cols.${i}.p`}>{col.p}</Editable>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal" style={{ position: 'relative', width: '100%', height: '360px', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--line)' }}>
            <EditableImage id="aboutPage.img.mission" src="/about_mission.png" alt="Capital Chain Logo Roundtable" fill sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      {/* Section 5: Who are we? */}
      <section className="sec">
        <div className="wrap">
          <div className="shead reveal" style={{ marginBottom: 40 }}>
            <div>
              <span className="idx"><Editable id="aboutPage.members.idx">{t.members.idx}</Editable></span>
              <h2 className="h2"><Editable id="aboutPage.members.title">{t.members.title}</Editable></h2>
            </div>
            <p style={{ maxWidth: '480px' }}>
              <Editable id="aboutPage.members.sub">{t.members.sub}</Editable>
            </p>
          </div>

          {/* Team Stat Cards */}
          <div className="trust reveal" style={{ borderLeft: '1px solid var(--line)', borderRight: '1px solid var(--line)', background: 'var(--surface)', borderRadius: '20px', overflow: 'hidden', marginBottom: 40 }}>
            <div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', padding: 0 }}>
              {t.members.stats.map((stat, i) => (
                <div key={i} className="st" style={{ borderRight: i < t.members.stats.length - 1 ? '1px solid var(--line)' : 'none', padding: '30px 24px' }}>
                  <Editable as="div" className="v gt" id={`aboutPage.members.stats.${i}.v`}>{stat.v}</Editable>
                  <div className="k"><Editable id={`aboutPage.members.stats.${i}.k`}>{stat.k}</Editable></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
