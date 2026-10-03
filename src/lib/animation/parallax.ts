/**
 * ParallaxLayer: children of a `[data-parallax-root]` with `data-depth="0.4"`
 * move with the pointer (and optionally scroll) at a rate set by their depth.
 * Background layers get small depths, foreground layers larger ones, so the
 * scene reads as stacked planes. Disabled for reduced motion and touch.
 */
import { onFrame, Smoothed, prefersReducedMotion, isCompact, whenVisible } from './motion';

export function initPointerParallax(root: HTMLElement, { strength = 18, tilt = 0 } = {}) {
  if (prefersReducedMotion() || isCompact()) return () => {};
  const layers = [...root.querySelectorAll<HTMLElement>('[data-depth]')].map((el) => ({
    el,
    depth: parseFloat(el.dataset.depth || '0'),
  }));
  const x = new Smoothed(0, 0.18);
  const y = new Smoothed(0, 0.18);
  let active = false;
  let stop: (() => void) | null = null;

  const onMove = (e: PointerEvent) => {
    const r = root.getBoundingClientRect();
    x.target = ((e.clientX - r.left) / r.width - 0.5) * 2;
    y.target = ((e.clientY - r.top) / r.height - 0.5) * 2;
    if (!stop && active) stop = onFrame(tick);
  };
  const onLeave = () => {
    x.target = 0;
    y.target = 0;
  };
  const tick = (dt: number) => {
    x.step(dt);
    y.step(dt);
    for (const { el, depth } of layers) {
      const tx = -x.value * strength * depth;
      const ty = -y.value * strength * depth;
      el.style.setProperty('--px', `${tx.toFixed(2)}px`);
      el.style.setProperty('--py', `${ty.toFixed(2)}px`);
      if (tilt) {
        el.style.setProperty('--prx', `${(y.value * tilt * depth).toFixed(3)}deg`);
        el.style.setProperty('--pry', `${(-x.value * tilt * depth).toFixed(3)}deg`);
      }
    }
    if (x.settled && y.settled) {
      stop = null;
      return false;
    }
    return true;
  };

  return whenVisible(
    root,
    () => {
      active = true;
      root.addEventListener('pointermove', onMove);
      root.addEventListener('pointerleave', onLeave);
    },
    () => {
      active = false;
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
    },
  );
}

/** Pointer-reactive tilt for a single card ("cards: subtle depth, pointer response"). */
export function initTilt(el: HTMLElement, max = 4) {
  if (prefersReducedMotion() || isCompact()) return;
  const rx = new Smoothed(0, 0.1);
  const ry = new Smoothed(0, 0.1);
  let stop: (() => void) | null = null;
  const tick = (dt: number) => {
    rx.step(dt);
    ry.step(dt);
    el.style.setProperty('--tilt-x', `${rx.value.toFixed(2)}deg`);
    el.style.setProperty('--tilt-y', `${ry.value.toFixed(2)}deg`);
    if (rx.settled && ry.settled) {
      stop = null;
      return false;
    }
    return true;
  };
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    ry.target = ((e.clientX - r.left) / r.width - 0.5) * 2 * max;
    rx.target = -((e.clientY - r.top) / r.height - 0.5) * 2 * max;
    el.style.setProperty('--glow-x', `${e.clientX - r.left}px`);
    el.style.setProperty('--glow-y', `${e.clientY - r.top}px`);
    stop ??= onFrame(tick);
  });
  el.addEventListener('pointerleave', () => {
    rx.target = 0;
    ry.target = 0;
    stop ??= onFrame(tick);
  });
}

/** Magnetic element: drifts a few pixels towards the pointer, springs back. */
export function initMagnetic(el: HTMLElement, pull = 0.25) {
  if (prefersReducedMotion() || isCompact()) return;
  const x = new Smoothed(0, 0.08);
  const y = new Smoothed(0, 0.08);
  let stop: (() => void) | null = null;
  const tick = (dt: number) => {
    x.step(dt);
    y.step(dt);
    el.style.translate = `${x.value.toFixed(2)}px ${y.value.toFixed(2)}px`;
    if (x.settled && y.settled) {
      stop = null;
      return false;
    }
    return true;
  };
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    x.target = (e.clientX - (r.left + r.width / 2)) * pull;
    y.target = (e.clientY - (r.top + r.height / 2)) * pull;
    stop ??= onFrame(tick);
  });
  el.addEventListener('pointerleave', () => {
    x.target = 0;
    y.target = 0;
    stop ??= onFrame(tick);
  });
}
