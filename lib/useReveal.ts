'use client';

import { useEffect } from 'react';

/**
 * IntersectionObserver reveal-on-scroll. Adds `.in` to every `.reveal` element,
 * with a small staggered transition-delay among siblings — mirrors the mockup.
 *
 * A MutationObserver also watches for `.reveal` elements added AFTER load — e.g.
 * live-data lists (leaderboard, live rewards, ticker) that re-mount when their
 * API responds — so those get revealed too instead of staying at opacity:0.
 */
export function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const target = e.target as HTMLElement;
            const siblings = Array.from(
              target.parentElement?.querySelectorAll<HTMLElement>('.reveal') ?? [],
            );
            target.style.transitionDelay = `${(siblings.indexOf(target) % 6) * 70}ms`;
            target.classList.add('in');
            io.unobserve(target);
          }
        }),
      { threshold: 0.12 },
    );

    const observe = (el: HTMLElement) => {
      if (!el.classList.contains('in')) io.observe(el);
    };
    const scan = (root: ParentNode) =>
      root.querySelectorAll<HTMLElement>('.reveal').forEach(observe);

    // Reveal-on-scroll only kicks in once JS is ready. Before enabling the hidden
    // start-state (gated on `html.js-ready` in CSS), mark every `.reveal` element
    // already in the viewport as `.in` so above-the-fold content (the hero) never
    // flashes from visible → hidden. The rest are hidden by `js-ready` and animate
    // in on scroll. This keeps the hero painted straight from the SSR HTML.
    const vh = window.innerHeight || document.documentElement.clientHeight;
    document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) el.classList.add('in');
    });
    document.documentElement.classList.add('js-ready');

    scan(document);

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.classList.contains('reveal')) observe(node);
          scan(node);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}
