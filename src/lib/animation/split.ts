/**
 * Line reveals: headings marked `data-split` are split into words that rise
 * out of a mask, one after another, when the heading enters the viewport.
 * Screen readers get the original text (aria-label); layout is unchanged.
 */
import { prefersReducedMotion } from './motion';

export function initSplitText(root: ParentNode = document) {
  const els = root.querySelectorAll<HTMLElement>('[data-split]:not(.is-split)');
  if (!els.length) return;
  const reduced = prefersReducedMotion();
  els.forEach((el) => {
    el.classList.add('is-split');
    if (reduced) return;
    el.setAttribute('aria-label', el.textContent?.replace(/\s+/g, ' ').trim() ?? '');
    let i = 0;
    const wrap = (node: Node) => {
      for (const child of [...node.childNodes]) {
        if (child.nodeType === Node.TEXT_NODE) {
          const parts = (child.textContent ?? '').split(/(\s+)/);
          const frag = document.createDocumentFragment();
          for (const p of parts) {
            if (!p) continue;
            if (/^\s+$/.test(p)) {
              frag.append(document.createTextNode(p));
              continue;
            }
            const outer = document.createElement('span');
            outer.className = 'sw';
            outer.setAttribute('aria-hidden', 'true');
            const inner = document.createElement('span');
            inner.className = 'sw-i';
            inner.style.setProperty('--wi', String(i++));
            inner.textContent = p;
            outer.append(inner);
            frag.append(outer);
          }
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE && (child as Element).tagName !== 'BR') {
          wrap(child);
        }
      }
    };
    wrap(el);
  });
  if (reduced) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        (e.target as HTMLElement).classList.add('is-in');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  els.forEach((el) => el.dataset.split !== 'manual' && io.observe(el));
}
