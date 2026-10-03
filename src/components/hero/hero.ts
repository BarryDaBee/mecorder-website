import { RecordingView } from '../../lib/program/player';
import { MiniTimeline } from '../../lib/program/timeline-view';
import { execute, activeSteps } from '../../lib/program/executor';
import { PRIMARY_BUTTON_PROGRAM } from '../../lib/program/model';
import { DURATION } from '../../lib/program/recording';
import { valueAt, span, fade, type Track } from '../../lib/animation/timeline';
import { onFrame, whenVisible, prefersReducedMotion, isCompact, lerp, progress, ease } from '../../lib/animation/motion';
import { initPointerParallax, initMagnetic } from '../../lib/animation/parallax';

/**
 * Film time H (seconds). Every visual is a pure function of H, so the film
 * replays identically, can be paused when off screen, and reduced motion is
 * simply "render the last frame".
 */
const T = {
  cursorIn: 0.3,
  windowIn: 1.5,
  ui: [2.3, 2.6, 2.9],
  rec: 3.3,
  labelOn: 5.25,
  panelIn: 6.2,
  blocks: 6.7,
  blockGap: 0.32,
  compile: 8.05,
  rewind: [8.2, 8.4],
  final: 11.3,
  pull: [11.8, 13.2],
  end: 13.8,
};

/** Recording time shown at film time H. */
function recTime(H: number): number {
  if (H < T.rec) return 0.3;
  if (H < 5.7) return 2.6 + (H - T.rec);
  if (H < T.rewind[0]) return 5.0;
  if (H < T.rewind[1]) return lerp(5.0, 4.05, ease.inOutQuad(progress(H, T.rewind[0], T.rewind[1])));
  if (H < T.final) return 4.05 + (H - T.rewind[1]);
  return (4.05 + (T.final - T.rewind[1]) + (H - T.final)) % DURATION;
}

const tracks: Record<string, Track> = {
  glow: fade(0.2, 2.6),
  cursorO: [
    { t: T.cursorIn, v: 0 },
    { t: T.cursorIn + 0.5, v: 1, ease: 'outCubic' },
    { t: 2.4, v: 1 },
    { t: 2.9, v: 0, ease: 'inQuad' },
  ],
  cursorK: span(T.cursorIn, 2.5, 0, 1, 'inOutCubic'),
  cursorPress: [
    { t: 1.4, v: 1 },
    { t: 1.5, v: 0.82, ease: 'outQuad' },
    { t: 1.75, v: 1, ease: 'outBack' },
  ],
  winO: fade(T.windowIn, 2.5),
  winRY: [
    { t: T.windowIn, v: -24 },
    { t: 3.2, v: -8, ease: 'outCubic' },
    { t: 6.4, v: 0, ease: 'inOutCubic' },
  ],
  winRX: [
    { t: T.windowIn, v: 12 },
    { t: 3.2, v: 3, ease: 'outCubic' },
    { t: 6.4, v: 0, ease: 'inOutCubic' },
  ],
  winS: [
    { t: T.windowIn, v: 0.78 },
    { t: 3.2, v: 0.92, ease: 'outCubic' },
    { t: 6.4, v: 1, ease: 'inOutCubic' },
  ],
  winZ: [
    { t: T.windowIn, v: -260 },
    { t: 3.2, v: -60, ease: 'outCubic' },
    { t: 6.4, v: 0, ease: 'inOutCubic' },
  ],
  winBlur: span(T.windowIn, 2.6, 16, 0, 'outCubic'),
  panelO: [
    { t: T.panelIn, v: 0 },
    { t: T.panelIn + 0.6, v: 1, ease: 'outCubic' },
    { t: T.final, v: 1 },
    { t: T.final + 0.7, v: 0, ease: 'inOutCubic' },
  ],
  panelX: [
    { t: T.panelIn, v: 70 },
    { t: T.panelIn + 0.9, v: 0, ease: 'outQuint' },
    { t: T.final, v: 0 },
    { t: T.final + 0.8, v: 40, ease: 'inOutCubic' },
  ],
  panelRY: [
    { t: T.panelIn, v: -32 },
    { t: T.panelIn + 1, v: -10, ease: 'outCubic' },
    { t: T.final, v: -10 },
    { t: T.final + 0.8, v: -24, ease: 'inOutCubic' },
  ],
  panelZ: [
    { t: T.panelIn, v: -120 },
    { t: T.panelIn + 1, v: 60, ease: 'outCubic' },
    { t: T.final, v: 60 },
    { t: T.final + 0.8, v: -160, ease: 'inOutCubic' },
  ],
  wallO: fade(T.final, T.final + 1),
  wallS: span(T.final, T.final + 1.4, 0.94, 1, 'outCubic'),
  pull: span(T.pull[0], T.pull[1], 0, 1, 'inOutCubic'),
  stepsO: [
    { t: 3.0, v: 0 },
    { t: 3.6, v: 1, ease: 'outCubic' },
    { t: T.pull[0], v: 1 },
    { t: T.pull[0] + 0.6, v: 0 },
  ],
  copy0: fade(12.2, 13.0),
  copy1: fade(12.35, 13.2),
  copy2: fade(12.6, 13.4),
  copy3: fade(12.8, 13.6),
  copy4: fade(12.9, 13.7),
};

export function initHero(root: HTMLElement) {
  const q = <E extends HTMLElement>(s: string) => root.querySelector<E>(s)!;
  const stageWrap = q('.hero-stage-wrap');
  const stage = q('[data-hero-stage]');
  const win = q('[data-hero-window]');
  const introCursor = q('[data-intro-cursor]');
  const wallpaper = q('[data-wallpaper]');
  const panel = q('[data-hero-program]');
  const hpState = q('[data-hp-state]');
  const rec = q('[data-rec]');
  const recTimeEl = q('[data-rec-time]');
  const copy = q('[data-hero-copy]');
  const copyKids = [...copy.children] as HTMLElement[];
  const steps = [...root.querySelectorAll<HTMLElement>('[data-step]')];
  const replay = q<HTMLButtonElement>('[data-hero-replay]');
  const bg = q('.hero-bg');
  const blocks = [...panel.querySelectorAll<HTMLElement>('.pblock')];

  const view = new RecordingView(q('[data-viewport]'));
  const timeline = new MiniTimeline(q('[data-hero-timeline]'));
  const edit = execute([PRIMARY_BUTTON_PROGRAM]);
  let compact = isCompact();
  const reduced = prefersReducedMotion();

  initPointerParallax(root, { strength: 14 });
  root.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => initMagnetic(el, 0.18));

  // Where the stage ends up after the pull back, so the headline fits above it.
  let pullTarget = { s: 0.8, y: 120 };
  const measure = () => {
    if (compact) return;
    const heroH = root.clientHeight;
    const copyBottom = copy.offsetTop + copy.offsetHeight;
    const wrapH = stageWrap.offsetHeight;
    const naturalTop = heroH / 2 - wrapH / 2;
    const top = copyBottom + 28;
    const s = Math.max(0.64, Math.min(0.84, (heroH - 24 - top) / wrapH));
    pullTarget = { s, y: top - naturalTop };
  };
  measure();
  new ResizeObserver(measure).observe(root);

  let H = compact ? 1.6 : 0;
  let compiled = false;
  let lastStep = -2;
  let lastUi = -1;
  let finalOn = false;

  function render(H: number) {
    const v = (k: string) => valueAt(tracks[k], H);
    bg.style.setProperty('--glow', v('glow').toFixed(3));

    // 1–2. A cursor in the dark, then the window materialises where it clicks.
    if (!compact) {
      const k = v('cursorK');
      const sw = stage.clientWidth;
      const sh = stage.clientHeight;
      const x = lerp(sw * 0.08, sw * 0.62, k);
      const y = lerp(sh * 0.86, sh * 0.5, k) - Math.sin(k * Math.PI) * sh * 0.18;
      introCursor.style.opacity = v('cursorO').toFixed(3);
      introCursor.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 80px) scale(${v('cursorPress').toFixed(3)})`;
      win.style.transform = `translate3d(0, 0, ${v('winZ').toFixed(1)}px) rotateX(${v('winRX').toFixed(3)}deg) rotateY(${v('winRY').toFixed(3)}deg) scale(${v('winS').toFixed(4)})`;
      const blur = v('winBlur');
      win.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : '';
    } else {
      introCursor.style.opacity = '0';
    }
    win.style.opacity = (compact ? Math.max(v('winO'), H > 0 ? 1 : 0) : v('winO')).toFixed(3);

    // 3. The interface appears progressively.
    const ui = T.ui.filter((t) => H >= t).length;
    if (ui !== lastUi) {
      lastUi = ui;
      win.classList.toggle('ui-1', ui >= 1);
      win.classList.toggle('ui-2', ui >= 2);
      win.classList.toggle('ui-3', ui >= 3);
    }

    // 4. Recording.
    const r = recTime(H);
    const recording = H >= T.rec && H < T.rewind[0];
    rec.classList.toggle('is-on', recording);
    if (recording) {
      const s = Math.floor(H - T.rec);
      recTimeEl.textContent = `00:${String(s).padStart(2, '0')}`;
    }

    // 5. Understanding: the click becomes a named target.
    view.setLabels(H >= T.labelOn && H < T.rewind[0] ? ['create-project'] : null);

    // 6. A Program assembles, block by block.
    if (!compact) {
      panel.style.transform = `translate3d(${v('panelX').toFixed(1)}px, 0, ${v('panelZ').toFixed(1)}px) rotateY(${v('panelRY').toFixed(2)}deg)`;
    }
    panel.style.opacity = v('panelO').toFixed(3);
    blocks.forEach((b, i) => b.classList.toggle('is-hidden', H < T.blocks + i * T.blockGap));

    // 7. It compiles to ordinary camera moves and effects, then previews.
    const shouldCompile = H >= T.compile;
    if (shouldCompile !== compiled) {
      compiled = shouldCompile;
      timeline.setEdit(compiled ? edit : null);
    }
    const previewing = H >= T.rewind[1] && H < T.final;
    hpState.textContent = previewing ? '▶ Preview' : H >= T.final ? 'Applied' : 'Editing';
    hpState.classList.toggle('is-running', previewing);
    const playing = previewing ? activeSteps(edit, r) : [];
    blocks.forEach((b) => {
      const idx = Number(b.dataset.index);
      b.classList.toggle('is-playing', playing.some((s) => s.action === idx));
    });

    const isFinal = H >= T.final;
    if (isFinal !== finalOn) {
      finalOn = isFinal;
      win.classList.toggle('is-final', isFinal);
    }
    view.render({
      t: r,
      edit: H >= T.rewind[1] ? edit : null,
      rawClicks: H < T.rewind[0],
      polished: H >= T.rewind[1],
      cursorVisible: H >= 2.7,
    });
    timeline.setTime(r);

    // 8. The finished video, then the camera pulls back to the headline.
    wallpaper.style.opacity = v('wallO').toFixed(3);
    wallpaper.style.transform = `scale(${v('wallS').toFixed(4)})`;
    if (!compact) {
      const k = v('pull');
      stageWrap.style.setProperty('--stage-s', lerp(1, pullTarget.s, k).toFixed(4));
      stageWrap.style.setProperty('--stage-y', `${lerp(0, pullTarget.y, k).toFixed(1)}px`);
      copyKids.forEach((c, i) => c.style.setProperty('--o', v(`copy${Math.min(i, 4)}`).toFixed(3)));
      copy.classList.toggle('is-live', H >= 12.4);
    }
    stageWrap.style.setProperty('--steps-o', v('stepsO').toFixed(3));
    const step = H < T.rec ? -1 : H < T.labelOn ? 0 : H < T.panelIn ? 1 : H < T.final ? 2 : 3;
    if (step !== lastStep) {
      lastStep = step;
      steps.forEach((s, i) => {
        s.classList.toggle('is-current', i === step);
        s.classList.toggle('is-done', i < step);
      });
    }
    replay.classList.toggle('is-shown', H >= T.end - 0.4);
  }

  const applyLayout = () => {
    copyKids.forEach((c) => c.style.setProperty('--o', compact ? '1' : '0'));
    copy.classList.toggle('is-live', compact);
    if (compact) {
      win.style.transform = '';
      win.style.filter = '';
      panel.style.transform = '';
      stageWrap.style.removeProperty('--stage-s');
      stageWrap.style.removeProperty('--stage-y');
    }
    measure();
  };
  applyLayout();
  window.matchMedia('(max-width: 760px), (pointer: coarse)').addEventListener('change', () => {
    compact = isCompact();
    applyLayout();
    render(H);
  });

  if (reduced) {
    // Last frame of the film, held on the moment the highlight lands.
    render(T.end);
    view.render({ t: 5.4, edit, polished: true });
    panel.style.opacity = compact ? '1' : '0';
    replay.hidden = true;
    return;
  }

  let running = false;
  let stop: (() => void) | null = null;
  const tick = (dt: number) => {
    H += dt;
    render(H);
    return running;
  };
  const start = () => {
    if (running) return;
    running = true;
    stop = onFrame(tick);
  };
  const pause = () => {
    running = false;
    stop?.();
  };
  render(H);
  if (import.meta.env.DEV) (window as any).__hero = { seek: (h: number) => ((H = h), render(H)), pause };
  whenVisible(root, start, pause, '0px');
  document.addEventListener('visibilitychange', () => (document.hidden ? pause() : start()));
  replay.addEventListener('click', () => {
    H = compact ? 1.6 : 0;
    compiled = false;
    timeline.setEdit(null);
    render(H);
    start();
  });
}
