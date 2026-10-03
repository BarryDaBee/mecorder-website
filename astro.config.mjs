// @ts-check
import { defineConfig } from 'astro/config';
import { SITE_URL } from './src/lib/site-url.mjs';
import rehypeDocs from './src/lib/docs/rehype-docs.mjs';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'never',
  build: { format: 'file' },
  devToolbar: { enabled: false },
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [rehypeDocs],
  },
});
