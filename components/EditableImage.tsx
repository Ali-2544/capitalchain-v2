'use client';

/**
 * Static image. Inline-CMS image replacement has been turned off — images render
 * from their fixed `src` in code. Kept as a thin passthrough so call sites don't
 * have to change.
 *
 *   <EditableImage id="aboutPage.img.booth" src="/about_booth.png" alt="…" fill />
 */
export default function EditableImage({
  src,
  alt = '',
  fill = false,
  width, 
  height,
  className,
  imgStyle,
}: {
  id?: string;
  src: string;
  alt?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  imgStyle?: React.CSSProperties;
}) {
  const fillStyle: React.CSSProperties = fill
    ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }
    : {};

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      style={{ ...fillStyle, ...imgStyle }}
    />
  );
}
