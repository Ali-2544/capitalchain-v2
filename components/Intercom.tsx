'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Intercom live chat — same workspace as the old site (app_id: nsq0eoof).
 *
 * Intercom's default launcher (a faint white-circle logo on a light page) is
 * hard to see, so — like the old site — we hide it and render our own clearly
 * branded chat button. Intercom is loaded lazily on the first user interaction
 * (or an idle fallback) so it never blocks initial render.
 */
const APP_ID = 'nsq0eoof';

type IntercomFn = ((...args: unknown[]) => void) & {
  q?: unknown[];
  c?: (args: unknown) => void;
};
interface IntercomWindow extends Window {
  Intercom?: IntercomFn;
  intercomSettings?: Record<string, unknown>;
}

export default function Intercom() {
  // Holds a "boot Intercom (if needed) and open the messenger" function so the
  // button can call it even before the lazy boot has happened.
  const openRef = useRef<() => void>(() => {});
  // The button is a client-only widget — render it after mount so the SSR HTML
  // and the first client render agree (no hydration mismatch).
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const w = window as IntercomWindow;
    let done = false;
    const settings = {
      app_id: APP_ID,
      hide_default_launcher: true,
      custom_launcher_selector: '#cc-chat',
    };

    const load = () => {
      if (done) return;
      done = true;
      w.intercomSettings = settings;

      if (typeof w.Intercom === 'function') {
        w.Intercom('reattach_activator');
        w.Intercom('update', settings);
      } else {
        const i = function (...args: unknown[]) {
          (i.c as (a: unknown) => void)(args);
        } as IntercomFn;
        i.q = [];
        i.c = (args: unknown) => {
          (i.q as unknown[]).push(args);
        };
        w.Intercom = i;
        const s = document.createElement('script');
        s.async = true;
        s.src = `https://widget.intercom.io/widget/${APP_ID}`;
        document.head.appendChild(s);
      }
      w.Intercom('boot', settings);
      detach();
    };

    openRef.current = () => {
      load();
      // `show` is queued if the widget script is still loading, so this works
      // even on the very first click.
      try {
        w.Intercom?.('show');
      } catch {
        /* ignore */
      }
    };

    const events: (keyof WindowEventMap)[] = [
      'pointerdown',
      'keydown',
      'scroll',
      'mousemove',
      'touchstart',
    ];
    // Load on the first real interaction only — NO idle/timeout fallback. The widget
    // (≈344 KiB of third-party JS + ~1s of bootup) is not needed until the user engages,
    // and the custom #cc-chat button boots it on click regardless. The old 8s idle
    // fallback forced the load on every page during initial load, inflating mobile TBT.
    events.forEach((e) => window.addEventListener(e, load, { once: true, passive: true }));

    function detach() {
      events.forEach((e) => window.removeEventListener(e, load));
    }

    return detach;
  }, []);

  if (!mounted) return null;

  return (
    <button
      id="cc-chat"
      type="button"
      className="cc-chat-fab"
      aria-label="Chat with support"
      onClick={() => openRef.current()}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    </button>
  );
}
