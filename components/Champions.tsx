'use client';

import { useT } from './LanguageProvider';
import { useLiveData } from '@/lib/useLiveData';
import Editable from '@/components/Editable';

interface Champ {
  id?: number;
  rank: string | number;
  flag: string;
  name: string;
  role: string;
  amt?: string;
  amount?: string;
}

// Fallback shown until the /api/leaderboard data loads (or if the DB is empty).
const FALLBACK: Champ[] = [
  { rank: '#01', flag: '🇦🇪', name: 'A. Rahman', role: '$200K · Operator', amt: '$96,316' },
  { rank: '#02', flag: '🇩🇪', name: 'B. Schneider', role: '$200K · Operator', amt: '$80,517' },
  { rank: '#03', flag: '🇵🇰', name: 'U. Bin Hannan', role: '$100K · Operator', amt: '$80,369' },
  { rank: '#04', flag: '🇬🇧', name: 'O. Trish', role: '$100K · Operator', amt: '$66,028' },
  { rank: '#05', flag: '🇸🇬', name: 'M. Chen', role: '$100K · Operator', amt: '$58,940' },
];

const rankLabel = (r: string | number) =>
  typeof r === 'number' ? `#${String(r).padStart(2, '0')}` : r;

export default function Champions() {
  const t = useT();
  const rows = useLiveData<Champ>('/api/leaderboard', FALLBACK);

  return (
    <section className="sec band" id="champions">
      <div className="wrap">
        <div className="shead reveal">
          <div>
            <span className="idx"><Editable id="champions.idx">{t.champions.idx}</Editable></span>
            <h2 className="h2">
              <Editable id="champions.title_a">{t.champions.title_a}</Editable> <Editable className="gt" id="champions.title_b">{t.champions.title_b}</Editable>
            </h2>
          </div>
          <p><Editable id="champions.sub">{t.champions.sub}</Editable></p>
        </div>
      </div>
      <div className="wrap">
        <div className="hscroll">
          {rows.map((c, i) => (
            <a
              className="hcard champ reveal"
              key={c.id ?? `${rankLabel(c.rank)}-${i}`}
              href={c.id ? `/certificate/${c.id}` : undefined}
              target={c.id ? '_blank' : undefined}
              rel="noreferrer"
              style={c.id ? { cursor: 'pointer' } : undefined}
            >
              <span className="rank">{rankLabel(c.rank)}</span>
              <div className="flag">{c.flag}</div>
              <div className="name">{c.name}</div>
              <div className="role">{c.role}</div>
              <div className="amt">{c.amt ?? c.amount}</div>
              <div className="amt-l"><Editable id="champions.paidThisCycle">{t.champions.paidThisCycle}</Editable></div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
