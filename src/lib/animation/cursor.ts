/**
 * Cursor treatment, kept quiet: the real system pointer stays as it is. When it
 * rests on something clickable, a dashed outline appears around that element
 * (like a semantic target in the app); demos show a small label beside the
 * pointer; a press sends out a Click Ripple. Nothing trails the pointer.
 * Pointer-fine, motion-OK devices only.
 */
import { onFrame, prefersReducedMotion, Smoothed } from './motion';

const SELECT = 'a, button, [role="tab"], summary, select, .pblock, [data-cursor]';
const MAX_AREA = 60000; // bigger areas (a whole demo) get the label only

export function initCursor() {
  if (prefersReducedMotion() || !matchMedia('(pointer: fine) and (hover: hover)').matches) return;
  const root = document.querySelector<HTMLElement>('[data-cursor-root]');
  if (!root) return;
  const ring = root.querySelector<HTMLElement>('.cur-ring')!;
  const label = root.querySelector<HTMLElement>('.cur-label')!;

  // The outline animates between targets; it never follows the pointer itself.
  const x = new Smoothed(0, 0.06);
  const y = new Smoothed(0, 0.06);
  const w = new Smoothed(0, 0.06);
  const h = new Smoothed(0, 0.06);
  let target: HTMLElement | null = null;
  let running: (() => void) | null = null;
  let fresh = true;

  const place = () => {
    if (!target?.isConnected) return;
    const r = target.getBoundingClientRect();
    const pad = 5;
    x.target = r.left - pad;
    y.target = r.top - pad;
    w.target = r.width + pad * 2;
    h.target = r.height + pad * 2;
    if (fresh) {
      x.value = x.target;
      y.value = y.target;
      w.value = w.target;
      h.value = h.target;
      fresh = false;
    }
    ring.style.borderRadius = `${Math.min((parseFloat(getComputedStyle(target).borderRadius) || 6) + pad, (r.height + pad * 2) / 2)}px`;
  };
  const tick = (dt: number) => {
    place();
    for (const s of [x, y, w, h]) s.step(dt);
    ring.style.transform = `translate3d(${x.value}px, ${y.value}px, 0)`;
    ring.style.width = `${w.value}px`;
    ring.style.height = `${h.value}px`;
    const idle = [x, y, w, h].every((s) => s.settled);
    if (idle || !target) running = null;
    return !(idle || !target);
  };
  const wake = () => target && (running ??= onFrame(tick));

  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      const el = (e.target as Element).closest?.(SELECT) as HTMLElement | null;
      const typing = (e.target as Element).closest?.('input:not([type="range"]), textarea, [contenteditable]');
      const next = el && !typing ? el : null;
      const name = next?.dataset.cursor || '';
      // Label sits just below-right of the real pointer.
      label.style.transform = `translate3d(${e.clientX + 16}px, ${e.clientY + 18}px, 0)`;
      root.classList.toggle('has-label', !!name);
      if (next !== target) {
        target = next;
        label.textContent = name;
        const outline = !!target && target.offsetWidth * target.offsetHeight < MAX_AREA;
        if (!root.classList.contains('is-target')) fresh = true;
        root.classList.toggle('is-target', outline);
        if (!outline) target = null;
        if (outline) {
          tick(0); // draw at once, then animate
          wake();
        }
      }
    },
    { passive: true },
  );
  window.addEventListener('scroll', wake, { passive: true });
  document.addEventListener('pointerleave', () => root.classList.remove('is-target', 'has-label'));

  window.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    const rip = document.createElement('span');
    rip.className = 'cur-ripple';
    rip.style.left = `${e.clientX}px`;
    rip.style.top = `${e.clientY}px`;
    root.append(rip);
    rip.addEventListener('animationend', () => rip.remove());
  });
}
