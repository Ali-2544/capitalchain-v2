'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLiveData } from '@/lib/useLiveData';

// Normalized payout pill. The API returns { flag, country, amount }; the fallback uses
// { flag, name, amt } — accept both.
type GP = { id?: number; flag: string; name: string; amt: string };
interface RawPayout {
  id?: number;
  flag: string;
  name?: string;
  country?: string;
  amt?: string;
  amount?: string;
}
const toGP = (r: RawPayout): GP => ({
  id: r.id,
  flag: r.flag,
  name: r.name ?? r.country ?? '',
  amt: r.amt ?? r.amount ?? '',
});

// Built-in list shown until the live /api/payouts feed loads.
const FALLBACK: GP[] = [
  { flag: '🇵🇰', name: 'Pakistan', amt: '$867K' },
  { flag: '🇮🇳', name: 'India', amt: '$210K' },
  { flag: '🇻🇳', name: 'Vietnam', amt: '$254K' },
  { flag: '🇵🇭', name: 'Philippines', amt: '$94.5K' },
  { flag: '🇲🇾', name: 'Malaysia', amt: '$159K' },
  { flag: '🇸🇬', name: 'Singapore', amt: '$72K' },
  { flag: '🇮🇩', name: 'Indonesia', amt: '$146K' },
  { flag: '🇦🇪', name: 'UAE', amt: '$420K' },
  { flag: '🇬🇧', name: 'UK', amt: '$188K' },
  { flag: '🇩🇪', name: 'Germany', amt: '$96K' },
  { flag: '🇯🇵', name: 'Japan', amt: '$77K' },
  { flag: '🇺🇸', name: 'USA', amt: '$512K' },
  { flag: '🇸🇦', name: 'Saudi Arabia', amt: '$305K' },
  { flag: '🇦🇺', name: 'Australia', amt: '$97K' },
];

// Fixed anchor points over the map's right-hand side (where it's revealed past the
// mask). Percentages of the viewport, so they track the right-anchored map across sizes.
const SLOTS: { left: string; top: string }[] = [
  { left: '61%', top: '32%' },
  { left: '77%', top: '28%' },
  { left: '90%', top: '41%' },
  { left: '66%', top: '50%' },
  { left: '84%', top: '57%' },
  { left: '72%', top: '65%' },
];

export default function MapPayouts() {
  // Live payouts (polled); falls back to the built-in list until the DB feed loads.
  const raw = useLiveData<RawPayout>('/api/payouts', FALLBACK);
  const payouts = useMemo(() => raw.map(toGP).filter((p) => p.name && p.amt), [raw]);

  // Advance which payout each slot shows, so the pills feel like a live feed.
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 3600);
    return () => clearInterval(t);
  }, []);

  if (payouts.length === 0) return null;

  return (
    <div className="map-labels" aria-hidden="true">
      {SLOTS.map((slot, i) => {
        // Spread slots across the list, then rotate over time.
        const p = payouts[(i * 2 + tick) % payouts.length];
        return (
          // key includes the payout so each rotation remounts the pill and replays the
          // fade-in animation.
          <div
            className="glabel"
            key={`${i}-${p.name}-${tick}`}
            style={{ left: slot.left, top: slot.top }}
          >
            <span className="gdot" />
            <span className="gflag">{p.flag}</span>
            <span className="gname">{p.name}</span>
            <span className="gamt">{p.amt}</span>
          </div>
        );
      })}
    </div>
  );
}
