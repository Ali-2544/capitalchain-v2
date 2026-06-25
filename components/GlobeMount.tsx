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

// Boot the globe on the first of these — by which point the page is already
// interactive, so the heavy three.js init lands well after TTI (outside the TBT window).
const BOOT_EVENTS: (keyof WindowEventMap)[] = [
  'pointerdown',
  'mousemove',
  'scroll',
  'keydown',
  'touchstart',
  'wheel',
];

/**
 * Defers the heavy three.js globe so it never blocks initial paint or interactivity:
 *  - A lightweight CSS poster (real, server-rendered HTML) stands in immediately.
 *  - On mobile / reduced-motion the poster is the final state — the WebGL bundle is
 *    never even fetched.
 *  - On desktop the WebGL bundle is imported on the first user interaction, or — for a
 *    passive viewer — once the main thread is idle AFTER the `load` event. We avoid the
 *    old short forced idle-timeout (which fired ~3s in, inside the load/TBT window and
 *    blocked the main thread mid-measurement); init now reliably lands after the page is
 *    interactive.
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
    let armed = false;

    const cleanupTriggers = () => {
      BOOT_EVENTS.forEach((e) => window.removeEventListener(e, boot));
      window.removeEventListener('load', scheduleIdleFallback);
      if (idleId != null) {
        if (w.cancelIdleCallback) w.cancelIdleCallback(idleId);
        else clearTimeout(idleId);
        idleId = undefined;
      }
    };

    function boot() {
      cleanupTriggers();
      setShow(true);
    }

    // Passive-viewer fallback: only after `load`, and on a genuine idle slot, so the
    // WebGL init still happens post-interactive even with zero interaction.
    function scheduleIdleFallback() {
      if (idleId != null) return;
      if (w.requestIdleCallback) idleId = w.requestIdleCallback(boot, { timeout: 10000 });
      else idleId = window.setTimeout(boot, 2000);
    }

    const arm = () => {
      if (armed || !eligible()) return; // mobile / reduced-motion: stay on the poster
      armed = true;
      desktop.removeEventListener('change', onChange);
      BOOT_EVENTS.forEach((e) => window.addEventListener(e, boot, { once: true, passive: true }));
      if (document.readyState === 'complete') scheduleIdleFallback();
      else window.addEventListener('load', scheduleIdleFallback, { once: true });
    };

    arm();
    // If the viewport grows from mobile to desktop (rotate / resize / responsive
    // devtools), arm the loader then rather than leaving the poster forever.
    const onChange = () => arm();
    desktop.addEventListener('change', onChange);

    return () => {
      desktop.removeEventListener('change', onChange);
      cleanupTriggers();
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
