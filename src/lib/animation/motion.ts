/** Shared motion maths and environment checks. Pure functions, no DOM state. */

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Map v from [a, b] to [0, 1], clamped. */
export const progress = (v: number, a: number, b: number) => (b === a ? (v >= b ? 1 : 0) : clamp((v - a) / (b - a)));

export const ease = {
  linear: (t: number) => t,
  inQuad: (t: number) => t * t,
  outQuad: (t: number) => 1 - (1 - t) * (1 - t),
  inOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  outCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  inOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  outExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  outQuint: (t: number) => 1 - Math.pow(1 - t, 5),
  /** The app's "Cinematic" camera curve: slow start, long settle. */
  cinematic: (t: number) => (t < 0.5 ? 16 * Math.pow(t, 5) : 1 - Math.pow(-2 * t + 2, 5) / 2),
  /** A gentle overshoot, like Motion.blockSettle. */
  outBack: (t: number) => {
    const c1 = 1.4;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
};
export type EaseName = keyof typeof ease;

let reducedQuery: MediaQueryList | null = null;
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  reducedQuery ??= window.matchMedia('(prefers-reduced-motion: reduce)');
  return reducedQuery.matches;
}

/** Narrow or touch-first screens get 2D versions of spatial scenes. */
export function isCompact(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 760px), (pointer: coarse)').matches;
}

/**
 * Critically damped smoothing towards a target: frame-rate independent,
 * never overshoots, settles. Used for pointer parallax and scroll easing.
 */
export class Smoothed {
  value: number;
  target: number;
  constructor(initial = 0, private halfLife = 0.12) {
    this.value = initial;
    this.target = initial;
  }
  step(dt: number) {
    const k = 1 - Math.pow(0.5, dt / this.halfLife);
    this.value += (this.target - this.value) * k;
    return this.value;
  }
  get settled() {
    return Math.abs(this.target - this.value) < 0.0005;
  }
}

/**
 * A rAF loop that only runs while something asks for it. `tick` returns true
 * to keep running; the loop stops itself when every subscriber is idle.
 */
type Tick = (dt: number, now: number) => boolean | void;
const ticks = new Set<Tick>();
let rafId = 0;
let last = 0;
function frame(now: number) {
  const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
  last = now;
  for (const t of [...ticks]) {
    if (t(dt, now) === false) ticks.delete(t);
  }
  rafId = ticks.size ? requestAnimationFrame(frame) : 0;
}
export function onFrame(tick: Tick): () => void {
  ticks.add(tick);
  if (!rafId) {
    last = performance.now();
    rafId = requestAnimationFrame(frame);
  }
  return () => ticks.delete(tick);
}

/** Run `start` when the element is near the viewport and `stop` when it leaves. */
export function whenVisible(el: Element, start: () => void, stop: () => void, rootMargin = '200px 0px') {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) (e.isIntersecting ? start : stop)();
    },
    { rootMargin },
  );
  io.observe(el);
  return () => io.disconnect();
}
