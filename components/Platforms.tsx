'use client';

import { useT } from './LanguageProvider';
import Editable from '@/components/Editable';

function BadgeIcon({ type }: { type: 'bolt' | 'chart' }) {
  if (type === 'bolt') {
    return (
      <svg className="ptile-badge-ic" viewBox="0 0 24 24" aria-hidden>
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg className="ptile-badge-ic" viewBox="0 0 24 24" aria-hidden>
      <path d="M3 3v18h18M7 16l4-4 4 4 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// cTrader + API tiles removed. `tile` indexes into the i18n tiles array so the
// remaining tiles keep their correct content/Editable ids.
const META = [
  { cls: 'a', badge: 'MT5', tile: 0 },
  { cls: 'd', badge: 'SPEED', tile: 3, icon: 'bolt' as const },
  { cls: 'e', badge: 'LEVERAGE', tile: 4, icon: 'chart' as const },
  { cls: 'f', badge: '✓ FREEDOM', tile: 5 },
];

export default function Platforms() {
  const t = useT();
  return (
    <section className="sec" id="platforms">
      <div className="wrap">
        <div className="shead reveal">
          <div>
            <span className="idx"><Editable id="platforms.idx">{t.platforms.idx}</Editable></span>
            <h2 className="h2">
              <Editable id="platforms.title_a">{t.platforms.title_a}</Editable> <Editable className="gt" id="platforms.title_b">{t.platforms.title_b}</Editable>
            </h2>
          </div>
          <p><Editable id="platforms.sub">{t.platforms.sub}</Editable></p>
        </div>
        <div className="plat-bento">
          {META.map((m) => (
            <div className={`ptile ${m.cls} reveal`} key={m.cls} data-tilt>
              <span className="badge">
                {'icon' in m && m.icon ? <BadgeIcon type={m.icon} /> : null}
                <Editable id={`platforms.tiles.${m.tile}.badge`}>{m.badge}</Editable>
              </span>
              <h4><Editable id={`platforms.tiles.${m.tile}.h`}>{t.platforms.tiles[m.tile].h}</Editable></h4>
              <p><Editable id={`platforms.tiles.${m.tile}.p`}>{t.platforms.tiles[m.tile].p}</Editable></p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
