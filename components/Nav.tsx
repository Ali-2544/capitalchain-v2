'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { LANGS, useLang, useT } from './LanguageProvider';
import EditableImage from '@/components/EditableImage';
import EditableLink from '@/components/EditableLink';

function Logo() {
  return (
    <a href="/" className="logo" aria-label="Capital Chain">
      <EditableImage id="brand.logoDark" className="logo-img logo-dark" src="/logo.png" alt="Capital Chain" width={150} height={33} />
      <EditableImage id="brand.logoLight" className="logo-img logo-light" src="/logo-light.png" alt="Capital Chain" width={150} height={33} />
    </a>
  );
}

function LangSwitch() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  return (
    <div className={`lang-switch${open ? ' open' : ''}`} ref={ref}>
      <button className="lang-btn" onClick={() => setOpen((o) => !o)} aria-label="Language">
        <span>{active.flag}</span>
        <span>{active.label}</span>
        <span className="caret">▼</span>
      </button>
      {open && (
        <div className="lang-menu" role="menu">
          {LANGS.map((l) => (
            <button
              key={l.code}
              className={`lang-opt${l.code === lang ? ' on' : ''}`}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
            >
              <span className="o-flag">{l.flag}</span>
              <span>{l.label}</span>
              <span className="o-native">{l.native}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Nav() {
  const { toggleTheme } = useTheme();
  const t = useT();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { key: 'home', href: '/', label: t.nav.home },
    { key: 'rewards', href: '/rewards', label: t.nav.rewards },
    { key: 'affiliate', href: '/affiliate', label: t.nav.affiliate },
    { key: 'blog', href: '/blog', label: t.nav.blog },
    { key: 'about', href: '/about', label: t.nav.about },
    { key: 'contact', href: '/contact', label: t.nav.contact },
    { key: 'terms', href: '/terms', label: t.nav.terms },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header id="hdr" className={scrolled ? 'scrolled' : undefined}>
      <div className="wrap">
        <div className="bar">
          <Logo />
          <div className="nav-links">
            {links.map((l) => (
              <EditableLink
                key={l.href}
                id={`nav.${l.key}`}
                href={l.href}
                className={pathname === l.href ? 'on' : undefined}
              >
                {l.label}
              </EditableLink>
            ))}
          </div>
          <div className="nav-cta">
            <button className="theme-tg" id="themeTg" aria-label="Toggle theme" onClick={toggleTheme}>
              <svg className="sun" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
              <svg className="moon" viewBox="0 0 24 24">
                <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
              </svg>
            </button>
            <LangSwitch />
            <EditableLink id="nav.login" href="#" className="btn nav-login">
              {t.nav.login}
            </EditableLink>
            <EditableLink id="nav.buy" href="/#programs" className="btn btn-p nav-buy" data-magnetic>
              {t.nav.buy}
            </EditableLink>
          </div>
          <button
            className="menu-btn"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="mobile-menu">
          <div className="wrap">
            {links.map((l) => (
              <EditableLink
                key={l.href}
                id={`nav.${l.key}`}
                href={l.href}
                className={pathname === l.href ? 'on' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </EditableLink>
            ))}
            <div className="mobile-cta">
              <EditableLink id="nav.login" href="#" className="btn">
                {t.nav.login}
              </EditableLink>
              <EditableLink id="nav.buy" href="/#programs" className="btn btn-p" data-magnetic onClick={() => setMenuOpen(false)}>
                {t.nav.buy}
              </EditableLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
