'use client';

import { useLang } from './LanguageProvider';
import { useContent } from './ContentProvider';

/**
 * Inline-editable text. Renders the DB override for the active language if one
 * exists, otherwise the i18n fallback passed as children.
 *
 * View mode: renders a bare fragment (or the styled element when `className` is
 * given) so it never disturbs parent styling — gradient text, etc.
 * Edit mode (admin): shows the text in place with a dashed outline; clicking
 * opens the editor popover (the text is never turned into an inline input, so it
 * stays visible and links/buttons don't navigate).
 */
export default function Editable({
  id,
  children,
  as: Tag = 'span',
  className,
}: {
  id: string;
  children: React.ReactNode;
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'b' | 'strong';
  className?: string;
}) {
  const { lang } = useLang();
  const { overrides, editMode, openEditor } = useContent();

  const fallback = typeof children === 'string' ? children : '';
  const value = overrides[`${lang}::${id}`]?.value ?? fallback;

  if (!editMode) {
    // With a className the Editable IS the styled element (e.g. gradient text).
    // Without one, render a bare fragment so the text inherits the parent's
    // styling untouched.
    return className ? <Tag className={className}>{value}</Tag> : <>{value}</>;
  }

  return (
    <Tag
      className={`${className ?? ''} editable`.trim()}
      title={`Edit (${lang.toUpperCase()})`}
      onClick={(e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        openEditor(id, value);
      }}
    >
      {value}
    </Tag>
  );
}
