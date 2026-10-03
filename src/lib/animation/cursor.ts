/**
 * The site's cursor is MeCorder's cursor treatment: a dot that glides (like
 * Movement smoothing), a ring that wraps whatever you're about to click (like a
 * semantic target), and a Click Ripple on every press. Pointer-fine, motion-OK
 * devices only; the system cursor is kept for text fields.
 */
import { onFrame, prefersReducedMotion, Smoothed } from './motion';

export function initCursor() {
  if (prefersReducedMotion() || !matchMedia('(pointer: fine) and (hover: hover)').matches) return;
  const root = document.querySelector<HTMLElement>('[data-cursor-root]');
  if (!root) return;
  const dot = root.querySelector<HTMLElement>('.cur-dot')!;
  const ring = root.querySelector<HTMLElement>('.cur-ring')!;
  const label = root.querySelector<HTMLElement>('.cur-label')!;
  document.documentElement.classList.add('has-cursor');

  const x = new Smoothed(-100, 0.05);
  const y = new Smoothed(-100, 0.05);
  const rx = new Smoothed(-100, 0.11);
  const ry = new Smoothed(-100, 0.11);
  const rw = new Smoothed(36, 0.08);
  const rh = new Smoothed(36, 0.08);
  const rr = new Smoothed(18, 0.08);
  let target: HTMLElement | null = null;
  let running: (() => void) | null = null;
  let seen = false;

  const SELECT = 'a, button, [role="tab"], summary, label, select, input[type="range"], .pblock, [data-cursor]';

  const tick = (dt: number) => {
    x.step(dt);
    y.step(dt);
    const r = target && target.isConnected ? target.getBoundingClientRect() : null;
    // Small targets get wrapped like a semantic target; big areas only label the cursor.
    if (target && r && r.width * r.height < 60000) {
      const pad = 6;
      rx.target = r.left + r.width / 2 + (x.value - (r.left + r.width / 2)) * 0.08;
      ry.target = r.top + r.height / 2 + (y.value - (r.top + r.height / 2)) * 0.08;
      rw.target = r.width + pad * 2;
      rh.target = r.height + pad * 2;
      rr.target = Math.min(parseFloat(getComputedStyle(target).borderRadius) || 8, (r.height + pad * 2) / 2) + 4;
    } else {
      rx.target = x.value;
      ry.target = y.value;
      rw.target = rh.target = 34;
      rr.target = 17;
    }
    rx.step(dt);
    ry.step(dt);
    rw.step(dt);
    rh.step(dt);
    rr.step(dt);
    dot.style.transform = `translate3d(${x.value}px, ${y.value}px, 0)`;
    ring.style.transform = `translate3d(${rx.value - rw.value / 2}px, ${ry.value - rh.value / 2}px, 0)`;
    ring.style.width = `${rw.value}px`;
    ring.style.height = `${rh.value}px`;
    ring.style.borderRadius = `${rr.value}px`;
    label.style.transform = `translate3d(${rx.value - rw.value / 2}px, ${ry.value - rh.value / 2 - 26}px, 0)`;
    const idle = x.settled && y.settled && rx.settled && ry.settled && rw.settled && rh.settled;
    if (idle) running = null;
    return !idle;
  };
  const wake = () => (running ??= onFrame(tick));

  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      x.target = e.clientX;
      y.target = e.clientY;
      if (!seen) {
        seen = true;
        x.value = rx.value = e.clientX;
        y.value = ry.value = e.clientY;
        root.classList.add('is-on');
      }
      const el = (e.target as Element).closest?.(SELECT) as HTMLElement | null;
      const text = (e.target as Element).closest?.('input:not([type="range"]), textarea, [contenteditable]');
      root.classList.toggle('is-text', !!text);
      if (el !== target) {
        target = el && !text ? el : null;
        const big = target ? target.offsetWidth * target.offsetHeight >= 60000 : false;
        root.classList.toggle('is-target', !!target && !big);
        const name = target?.dataset.cursor || '';
        label.textContent = name;
        root.classList.toggle('has-label', !!name);
      }
      wake();
    },
    { passive: true },
  );
  document.addEventListener('pointerleave', () => root.classList.remove('is-on'));
  document.addEventListener('pointerenter', () => seen && root.classList.add('is-on'));
  window.addEventListener('scroll', wake, { passive: true });

  // A Click Ripple, MeCorder's own click effect.
  window.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    root.classList.add('is-down');
    const rip = document.createElement('span');
    rip.className = 'cur-ripple';
    rip.style.left = `${e.clientX}px`;
    rip.style.top = `${e.clientY}px`;
    root.append(rip);
    rip.addEventListener('animationend', () => rip.remove());
  });
  window.addEventListener('pointerup', () => root.classList.remove('is-down'));
}
