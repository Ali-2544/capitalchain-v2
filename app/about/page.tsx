import type { Metadata } from 'next';
import Image from 'next/image';
import PromoBar from '@/components/PromoBar';
import Nav from '@/components/Nav';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'About Us — CapitalChain',
  description: 'Learn about Capital Chain, our mission, vision, and the professional team behind the world\'s leading prop trading platform.',
};

export default function AboutUs() {
  return (
    <>
      <PromoBar />
      <Nav />
      <main>
        {/* Section 1: Hero-like Split Grid (About Capital Chain) */}
        <section className="hero">
          <div className="wrap grid-2">
            <div className="reveal">
              <span className="eyebrow">
                <span className="dot" />
                WHO WE ARE
              </span>
              <h1 style={{ marginBottom: 24 }}>
                About <span className="gt">Capital Chain</span>
              </h1>
              <p className="hero-sub" style={{ marginBottom: 20 }}>
                Capital Chain is a leading prop trading firm that empowers traders worldwide. We provide capital, cutting-edge technology, and educational support to help traders reach their full potential.
              </p>
              <p className="hero-sub" style={{ fontSize: '18px' }}>
                Our mission is to create a transparent, secure, and supportive environment for traders to thrive and grow their capital.
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
              <span className="idx">[ 01 — OUR VISION ]</span>
              <h2 className="h2" style={{ marginBottom: 24 }}>
                Capital Chain <span className="gt">Vision</span>
              </h2>
              <p style={{ color: 'var(--dim)', fontSize: 18, marginBottom: 32 }}>
                We believe in creating a better future for traders by staying true to our core pillars:
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 30 }}>
                <div style={{ border: '1px solid var(--line)', borderRadius: '16px', padding: '20px 24px', background: 'var(--surface)' }}>
                  <h3 style={{ fontFamily: 'var(--fd)', fontSize: '20px', marginBottom: '6px', color: 'var(--teal)' }}>Reliability</h3>
                  <p style={{ color: 'var(--dim)', fontSize: '14.5px' }}>Guaranteed prompt payouts, state-of-the-art server infrastructure, and maximum platform uptime.</p>
                </div>
                <div style={{ border: '1px solid var(--line)', borderRadius: '16px', padding: '20px 24px', background: 'var(--surface)' }}>
                  <h3 style={{ fontFamily: 'var(--fd)', fontSize: '20px', marginBottom: '6px', color: 'var(--teal)' }}>Innovation</h3>
                  <p style={{ color: 'var(--dim)', fontSize: '14.5px' }}>Continuous evolution of trading dashboards, evaluation models, and analytical tools.</p>
                </div>
                <div style={{ border: '1px solid var(--line)', borderRadius: '16px', padding: '20px 24px', background: 'var(--surface)' }}>
                  <h3 style={{ fontFamily: 'var(--fd)', fontSize: '20px', marginBottom: '6px', color: 'var(--teal)' }}>Transparency</h3>
                  <p style={{ color: 'var(--dim)', fontSize: '14.5px' }}>No hidden rules, straightforward drawdown limits, and real-time public payout statistics.</p>
                </div>
              </div>

              <p style={{ color: 'var(--dim)', fontSize: 15, lineHeight: 1.6 }}>
                These three core pillars are at the heart of our mission. We strive to provide the best possible services to our clients, ensuring transparency, reliability, and continuous innovation in everything we do.
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
              <span className="idx">[ 02 — PARTNER WITH US ]</span>
              <h2 className="h2">
                Community <span className="gt">Over Everything</span>
              </h2>
              <p>Our community is at the heart of everything we do.</p>
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
                  We believe that a strong community is essential for the success of any trader. That&apos;s why we place a high value on our community, offering support, education, and resources to help our traders succeed.
                </p>
                <p style={{ color: 'var(--dim)', fontSize: 18, lineHeight: 1.6 }}>
                  Join our global community of traders today and start your journey towards financial freedom.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
                  <a href="/#community" className="btn btn-p" data-magnetic>Join our community</a>
                  <a href="/#programs" className="btn">Trading courses</a>
                  <a href="/#community" className="btn">Live chat support</a>
                </div>
              </div>
            </div>

            <div className="reveal" style={{ textAlign: 'center', borderTop: '1px solid var(--line)', paddingTop: 40, marginTop: 40 }}>
              <h3 style={{ fontFamily: 'var(--fd)', fontSize: '28px', color: 'var(--teal)', fontWeight: 600 }}>
                Capital Chain is not built for traders. <span className="gt">It is built with them!</span>
              </h3>
            </div>
          </div>
        </section>

        {/* Section 4: Our Mission */}
        <section className="sec band">
          <div className="wrap grid-2">
            <div className="reveal">
              <span className="idx">[ 03 — OUR MISSION ]</span>
              <h2 className="h2" style={{ marginBottom: 30 }}>
                Our <span className="gt">Mission</span>
              </h2>
              <div className="about-mission-cols">
                <div>
                  <h4 style={{ fontFamily: 'var(--fd)', fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
                    Global Network of Trading Excellence
                  </h4>
                  <p style={{ color: 'var(--dim)', fontSize: 14.5, lineHeight: 1.6 }}>
                    We are building a global network of traders who share our passion for excellence, continuous learning, and mutual support.
                  </p>
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--fd)', fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
                    More Than Capital: A Supportive Trading Partner
                  </h4>
                  <p style={{ color: 'var(--dim)', fontSize: 14.5, lineHeight: 1.6 }}>
                    We provide more than just capital. We offer a supportive trading environment, education, tools, and a community of like-minded traders to help you succeed.
                  </p>
                </div>
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
                <span className="idx">[ 04 — MEMBERS ]</span>
                <h2 className="h2">Who are we?</h2>
              </div>
              <p style={{ maxWidth: '480px' }}>
                We are a team of professionals dedicated to helping you succeed. Our team includes experienced traders, software developers, and support specialists.
              </p>
            </div>

            {/* Team Stat Cards */}
            <div className="trust reveal" style={{ borderLeft: '1px solid var(--line)', borderRight: '1px solid var(--line)', background: 'var(--surface)', borderRadius: '20px', overflow: 'hidden', marginBottom: 40 }}>
              <div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', padding: 0 }}>
                <div className="st" style={{ borderRight: '1px solid var(--line)', padding: '30px 24px' }}>
                  <div className="v gt">40+</div>
                  <div className="k">Team Professionals</div>
                </div>
                <div className="st" style={{ borderRight: '1px solid var(--line)', padding: '30px 24px' }}>
                  <div className="v gt">9</div>
                  <div className="k">Different Nations</div>
                </div>
                <div className="st" style={{ borderRight: 'none', padding: '30px 24px' }}>
                  <div className="v gt">Global</div>
                  <div className="k">Multiple Countries</div>
                </div>
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
                <span className="idx" style={{ color: 'var(--teal)' }}>HEADQUARTERS</span>
                <h3>Dubai Healthcare City, Dubai,<br />United Arab Emirates</h3>
                <p style={{ color: 'var(--dim)', fontSize: 16, marginBottom: 30 }}>
                  Meet us at our office in Dubai or reach out to us online.
                </p>
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                  <a href="/#community" className="btn btn-p" data-magnetic>Contact Us Online</a>
                  <a 
                    href="https://maps.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn"
                  >
                    View on Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FinalCTA />
      <Footer />
    </>
  );
}
