'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { LANGS, useLang, useT } from './LanguageProvider';
import EditableImage from '@/components/EditableImage';
import EditableLink from '@/components/EditableLink';
import { useContent } from './ContentProvider';
import { LINKS, EXTERNAL } from '@/lib/links';

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
  const { editMode, overrides, save } = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // The built-in page links. Order/visibility/extra links are managed in the DB.
  // `external` links open in a new tab (e.g. the hosted help centre).
  const DEFAULT_NAV: { key: string; href: string; label: React.ReactNode; external?: boolean }[] = [
    { key: 'home', href: '/', label: t.nav.home },
    { key: 'rewards', href: '/rewards', label: t.nav.rewards },
    { key: 'affiliate', href: '/affiliate', label: t.nav.affiliate },
    { key: 'blog', href: '/blog', label: t.nav.blog },
    { key: 'about', href: '/about', label: t.nav.about },
    { key: 'contact', href: '/contact', label: t.nav.contact },
    { key: 'faq', href: 'https://help.capitalchain.co/en/', label: 'FAQ', external: true },
    { key: 'terms', href: '/terms', label: t.nav.terms },
  ];

  const parseList = (raw?: string): string[] => {
    if (!raw) return [];
    try {
      const p = JSON.parse(raw);
      if (Array.isArray(p)) return p.filter((k): k is string => typeof k === 'string');
    } catch {
      /* ignore */
    }
    return [];
  };

  // Final order = saved order (if any) with any missing defaults appended.
  const savedOrder = parseList(overrides['en::nav.order']?.value);
  const order = savedOrder.length ? [...savedOrder] : DEFAULT_NAV.map((d) => d.key);
  for (const d of DEFAULT_NAV) if (!order.includes(d.key)) order.push(d.key);

  const hidden = parseList(overrides['en::nav.hidden']?.value);

  const items = order.map((key) => {
    const def = DEFAULT_NAV.find((d) => d.key === key);
    return def
      ? { key, href: def.href, label: def.label, custom: false, external: !!def.external }
      : { key, href: '#', label: 'New link' as React.ReactNode, custom: true, external: false };
  });

  const saveOrder = (next: string[]) => save('nav.order', 'en', 'text', JSON.stringify(next));
  const saveHidden = (next: string[]) => save('nav.hidden', 'en', 'text', JSON.stringify(next));
  const hideItem = (key: string) => saveHidden(Array.from(new Set([...hidden, key])));
  const restoreItem = (key: string) => saveHidden(hidden.filter((k) => k !== key));
  const removeCustom = (key: string) => saveOrder(order.filter((k) => k !== key));
  const addItem = () => saveOrder([...order, `custom-${Date.now()}`]);

  // What visitors see: everything that isn't hidden.
  const visibleItems = items.filter((it) => !hidden.includes(it.key));

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
            {(editMode ? items : visibleItems).map((it) => {
              const isHidden = hidden.includes(it.key);
              return (
                <span key={it.key} className={`nav-item${isHidden ? ' nav-item-hidden' : ''}`}>
                  <EditableLink
                    id={`nav.${it.key}`}
                    href={it.href}
                    className={pathname === it.href ? 'on' : undefined}
                    {...(it.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {it.label}
                  </EditableLink>
                  {editMode && (
                    <button
                      type="button"
                      className="nav-toggle"
                      title={isHidden ? 'Show in menu' : it.custom ? 'Remove link' : 'Hide from menu'}
                      onClick={() => {
                        if (isHidden) restoreItem(it.key);
                        else if (it.custom) removeCustom(it.key);
                        else hideItem(it.key);
                      }}
                    >
                      {isHidden ? '↺' : '✕'}
                    </button>
                  )}
                </span>
              );
            })}
            {editMode && (
              <button type="button" className="nav-add" onClick={addItem} title="Add a menu link">
                + Add
              </button>
            )}
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
            <EditableLink id="nav.login" href={LINKS.getStarted} className="btn nav-login" {...EXTERNAL}>
              {t.nav.login}
            </EditableLink>
            <EditableLink id="nav.buy" href={LINKS.calculator} className="btn btn-p nav-buy" data-magnetic>
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
            {visibleItems.map((it) => (
              <EditableLink
                key={it.key}
                id={`nav.${it.key}`}
                href={it.href}
                className={pathname === it.href ? 'on' : undefined}
                onClick={() => setMenuOpen(false)}
                {...(it.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {it.label}
              </EditableLink>
            ))}
            <div className="mobile-cta">
              <EditableLink id="nav.login" href={LINKS.getStarted} className="btn" {...EXTERNAL}>
                {t.nav.login}
              </EditableLink>
              <EditableLink id="nav.buy" href={LINKS.calculator} className="btn btn-p" data-magnetic onClick={() => setMenuOpen(false)}>
                {t.nav.buy}
              </EditableLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
