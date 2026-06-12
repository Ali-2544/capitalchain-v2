'use client';

import { useT } from './LanguageProvider';
import Editable from '@/components/Editable';
import EditableLink from '@/components/EditableLink';
import EditableImage from '@/components/EditableImage';

export default function Footer() {
  const t = useT();
  return (
    <footer>
      <div className="wrap">
        <div className="news reveal">
          <div>
            <h4><Editable id="footer.newsH">{t.footer.newsH}</Editable></h4>
            <p><Editable id="footer.newsP">{t.footer.newsP}</Editable></p>
          </div>
          <div className="form">
            <input type="email" placeholder={t.footer.emailPlaceholder} aria-label="email" />
            <EditableLink id="footer.subscribe" href="#" className="btn btn-p" data-magnetic>{t.footer.subscribe}</EditableLink>
          </div>
        </div>
        <div className="foot-grid">
          <div className="foot-brand">
            <a href="/" className="logo" aria-label="Capital Chain">
              <EditableImage id="brand.logoDark" className="logo-img logo-dark" src="/logo.png" alt="Capital Chain" width={164} height={36} />
              <EditableImage id="brand.logoLight" className="logo-img logo-light" src="/logo-light.png" alt="Capital Chain" width={164} height={36} />
            </a>
            <p><Editable id="footer.brandP">{t.footer.brandP}</Editable></p>
          </div>
          <div className="foot-col">
            <h5><Editable id="footer.platform">{t.footer.platform}</Editable></h5>
            <EditableLink id="footer.programs" href="/#programs">{t.footer.programs}</EditableLink>
            <EditableLink id="footer.payouts" href="/#payouts">{t.footer.payouts}</EditableLink>
            <EditableLink id="footer.scaling" href="/#scaling">{t.footer.scaling}</EditableLink>
            <EditableLink id="footer.platforms" href="/#platforms">{t.footer.platforms}</EditableLink>
          </div>
          <div className="foot-col">
            <h5><Editable id="footer.company">{t.footer.company}</Editable></h5>
            <EditableLink id="footer.about" href="/about">{t.footer.about}</EditableLink>
            <EditableLink id="footer.affiliate" href="/affiliate">{t.footer.affiliate}</EditableLink>
            <EditableLink id="footer.community" href="/#community">{t.footer.community}</EditableLink>
            <EditableLink id="footer.contact" href="/contact">{t.footer.contact}</EditableLink>
          </div>
          <div className="foot-col">
            <h5><Editable id="footer.legal">{t.footer.legal}</Editable></h5>
            <EditableLink id="footer.termsOfUse" href="/terms">{t.footer.termsOfUse}</EditableLink>
            <EditableLink id="footer.privacy" href="/terms#risk">{t.footer.privacy}</EditableLink>
            <EditableLink id="footer.risk" href="/terms#risk">{t.footer.risk}</EditableLink>
            <EditableLink id="footer.refund" href="/terms#refund">{t.footer.refund}</EditableLink>
          </div>
        </div>
        <div className="disclaimer">
          <strong style={{ color: 'var(--dim)' }}><Editable id="footer.riskTitle">{t.footer.riskTitle}</Editable></strong>
          <Editable id="footer.disclaimer">{t.footer.disclaimer}</Editable>
        </div>
        <div className="foot-bot">
          <span><Editable id="footer.rights">{t.footer.rights}</Editable></span>
          <span>capitalchain.co</span>
        </div>
      </div>
    </footer>
  );
}
