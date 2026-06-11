'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useT } from './LanguageProvider';
import Editable from '@/components/Editable';

function FaqItem({ q, a, open, onToggle }: { q: ReactNode; a: ReactNode; open: boolean; onToggle: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.maxHeight = open ? `${el.scrollHeight}px` : '';
  }, [open]);

  return (
    <div className={`faq-item${open ? ' open' : ''}`}>
      <button className="faq-q" onClick={onToggle}>
        {q} <span className="pm">+</span>
      </button>
      <div className="faq-a" ref={ref}>
        <div>{a}</div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const t = useT();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="sec band" id="faq">
      <div className="wrap">
        <div className="faq-grid">
          <div className="reveal">
            <span className="idx"><Editable id="faq.idx">{t.faq.idx}</Editable></span>
            <h2 className="h2">
              <Editable id="faq.title_a">{t.faq.title_a}</Editable> <Editable className="gt" id="faq.title_b">{t.faq.title_b}</Editable>
            </h2>
            <p style={{ color: 'var(--dim)', marginTop: 14 }}><Editable id="faq.sub">{t.faq.sub}</Editable></p>
          </div>
          <div className="faq-list reveal">
            {t.faq.items.map((it, i) => (
              <FaqItem
                key={i}
                q={<Editable id={`faq.items.${i}.q`}>{it.q}</Editable>}
                a={<Editable id={`faq.items.${i}.a`}>{it.a}</Editable>}
                open={open === i}
                onToggle={() => setOpen(open === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
