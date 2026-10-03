/**
 * Docs page behaviour: heading anchors, "on this page" scroll spy, the
 * mobile section menu, and the animated demonstrations (figure.doc-demo).
 */
import { RecordingView } from '../program/player';
import { MiniTimeline } from '../program/timeline-view';
import { execute, activeSteps } from '../program/executor';
import { PRIMARY_BUTTON_PROGRAM, EVERY_CLICK_PROGRAM } from '../program/model';
import { programHTML } from '../program/blocks';
import { DURATION } from '../program/recording';
import { onFrame, whenVisible, prefersReducedMotion } from '../animation/motion';

export function initDocsPage() {
  const prose = document.querySelector<HTMLElement>('[data-prose]');
  if (!prose) return;

  // Anchors on headings.
  prose.querySelectorAll<HTMLElement>('h2[id], h3[id]').forEach((h) => {
    const a = document.createElement('a');
    a.className = 'anchor';
    a.href = `#${h.id}`;
    a.textContent = '#';
    a.setAttribute('aria-label', `Link to ${h.textContent}`);
    h.prepend(a);
  });

  // Scroll spy for the table of contents and the sidebar's current page.
  const heads = [...prose.querySelectorAll<HTMLElement>('h2[id], h3[id]')];
  const tocLinks = new Map([...document.querySelectorAll<HTMLAnchorElement>('[data-toc]')].map((a) => [a.dataset.toc!, a]));
  const subLinks = new Map([...document.querySelectorAll<HTMLAnchorElement>('[data-sub]')].map((a) => [a.dataset.sub!, a]));
  let current = '';
  const spy = () => {
    const y = window.innerHeight * 0.28;
    let id = heads[0]?.id ?? '';
    let h2 = '';
    for (const h of heads) {
      if (h.getBoundingClientRect().top < y) {
        id = h.id;
        if (h.tagName === 'H2') h2 = h.id;
      }
    }
    if (id === current) return;
    current = id;
    tocLinks.forEach((a, k) => a.classList.toggle('is-active', k === id));
    subLinks.forEach((a, k) => a.classList.toggle('is-active', k === h2));
  };
  let queued = false;
  window.addEventListener(
    'scroll',
    () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        spy();
      });
    },
    { passive: true },
  );
  spy();

  // Mobile: the section menu starts closed and closes after choosing.
  const nav = document.querySelector<HTMLDetailsElement>('[data-docs-nav]');
  if (nav && window.matchMedia('(max-width: 860px)').matches) nav.open = false;
  nav?.addEventListener('click', (e) => {
    if ((e.target as Element).closest('a') && window.matchMedia('(max-width: 860px)').matches) nav.open = false;
  });

  document.querySelectorAll<HTMLElement>('figure.doc-demo[data-demo]').forEach(mountDemo);
}

const tpl = () => document.getElementById('mock-app-template') as HTMLTemplateElement | null;

function stageWithApp(fig: HTMLElement): HTMLElement | null {
  const t = tpl();
  if (!t) return null;
  const stage = document.createElement('div');
  stage.className = 'dd-stage';
  stage.append(t.content.cloneNode(true));
  return stage;
}

/** Run `frame(t)` on a loop while the figure is on screen (once, statically, with reduced motion). */
function loop(fig: HTMLElement, frame: (t: number) => void, start = 0, still = start) {
  let t = start;
  if (prefersReducedMotion()) {
    frame(still);
    return;
  }
  frame(t);
  let stop: (() => void) | null = null;
  whenVisible(
    fig,
    () =>
      (stop ??= onFrame((dt) => {
        t = (t + dt) % DURATION;
        frame(t);
        return true;
      })),
    () => {
      stop?.();
      stop = null;
    },
  );
}

function mountDemo(fig: HTMLElement) {
  const cap = fig.querySelector('figcaption');
  const host = document.createElement('div');
  fig.insertBefore(host, cap);
  fig.setAttribute('role', 'figure');
  const kind = fig.dataset.demo;

  if (kind === 'program-run' || kind === 'camera-follow' || kind === 'semantic-target') {
    const stage = stageWithApp(fig);
    if (!stage) return;
    const program = kind === 'camera-follow' ? EVERY_CLICK_PROGRAM : PRIMARY_BUTTON_PROGRAM;
    const edit = execute([program]);
    if (kind === 'program-run') {
      host.className = 'dd-split';
      const side = document.createElement('div');
      side.innerHTML = programHTML(program);
      host.append(stage, side);
      const view = new RecordingView(stage.querySelector('[data-viewport]')!);
      const blocks = [...side.querySelectorAll<HTMLElement>('.pblock')];
      loop(fig, (t) => {
        view.render({ t, edit, polished: true });
        const steps = activeSteps(edit, t);
        blocks.forEach((b) => b.classList.toggle('is-playing', steps.some((s) => s.action === Number(b.dataset.index))));
      }, 3.2, 5.4);
    } else if (kind === 'camera-follow') {
      host.append(stage);
      const view = new RecordingView(stage.querySelector('[data-viewport]')!);
      loop(fig, (t) => view.render({ t, edit, polished: true }), 0.8, 4.6);
    } else {
      // Raw point first, then the named element.
      host.append(stage);
      const view = new RecordingView(stage.querySelector('[data-viewport]')!);
      const tag = document.createElement('div');
      tag.className = 'dd-xy';
      tag.style.cssText =
        'position:absolute;right:12px;top:12px;padding:5px 10px;border-radius:8px;background:#17171a;color:#fff;font:600 12px/1.3 var(--font-mono);box-shadow:0 8px 20px -6px rgba(0,0,0,.5)';
      stage.append(tag);
      loop(fig, (t) => {
        const named = t % 4 > 2;
        view.render({ t: 4.25, rawClicks: false });
        view.setLabels(named ? ['create-project'] : null, 0);
        tag.textContent = named ? 'Click → Primary Button (Create Project)' : 'Click at x 1726 · y 84';
      }, 0, 3);
    }
    return;
  }

  if (kind === 'timeline-tracks') {
    const el = document.createElement('div');
    el.style.cssText = 'border-radius:10px;background:rgba(0,0,0,.25)';
    host.append(el);
    const tl = new MiniTimeline(el);
    tl.setEdit(execute([EVERY_CLICK_PROGRAM]));
    loop(fig, (t) => tl.setTime(t), 0, 4.4);
    return;
  }

  if (kind === 'cursor-styles') {
    host.innerHTML = `<div class="dd-cursor" style="display:flex;justify-content:center;gap:34px;flex-wrap:wrap;padding:18px 0;color:var(--text-3);font-size:12px;text-align:center">
      ${[
        ['As recorded', 'M6 3.5v18.2l4.6-4.4 2.9 6.6 3.1-1.4-2.9-6.5h6.3z', 1],
        ['Larger, smoothed', 'M6 3.5v18.2l4.6-4.4 2.9 6.6 3.1-1.4-2.9-6.5h6.3z', 1.5],
        ['On click: pointing hand', 'M10 4a1.6 1.6 0 0 1 3.2 0v7l1-.2a1.6 1.6 0 0 1 1.8 1.2l.1.4 1.4-.2a1.6 1.6 0 0 1 1.8 1.6V19a5 5 0 0 1-5 5h-2.4a5 5 0 0 1-4-2l-3.3-4.3a1.6 1.6 0 0 1 2.4-2.1L10 17z', 1.3],
      ]
        .map(
          ([label, d, s], i) =>
            `<div><div style="height:64px;display:grid;place-items:center"><svg viewBox="0 0 28 28" width="${28 * (s as number)}" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,.4));${i === 2 ? 'animation:dd-press 1.6s ease-in-out infinite' : ''}"><path d="${d}" fill="#111" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg></div>${label}</div>`,
        )
        .join('')}
    </div><style>@keyframes dd-press{50%{transform:scale(.82)}}</style>`;
    return;
  }

  if (kind === 'export-steps') {
    const steps = ['Preparing', 'Rendering frame 1 of 1,800', 'Checking the file', 'Finalising'];
    host.innerHTML = `<div style="max-width:420px;margin:0 auto;padding:6px 0"><ol style="list-style:none;margin:0;padding:0;display:grid;gap:8px">${steps
      .map((s, i) => `<li data-ex="${i}" style="display:flex;gap:10px;align-items:center;color:var(--text-4);font-size:14px;transition:color .3s"><i style="width:14px;height:14px;border-radius:50%;border:1.5px solid currentColor;display:inline-block"></i><span>${s}</span></li>`)
      .join('')}</ol><div style="margin-top:14px;height:6px;border-radius:3px;background:rgba(255,255,255,.06);overflow:hidden"><i data-ex-bar style="display:block;height:100%;width:0;background:linear-gradient(90deg,var(--accent),#b3a9ff)"></i></div></div>`;
    const items = [...host.querySelectorAll<HTMLElement>('[data-ex]')];
    const bar = host.querySelector<HTMLElement>('[data-ex-bar]')!;
    const label = items[1].querySelector('span')!;
    loop(fig, (t) => {
      const k = (t % 8) / 6.5;
      const step = k < 0.12 ? 0 : k < 0.75 ? 1 : k < 0.9 ? 2 : 3;
      items.forEach((el, i) => (el.style.color = i < step || k >= 1 ? 'var(--success)' : i === step ? 'var(--text)' : 'var(--text-4)'));
      const r = Math.min(1, Math.max(0, (k - 0.12) / 0.63));
      label.textContent = `Rendering frame ${Math.max(1, Math.round(r * 1800)).toLocaleString()} of 1,800`;
      bar.style.width = `${Math.min(100, k * 100)}%`;
    }, 0, 7.9);
  }
}
