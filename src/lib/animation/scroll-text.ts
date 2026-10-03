/**
 * Scroll-lit text: words in `[data-scroll-text]` brighten from dim to full as
 * the paragraph moves up through the viewport, so reading pace follows scroll.
 */
import { prefersReducedMotion, clamp, onFrame, whenVisible } from './motion';

export function initScrollText(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-scroll-text]').forEach((el) => {
    if (prefersReducedMotion()) return;
    el.setAttribute('aria-label', el.textContent?.replace(/\s+/g, ' ').trim() ?? '');
    const words: HTMLElement[] = [];
    const walk = (node: Node) => {
      for (const child of [...node.childNodes]) {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          for (const p of (child.textContent ?? '').split(/(\s+)/)) {
            if (!p) continue;
            if (/^\s+$/.test(p)) frag.append(document.createTextNode(p));
            else {
              const s = document.createElement('span');
              s.className = 'lw';
              s.setAttribute('aria-hidden', 'true');
              s.textContent = p;
              words.push(s);
              frag.append(s);
            }
          }
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE) walk(child);
      }
    };
    walk(el);
    let lit = -1;
    let stop: (() => void) | null = null;
    const tick = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the top reaches 85% of the viewport, 1 when the bottom reaches 45%.
      const p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.4));
      const n = Math.round(p * words.length);
      if (n !== lit) {
        lit = n;
        words.forEach((w, i) => w.classList.toggle('is-lit', i < n));
      }
      return true;
    };
    whenVisible(
      el,
      () => (stop ??= onFrame(tick)),
      () => {
        stop?.();
        stop = null;
      },
      '0px',
    );
  });
}
