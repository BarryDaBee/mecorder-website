/**
 * Reveal: elements marked `data-reveal` fade and rise once when they enter the
 * viewport. `data-reveal-delay="120"` staggers siblings. Declarative, one observer.
 */
import { prefersReducedMotion } from './motion';

export function initReveals(root: ParentNode = document) {
  const els = root.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-revealed)');
  if (!els.length) return;
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-revealed'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        if (el.dataset.revealDelay) el.style.setProperty('--reveal-delay', el.dataset.revealDelay);
        el.classList.add('is-revealed');
        io.unobserve(el);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
  );
  els.forEach((el) => io.observe(el));
}
