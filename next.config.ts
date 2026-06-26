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
};

export default nextConfig;
