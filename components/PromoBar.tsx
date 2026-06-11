'use client';

import { useT } from './LanguageProvider';
import Editable from './Editable';

// ◆ = wide diamond separators from the mockup (nowrap collapses ordinary spaces).
const SEP = '  ◆  ';

export default function PromoBar() {
  const t = useT();
  // Each promo message is individually editable; the row is duplicated for the
  // seamless marquee, both copies sharing the same ids.
  const run = (key: string) =>
    t.promo.map((p, i) => (
      <span key={`${key}-${i}`}>
        <Editable id={`promo.${i}`}>{p}</Editable>
        {SEP}
      </span>
    ));

  return (
    <div className="promo">
      <div className="row" id="promoRow">
        <span>{run('a')}</span>
        <span>{run('b')}</span>
      </div>
    </div>
  );
}
