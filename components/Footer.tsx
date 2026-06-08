'use client';

import Image from 'next/image';
import { useT } from './LanguageProvider';

export default function Footer() {
  const t = useT();
  return (
    <footer>
      <div className="wrap">
        <div className="news reveal">
          <div>
            <h4>{t.footer.newsH}</h4>
            <p>{t.footer.newsP}</p>
          </div>
          <div className="form">
            <input type="email" placeholder={t.footer.emailPlaceholder} aria-label="email" />
            <a href="#" className="btn btn-p" data-magnetic>
              {t.footer.subscribe}
            </a>
          </div>
        </div>
        <div className="foot-grid">
          <div className="foot-brand">
            <a href="/" className="logo" aria-label="Capital Chain">
              <Image className="logo-img logo-dark" src="/logo.png" alt="Capital Chain" width={164} height={36} />
              <Image className="logo-img logo-light" src="/logo-light.png" alt="Capital Chain" width={164} height={36} />
            </a>
            <p>{t.footer.brandP}</p>
          </div>
          <div className="foot-col">
            <h5>{t.footer.platform}</h5>
            <a href="/#programs">{t.footer.programs}</a>
            <a href="/#payouts">{t.footer.payouts}</a>
            <a href="/#scaling">{t.footer.scaling}</a>
            <a href="/#platforms">{t.footer.platforms}</a>
          </div>
          <div className="foot-col">
            <h5>{t.footer.company}</h5>
            <a href="/about">{t.footer.about}</a>
            <a href="/affiliate">{t.footer.affiliate}</a>
            <a href="/#community">{t.footer.community}</a>
            <a href="/contact">{t.footer.contact}</a>
          </div>
          <div className="foot-col">
            <h5>{t.footer.legal}</h5>
            <a href="/terms">{t.footer.termsOfUse}</a>
            <a href="/terms#risk">{t.footer.privacy}</a>
            <a href="/terms#risk">{t.footer.risk}</a>
            <a href="/terms#refund">{t.footer.refund}</a>
          </div>
        </div>
        <div className="disclaimer">
          <strong style={{ color: 'var(--dim)' }}>{t.footer.riskTitle}</strong>
          {t.footer.disclaimer}
        </div>
        <div className="foot-bot">
          <span>{t.footer.rights}</span>
          <span>capitalchain.co</span>
        </div>
      </div>
    </footer>
  );
}
