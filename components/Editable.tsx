'use client';

/**
 * Static text. The inline-CMS editing of page content has been turned off — the
 * site renders fixed copy from the i18n dictionary. This component is kept as a
 * thin passthrough so the many call sites don't have to change; it simply
 * renders its children (optionally wrapped in a styled element, e.g. gradient
 * text via `className`).
 */
export default function Editable({
  children,
  as: Tag = 'span',
  className,
}: {
  id?: string;
  children: React.ReactNode;
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'b' | 'strong';
  className?: string;
}) {
  return className ? <Tag className={className}>{children}</Tag> : <>{children}</>;
}
