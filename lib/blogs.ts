// Helpers for the blog system: slugs, a pragmatic HTML sanitizer for the
// rich-text body, and a plain-text excerpt fallback.

/** "Hello World!" -> "hello-world". Always returns a non-empty slug. */
export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip accents (combining diacritics)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return base || 'post';
}

/**
 * Pragmatic sanitizer for the WYSIWYG HTML body. The editor is behind the admin
 * password (trusted input), but the body is rendered with dangerouslySetInnerHTML
 * on the public site, so we strip the obvious XSS vectors defensively:
 *  - <script>/<style>/<iframe>/<object>/<embed> elements (and their content)
 *  - on*="..." event-handler attributes
 *  - javascript: / vbscript: / data: (non-image) URLs in href/src
 */
export function sanitizeHtml(html: string): string {
  let out = html ?? '';
  // Drop dangerous elements entirely (including their inner content).
  out = out.replace(/<(script|style|iframe|object|embed|noscript)\b[\s\S]*?<\/\1>/gi, '');
  // Drop self-closing / unmatched dangerous tags.
  out = out.replace(/<\/?(script|style|iframe|object|embed|noscript)\b[^>]*>/gi, '');
  // Strip inline event handlers: onclick=, onerror=, etc.
  out = out.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  // Neutralize javascript:/vbscript: URLs in href/src.
  out = out.replace(/\s(href|src)\s*=\s*("|')\s*(javascript|vbscript):[^"']*\2/gi, ' $1=$2#$2');
  // Allow data: only for images (data:image/...) — strip other data: URLs.
  out = out.replace(/\s(href|src)\s*=\s*("|')\s*data:(?!image\/)[^"']*\2/gi, ' $1=$2#$2');
  return out.trim();
}

/** Strip tags to derive a plain-text excerpt when none was provided. */
export function htmlToExcerpt(html: string, max = 180): string {
  const text = (html ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text;
}
