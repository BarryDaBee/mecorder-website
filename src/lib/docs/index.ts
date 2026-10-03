/** The documentation, loaded from src/content/docs/*.md at build time. */
import type { MarkdownHeading } from 'astro';

export interface DocPage {
  slug: string; // '' for the docs home
  url: string;
  title: string;
  description: string;
  order: number;
  section: string;
  headings: MarkdownHeading[];
  raw: string;
  Content: any;
}

const modules = import.meta.glob<any>('../../content/docs/*.md', { eager: true });

export const DOCS: DocPage[] = Object.entries(modules)
  .map(([path, mod]) => {
    const file = path.split('/').pop()!.replace(/\.md$/, '');
    const slug = file === 'index' ? '' : file;
    const fm = mod.frontmatter ?? {};
    return {
      slug,
      url: slug ? `/docs/${slug}` : '/docs',
      title: fm.title ?? file,
      description: fm.description ?? '',
      order: fm.order ?? 99,
      section: fm.section ?? fm.title ?? file,
      headings: mod.getHeadings(),
      raw: mod.rawContent(),
      Content: mod.Content,
    } satisfies DocPage;
  })
  .sort((a, b) => a.order - b.order);

export const GUIDE = DOCS.filter((d) => d.slug);

/** Plain text from Markdown, for search snippets. */
export function plain(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, (m) => m.replace(/```\w*|```/g, ' ').replace(/\[|\]/g, ''))
    .replace(/<[^>]+>/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`#>|]/g, ' ')
    .replace(/-{3,}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** One search entry per `##` section (and one per page). */
export function searchEntries() {
  const out: { t: string; p: string; u: string; x: string }[] = [];
  for (const d of DOCS) {
    const parts = d.raw.split(/^## +/m);
    out.push({ t: d.title, p: d.slug ? 'Docs' : 'Docs home', u: d.url, x: plain(parts[0]).slice(0, 600) || d.description });
    parts.slice(1).forEach((part) => {
      const nl = part.indexOf('\n');
      const heading = part.slice(0, nl).trim();
      const h = d.headings.find((x) => x.depth === 2 && x.text === heading);
      out.push({ t: heading, p: d.title, u: `${d.url}#${h?.slug ?? ''}`, x: plain(part.slice(nl)).slice(0, 1600) });
    });
  }
  return out;
}
