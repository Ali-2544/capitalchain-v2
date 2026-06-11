'use client';

import { useT } from '@/components/LanguageProvider';
import Editable from '@/components/Editable';

export default function AffiliateFAQ() {
  const items = useT().affiliatePage.faq.items;

  const toggleFAQ = (e: React.MouseEvent<HTMLButtonElement>) => {
    const ans = e.currentTarget.nextElementSibling as HTMLElement;
    const parent = e.currentTarget.parentElement;
    if (parent?.classList.contains('open')) {
      parent.classList.remove('open');
      ans.style.maxHeight = '0px';
    } else {
      parent?.classList.add('open');
      ans.style.maxHeight = ans.scrollHeight + 'px';
    }
  };

  return (
    <div className="faq-list reveal">
      {items.map((item, i) => (
        <div className="faq-item" style={{ borderBottom: '1px solid var(--line)' }} key={i}>
          <button className="faq-q" onClick={toggleFAQ}>
            <span><Editable id={`affiliatePage.faq.items.${i}.q`}>{item.q}</Editable></span>
            <span className="pm">+</span>
          </button>
          <div className="faq-a" style={{ transition: 'max-height 0.35s ease', maxHeight: '0px', overflow: 'hidden' }}>
            <div><Editable id={`affiliatePage.faq.items.${i}.a`}>{item.a}</Editable></div>
          </div>
        </div>
      ))}
    </div>
  );
}
