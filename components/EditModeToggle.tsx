'use client';

import { useContent } from './ContentProvider';
import { useLang } from './LanguageProvider';

// Floating button — only rendered for an authenticated admin. Toggles inline
// Edit mode; shows which language is currently being edited.
export default function EditModeToggle() {
  const { authed, editMode, setEditMode } = useContent();
  const { lang } = useLang();

  if (!authed) return null;

  return (
    <button
      type="button"
      className={`edit-fab${editMode ? ' on' : ''}`}
      onClick={() => setEditMode(!editMode)}
    >
      {editMode ? `✓ Done — editing ${lang.toUpperCase()}` : '✎ Edit page'}
    </button>
  );
}
