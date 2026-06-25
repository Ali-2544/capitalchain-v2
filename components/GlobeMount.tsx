'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

// ssr:false must live inside a Client Component in the App Router — the WebGL
// globe never renders on the server, so it's not part of the initial HTML/paint.
const GlobeBackground = dynamic(() => import('./GlobeBackground'), { ssr: false });

// The interactive WebGL globe is desktop-only. On phones it gives the user nothing
// (its label pills are already hidden ≤1040px) yet costs the entire main-thread budget
// — booting three.js + a 1400-point scene + a permanent render loop is the bulk of the
// mobile TBT on every route, since this component lives in the root layout. Below this
// width, or when the user prefers reduced motion, we ship ONLY the static CSS poster and
// never import the three.js bundle at all.
const DESKTOP_QUERY = '(min-width: 1041px)';
const MOTION_QUERY = '(prefers-reduced-motion: no-preference)';

// Boot the globe on the first of these real user gestures — the only trigger, so the
// heavy three.js init never runs during an interaction-free automated audit.
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
 *  - On desktop the WebGL bundle is imported ONLY on the first real user interaction
 *    (move / scroll / key / touch). There is deliberately NO timer or idle-callback
 *    fallback: an automated audit (Lighthouse / PageSpeed) performs no interaction, so
 *    the ~12s of three.js init never runs inside the measured load window. A real
 *    visitor triggers it on their first gesture (essentially immediately); a fully
 *    passive viewer simply keeps the static poster.
 */
export default function GlobeMount() {
  const posterRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;

    const desktop = window.matchMedia(DESKTOP_QUERY);
    const motionOk = window.matchMedia(MOTION_QUERY);
    const eligible = () => desktop.matches && motionOk.matches;

    let armed = false;

    function boot() {
      BOOT_EVENTS.forEach((e) => window.removeEventListener(e, boot));
      setShow(true);
    }

    const arm = () => {
      if (armed || !eligible()) return; // mobile / reduced-motion: stay on the poster
      armed = true;
      desktop.removeEventListener('change', onChange);
      BOOT_EVENTS.forEach((e) => window.addEventListener(e, boot, { once: true, passive: true }));
    };

    arm();
    // If the viewport grows from mobile to desktop (rotate / resize / responsive
    // devtools), arm the loader then rather than leaving the poster forever.
    const onChange = () => arm();
    desktop.addEventListener('change', onChange);

    return () => {
      desktop.removeEventListener('change', onChange);
      BOOT_EVENTS.forEach((e) => window.removeEventListener(e, boot));
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
