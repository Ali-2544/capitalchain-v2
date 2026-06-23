'use client';

import { useT } from './LanguageProvider';
import Editable from '@/components/Editable';
import EditableLink from '@/components/EditableLink';
import EditableImage from '@/components/EditableImage';
import NewsletterForm from '@/components/NewsletterForm';
import { LINKS, EXTERNAL } from '@/lib/links';

// Footer social row. Plain anchors (static) — each opens its profile in a new tab.
const SOCIALS: { label: string; href: string; path: string }[] = [
  { label: 'X (Twitter)', href: LINKS.x, path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z' },
  { label: 'Instagram', href: LINKS.instagram, path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.92 4.919-1.266.058-1.644.07-4.849.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z' },
  { label: 'Telegram', href: LINKS.telegram, path: 'M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42Z' },
  { label: 'Discord', href: LINKS.discord, path: 'M20.317 4.369A19.79 19.79 0 0 0 15.432 3c-.21.375-.45.882-.617 1.283a18.27 18.27 0 0 0-5.487 0A12.6 12.6 0 0 0 8.71 3a19.74 19.74 0 0 0-4.885 1.37C.66 9.04-.196 13.58.23 18.06a19.9 19.9 0 0 0 6.066 3.058c.49-.67.926-1.382 1.302-2.13-.717-.27-1.4-.602-2.045-.99.171-.126.34-.257.502-.392 3.927 1.84 8.18 1.84 12.061 0 .164.135.332.266.502.392-.646.388-1.33.72-2.047.99.375.748.81 1.46 1.302 2.13a19.84 19.84 0 0 0 6.067-3.058c.5-5.177-.838-9.674-3.524-13.69ZM8.02 15.331c-1.182 0-2.157-1.085-2.157-2.42 0-1.333.955-2.42 2.157-2.42 1.21 0 2.176 1.096 2.157 2.42 0 1.335-.955 2.42-2.157 2.42Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.42 0-1.333.955-2.42 2.157-2.42 1.21 0 2.176 1.096 2.157 2.42 0 1.335-.946 2.42-2.157 2.42Z' },
  { label: 'YouTube', href: LINKS.youtube, path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.546 15.568V8.432L15.818 12l-6.273 3.568Z' },
];

export default function Footer() {
  const t = useT();
  return (
    <footer>
      <div className="wrap">
        <div className="news reveal">
          <div>
            <h2><Editable id="footer.newsH">{t.footer.newsH}</Editable></h2>
            <p><Editable id="footer.newsP">{t.footer.newsP}</Editable></p>
          </div>
          <NewsletterForm />
        </div>
        <div className="foot-grid">
          <div className="foot-brand">
            <a href="/" className="logo" aria-label="Capital Chain">
              <EditableImage id="brand.logoDark" className="logo-img logo-dark" src="/logo.png" alt="Capital Chain" width={164} height={36} />
              <EditableImage id="brand.logoLight" className="logo-img logo-light" src="/logo-light.png" alt="Capital Chain" width={164} height={36} />
            </a>
            <p><Editable id="footer.brandP">{t.footer.brandP}</Editable></p>
            <div className="foot-social">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label} title={s.label} className="foot-social-link" {...EXTERNAL}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          <div className="foot-col">
            <h3><Editable id="footer.platform">{t.footer.platform}</Editable></h3>
            <EditableLink id="footer.programs" href={LINKS.programs}>{t.footer.programs}</EditableLink>
            <EditableLink id="footer.payouts" href="/#payouts">{t.footer.payouts}</EditableLink>
            <EditableLink id="footer.scaling" href="/#scaling">{t.footer.scaling}</EditableLink>
            <EditableLink id="footer.platforms" href="/#platforms">{t.footer.platforms}</EditableLink>
          </div>
          <div className="foot-col">
            <h3><Editable id="footer.company">{t.footer.company}</Editable></h3>
            <EditableLink id="footer.about" href="/about">{t.footer.about}</EditableLink>
            <EditableLink id="footer.affiliate" href="/partnership">{t.footer.affiliate}</EditableLink>
            <EditableLink id="footer.community" href="/#community">{t.footer.community}</EditableLink>
            <EditableLink id="footer.contact" href="/contact">{t.footer.contact}</EditableLink>
          </div>
          <div className="foot-col">
            <h3><Editable id="footer.legal">{t.footer.legal}</Editable></h3>
            <EditableLink id="footer.termsOfUse" href="/terms">{t.footer.termsOfUse}</EditableLink>
            <EditableLink id="footer.privacy" href="/privacy">{t.footer.privacy}</EditableLink>
            <EditableLink id="footer.cookies" href="/cookies">Cookie Policy</EditableLink>
            <EditableLink id="footer.refund" href="/refund">{t.footer.refund}</EditableLink>
            <EditableLink id="footer.kycAml" href="/kyc-aml">KYC &amp; AML Policy</EditableLink>
            <EditableLink id="footer.risk" href="/risk-disclosure">{t.footer.risk}</EditableLink>
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
