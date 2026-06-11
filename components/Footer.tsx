'use client';

import { useT } from './LanguageProvider';
import Editable from '@/components/Editable';
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
            <a href="#" className="btn btn-p" data-magnetic>
              <Editable id="footer.subscribe">{t.footer.subscribe}</Editable>
            </a>
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
            <a href="/#programs"><Editable id="footer.programs">{t.footer.programs}</Editable></a>
            <a href="/#payouts"><Editable id="footer.payouts">{t.footer.payouts}</Editable></a>
            <a href="/#scaling"><Editable id="footer.scaling">{t.footer.scaling}</Editable></a>
            <a href="/#platforms"><Editable id="footer.platforms">{t.footer.platforms}</Editable></a>
          </div>
          <div className="foot-col">
            <h5><Editable id="footer.company">{t.footer.company}</Editable></h5>
            <a href="/about"><Editable id="footer.about">{t.footer.about}</Editable></a>
            <a href="/affiliate"><Editable id="footer.affiliate">{t.footer.affiliate}</Editable></a>
            <a href="/#community"><Editable id="footer.community">{t.footer.community}</Editable></a>
            <a href="/contact"><Editable id="footer.contact">{t.footer.contact}</Editable></a>
          </div>
          <div className="foot-col">
            <h5><Editable id="footer.legal">{t.footer.legal}</Editable></h5>
            <a href="/terms"><Editable id="footer.termsOfUse">{t.footer.termsOfUse}</Editable></a>
            <a href="/terms#risk"><Editable id="footer.privacy">{t.footer.privacy}</Editable></a>
            <a href="/terms#risk"><Editable id="footer.risk">{t.footer.risk}</Editable></a>
            <a href="/terms#refund"><Editable id="footer.refund">{t.footer.refund}</Editable></a>
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
