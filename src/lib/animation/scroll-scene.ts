/**
 * ScrollScene: turns a tall section with a sticky stage into a 0…1 progress
 * value. Only measures while the section is near the viewport, reads layout
 * once per frame, and eases the value so trackpad steps don't look jumpy.
 */
import { clamp, onFrame, Smoothed, whenVisible, prefersReducedMotion } from './motion';

export interface ScrollSceneOptions {
  /** Called every frame while progress is changing. */
  onProgress: (p: number) => void;
  /** Smoothing half-life in seconds (0 = raw). */
  smoothing?: number;
}

export function createScrollScene(section: HTMLElement, { onProgress, smoothing = 0.08 }: ScrollSceneOptions) {
  const s = new Smoothed(0, prefersReducedMotion() ? 0.0001 : Math.max(0.0001, smoothing));
  let running = false;
  let stopLoop: (() => void) | null = null;

  const measure = () => {
    const r = section.getBoundingClientRect();
    const range = r.height - window.innerHeight;
    return range <= 0 ? (r.top <= 0 ? 1 : 0) : clamp(-r.top / range);
  };

  const loop = (dt: number) => {
    s.target = measure();
    const before = s.value;
    s.step(dt);
    if (Math.abs(s.value - before) > 0.00001 || !s.settled) {
      section.style.setProperty('--p', s.value.toFixed(4));
      onProgress(s.value);
    }
    return running;
  };

  const start = () => {
    if (running) return;
    running = true;
    s.value = s.target = measure();
    section.style.setProperty('--p', s.value.toFixed(4));
    onProgress(s.value);
    stopLoop = onFrame(loop);
  };
  const stop = () => {
    running = false;
    stopLoop?.();
  };

  return whenVisible(section, start, stop, '100px 0px');
}
