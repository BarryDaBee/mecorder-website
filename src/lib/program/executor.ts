/**
 * Matcher + executor + compiler, mirroring MeCorder's pipeline:
 *
 *   recording events ──match──▶ matches ──execute──▶ timed steps ──compile──▶ camera keyframes + effects
 *
 * Timing follows the app's ProgramSequence: every action starts when the one
 * before it finishes, in recording time; a camera move occupies its duration;
 * Wait adds time; Highlight holds; Click Ripple is timed to the click. The
 * renderer only ever sees keyframes and effects, as in the app.
 */
import { EVENTS, TARGETS, SCREEN, type RecordingEvent } from './recording';
import { type Program, type Action, type TargetRef, ANY_BUTTON, ANY_ELEMENT, TRIGGER_TARGET, FOCUS_ZOOM } from './model';

export interface Camera {
  x: number;
  y: number;
  zoom: number;
}
export const BASE_CAMERA: Camera = { x: SCREEN.w / 2, y: SCREEN.h / 2, zoom: 1 };

export interface CameraKey extends Camera {
  t: number;
}

export type Effect =
  | { type: 'highlight'; t0: number; t1: number; target: string; programId: string }
  | { type: 'ripple'; t0: number; t1: number; x: number; y: number; programId: string };

export interface Step {
  programId: string;
  matchId: string;
  /** Index into program.actions, or -1 for the trigger. */
  action: number;
  t0: number;
  t1: number;
}

export interface Match {
  programId: string;
  event: RecordingEvent;
}

export interface CompiledEdit {
  matches: Match[];
  steps: Step[];
  cameraKeys: CameraKey[];
  effects: Effect[];
  /** Plain sentences for skipped work, like the app's run report. */
  notes: string[];
}

function targetMatches(ref: TargetRef | undefined, ev: RecordingEvent): boolean {
  if (!ref || ref === ANY_ELEMENT) return true;
  if (!ev.target) return false;
  if (ref === ANY_BUTTON) return TARGETS[ev.target]?.role === 'button';
  return ref === ev.target;
}

export function match(program: Program, events: RecordingEvent[] = EVENTS): Match[] {
  const tr = program.trigger;
  return events
    .filter((ev) => {
      if (ev.type !== tr.type) return false;
      if (tr.type === 'keyPress') return !tr.key || tr.key === ev.key;
      // No element metadata means no match, never a guess (RecordedMetadataTargetResolver).
      if (tr.target && tr.target !== ANY_ELEMENT && !ev.target) return false;
      return targetMatches(tr.target, ev);
    })
    .map((event) => ({ programId: program.id, event }));
}

function resolve(ref: TargetRef, ev: RecordingEvent): { x: number; y: number; id?: string } | null {
  const id = ref === TRIGGER_TARGET ? ev.target : ref;
  if (!id) return ref === TRIGGER_TARGET ? { x: ev.x, y: ev.y } : null;
  const t = TARGETS[id];
  if (!t) return null;
  return { x: t.x + t.w / 2, y: t.y + t.h / 2, id };
}

/** Keep the framed area inside the recording (ShotMapper.clampedCenter). */
export function clampCamera(c: Camera): Camera {
  const hw = SCREEN.w / (2 * c.zoom);
  const hh = SCREEN.h / (2 * c.zoom);
  return {
    zoom: c.zoom,
    x: Math.min(SCREEN.w - hw, Math.max(hw, c.x)),
    y: Math.min(SCREEN.h - hh, Math.max(hh, c.y)),
  };
}

export function actionDuration(a: Action): number {
  switch (a.type) {
    case 'focus':
    case 'zoomOut':
    case 'reset':
    case 'wait':
      return a.duration;
    case 'highlight':
      return a.hold;
    case 'ripple':
      return 0;
  }
}

export function execute(programs: Program[], events: RecordingEvent[] = EVENTS): CompiledEdit {
  const out: CompiledEdit = { matches: [], steps: [], cameraKeys: [], effects: [], notes: [] };
  const all = programs.flatMap((p) => match(p, events).map((m) => ({ m, p })));
  all.sort((a, b) => a.m.event.t - b.m.event.t);

  let cam: Camera = { ...BASE_CAMERA };
  let cameraBusyUntil = -Infinity;

  for (const { m, p } of all) {
    out.matches.push(m);
    const ev = m.event;
    let t = ev.t;
    out.steps.push({ programId: p.id, matchId: ev.id, action: -1, t0: ev.t, t1: ev.t + 0.25 });

    p.actions.forEach((a, i) => {
      const d = actionDuration(a);
      const step: Step = { programId: p.id, matchId: ev.id, action: i, t0: t, t1: t + d };
      switch (a.type) {
        case 'focus':
        case 'zoomOut':
        case 'reset': {
          if (t < cameraBusyUntil - 0.001) {
            // An earlier behaviour still holds the camera: the newer one waits its turn.
            t = cameraBusyUntil;
            step.t0 = t;
            step.t1 = t + d;
          }
          let next: Camera;
          if (a.type === 'focus') {
            const r = resolve(a.target, ev);
            if (!r) {
              out.notes.push(`Focus skipped at ${ev.t.toFixed(1)} s: the target isn't in this recording.`);
              break;
            }
            next = clampCamera({ x: r.x, y: r.y, zoom: FOCUS_ZOOM });
          } else {
            next = { ...BASE_CAMERA };
          }
          out.cameraKeys.push({ t, ...cam }, { t: t + d, ...next });
          cam = next;
          cameraBusyUntil = t + d;
          break;
        }
        case 'highlight': {
          const r = resolve(a.target, ev);
          if (!r?.id) {
            out.notes.push(`Highlight skipped at ${ev.t.toFixed(1)} s: nothing named to ring.`);
            break;
          }
          out.effects.push({ type: 'highlight', t0: t, t1: t + a.hold, target: r.id, programId: p.id });
          break;
        }
        case 'ripple':
          // Timed to the click, whatever came before it in the chain.
          out.effects.push({ type: 'ripple', t0: ev.t, t1: ev.t + 0.7, x: ev.x, y: ev.y, programId: p.id });
          break;
        case 'wait':
          break;
      }
      out.steps.push(step);
      t += d;
    });
  }
  out.cameraKeys.sort((a, b) => a.t - b.t);
  return out;
}

const smoothstep = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

/** Camera at time t: interpolate the compiled keyframes (KeyframeEvaluator). */
export function cameraAt(keys: CameraKey[], t: number): Camera {
  if (!keys.length || t <= keys[0].t) return keys.length ? { x: keys[0].x, y: keys[0].y, zoom: keys[0].zoom } : { ...BASE_CAMERA };
  for (let i = 1; i < keys.length; i++) {
    const b = keys[i];
    if (t <= b.t) {
      const a = keys[i - 1];
      const k = smoothstep((t - a.t) / (b.t - a.t || 1));
      // Interpolate zoom in log space so zooming feels even, like a real lens.
      const zoom = Math.exp(Math.log(a.zoom) + (Math.log(b.zoom) - Math.log(a.zoom)) * k);
      return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, zoom };
    }
  }
  const z = keys[keys.length - 1];
  return { x: z.x, y: z.y, zoom: z.zoom };
}

/** Which blocks are playing at time t (the app lights them up). */
export function activeSteps(edit: CompiledEdit, t: number): Step[] {
  return edit.steps.filter((s) => t >= s.t0 && t < Math.max(s.t1, s.t0 + 0.18));
}
