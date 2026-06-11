'use client';

import { useRef, useState } from 'react';
import { useContent } from './ContentProvider';

/**
 * Inline-editable image. Renders the DB override if one exists, otherwise the
 * default `src`. In admin Edit mode, shows a "Replace image" overlay that uploads
 * to /api/admin/assets and saves the override. Images are global (not per-locale),
 * so they're stored under the canonical locale "en".
 *
 *   <EditableImage id="aboutPage.img.booth" src="/about_booth.png" alt="…" fill />
 */
export default function EditableImage({
  id,
  src,
  alt = '',
  fill = false,
  width,
  height,
  className,
  imgStyle,
}: {
  id: string;
  src: string;
  alt?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  imgStyle?: React.CSSProperties;
}) {
  const { overrides, editMode, save } = useContent();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const ov = overrides[`en::${id}`];
  const url = ov?.type === 'image' && ov.value ? ov.value : src;

  const fillStyle: React.CSSProperties = fill
    ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }
    : {};

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    try {
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
      if (resp.ok) {
        const { url: assetUrl } = await resp.json();
        await save(id, 'en', 'image', assetUrl);
      } else {
        const j = await resp.json().catch(() => ({}));
        alert(j.error || 'Image upload failed');
      }
    } finally {
      setBusy(false);
    }
  };

  // eslint-disable-next-line @next/next/no-img-element
  const img = (
    <img
      src={url}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      style={{ ...fillStyle, ...imgStyle }}
    />
  );

  if (!editMode) return img;

  return (
    <span
      className={`editable-img${fill ? ' fill' : ''}${className ? ' ' + className : ''}`}
      onClick={() => fileRef.current?.click()}
      title="Replace image"
    >
      {img}
      <span className="editable-img-btn">{busy ? 'Uploading…' : '✎ Replace image'}</span>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPick} />
    </span>
  );
}
