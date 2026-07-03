import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Inline the route's CSS into the HTML <head> so there is no render-blocking
  // stylesheet request before first paint (App Router built-in).
  experimental: {
    inlineCss: true,
  },
  // next/image: serve AVIF first, then WebP, via the built-in optimizer.
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Keep old links/SEO working after route renames.
  async redirects() {
    return [
      { source: "/affiliate", destination: "/partnership", permanent: true },
      { source: "/terms", destination: "/terms-of-use", permanent: true },
    ];
  },
  // Static image assets in /public are stable brand assets referenced by fixed
  // filenames (map backgrounds, logos, illustrations). Next serves /public with
  // `Cache-Control: public, max-age=0` by default, so every repeat view re-validates
  // them. Give them a 30-day cache — long enough to help returning visitors, short
  // enough to recover if a same-named file is ever replaced. Fingerprinted assets
  // under /_next/static (JS, CSS, fonts) already send `immutable` and are untouched.
  async headers() {
    return [
      {
        source: "/:path*.:ext(avif|webp|png|jpg|jpeg|gif|svg|ico)",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }],
      },
    ];
  },
};

export default nextConfig;
