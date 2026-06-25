'use client';

import { useTheme } from '@/components/ThemeProvider';

// Full-viewport looping map animation that stands in for the old WebGL globe.
// A separate clip per theme: the light .mp4 for the light palette, the dark .webm
// for the dark palette. Both live in /public. Rendered once in the root layout so
// it persists across routes (same role the globe had), behind all page content.
//
// Spaces in the filenames are URL-encoded so the path is a valid asset URL.
const LIGHT_SRC = '/Map%20Animation%20Light%20Color.mp4';
const DARK_SRC = '/Map%20Animation%20Dark%20Color.webm';

export default function MapVideoBackground() {
  const { isLight } = useTheme();
  const src = isLight ? LIGHT_SRC : DARK_SRC;

  return (
    <video
      // key forces a fresh element (and reload) when the theme flips, so the
      // correct clip plays instead of swapping the src on a playing element.
      key={src}
      className="map-video-bg"
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
    />
  );
}
