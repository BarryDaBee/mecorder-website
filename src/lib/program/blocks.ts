/**
 * Renders a Program as MeCorder's visual blocks (see the app's
 * docs/DesignLanguage.md: stack blocks interlock, hats cap a chain, values sit
 * in white slots, colour is the block's category). Pure string builders, so
 * Astro can render them at build time and scripts can re-render on change.
 */
import { type Program, type Action, ACTION_INFO, TRIGGER_INFO, TRIGGER_TARGET, ANY_BUTTON, ANY_ELEMENT } from './model';
import { TARGETS } from './recording';

export type Category = 'events' | 'camera' | 'effects' | 'control' | 'variables' | 'sensing' | 'sound' | 'behaviours' | 'scene';

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

export function targetName(ref: string | undefined, triggerRef?: string): string {
  if (!ref) return 'Anything';
  if (ref === TRIGGER_TARGET) return triggerRef && triggerRef !== TRIGGER_TARGET ? targetName(triggerRef) : 'Clicked element';
  if (ref === ANY_BUTTON) return 'Any button';
  if (ref === ANY_ELEMENT) return 'Anything';
  const t = TARGETS[ref];
  return t ? (t.primary ? 'Primary Button' : t.name) : ref;
}

export const slot = (text: string, extra = '') => `<span class="pslot${extra}">${esc(text)}</span>`;

export function block(category: Category, inner: string, opts: { hat?: boolean; index?: number; attrs?: string } = {}) {
  const cls = `pblock pb-${category}${opts.hat ? ' pb-hat' : ''}`;
  const idx = opts.index !== undefined ? ` data-index="${opts.index}"` : '';
  return `<div class="${cls}"${idx}${opts.attrs ?? ''}><span class="pb-ico" aria-hidden="true"></span><span class="pb-body">${inner}</span></div>`;
}

export function triggerInner(p: Program): string {
  const tr = p.trigger;
  const word = TRIGGER_INFO[tr.type];
  if (tr.type === 'keyPress') return `<b>When</b> ${slot(word)} ${slot(tr.key ?? 'Any key')}`;
  return `<b>When</b> ${slot(word)} ${slot(targetName(tr.target))}`;
}

export function actionInner(a: Action, p?: Program): string {
  const trig = p?.trigger.target;
  switch (a.type) {
    case 'focus':
      return `<b>Focus</b> ${slot(targetName(a.target, trig))}`;
    case 'zoomOut':
      return `<b>Zoom Out</b>`;
    case 'highlight':
      return `<b>Highlight</b> ${slot(targetName(a.target, trig))}`;
    case 'ripple':
      return `<b>Play</b> ${slot('Click Ripple')}`;
    case 'wait':
      return `<b>Wait</b> ${slot(String(a.duration))} <i>seconds</i>`;
    case 'reset':
      return `<b>Reset</b> <i>camera</i>`;
  }
}

export function programHTML(p: Program): string {
  const parts = [block('events', triggerInner(p), { hat: true, index: -1 })];
  p.actions.forEach((a, i) => parts.push(block(ACTION_INFO[a.type].category, actionInner(a, p), { index: i })));
  return `<div class="pstack" role="list" aria-label="Program: ${esc(p.name)}">${parts
    .map((b) => b.replace('<div class="pblock', '<div role="listitem" class="pblock'))
    .join('')}</div>`;
}

/** Plain-text reading of a Program, for screen readers and the JSON panel. */
export function programSentence(p: Program): string {
  const tr = p.trigger;
  const when = tr.type === 'keyPress' ? `When ${tr.key ?? 'a key'} is pressed` : `When ${TRIGGER_INFO[tr.type]} on ${targetName(tr.target)}`;
  const acts = p.actions.map((a) => {
    switch (a.type) {
      case 'focus':
        return `focus ${targetName(a.target, tr.target)}`;
      case 'zoomOut':
        return 'zoom out';
      case 'highlight':
        return `highlight ${targetName(a.target, tr.target)}`;
      case 'ripple':
        return 'play Click Ripple';
      case 'wait':
        return `wait ${a.duration} s`;
      case 'reset':
        return 'reset the camera';
    }
  });
  return `${when}: ${acts.join(', then ')}.`;
}

/**
 * The docs' ```program notation → blocks. One block per line; the first word
 * picks the category; [brackets] are value slots; two-space indents nest
 * inside IF / PARALLEL, closed by END.
 */
const WORD_CATEGORY: Record<string, Category> = {
  when: 'events',
  at: 'events',
  focus: 'camera',
  zoom: 'camera',
  reset: 'camera',
  highlight: 'effects',
  ripple: 'effects',
  click: 'effects',
  wait: 'control',
  if: 'control',
  else: 'control',
  parallel: 'control',
  branch: 'control',
  end: 'control',
  repeat: 'control',
  set: 'variables',
  change: 'variables',
  play: 'sound',
  run: 'behaviours',
  define: 'behaviours',
  enter: 'scene',
  exit: 'scene',
  shot: 'scene',
};

export function notationHTML(src: string): string {
  const lines = src.replace(/\t/g, '  ').split('\n').filter((l) => l.trim());
  const out: string[] = [];
  for (const line of lines) {
    const depth = Math.floor((line.match(/^ */)?.[0].length ?? 0) / 2);
    const text = line.trim();
    const first = text.split(/\s+/)[0].toLowerCase();
    let cat = WORD_CATEGORY[first] ?? 'control';
    if (first === 'play' && !/^play\s+sound/i.test(text)) cat = 'effects';
    if (first === 'when' && /\b(starts|ends)\s*$/i.test(text)) cat = 'scene';
    const hat = first === 'when' || first === 'at' || first === 'define';
    const structural = ['else', 'end', 'branch'].includes(first);
    const inner = esc(text)
      .replace(/\[([^\]]+)\]/g, (_, v) => `<span class="pslot">${v}</span>`)
      .replace(/^(\S+)/, '<b>$1</b>');
    out.push(
      `<div role="listitem" class="pblock pb-${cat}${hat ? ' pb-hat' : ''}${structural ? ' pb-arm' : ''}" style="--depth:${depth}"><span class="pb-ico" aria-hidden="true"></span><span class="pb-body">${inner}</span></div>`,
    );
  }
  return `<div class="pstack pstack-notation" role="list">${out.join('')}</div>`;
}
