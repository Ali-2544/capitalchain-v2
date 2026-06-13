'use client';

import { useT } from './LanguageProvider';
import Editable from '@/components/Editable';
import EditableLink from '@/components/EditableLink';
import { LINKS, EXTERNAL } from '@/lib/links';

export default function Community() {
  const t = useT();
  return (
    <section className="sec band" id="community">
      <div className="wrap">
        <div className="shead reveal">
          <div>
            <span className="idx"><Editable id="community.idx">{t.community.idx}</Editable></span>
            <h2 className="h2">
              <Editable id="community.title_a">{t.community.title_a}</Editable> <Editable className="gt" id="community.title_b">{t.community.title_b}</Editable>
            </h2>
          </div>
          <p><Editable id="community.sub">{t.community.sub}</Editable></p>
        </div>
        <div className="commgrid">
          <div className="comm reveal">
            <div className="dlogo">
              <svg viewBox="0 0 24 24">
                <path d="M20.3 4.4A19.8 19.8 0 0015.4 3l-.3.5a14.6 14.6 0 014.4 1.4 12.6 12.6 0 00-15 0A14.6 14.6 0 018.9 3.5L8.6 3a19.8 19.8 0 00-4.9 1.4C.6 9 0 13.5.3 17.9a19.9 19.9 0 006 3l.5-1.3a13 13 0 01-1.9-.9l.4-.3a14.2 14.2 0 0012.4 0l.4.3a13 13 0 01-1.9.9l.5 1.3a19.9 19.9 0 006-3c.4-5.1-.7-9.6-2.8-13.5zM8.3 15.3c-1.2 0-2.1-1.1-2.1-2.4S7.1 10.5 8.3 10.5s2.1 1.1 2.1 2.4-.9 2.4-2.1 2.4zm7.4 0c-1.2 0-2.1-1.1-2.1-2.4s.9-2.4 2.1-2.4 2.1 1.1 2.1 2.4-.9 2.4-2.1 2.4z" />
              </svg>
            </div>
            <h3><Editable id="community.discordH">{t.community.discordH}</Editable></h3>
            <p><Editable id="community.discordP">{t.community.discordP}</Editable></p>
            <EditableLink id="community.discordCta" href={LINKS.discord} className="btn btn-p btn-lg" data-magnetic data-discord {...EXTERNAL}>{t.community.discordCta}</EditableLink>
          </div>
          <div className="support reveal">
            <div className="ic">
              <svg viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </div>
            <h3><Editable id="community.supportH">{t.community.supportH}</Editable></h3>
            <p><Editable id="community.supportP">{t.community.supportP}</Editable></p>
            <div className="langs"><Editable id="community.langs">{t.community.langs}</Editable></div>
          </div>
        </div>
      </div>
    </section>
  );
}
