import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PromoBar from '@/components/PromoBar';
import Nav from '@/components/Nav';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function fmtDate(d: Date) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

async function getPost(slug: string) {
  return prisma.blog.findFirst({ where: { slug, published: true } }).catch(() => null);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Post not found — CapitalChain' };
  return {
    title: `${post.title} — CapitalChain`,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.coverAssetId ? [`/api/assets/${post.coverAssetId}`] : undefined,
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <>
      <PromoBar />
      <Nav />
      <main>
        <article className="sec blog-article">
          <div className="wrap blog-article-wrap">
            <a href="/blog" className="blog-back">← All posts</a>
            <div className="blog-article-meta">
              <span>{post.author}</span>
              <span>·</span>
              <span>{fmtDate(post.createdAt)}</span>
            </div>
            <h1 className="blog-article-title">{post.title}</h1>
            {post.excerpt && <p className="blog-article-lede">{post.excerpt}</p>}

            {post.coverAssetId && (
              <div className="blog-article-cover">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/api/assets/${post.coverAssetId}`} alt={post.title} />
              </div>
            )}

            {/* Body HTML is sanitized on save (see lib/blogs.ts → sanitizeHtml). */}
            <div className="blog-prose" dangerouslySetInnerHTML={{ __html: post.body }} />
          </div>
        </article>
      </main>
      <FinalCTA />
      <Footer />
    </>
  );
}
