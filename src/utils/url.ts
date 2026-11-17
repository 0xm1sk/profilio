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
export function url(path = ''): string {
  const raw = import.meta.env.BASE_URL || '/';
  // BASE_URL ends with "/" when trailingSlash is 'always', but not when it is
  // 'ignore'/'never' — normalize so concatenation is always correct.
  const base = raw.endsWith('/') ? raw : `${raw}/`;
  const clean = path.replace(/^\/+|\/+$/g, '');
  return clean ? `${base}${clean}/` : base;
}
