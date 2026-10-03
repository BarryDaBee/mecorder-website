import { RecordingView } from '../../lib/program/player';
import { execute, activeSteps } from '../../lib/program/executor';
import { PRIMARY_BUTTON_PROGRAM } from '../../lib/program/model';
import { createScrollScene } from '../../lib/animation/scroll-scene';
import { valueAt, type Track } from '../../lib/animation/timeline';
import { progress, lerp, isCompact, prefersReducedMotion } from '../../lib/animation/motion';

/** Chapter boundaries in scroll progress (0…1). */
const CH = [0, 0.17, 0.36, 0.58, 0.8, 1];

/** Recording time as a function of scroll progress. */
const recTrack: Track = [
  { t: 0, v: 0.2 },
  { t: CH[1], v: 4.25, ease: 'linear' },
  { t: CH[3], v: 4.25 },
  { t: CH[3] + 0.015, v: 4.05, ease: 'linear' },
  { t: CH[4], v: 6.95, ease: 'linear' },
  { t: 1, v: 9.4, ease: 'linear' },
];

export function initStory(root: HTMLElement) {
  const q = <E extends HTMLElement>(s: string) => root.querySelector<E>(s)!;
  const visual = q('[data-story-visual]');
  const sticky = q('.story-sticky');
  const win = q('[data-sv-window]');
  const wall = q('[data-sv-wall]');
  const panel = q('[data-sv-program]');
  const mode = q('[data-sv-mode]');
  const state = q('[data-svp-state]');
  const texts = [...root.querySelectorAll<HTMLElement>('[data-chapter]')];
  const rail = [...root.querySelectorAll<HTMLElement>('[data-rail]')];
  const copy = q('.story-copy');
  const count = q('[data-story-count]');
  const blocks = [...panel.querySelectorAll<HTMLElement>('.pblock')];
  const view = new RecordingView(q('[data-viewport]'));
  const edit = execute([PRIMARY_BUTTON_PROGRAM]);
  const reduced = prefersReducedMotion();

  // How much the visual must grow (and move) to fill the viewport at the end.
  let fill = { s: 1.3, x: 0, y: 0 };
  const measure = () => {
    const prev = visual.style.transform;
    visual.style.transform = 'none';
    const r = visual.getBoundingClientRect();
    const box = sticky.getBoundingClientRect();
    visual.style.transform = prev;
    const vw = box.width;
    const vh = box.height;
    const s = Math.min((vw * 0.94) / r.width, (vh * 0.86) / r.height);
    // Relative to the sticky frame, so it doesn't matter where the page is scrolled.
    fill = { s, x: vw / 2 - (r.left - box.left + r.width / 2), y: vh / 2 - (r.top - box.top + r.height / 2) + 20 };
  };
  measure();
  window.addEventListener('resize', measure);

  let lastChapter = -1;

  const render = (p: number) => {
    const compact = isCompact();
    const chapter = Math.min(4, CH.findIndex((c, i) => p < CH[i + 1]));
    if (chapter !== lastChapter) {
      lastChapter = chapter;
      texts.forEach((t, i) => t.classList.toggle('is-current', i === chapter));
      rail.forEach((r, i) => {
        r.classList.toggle('is-current', i === chapter);
        r.classList.toggle('is-done', i < chapter);
      });
      mode.textContent = ['Recording', 'Recording · paused', 'Program', 'Preview', 'Export'][chapter];
      count.textContent = `${String(chapter + 1).padStart(2, '0')} / 05`;
    }

    const t = valueAt(recTrack, p);

    // Understand: names appear around the elements, one after another.
    const kU = progress(p, CH[1] + 0.01, CH[2] - 0.04);
    const names = ['navigation', 'search', 'create-project', 'card-q3', 'settings'];
    const shown = p >= CH[1] && p < CH[3] ? (p < CH[2] ? names.slice(0, Math.ceil(kU * names.length)) : ['create-project']) : null;
    view.setLabels(shown, 0);

    // Program: the window slides aside, the blocks assemble as you scroll.
    const kP = progress(p, CH[2], CH[2] + 0.06);
    const kOut = progress(p, CH[4], CH[4] + 0.06);
    const panelO = Math.min(kP, 1 - kOut);
    panel.style.opacity = panelO.toFixed(3);
    const kBlocks = progress(p, CH[2] + 0.03, CH[3] - 0.03);
    blocks.forEach((b, i) => b.classList.toggle('is-hidden', kBlocks * blocks.length < i + 0.5));
    const running = p >= CH[3] && p < CH[4];
    state.textContent = running ? '▶ Preview' : p >= CH[4] ? 'Applied' : 'Editing';
    state.classList.toggle('is-running', running);
    const playing = running ? activeSteps(edit, t) : [];
    blocks.forEach((b) => b.classList.toggle('is-playing', playing.some((s) => s.action === Number(b.dataset.index))));

    // Export: the picture fills the screen as the finished video.
    const kF = progress(p, CH[4], CH[4] + 0.12);
    win.classList.toggle('is-final', kF > 0.3);
    wall.style.opacity = kF.toFixed(3);
    copy.style.setProperty('--copy-o', compact ? '1' : (1 - kF * 1.6).toFixed(3));

    if (!compact && !reduced) {
      const tilt = (1 - kP) * (1 - kF);
      const slide = kP * (1 - kF);
      win.style.transform = `rotateY(${(-6 * tilt + -4 * slide).toFixed(2)}deg) rotateX(${(2 * tilt).toFixed(2)}deg) translateX(${(-6 * slide).toFixed(1)}%)`;
      panel.style.transform = `translate3d(${lerp(60, 0, kP).toFixed(1)}px, -50%, ${lerp(-80, 40, kP).toFixed(1)}px) rotateY(${lerp(-24, -8, kP).toFixed(2)}deg)`;
      visual.style.transform = `translate3d(${(fill.x * kF).toFixed(1)}px, ${(fill.y * kF).toFixed(1)}px, 0) scale(${lerp(1, fill.s, kF).toFixed(4)})`;
    } else {
      win.style.transform = '';
      panel.style.transform = '';
      visual.style.transform = '';
    }

    view.render({ t, edit: p >= CH[3] ? edit : null, rawClicks: p < CH[3], polished: p >= CH[3] });
  };

  render(0);
  createScrollScene(root, { onProgress: render, smoothing: 0.07 });
}
