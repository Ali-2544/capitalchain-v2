import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The affiliate page moved to /partnership — keep old links/SEO working.
  async redirects() {
    return [
      { source: "/affiliate", destination: "/partnership", permanent: true },
    ];
  },
};

export default nextConfig;
