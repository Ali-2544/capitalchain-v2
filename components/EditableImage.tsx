'use client';

import Image from 'next/image';

/**
 * Static image rendered through next/image: automatic AVIF/WebP via the default
 * loader, responsive `srcset`, and lazy loading by default. Pass `priority` for
 * the hero/LCP image so it is eager-loaded + preloaded; everything else stays lazy.
 *
 *   <EditableImage src="/about_booth.png" alt="…" fill sizes="(max-width:768px) 100vw, 50vw" priority />
 *   <EditableImage src="/logo.png" alt="…" width={150} height={33} />
 */
export default function EditableImage({
  src,
  alt = '',
  fill = false,
  width,
  height,
  className,
  imgStyle,
  sizes,
  priority = false,
}: {
  id?: string;
  src: string;
  alt?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  imgStyle?: React.CSSProperties;
  sizes?: string;
  priority?: boolean;
}) {
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? '100vw'}
        priority={priority}
        className={className}
        style={{ objectFit: 'cover', ...imgStyle }}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 0}
      height={height ?? 0}
      sizes={sizes}
      priority={priority}
      className={className}
      style={imgStyle}
    />
  );
}
