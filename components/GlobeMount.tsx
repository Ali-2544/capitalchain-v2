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

// The interactive WebGL globe is desktop-only. On phones it gives the user nothing
// (its label pills are already hidden ≤1040px) yet costs the entire main-thread budget
// — booting three.js + a 1400-point scene + a permanent render loop is the bulk of the
// mobile TBT on every route, since this component lives in the root layout. Below this
// width, or when the user prefers reduced motion, we ship ONLY the static CSS poster and
// never import the three.js bundle at all.
const DESKTOP_QUERY = '(min-width: 1041px)';
const MOTION_QUERY = '(prefers-reduced-motion: no-preference)';

/**
 * Defers the heavy three.js globe so it never blocks initial paint or interactivity:
 *  - A lightweight CSS poster (real, server-rendered HTML) stands in immediately.
 *  - On mobile / reduced-motion the poster is the final state — the WebGL bundle is
 *    never even fetched.
 *  - On desktop the WebGL bundle is only imported once the poster scrolls into view
 *    (IntersectionObserver) AND the main thread is idle (requestIdleCallback),
 *    i.e. after hydration / LCP / first interactions — not on mount.
 */
export default function GlobeMount() {
  const posterRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;

    const w = window as IdleWindow;
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const motionOk = window.matchMedia(MOTION_QUERY);
    const eligible = () => desktop.matches && motionOk.matches;

    let idleId: number | undefined;
    let io: IntersectionObserver | undefined;

    const start = () => {
      // Hand the WebGL init to an idle slot so it can't compete with the
      // critical-path work; fall back to a short timeout where unsupported.
      if (w.requestIdleCallback) idleId = w.requestIdleCallback(() => setShow(true), { timeout: 3000 });
      else idleId = window.setTimeout(() => setShow(true), 400);
    };

    const arm = () => {
      const el = posterRef.current;
      if (io || !el || !eligible()) return; // mobile / reduced-motion: stay on the poster
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            io?.disconnect();
            start();
          }
        },
        { rootMargin: '300px' },
      );
      io.observe(el);
    };

    arm();
    // If the viewport grows from mobile to desktop (rotate / resize / responsive
    // devtools), arm the loader then rather than leaving the poster forever.
    const onChange = () => arm();
    desktop.addEventListener('change', onChange);

    return () => {
      io?.disconnect();
      desktop.removeEventListener('change', onChange);
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
