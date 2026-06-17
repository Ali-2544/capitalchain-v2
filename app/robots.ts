import type { MetadataRoute } from 'next';

const BASE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://capitalchain.co').replace(/\/$/, '');

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Keep private / non-content routes out of search.
      disallow: ['/admin', '/api/', '/certificate/'],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
