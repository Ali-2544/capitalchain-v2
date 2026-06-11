'use client';

import { useLang } from './LanguageProvider';
import { useContent } from './ContentProvider';

/**
 * An <a> whose label (per-language) and URL (global) are both inline-editable.
 * In edit mode, clicking opens the popover with a Label field + a Link URL field
 * instead of navigating.
 *
 *   <EditableLink id="nav.buy" href="/#programs" className="btn">{t.nav.buy}</EditableLink>
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
