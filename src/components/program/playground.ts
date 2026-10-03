import { RecordingView } from '../../lib/program/player';
import { MiniTimeline } from '../../lib/program/timeline-view';
import { execute, activeSteps, type CompiledEdit } from '../../lib/program/executor';
import {
  type Program,
  type Action,
  type ActionType,
  type TriggerType,
  DEFAULTS,
  ACTION_INFO,
  TRIGGER_INFO,
  TRIGGER_TARGET,
  ANY_BUTTON,
  ANY_ELEMENT,
  clone,
} from '../../lib/program/model';
import { TARGETS, EVENTS, DURATION } from '../../lib/program/recording';
import { targetName, programSentence } from '../../lib/program/blocks';
import { onFrame, whenVisible, prefersReducedMotion } from '../../lib/animation/motion';
import { track, trackOnce } from '../../lib/analytics';

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/** Elements that actually have events of this kind in the recording (like the app's TargetPicker). */
function triggerTargets(type: TriggerType): { value: string; label: string }[] {
  const ids = [...new Set(EVENTS.filter((e) => e.type === type && e.target).map((e) => e.target!))];
  const named = ids.map((id) => ({ value: id, label: targetName(id) }));
  if (type === 'click') return [...named, { value: ANY_BUTTON, label: 'Any button' }, { value: ANY_ELEMENT, label: 'Anything clicked' }];
  if (type === 'hover') return [...named, { value: ANY_ELEMENT, label: 'Any element' }];
  if (type === 'textInput') return [...named, { value: ANY_ELEMENT, label: 'Any field' }];
  return named;
}

const actionTargets = () => [
  { value: TRIGGER_TARGET, label: 'The event’s element' },
  ...Object.values(TARGETS)
    .filter((t) => t.id !== 'navigation')
    .map((t) => ({ value: t.id, label: targetName(t.id) })),
];

const select = (name: string, value: string, options: { value: string; label: string }[], label: string) =>
  `<select class="pslot-select" data-field="${name}" aria-label="${esc(label)}">${options
    .map((o) => `<option value="${esc(o.value)}"${o.value === value ? ' selected' : ''}>${esc(o.label)}</option>`)
    .join('')}</select>`;

const num = (name: string, value: number, label: string, min = 0, max = 3, step = 0.1) =>
  `<input class="pslot-num" type="number" inputmode="decimal" data-field="${name}" value="${value}" min="${min}" max="${max}" step="${step}" aria-label="${esc(label)}" />`;

function actionBody(a: Action, i: number, n: number): string {
  const typeSel = select(
    'type',
    a.type,
    (Object.keys(ACTION_INFO) as ActionType[]).map((k) => ({ value: k, label: ACTION_INFO[k].title })),
    `Block ${i + 1} type`,
  );
  let params = '';
  switch (a.type) {
    case 'focus':
      params = `${select('target', a.target, actionTargets(), 'Focus target')}`;
      break;
    case 'highlight':
      params = `${select('target', a.target, actionTargets(), 'Highlight target')} <i>for</i> ${num('hold', a.hold, 'Hold, seconds', 0.2, 3)} <i>s</i>`;
      break;
    case 'wait':
      params = `${num('duration', a.duration, 'Wait, seconds', 0, 3)} <i>seconds</i>`;
      break;
    case 'ripple':
    case 'zoomOut':
    case 'reset':
      break;
  }
  const tools = `<span class="pb-tools"><button type="button" class="pb-tool" data-move="-1" aria-label="Move block ${i + 1} up"${i === 0 ? ' disabled' : ''}>↑</button><button type="button" class="pb-tool" data-move="1" aria-label="Move block ${i + 1} down"${i === n - 1 ? ' disabled' : ''}>↓</button><button type="button" class="pb-tool" data-remove aria-label="Delete block ${i + 1}">×</button></span>`;
  return `${typeSel}${params ? ' ' + params : ''}${tools}`;
}

function triggerBody(p: Program): string {
  const tr = p.trigger;
  const typeSel = select(
    'trigger-type',
    tr.type,
    (Object.keys(TRIGGER_INFO) as TriggerType[]).map((k) => ({ value: k, label: TRIGGER_INFO[k] })),
    'Trigger event',
  );
  const tgt =
    tr.type === 'keyPress'
      ? select('trigger-key', tr.key ?? 'Return', [{ value: 'Return', label: 'Return' }], 'Key')
      : select('trigger-target', tr.target ?? ANY_ELEMENT, triggerTargets(tr.type), 'Trigger element');
  return `<b>When</b> ${typeSel} ${tgt}`;
}

export function initPlayground(root: HTMLElement) {
  const q = <E extends HTMLElement>(s: string) => root.querySelector<E>(s)!;
  const view = new RecordingView(q('[data-viewport]'));
  const timeline = new MiniTimeline(q('[data-pg-timeline]'));
  const stack = q('[data-stack]');
  const addBar = q('[data-add]');
  const report = q('[data-report]');
  const json = q('[data-json]');
  const live = q('[data-live]');
  const scrub = q<HTMLInputElement>('[data-scrub]');
  const timeEl = q('[data-time]');
  const playBtn = q<HTMLButtonElement>('[data-play]');
  const revealTitle = q('[data-reveal-title]');
  const reduced = prefersReducedMotion();

  let program: Program | null = null;
  let edit: CompiledEdit | null = null;
  let t = 0.2;
  let playing = !reduced;
  let building = false;

  root.classList.add('is-picking');

  const setPlaying = (on: boolean) => {
    playing = on;
    root.classList.toggle('is-paused', !on);
    playBtn.setAttribute('aria-label', on ? 'Pause' : 'Play');
  };
  setPlaying(playing);

  /** Recompile and re-render the editor; `seek` jumps to just before the first match, like Preview. */
  function update({ rebuild = true, seek = true, animateFrom = Infinity } = {}) {
    if (!program) return;
    edit = execute([program]);
    timeline.setEdit(edit);
    if (rebuild) renderStack(animateFrom);
    const n = edit.matches.length;
    const kind = TRIGGER_INFO[program.trigger.type].toLowerCase();
    report.textContent =
      n === 0
        ? `No ${kind} in this recording matches. Try another element.`
        : `Matches ${n} ${n === 1 ? 'moment' : 'moments'} in the recording · ${edit.cameraKeys.length / 2} camera ${edit.cameraKeys.length / 2 === 1 ? 'move' : 'moves'}, ${edit.effects.length} ${edit.effects.length === 1 ? 'effect' : 'effects'}`;
    if (edit.notes.length) report.textContent += ` · ${edit.notes[0]}`;
    json.textContent = JSON.stringify(program, null, 2);
    live.textContent = `${programSentence(program)} ${report.textContent}`;
    if (seek && n) t = Math.max(0, edit.matches[0].event.t - 0.8);
    draw();
  }

  function renderStack(animateFrom: number) {
    if (!program) return;
    const p = program;
    const items = [
      `<div role="listitem" class="pblock pb-events pb-hat${animateFrom > -1 ? ' is-static' : ''}" data-index="-1" style="--n:0"><span class="pb-ico" aria-hidden="true"></span><span class="pb-body">${triggerBody(p)}</span></div>`,
      ...p.actions.map((a, i) => {
        const cat = ACTION_INFO[a.type].category;
        const stat = i < animateFrom ? ' is-static' : '';
        return `<div role="listitem" class="pblock pb-${cat}${stat}" data-index="${i}" style="--n:${(i - Math.max(0, animateFrom)) * 90}"><span class="pb-ico" aria-hidden="true"></span><span class="pb-body">${actionBody(a, i, p.actions.length)}</span></div>`;
      }),
    ];
    stack.innerHTML = items.join('');
    addBar.hidden = building;
  }

  function draw() {
    const steps = edit ? activeSteps(edit, t) : [];
    stack.querySelectorAll<HTMLElement>('.pblock').forEach((b) => {
      const idx = Number(b.dataset.index);
      b.classList.toggle('is-playing', steps.some((s) => s.action === idx));
    });
    view.render({ t, edit, polished: !!program, rawClicks: !program });
    timeline.setTime(t);
    scrub.value = String(t);
    const s = Math.floor(t);
    timeEl.textContent = `00:${String(s).padStart(2, '0')}.${String(Math.floor((t - s) * 100)).padStart(2, '0')}`;
  }

  /** The signature moment: a picked element becomes a target, then a Program, block by block. */
  async function pick(id: string) {
    if (building) return;
    building = true;
    root.classList.remove('is-picking');
    root.classList.add('has-program');
    track('program_target_picked', { target: id });
    trackOnce('program_demo_interaction');
    const hasClick = EVENTS.some((e) => e.type === 'click' && e.target === id);
    const hasHover = EVENTS.some((e) => e.type === 'hover' && e.target === id);
    const type: TriggerType = hasClick ? 'click' : hasHover ? 'hover' : 'click';
    const full: Program = {
      id: 'playground',
      name: `Emphasise ${targetName(id)}`,
      trigger: { type, target: id },
      actions: [
        { type: 'focus', target: id, duration: 0.5 },
        { type: 'wait', duration: 0.3 },
        { type: 'highlight', target: id, hold: 1 },
        { type: 'reset', duration: 0.5 },
      ],
    };
    view.setLabels(null);
    program = { ...clone(full), actions: [] };
    setPlaying(false);
    update({ seek: true, animateFrom: 0 });
    const wait = (ms: number) => new Promise((r) => setTimeout(r, reduced ? 0 : ms));
    for (let i = 0; i < full.actions.length; i++) {
      await wait(380);
      program.actions.push(clone(full.actions[i]));
      update({ seek: true, animateFrom: i });
    }
    building = false;
    addBar.hidden = false;
    await wait(250);
    setPlaying(!reduced);
    // When the run ends, pull back to the idea itself.
    const end = edit && edit.matches.length ? edit.steps.filter((s) => s.matchId === edit!.matches[0].event.id).reduce((m, s) => Math.max(m, s.t1), 0) : 0;
    if (end && !reduced) {
      const watch = onFrame(() => {
        if (t >= end + 0.15) {
          revealTitle.classList.add('is-on');
          setTimeout(() => revealTitle.classList.remove('is-on'), 2200);
          return false;
        }
        return !!program;
      });
      setTimeout(() => watch(), 9000);
    }
  }

  root.querySelectorAll<HTMLButtonElement>('[data-pick]').forEach((b) => {
    b.addEventListener('click', () => pick(b.dataset.pick!));
    b.addEventListener('pointerenter', () => view.setLabels([b.dataset.pick!], 0));
    b.addEventListener('pointerleave', () => view.setLabels(null));
  });
  q<HTMLSelectElement>('[data-empty-select]').addEventListener('change', (e) => {
    const v = (e.target as HTMLSelectElement).value;
    if (v) pick(v);
  });

  // Editing: every control writes into the Program, then everything re-derives from it.
  stack.addEventListener('change', (e) => {
    if (!program) return;
    const el = e.target as HTMLInputElement | HTMLSelectElement;
    const block = el.closest<HTMLElement>('.pblock');
    if (!block) return;
    const idx = Number(block.dataset.index);
    const f = el.dataset.field!;
    if (idx === -1) {
      if (f === 'trigger-type') {
        const type = el.value as TriggerType;
        const opts = type === 'keyPress' ? [] : triggerTargets(type);
        const keep = opts.find((o) => o.value === program!.trigger.target);
        program.trigger = type === 'keyPress' ? { type, key: 'Return' } : { type, target: keep?.value ?? opts[0]?.value ?? ANY_ELEMENT };
      } else if (f === 'trigger-target') program.trigger.target = el.value;
      else if (f === 'trigger-key') program.trigger.key = el.value;
    } else {
      const a = program.actions[idx];
      if (f === 'type') {
        const next = clone(DEFAULTS[el.value as ActionType]) as Action;
        if ('target' in next && 'target' in a) (next as { target: string }).target = a.target;
        program.actions[idx] = next;
      } else if (f === 'target') (a as { target: string }).target = el.value;
      else {
        const v = Math.max(0, Math.min(3, parseFloat(el.value) || 0));
        (a as Record<string, unknown>)[f] = Math.round(v * 100) / 100;
      }
    }
    track('program_block_modified', { field: f });
    update({ rebuild: f === 'type' || f === 'trigger-type' });
    if (f === 'type' || f === 'trigger-type') {
      stack.querySelector<HTMLElement>(`.pblock[data-index="${idx}"] [data-field="${f}"]`)?.focus();
    }
  });
  stack.addEventListener('click', (e) => {
    if (!program) return;
    const btn = (e.target as Element).closest<HTMLButtonElement>('.pb-tool');
    if (!btn) return;
    const idx = Number(btn.closest<HTMLElement>('.pblock')!.dataset.index);
    if (btn.dataset.move) {
      const to = idx + Number(btn.dataset.move);
      const [a] = program.actions.splice(idx, 1);
      program.actions.splice(to, 0, a);
      track('program_block_modified', { field: 'move' });
      update();
      stack.querySelector<HTMLElement>(`.pblock[data-index="${to}"] [data-move="${btn.dataset.move}"]:not(:disabled)`)?.focus();
    } else if ('remove' in btn.dataset) {
      program.actions.splice(idx, 1);
      track('program_block_modified', { field: 'remove' });
      update();
    }
  });
  addBar.addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLButtonElement>('[data-add-type]');
    if (!b || !program) return;
    const a = clone(DEFAULTS[b.dataset.addType as ActionType]) as Action;
    if ('target' in a && program.trigger.target && ![ANY_BUTTON, ANY_ELEMENT].includes(program.trigger.target)) {
      (a as { target: string }).target = program.trigger.target;
    }
    program.actions.push(a);
    track('program_block_modified', { field: 'add', type: a.type });
    update({ animateFrom: program.actions.length - 1 });
  });
  q('[data-reset-program]').addEventListener('click', () => {
    program = null;
    edit = null;
    building = false;
    stack.innerHTML = '';
    addBar.hidden = true;
    timeline.setEdit(null);
    report.textContent = 'Pick a target to start.';
    json.textContent = '';
    root.classList.remove('has-program');
    root.classList.add('is-picking');
    t = 0.2;
    setPlaying(!reduced);
    draw();
  });

  // Transport.
  playBtn.addEventListener('click', () => setPlaying(!playing));
  scrub.addEventListener('input', () => {
    t = parseFloat(scrub.value);
    setPlaying(false);
    draw();
  });

  let stop: (() => void) | null = null;
  const tick = (dt: number) => {
    if (playing) {
      t = (t + dt) % DURATION;
      draw();
    }
    return true;
  };
  draw();
  whenVisible(
    root,
    () => (stop ??= onFrame(tick)),
    () => {
      stop?.();
      stop = null;
    },
  );
  (root as HTMLElement & { __pick?: (id: string) => void }).__pick = pick;
}
