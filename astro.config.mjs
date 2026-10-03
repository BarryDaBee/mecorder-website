// @ts-check
import { defineConfig } from 'astro/config';
import { SITE_URL, BASE_PATH } from './src/lib/site-url.mjs';
import rehypeDocs from './src/lib/docs/rehype-docs.mjs';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [[rehypeDocs, { base: BASE_PATH }]],
  },
});
