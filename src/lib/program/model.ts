/**
 * The website's Program model: a small, faithful subset of MeCorder's
 * (`Program`, `ProgramTrigger`, `ProgramAction` in MeCorderCore). It's plain
 * data, so the block editor edits it, the executor interprets it, and the
 * demo renders whatever the executor produces. Nothing here is a canned
 * animation per interaction.
 */

export type TriggerType = 'click' | 'hover' | 'textInput' | 'keyPress';

/** A target is a semantic element id, "trigger" (whatever the event hit), or a wildcard. */
export type TargetRef = string;
export const ANY_BUTTON = 'any-button';
export const ANY_ELEMENT = 'any';
export const TRIGGER_TARGET = 'trigger';

export interface Trigger {
  type: TriggerType;
  target?: TargetRef;
  key?: string;
}

/**
 * Mirrors the app's palette (ProgramBlocks.swift): Focus [target] with a move
 * time (the zoom is the project's usual focus zoom), Wait, Highlight [target]
 * with a hold, Reset, Zoom Out, and Play [effect] for library effects.
 */
export type Action =
  | { type: 'focus'; target: TargetRef; duration: number }
  | { type: 'zoomOut'; duration: number }
  | { type: 'highlight'; target: TargetRef; hold: number }
  | { type: 'ripple' }
  | { type: 'wait'; duration: number }
  | { type: 'reset'; duration: number };

/** The project's usual focus zoom (Camera settings); Focus blocks use it. */
export const FOCUS_ZOOM = 1.8;

export type ActionType = Action['type'];

export interface Program {
  id: string;
  name: string;
  trigger: Trigger;
  actions: Action[];
}

export const DEFAULTS: { [K in ActionType]: Extract<Action, { type: K }> } = {
  focus: { type: 'focus', target: TRIGGER_TARGET, duration: 0.4 },
  zoomOut: { type: 'zoomOut', duration: 0.4 },
  highlight: { type: 'highlight', target: TRIGGER_TARGET, hold: 0.6 },
  ripple: { type: 'ripple' },
  wait: { type: 'wait', duration: 0.3 },
  reset: { type: 'reset', duration: 0.4 },
};

export const ACTION_INFO: Record<ActionType, { title: string; category: 'camera' | 'effects' | 'control' }> = {
  focus: { title: 'Focus', category: 'camera' },
  zoomOut: { title: 'Zoom Out', category: 'camera' },
  reset: { title: 'Reset', category: 'camera' },
  highlight: { title: 'Highlight', category: 'effects' },
  ripple: { title: 'Play Click Ripple', category: 'effects' },
  wait: { title: 'Wait', category: 'control' },
};

export const TRIGGER_INFO: Record<TriggerType, string> = {
  click: 'Click',
  hover: 'Hover',
  textInput: 'Text Input',
  keyPress: 'Key Press',
};

/** The Program from the brief and from slice 2 of the app. */
export const PRIMARY_BUTTON_PROGRAM: Program = {
  id: 'primary-button',
  name: 'Emphasise Create Project',
  trigger: { type: 'click', target: 'create-project' },
  actions: [
    { type: 'focus', target: 'create-project', duration: 0.5 },
    { type: 'wait', duration: 0.3 },
    { type: 'highlight', target: 'create-project', hold: 1.0 },
    { type: 'reset', duration: 0.6 },
  ],
};

/** "Every click": what the automatic polish looks like as a Program. */
export const EVERY_CLICK_PROGRAM: Program = {
  id: 'every-click',
  name: 'Every click',
  trigger: { type: 'click', target: ANY_ELEMENT },
  actions: [
    { type: 'focus', target: TRIGGER_TARGET, duration: 0.45 },
    { type: 'ripple' },
    { type: 'wait', duration: 0.5 },
    { type: 'reset', duration: 0.5 },
  ],
};

export const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));
