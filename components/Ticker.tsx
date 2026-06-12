'use client';

import { useMemo } from 'react';
import { useLiveData } from '@/lib/useLiveData';
import Editable from '@/components/Editable';

interface RawSettlement {
  id?: number;
  flag: string;
  name: string;
  amount: string;
}

// Fallback shown only until /api/settlements loads (or if the DB is empty).
// Once the dashboard has payouts, the ticker shows those — nothing else.
const FALLBACK: RawSettlement[] = [
  { flag: '🇦🇪', name: 'Ahmed R.', amount: '$4,820' },
  { flag: '🇪🇸', name: 'Sofia L.', amount: '$1,340' },
  { flag: '🇩🇪', name: 'Daniel K.', amount: '$7,650' },
  { flag: '🇸🇬', name: 'Mei Chen', amount: '$2,980' },
  { flag: '🇧🇷', name: 'Carlos V.', amount: '$6,210' },
  { flag: '🇮🇳', name: 'Priya S.', amount: '$920' },
];

function Chip({ s }: { s: RawSettlement }) {
  return (
    <span className="chip">
      <span className="f">{s.flag}</span>
      <span className="n">{s.name}</span>
      <span className="a">+{s.amount.replace(/^\+/, '')}</span>
    </span>
  );
}

export default function Ticker() {
  const rows = useLiveData<RawSettlement>('/api/settlements', FALLBACK);

  // Repeat the available payouts to fill a wide marquee, then duplicate the
  // whole run (A + B) so the loop is seamless.
  const run = useMemo(() => {
    const src = rows.length ? rows : FALLBACK;
    const out: RawSettlement[] = [];
    for (let i = 0; i < Math.max(14, src.length); i++) out.push(src[i % src.length]);
    return out;
  }, [rows]);

  return (
    <div className="ticker">
      <span className="lbl">
        <span className="p" />
        <Editable id="ticker.live">LIVE</Editable>
      </span>
      <div className="chips" id="chips">
        {run.map((s, i) => (
          <Chip key={`a-${i}`} s={s} />
        ))}
        {run.map((s, i) => (
          <Chip key={`b-${i}`} s={s} />
        ))}
      </div>
    </div>
  );
}
