/**
 * Build-time docs transforms (no extra dependencies):
 *  - ```program fences become MeCorder blocks (lib/program/blocks.ts notation);
 *  - tables get a scroll wrapper so wide ones never break the layout.
 */
import { notationHTML } from '../program/blocks.ts';

function textOf(node) {
  if (node.type === 'text') return node.value;
  return (node.children || []).map(textOf).join('');
}

function walk(node, fn, parent = null, index = 0) {
  fn(node, parent, index);
  if (node.children) for (let i = 0; i < node.children.length; i++) walk(node.children[i], fn, node, i);
}

export default function rehypeDocs({ base = '/' } = {}) {
  const prefix = base.replace(/\/+$/, '');
  return (tree) => {
    walk(tree, (node, parent, index) => {
      if (!parent || node.type !== 'element') return;
      // Site-relative links in Markdown get the base path (GitHub Pages sub-path).
      const href = node.tagName === 'a' && node.properties?.href;
      if (typeof href === 'string' && href.startsWith('/') && !href.startsWith('//') && prefix) {
        node.properties.href = prefix + href;
      }
      if (node.tagName === 'pre') {
        const code = node.children?.find((c) => c.type === 'element' && c.tagName === 'code');
        const cls = code?.properties?.className || [];
        if (cls.includes('language-program')) {
          parent.children[index] = { type: 'raw', value: notationHTML(textOf(code)) };
        }
      } else if (node.tagName === 'table' && !(parent.properties?.className || []).includes('table-wrap')) {
        parent.children[index] = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['table-wrap'] },
          children: [node],
        };
      }
    });
  };
}
