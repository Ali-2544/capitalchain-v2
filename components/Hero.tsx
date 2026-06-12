'use client';

import { useT } from './LanguageProvider';
import Editable from './Editable';
import EditableLink from '@/components/EditableLink';

export default function Hero() {
  const t = useT();
  return (
    <section className="hero">
      <div className="wrap">
        <h1 className="reveal">
          <Editable id="hero.title_a">{t.hero.title_a}</Editable>{' '}
          <span className="gt">
            <Editable id="hero.title_traders">{t.hero.title_traders}</Editable>
          </span>{' '}
          <Editable id="hero.title_to">{t.hero.title_to}</Editable>{' '}
          <span className="gt">
            <Editable id="hero.title_capital">{t.hero.title_capital}</Editable>
          </span>
        </h1>
        <Editable id="hero.sub" as="p" className="hero-sub reveal">
          {t.hero.sub}
        </Editable>
        <div className="hero-actions reveal">
          <EditableLink id="hero.cta" href="#programs" className="btn btn-p btn-lg" data-magnetic>{t.hero.cta}</EditableLink>
          <span className="trustline">
            <span className="av">
              <span />
              <span />
              <span />
            </span>
            <Editable id="hero.trust">{t.hero.trust}</Editable>
          </span>
        </div>
      </div>
    </section>
  );
}
