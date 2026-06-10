'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useT } from './LanguageProvider';
import { useLiveData, timeAgo } from '@/lib/useLiveData';

interface Settlement {
  id?: number;
  flag: string;
  name: string;
  country: string;
  amt: string;
  time: string;
  net: string;
}

// Raw row can come from the API (amount/method/createdAt) or the fallback (amt/time/net).
interface RawSettlement {
  id?: number;
  flag: string;
  name: string;
  country: string;
  amount?: string;
  amt?: string;
  method?: string;
  net?: string;
  createdAt?: string;
  time?: string;
}

// Fallback shown until /api/settlements loads (or if the DB is empty).
const FALLBACK: RawSettlement[] = [
  { flag: '🇮🇳', name: 'Rashmeet Kaur', country: 'India', amt: '$2,140', time: '8m', net: 'USDT (TRC-20)' },
  { flag: '🇩🇪', name: 'Nik Dolja', country: 'Germany', amt: '$1,680', time: '14m', net: 'Bank transfer' },
  { flag: '🇳🇱', name: 'Jasper Hof', country: 'Netherlands', amt: '$1,499', time: '3h', net: 'USDT (TRC-20)' },
  { flag: '🇮🇳', name: 'Shreyas M V', country: 'India', amt: '$1,205', time: '4h', net: 'USDT (TRC-20)' },
  { flag: '🇵🇰', name: 'Saim Ahmed', country: 'Pakistan', amt: '$940', time: '4h', net: 'USDT (TRC-20)' },
  { flag: '🇲🇾', name: 'Jun Jye Ooi', country: 'Malaysia', amt: '$3,310', time: '6h', net: 'Bank transfer' },
  { flag: '🇵🇰', name: 'Shahyan Zahid', country: 'Pakistan', amt: '$3,020', time: '8h', net: 'USDT (TRC-20)' },
  { flag: '🇵🇰', name: 'Zohaib Sajjad', country: 'Pakistan', amt: '$710', time: '14h', net: 'USDT (TRC-20)' },
];

function normalize(r: RawSettlement): Settlement {
  return {
    id: r.id,
    flag: r.flag,
    name: r.name,
    country: r.country,
    amt: r.amt ?? r.amount ?? '',
    net: r.net ?? r.method ?? '',
    time: r.time ?? (r.createdAt ? timeAgo(r.createdAt) : ''),
  };
}

const certHref = (id?: number) => (id ? `/certificate/${id}` : undefined);

export default function LiveRewards() {
  // `active` drives the left card visibility + scroll pause; `last` keeps the card
  // filled while it fades out after the pointer leaves a row.
  const t = useT();
  const raw = useLiveData<RawSettlement>('/api/settlements', FALLBACK);
  const settlements = useMemo(() => raw.map(normalize), [raw]);
  const [active, setActive] = useState<Settlement | null>(null);
  const [last, setLast] = useState<Settlement | null>(null);
  const card = active ?? last ?? settlements[0];

  // Continuous upward scroll driven by rAF (robust across reduced-motion quirks).
  // `paused` is a ref so toggling hover never restarts the animation loop.
  const trackRef = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  useEffect(() => {
    const SPEED = 32; // px per second
    let raf = 0;
    let offset = 0;
    let prev: number | null = null;
    const tick = (t: number) => {
      if (prev === null) prev = t;
      const dt = (t - prev) / 1000;
      prev = t;
      const track = trackRef.current;
      if (track && !paused.current) {
        const half = track.scrollHeight / 2;
        offset += SPEED * dt;
        if (half > 0 && offset >= half) offset -= half;
        track.style.transform = `translateY(${-offset}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="sec band" id="rewards">
      <div className="wrap">
        <div className="shead reveal">
          <div>
            <span className="idx">{t.live.idx}</span>
            <h2 className="h2">
              {t.live.title_a} <span className="gt">{t.live.title_b}</span>
            </h2>
          </div>
          <p>{t.live.sub}</p>
        </div>

        <div className="rewards reveal">
          <div className="rewards-lead">
            <span className="rewards-tag">
              <span className="lr-dot" /> {t.live.tag}
            </span>
            <div className="rewards-total gt">$5.31M</div>
            <p className="rewards-cap">{t.live.total}</p>

            <div className={`reward-feature${active ? ' is-on' : ''}`} aria-hidden={!active}>
              <div className="rf-top">
                <span className="rf-flag">{card.flag}</span> {card.country.toUpperCase()}
              </div>
              <div className="rf-name">{card.name}</div>
              <div className="rf-amt">{card.amt}</div>
              <div className="rf-meta">
                {card.time} {t.live.ago} · {card.net}
              </div>
              <a
                href={certHref(card.id) ?? '#rewards'}
                target={card.id ? '_blank' : undefined}
                rel="noreferrer"
                className="btn btn-p"
                data-magnetic
                style={{ marginTop: 22 }}
              >
                {t.live.proof}
              </a>
            </div>
          </div>

          <div className="rewards-list">
            <div className="rl-head">
              <span>{t.live.recent}</span>
              <a href="#rewards">{t.live.viewRewards}</a>
            </div>
            <div
              className="rl-viewport"
              onMouseLeave={() => {
                paused.current = false;
                setActive(null);
              }}
            >
              <div className="rl-track" ref={trackRef}>
                {[...settlements, ...settlements].map((s, i) => {
                  const href = certHref(s.id);
                  return (
                    <a
                      className="rrow"
                      key={`${s.name}-${i}`}
                      href={href}
                      target={href ? '_blank' : undefined}
                      rel="noreferrer"
                      onClick={(e) => {
                        if (!href) e.preventDefault();
                      }}
                      onMouseEnter={() => {
                        paused.current = true;
                        setActive(s);
                        setLast(s);
                      }}
                    >
                      <span className="rf-flag">{s.flag}</span>
                      <div>
                        <div className="rr-name">{s.name}</div>
                        <div className="rr-country">{s.country}</div>
                      </div>
                      <div className="rr-amt">{s.amt}</div>
                      <div className="rr-time">{s.time}</div>
                    </a>
                  );
                })}
              </div>
            </div>
            <div className="rl-foot">{t.live.onchain}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
