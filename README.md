# MeCorder website

Marketing site and documentation for MeCorder. Static Astro site, no runtime
dependencies beyond Astro itself; every animation is plain TypeScript + CSS.

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in dist/
npm run preview   # serve dist/
```

## Where things live

| Path | What |
| --- | --- |
| `src/pages/` | Routes: `/`, `/download`, `/pricing`, `/docs`, `/docs/[slug]`, `/changelog`, `/about`, `/privacy`, `/terms`, plus `sitemap.xml`, `robots.txt`, `search-index.json` |
| `src/content/docs/*.md` | Documentation. `##` headings become the sidebar, table of contents and search entries |
| `src/content/changelog.ts` | The product journal |
| `src/lib/program/` | The demo's real Program model, recording, executor/compiler, renderer and block views |
| `src/lib/animation/` | Motion primitives: reveal, scroll scenes, parallax, tilt, magnetic, keyframe timelines |
| `src/lib/analytics/` | `track()` seam; swap the provider in one place |
| `src/components/` | Sections, grouped by area (hero, product, program, timeline, demos, documentation…) |
| `tools/og/og.html` | Source of `public/og.png` |

## The demos are data-driven

Every product demo (hero, scroll story, playground, before/after, docs
examples) renders one recording (`lib/program/recording.ts`) through
`execute(programs)`, which mirrors the app's pipeline: match events → lay out
steps in time → compile to camera keyframes and effects. The playground edits a
`Program` object and re-runs that pipeline on every change.

## Docs syntax

- ` ```program ` fences render as blocks (one per line; first word picks the
  category; `[value]` is a slot; two-space indents nest under IF / PARALLEL).
- `<aside class="callout note|tip|planned">`
- `<figure class="doc-demo" data-demo="semantic-target|program-run|timeline-tracks|camera-follow|cursor-styles|export-steps">`

## Placeholders to fill before launch

- `src/lib/site-url.mjs`: the production domain (canonical URLs, Open Graph, sitemap).
- `src/lib/site.ts` → `DOWNLOAD.url` / `version`: the signed, notarised build.
  While it's `null`, download buttons say the build isn't out yet.
- `/terms` and the formal privacy policy.
- Contributions on `/pricing` don't charge anything yet.

Regenerate the Open Graph image after editing `tools/og/og.html`:

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars --window-size=1200,630 --screenshot=public/og.png "file://$PWD/tools/og/og.html"
```
