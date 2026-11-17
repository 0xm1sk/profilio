/**
 * Build a site-internal URL that respects the configured `base` path and the
 * `trailingSlash: 'always'` setting.
 *
 * Astro exposes `base` as `import.meta.env.BASE_URL` (e.g. "/profilio/").
 * Hardcoding "/profilio" in templates breaks in dev (routes are served under
 * the base path) and breaks if the site is ever deployed to a different base.
 *
 * @example
 *   url('notes')                 -> "/profilio/notes/"
 *   url('notes/' + entry.slug)   -> "/profilio/notes/my-note/"
 *   url('')                      -> "/profilio/"
 */
function baseUrl(): string {
  const raw = import.meta.env.BASE_URL || '/';
  // BASE_URL ends with "/" when trailingSlash is 'always', but not when it is
  // 'ignore'/'never' — normalize so concatenation is always correct.
  return raw.endsWith('/') ? raw : `${raw}/`;
}

export function url(path = ''): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return clean ? `${baseUrl()}${clean}/` : baseUrl();
}

/** Base-aware path for static files in `public/` (no trailing slash added). */
export function assetPath(path: string): string {
  return `${baseUrl()}${path.replace(/^\/+/, '')}`;
}
