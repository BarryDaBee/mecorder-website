import { u } from '../lib/url';
import { GUIDE } from '../lib/docs';

const STATIC = ['/', '/download', '/pricing', '/docs', '/changelog', '/about', '/privacy', '/terms'];

export function GET({ site }: { site: URL }) {
  const urls = [...STATIC.map(u), ...GUIDE.map((d) => d.url)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${new URL(u, site).href}</loc></url>`).join('\n')}
</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
