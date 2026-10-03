/**
 * First-visit intro: a recording timecode counts in, then the curtain lifts
 * and everything underneath starts (reveals, the hero film). Resolves at once
 * when the intro isn't playing.
 */
export const INTRO_DONE = 'mecorder:intro-done';

export function introPlaying() {
  return document.documentElement.classList.contains('intro-playing');
}

export function playIntro(): Promise<void> {
  const root = document.documentElement;
  const el = document.querySelector<HTMLElement>('[data-intro]');
  if (!introPlaying() || !el) return Promise.resolve();
  const time = el.querySelector<HTMLElement>('[data-intro-time]');
  const t0 = performance.now();
  const COUNT = 950;
  return new Promise((resolve) => {
    const step = (now: number) => {
      const ms = Math.min(COUNT, now - t0);
      const frames = Math.floor((ms / 1000) * 60);
      if (time) time.textContent = `00:00:${String(Math.floor(ms / 1000)).padStart(2, '0')}:${String(frames % 60).padStart(2, '0')}`.slice(3);
      if (ms < COUNT) requestAnimationFrame(step);
      else {
        el.classList.add('is-out');
        root.classList.remove('intro-playing');
        window.dispatchEvent(new Event(INTRO_DONE));
        resolve();
        setTimeout(() => el.remove(), 1000);
      }
    };
    requestAnimationFrame(step);
  });
}
