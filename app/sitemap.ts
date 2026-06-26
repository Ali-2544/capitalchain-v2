import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

// Regenerate at request time so newly published blog posts appear without a rebuild.
export const dynamic = 'force-dynamic';

const BASE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://capitalchain.co').replace(/\/$/, '');

// Public, indexable routes. /admin and /certificate/[id] are intentionally left out
// (private / noindex), as are API routes.
const ROUTES: {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
  priority: number;
}[] = [
  { path: '/', changeFrequency: 'daily', priority: 1 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/partnership', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/rewards', changeFrequency: 'daily', priority: 0.8 },
  { path: '/blog', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/terms-of-use', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/cookies', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/refund', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/kyc-aml', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/risk-disclosure', changeFrequency: 'yearly', priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = ROUTES.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Published blog posts. If the DB is unreachable, still emit the static sitemap.
  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.blog.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    });
    blogEntries = posts.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));
  } catch {
    /* DB unavailable — fall back to static routes only */
  }

  return [...staticEntries, ...blogEntries];
}
