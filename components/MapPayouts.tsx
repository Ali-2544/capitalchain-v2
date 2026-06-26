'use client';

import { useMemo } from 'react';
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

// Geographic anchor for each country we're willing to show, as viewport percentages
// over the right-anchored world-map background (db bg.png / lg bg.png). Pills are
// translated by -50%/-50% in CSS, so these coordinates mark the *centre* of the pill.
// Any country not listed here is dropped — better no pill than a pill on the wrong
// continent. Tweak these by eye against the map image if needed.
const COUNTRY_POS: Record<string, { left: string; top: string }> = {
  UK: { left: '57%', top: '25%' },
  Germany: { left: '60%', top: '28%' },
  'Saudi Arabia': { left: '64%', top: '43%' },
  UAE: { left: '68%', top: '46%' },
  Pakistan: { left: '72%', top: '40%' },
  India: { left: '74%', top: '48%' },
  Japan: { left: '90%', top: '37%' },
  Vietnam: { left: '79%', top: '49%' },
  Philippines: { left: '86%', top: '52%' },
  Malaysia: { left: '78%', top: '56%' },
  Singapore: { left: '81%', top: '60%' },
  Indonesia: { left: '84%', top: '63%' },
  Australia: { left: '87%', top: '70%' },
};

// Built-in list shown until the live /api/payouts feed loads. Only countries that have
// a position in COUNTRY_POS will end up rendered, so this list can include extras.
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
  { flag: '🇸🇦', name: 'Saudi Arabia', amt: '$305K' },
  { flag: '🇦🇺', name: 'Australia', amt: '$97K' },
];

export default function MapPayouts() {
  // Live payouts (polled); falls back to the built-in list until the DB feed loads.
  const raw = useLiveData<RawPayout>('/api/payouts', FALLBACK);

  // Keep one entry per country (latest amount wins) and only those we have a fixed
  // geo position for, so every pill lands on the right place on the map.
  const payouts = useMemo(() => {
    const byCountry = new Map<string, GP>();
    for (const r of raw) {
      const p = toGP(r);
      if (!p.name || !p.amt) continue;
      if (!COUNTRY_POS[p.name]) continue;
      byCountry.set(p.name, p);
    }
    return Array.from(byCountry.values());
  }, [raw]);

  if (payouts.length === 0) return null;

  return (
    <div className="map-labels" aria-hidden="true">
      {payouts.map((p) => {
        const pos = COUNTRY_POS[p.name]!;
        return (
          // Keyed by country name + amount so amount changes replay the fade-in.
          <div
            className="glabel"
            key={`${p.name}-${p.amt}`}
            style={{ left: pos.left, top: pos.top }}
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
