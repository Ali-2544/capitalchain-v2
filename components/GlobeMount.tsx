'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

// ssr:false must live inside a Client Component in the App Router — the WebGL
// globe never renders on the server, so it's not part of the initial HTML/paint.
const GlobeBackground = dynamic(() => import('./GlobeBackground'), { ssr: false });

type IdleWindow = typeof window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

/**
 * Defers the heavy three.js globe so it never blocks initial paint or interactivity:
 *  - A lightweight CSS poster (real, server-rendered HTML) stands in immediately.
 *  - The WebGL bundle is only imported once the poster scrolls into view
 *    (IntersectionObserver) AND the main thread is idle (requestIdleCallback),
 *    i.e. after hydration / LCP / first interactions — not on mount.
 */
export default function GlobeMount() {
  const posterRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    const el = posterRef.current;
    if (!el) return;

    let idleId: number | undefined;
    const w = window as IdleWindow;

    const start = () => {
      // Hand the WebGL init to an idle slot so it can't compete with the
      // critical-path work; fall back to a short timeout where unsupported.
      if (w.requestIdleCallback) idleId = w.requestIdleCallback(() => setShow(true), { timeout: 3000 });
      else idleId = window.setTimeout(() => setShow(true), 400);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          start();
        }
      },
      { rootMargin: '300px' },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (idleId != null) w.cancelIdleCallback?.(idleId);
    };
  }, [show]);

  return (
    <>
      {/* Static placeholder — paints immediately as the background, no WebGL. */}
      <div ref={posterRef} className={`globe-poster${show ? ' is-hidden' : ''}`} aria-hidden="true" />
      {show && <GlobeBackground />}
    </>
  );
}
