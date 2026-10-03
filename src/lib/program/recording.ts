/**
 * The demo recording: a short, scripted session in a fictional project app
 * ("Orbit"), described the way MeCorder stores a recording. The screen is a
 * fixed 960×600 canvas; the cursor track and the recorded events live beside
 * the pixels, and every event carries the element it happened on (role +
 * label, read through accessibility), never just a coordinate.
 *
 * MockApp.astro draws the screen from `TARGETS`, so the geometry used by the
 * program executor and the pixels on screen come from one source.
 */

export const SCREEN = { w: 960, h: 600 } as const;

export type Role = 'button' | 'textField' | 'navigation' | 'link' | 'group';

export interface Target {
  id: string;
  /** What accessibility reports, e.g. "Create Project". */
  label: string;
  role: Role;
  /** What the website shows as the semantic name. */
  name: string;
  /** Frame in screen pixels. */
  x: number;
  y: number;
  w: number;
  h: number;
  primary?: boolean;
}

export const TARGETS: Record<string, Target> = {
  navigation: { id: 'navigation', label: 'Sidebar', role: 'navigation', name: 'Navigation', x: 12, y: 70, w: 176, h: 160 },
  'nav-team': { id: 'nav-team', label: 'Team', role: 'link', name: 'Team', x: 20, y: 152, w: 160, h: 32 },
  search: { id: 'search', label: 'Search', role: 'textField', name: 'Search', x: 232, y: 22, w: 360, h: 40 },
  'create-project': {
    id: 'create-project',
    label: 'Create Project',
    role: 'button',
    name: 'Create Project',
    x: 786,
    y: 22,
    w: 154,
    h: 40,
    primary: true,
  },
  'card-q3': { id: 'card-q3', label: 'Q3 Launch', role: 'group', name: 'Q3 Launch', x: 232, y: 150, w: 220, h: 150 },
  settings: { id: 'settings', label: 'Settings', role: 'button', name: 'Settings', x: 20, y: 544, w: 36, h: 36 },
};

export const ROLE_LABEL: Record<Role, string> = {
  button: 'Button',
  textField: 'Text field',
  navigation: 'Navigation',
  link: 'Link',
  group: 'Group',
};

export type EventType = 'click' | 'hover' | 'textInput' | 'keyPress';

export interface RecordingEvent {
  id: string;
  t: number;
  type: EventType;
  target?: string;
  x: number;
  y: number;
  key?: string;
  text?: string;
}

const c = (id: string) => {
  const t = TARGETS[id];
  return { x: Math.round(t.x + t.w / 2), y: Math.round(t.y + t.h / 2) };
};

/** Cursor keyframes: where the pointer is at each moment (eased between). */
export interface CursorKey {
  t: number;
  x: number;
  y: number;
}

const START = { x: 610, y: 430 };
export const DURATION = 11;

export const CURSOR: CursorKey[] = [
  { t: 0, ...START },
  { t: 0.3, ...START },
  { t: 1.35, ...c('search') },
  { t: 2.75, ...c('search') },
  { t: 3.95, ...c('create-project') },
  { t: 4.75, ...c('create-project') },
  { t: 5.95, ...c('nav-team') },
  { t: 6.55, ...c('nav-team') },
  { t: 7.6, x: 330, y: 214 },
  { t: 8.25, x: 330, y: 214 },
  { t: 9.35, ...c('settings') },
  { t: 9.9, ...c('settings') },
  { t: 10.85, ...START },
  { t: DURATION, ...START },
];

export const EVENTS: RecordingEvent[] = [
  { id: 'e1', t: 1.45, type: 'hover', target: 'search', ...c('search') },
  { id: 'e2', t: 1.55, type: 'click', target: 'search', ...c('search') },
  { id: 'e3', t: 1.75, type: 'textInput', target: 'search', ...c('search'), text: 'launch' },
  { id: 'e4', t: 2.65, type: 'keyPress', ...c('search'), key: 'Return' },
  { id: 'e5', t: 4.1, type: 'hover', target: 'create-project', ...c('create-project') },
  { id: 'e6', t: 4.3, type: 'click', target: 'create-project', ...c('create-project') },
  { id: 'e7', t: 6.1, type: 'hover', target: 'nav-team', ...c('nav-team') },
  { id: 'e8', t: 6.25, type: 'click', target: 'nav-team', ...c('nav-team') },
  { id: 'e9', t: 7.85, type: 'hover', target: 'card-q3', x: 330, y: 214 },
  { id: 'e10', t: 9.6, type: 'click', target: 'settings', ...c('settings') },
];

const smooth = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

export function cursorAt(t: number): { x: number; y: number } {
  const keys = CURSOR;
  if (t <= keys[0].t) return { x: keys[0].x, y: keys[0].y };
  for (let i = 1; i < keys.length; i++) {
    const b = keys[i];
    if (t <= b.t) {
      const a = keys[i - 1];
      const k = smooth((t - a.t) / (b.t - a.t || 1));
      // A slight arc, like a real hand, so paths never look robotic.
      const arc = Math.sin(k * Math.PI) * Math.min(40, Math.hypot(b.x - a.x, b.y - a.y) * 0.08);
      return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k - arc };
    }
  }
  const z = keys[keys.length - 1];
  return { x: z.x, y: z.y };
}

/** What the recorded app itself shows at time t (the pixels, not the edit). */
export function appStateAt(t: number) {
  const typed = 'launch';
  const typeStart = 1.75;
  const chars = t < typeStart ? 0 : Math.min(typed.length, Math.floor((t - typeStart) / 0.13) + 1);
  return {
    searchText: t > 10.6 ? '' : typed.slice(0, chars),
    searchFocused: t >= 1.55 && t < 4.3,
    newCard: t >= 4.42 && t < 10.6,
    activeNav: t >= 6.25 && t < 10.6 ? 'team' : 'projects',
    pressed: EVENTS.find((e) => e.type === 'click' && t >= e.t && t < e.t + 0.16)?.target ?? null,
    hovered: [...EVENTS].reverse().find((e) => e.type === 'hover' && t >= e.t && t < e.t + 0.9)?.target ?? null,
  };
}

export const describeTarget = (id: string) => {
  const t = TARGETS[id];
  return t ? `${ROLE_LABEL[t.role]} · ${t.label}` : id;
};
