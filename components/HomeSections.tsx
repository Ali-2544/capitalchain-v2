'use client';

import { useEffect, useRef, useState } from 'react';
import { useContent } from './ContentProvider';
import Hero from './Hero';
import TrustBand from './TrustBand';
import Ticker from './Ticker';
import HowStacking from './HowStacking';
import ProgramsConfigurator from './ProgramsConfigurator';
import PayoutCycles from './PayoutCycles';
import Calculator from './Calculator';
import WhoWeAre from './WhoWeAre';
import WhyBento from './WhyBento';
import Platforms from './Platforms';
import Champions from './Champions';
import ScalingLadder from './ScalingLadder';
import LiveRewards from './LiveRewards';
import Testimonials from './Testimonials';
import Community from './Community';
import Affiliate from './Affiliate';
import FAQ from './FAQ';
import FinalCTA from './FinalCTA';

// key -> component + human label (label shown on the drag handle).
const REGISTRY: Record<string, { Comp: React.ComponentType; label: string }> = {
  hero: { Comp: Hero, label: 'Hero' },
  trust: { Comp: TrustBand, label: 'Trust band' },
  ticker: { Comp: Ticker, label: 'Ticker' },
  how: { Comp: HowStacking, label: 'The Chain' },
  programs: { Comp: ProgramsConfigurator, label: 'Programs' },
  payouts: { Comp: PayoutCycles, label: 'Payouts' },
  calc: { Comp: Calculator, label: 'Calculator' },
  who: { Comp: WhoWeAre, label: 'Who We Are' },
  why: { Comp: WhyBento, label: 'Why Capital Chain' },
  platforms: { Comp: Platforms, label: 'Platforms' },
  champions: { Comp: Champions, label: 'Leaderboard' },
  scaling: { Comp: ScalingLadder, label: 'Scaling' },
  live: { Comp: LiveRewards, label: 'Live Rewards' },
  testimonials: { Comp: Testimonials, label: 'Testimonials' },
  community: { Comp: Community, label: 'Community' },
  affiliate: { Comp: Affiliate, label: 'Affiliate' },
  faq: { Comp: FAQ, label: 'FAQ' },
  finalcta: { Comp: FinalCTA, label: 'Final CTA' },
};

const DEFAULT_ORDER = [
  'hero', 'trust', 'ticker', 'how', 'programs', 'payouts', 'calc', 'who', 'why',
  'platforms', 'champions', 'scaling', 'live', 'testimonials', 'community', 'affiliate', 'faq', 'finalcta',
];

// Build a valid, complete order: keep saved order (known keys only), then append
// any sections missing from it (so new sections always appear).
function computeOrder(saved?: string): string[] {
  let arr = DEFAULT_ORDER;
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) arr = parsed.filter((k) => typeof k === 'string' && k in REGISTRY);
    } catch {
      /* ignore bad JSON */
    }
  }
  const out = [...arr];
  for (const k of DEFAULT_ORDER) if (!out.includes(k)) out.push(k);
  return out;
}

function parseHidden(saved?: string): string[] {
  if (!saved) return [];
  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) return parsed.filter((k) => typeof k === 'string' && k in REGISTRY);
  } catch {
    /* ignore */
  }
  return [];
}

export default function HomeSections() {
  const { overrides, editMode, save } = useContent();
  const saved = overrides['en::home.order']?.value;
  const savedHidden = overrides['en::home.hidden']?.value;

  const [items, setItems] = useState<string[]>(() => computeOrder(saved));
  const [hidden, setHidden] = useState<string[]>(() => parseHidden(savedHidden));
  const dragKey = useRef<string | null>(null);
  const [over, setOver] = useState<string | null>(null);

  // Keep local state in sync with the saved overrides.
  useEffect(() => {
    setItems(computeOrder(saved));
  }, [saved]);
  useEffect(() => {
    setHidden(parseHidden(savedHidden));
  }, [savedHidden]);

  const persistOrder = async (next: string[]) => {
    setItems(next);
    await save('home.order', 'en', 'text', JSON.stringify(next));
  };
  const persistHidden = async (next: string[]) => {
    setHidden(next);
    await save('home.hidden', 'en', 'text', JSON.stringify(next));
  };

  const onDrop = async (targetKey: string) => {
    const from = dragKey.current;
    dragKey.current = null;
    setOver(null);
    if (!from || from === targetKey) return;
    const next = items.filter((k) => k !== from);
    next.splice(next.indexOf(targetKey), 0, from);
    await persistOrder(next);
  };

  // Simple, reliable reordering: move a section up or down by one.
  const move = async (key: string, dir: -1 | 1) => {
    const i = items.indexOf(key);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    await persistOrder(next);
  };

  const remove = (key: string) => persistHidden(Array.from(new Set([...hidden, key])));
  const restore = (key: string) => persistHidden(hidden.filter((k) => k !== key));

  return (
    <>
      {items.map((key) => {
        const entry = REGISTRY[key];
        if (!entry) return null;
        const { Comp, label } = entry;
        const isHidden = hidden.includes(key);

        // Live site: skip removed sections entirely.
        if (!editMode) return isHidden ? null : <Comp key={key} />;

        // Edit mode, removed: show a compact strip with a Restore button.
        if (isHidden) {
          return (
            <div key={key} className="section-removed">
              <span className="section-removed-label">⊘ {label} — removed (hidden on site)</span>
              <button type="button" className="btn btn-p section-restore" onClick={() => restore(key)}>
                Restore
              </button>
            </div>
          );
        }

        // Edit mode, visible: section with reorder + remove controls.
        return (
          <div
            key={key}
            className={`section-dragwrap${over === key ? ' over' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              if (over !== key) setOver(key);
            }}
            onDrop={() => onDrop(key)}
          >
            <div className="section-ctrl">
              <span
                className="section-grip"
                draggable
                onDragStart={() => {
                  dragKey.current = key;
                }}
                onDragEnd={() => {
                  dragKey.current = null;
                  setOver(null);
                }}
                title="Drag to reorder"
              >
                ⠿ {label}
              </span>
              <button
                type="button"
                className="section-move"
                onClick={() => move(key, -1)}
                disabled={items.indexOf(key) === 0}
                title="Move up"
                aria-label="Move section up"
              >
                ▲
              </button>
              <button
                type="button"
                className="section-move"
                onClick={() => move(key, 1)}
                disabled={items.indexOf(key) === items.length - 1}
                title="Move down"
                aria-label="Move section down"
              >
                ▼
              </button>
              <button
                type="button"
                className="section-move section-remove"
                onClick={() => remove(key)}
                title="Remove section (hide on site)"
                aria-label="Remove section"
              >
                ✕
              </button>
            </div>
            <Comp />
          </div>
        );
      })}
    </>
  );
}
