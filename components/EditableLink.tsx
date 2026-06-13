'use client';

import { useLang } from './LanguageProvider';
import { useContent } from './ContentProvider';

/**
 * A link that is normally STATIC (renders its fixed href + label from code).
 *
 * The one exception is the navigation menu: ids beginning with `nav.` stay
 * dynamic so the menu can still be managed from the frontend (label + URL are
 * read from / edited via the content overrides). Everything else ignores the
 * CMS entirely and renders a plain anchor.
 */
export default function EditableLink({
  id,
  href,
  children,
  className,
  ...rest
}: {
  id: string;
  href: string;
  children: React.ReactNode;
  className?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className' | 'id'>) {
  const { lang } = useLang();
  const { overrides, editMode, openLinkEditor } = useContent();

  const isNav = id.startsWith('nav.');

  // Static links: fixed href + label, no overrides, never editable.
  if (!isNav) {
    return (
      <a href={href} className={className} {...rest}>
        {children}
      </a>
    );
  }

  // Nav links stay dynamic.
  const fallback = typeof children === 'string' ? children : '';
  const label = overrides[`${lang}::${id}`]?.value ?? fallback;
  const url = overrides[`en::${id}.href`]?.value || href;

  if (!editMode) {
    return (
      <a href={url} className={className} {...rest}>
        {label}
      </a>
    );
  }

  return (
    <a
      href={url}
      className={`${className ?? ''} editable`.trim()}
      title={`Edit link (${lang.toUpperCase()})`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openLinkEditor(id, label, url);
      }}
    >
      {label}
    </a>
  );
}
