import type { Metadata } from 'next';
import PromoBar from '@/components/PromoBar';
import Nav from '@/components/Nav';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog — CapitalChain',
  description:
    'Trading insights, payout updates, and product news from Capital Chain — the bridge between your trading skills and real earnings.',
};

function fmtDate(d: Date) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default async function BlogIndex() {
  const posts = await prisma.blog
    .findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        author: true,
        coverAssetId: true,
        createdAt: true,
      },
    })
    .catch(() => []);

  return (
    <>
      <PromoBar />
      <Nav />
      <main>
        <section className="hero">
          <div className="wrap">
            <span className="eyebrow reveal">
              <span className="dot" />
              CAPITAL CHAIN · BLOG
            </span>
            <h1 className="reveal">
              Insights from the <span className="gt">desk.</span>
            </h1>
            <p className="hero-sub reveal" style={{ maxWidth: '640px' }}>
              Trading insights, payout updates and product news — straight from the Capital Chain team.
            </p>
          </div>
        </section>

        <section className="sec band">
          <div className="wrap">
            {posts.length === 0 ? (
              <p style={{ color: 'var(--dim)', textAlign: 'center' }}>No posts published yet — check back soon.</p>
            ) : (
              <div className="blog-grid">
                {posts.map((p) => (
                  <a key={p.id} href={`/blog/${p.slug}`} className="blog-tile">
                    <div className="blog-tile-cover">
                      {p.coverAssetId ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={`/api/assets/${p.coverAssetId}`} alt="" />
                      ) : (
                        <span className="blog-tile-mark">CC</span>
                      )}
                    </div>
                    <div className="blog-tile-body">
                      <div className="blog-tile-meta">
                        <span>{p.author}</span>
                        <span>·</span>
                        <span>{fmtDate(p.createdAt)}</span>
                      </div>
                      <h3>{p.title}</h3>
                      <p>{p.excerpt}</p>
                      <span className="blog-tile-more">Read article →</span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <FinalCTA />
      <Footer />
    </>
  );
}
