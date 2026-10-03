/**
 * Every internal link and asset goes through `u()`, so the site works both at
 * a domain root and under a sub-path (GitHub Pages: /mecorder-website).
 */
const BASE = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');

export function u(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  return `${BASE}${path}` || '/';
}
