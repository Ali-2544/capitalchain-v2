'use client';

import { useEffect, useRef } from 'react';

/**
 * Lightweight dependency-free WYSIWYG editor (contentEditable + a toolbar).
 * Emits sanitized-on-save HTML via onChange. Inline images are uploaded to the
 * database (POST /api/admin/assets) and inserted as <img src="/api/assets/ID">.
 *
 * `resetKey` re-initialises the content when switching between posts.
 */
export default function RichTextEditor({
  value,
  onChange,
  resetKey,
}: {
  value: string;
  onChange: (html: string) => void;
  resetKey?: string | number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Initialise content once per post (not on every keystroke — that would move the caret).
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) ref.current.innerHTML = value || '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  const emit = () => onChange(ref.current?.innerHTML ?? '');

  const exec = (command: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    emit();
  };

  const addLink = () => {
    const url = window.prompt('Link URL (https://…)');
    if (url) exec('createLink', url);
  };

  const onPickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const dataUrl = await new Promise<string>((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result));
      r.onerror = rej;
      r.readAsDataURL(file);
    });
    const resp = await fetch('/api/admin/assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataUrl }),
    });
    if (!resp.ok) {
      const j = await resp.json().catch(() => ({}));
      alert(j.error || 'Image upload failed');
      return;
    }
    const { url } = await resp.json();
    exec('insertImage', url);
  };

  const TOOLS: { label: string; title: string; on: () => void }[] = [
    { label: 'B', title: 'Bold', on: () => exec('bold') },
    { label: 'I', title: 'Italic', on: () => exec('italic') },
    { label: 'H2', title: 'Heading', on: () => exec('formatBlock', 'h2') },
    { label: 'H3', title: 'Subheading', on: () => exec('formatBlock', 'h3') },
    { label: '¶', title: 'Paragraph', on: () => exec('formatBlock', 'p') },
    { label: '“ ”', title: 'Quote', on: () => exec('formatBlock', 'blockquote') },
    { label: '• List', title: 'Bullet list', on: () => exec('insertUnorderedList') },
    { label: '1. List', title: 'Numbered list', on: () => exec('insertOrderedList') },
    { label: 'Link', title: 'Insert link', on: addLink },
    { label: 'Image', title: 'Insert image', on: () => fileRef.current?.click() },
    { label: 'Clear', title: 'Clear formatting', on: () => exec('removeFormat') },
  ];

  return (
    <div className="rte">
      <div className="rte-toolbar">
        {TOOLS.map((tool) => (
          <button
            key={tool.title}
            type="button"
            title={tool.title}
            className="rte-btn"
            onMouseDown={(e) => e.preventDefault() /* keep selection */}
            onClick={tool.on}
          >
            {tool.label}
          </button>
        ))}
      </div>
      <div
        ref={ref}
        className="rte-area"
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        data-placeholder="Write your post…"
      />
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickImage} />
    </div>
  );
}
