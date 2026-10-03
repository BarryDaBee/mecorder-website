import { u } from '../lib/url';
export function GET({ site }: { site: URL }) {
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL(u('/sitemap.xml'), site).href}\n`, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
