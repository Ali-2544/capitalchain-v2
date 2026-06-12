'use client';

import { useT } from './LanguageProvider';
import Editable from '@/components/Editable';

const META = [
  { cls: 'a', badge: 'MT5 / MT4' },
  { cls: 'b', badge: 'cTRADER' },
  { cls: 'c', badge: 'API' },
  { cls: 'd', badge: '⚡ SPEED' },
  { cls: 'e', badge: '📈 LEVERAGE' },
  { cls: 'f', badge: '✓ FREEDOM' },
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
          {META.map((m, i) => (
            <div className={`ptile ${m.cls} reveal`} key={m.cls} data-tilt>
              <span className="badge"><Editable id={`platforms.tiles.${i}.badge`}>{m.badge}</Editable></span>
              <h4><Editable id={`platforms.tiles.${i}.h`}>{t.platforms.tiles[i].h}</Editable></h4>
              <p><Editable id={`platforms.tiles.${i}.p`}>{t.platforms.tiles[i].p}</Editable></p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
