'use client';

import { useEffect, useState } from 'react';
import { useLang } from './LanguageProvider';
import { useContent } from './ContentProvider';

// The single editor popover. Opens when any <Editable>/<EditableLink> is clicked
// in edit mode. Editing happens here in normal fields — the in-place text is
// never altered or hidden, so it stays visible and styled correctly.
export default function EditorPopover() {
  const { editMode, editing, closeEditor, save, reset } = useContent();
  const { lang } = useLang();
  const [draft, setDraft] = useState('');
  const [href, setHref] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setDraft(editing?.value ?? '');
    setHref(editing?.href ?? '');
  }, [editing]);

  if (!editMode || !editing) return null;
  const isLink = editing.kind === 'link';

  const onSave = async () => {
    setBusy(true);
    await save(editing.id, lang, 'text', draft);
    // Links also store their URL — globally (locale "en"), under "<id>.href".
    if (isLink) await save(`${editing.id}.href`, 'en', 'link', href.trim());
    setBusy(false);
    closeEditor();
  };

  const onReset = async () => {
    setBusy(true);
    await reset(editing.id, lang);
    if (isLink) await reset(`${editing.id}.href`, 'en');
    setBusy(false);
    closeEditor();
  };

  return (
    <div className="cms-pop-backdrop" onClick={closeEditor}>
      <div className="cms-pop" onClick={(e) => e.stopPropagation()}>
        <div className="cms-pop-head">
          <span className="cms-pop-id">{editing.id}</span>
          <span className="cms-pop-lang">{isLink ? 'Link' : 'Text'} · {lang.toUpperCase()}</span>
        </div>

        <label className="cms-pop-field">
          <span>{isLink ? 'Label' : 'Text'}</span>
          <textarea
            className="cms-pop-area"
            value={draft}
            rows={isLink ? 2 : 3}
            autoFocus
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) onSave();
              if (e.key === 'Escape') closeEditor();
            }}
          />
        </label>

        {isLink && (
          <label className="cms-pop-field">
            <span>Link URL</span>
            <input
              className="cms-pop-input"
              value={href}
              placeholder="/programs  or  https://…"
              onChange={(e) => setHref(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSave();
                if (e.key === 'Escape') closeEditor();
              }}
            />
          </label>
        )}

        <div className="cms-pop-actions">
          <button type="button" className="btn" onClick={closeEditor} disabled={busy}>
            Cancel
          </button>
          <button type="button" className="btn cms-pop-reset" onClick={onReset} disabled={busy}>
            Reset to default
          </button>
          <button type="button" className="btn btn-p" onClick={onSave} disabled={busy}>
            {busy ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
