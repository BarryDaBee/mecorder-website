/**
 * A tiny deterministic keyframe timeline. A scene is described as data
 * (tracks of keyframes), and `valueAt(track, t)` evaluates it as a pure
 * function of time. The same description drives auto-play (time from the
 * clock), scroll scrubbing (time from progress) and reduced motion (time = end).
 */
import { ease, type EaseName, clamp } from './motion';

export interface Key {
  t: number;
  v: number;
  ease?: EaseName;
}
export type Track = Key[];

export function valueAt(track: Track, t: number): number {
  if (!track.length) return 0;
  if (t <= track[0].t) return track[0].v;
  for (let i = 1; i < track.length; i++) {
    const b = track[i];
    if (t <= b.t) {
      const a = track[i - 1];
      const k = clamp((t - a.t) / (b.t - a.t || 1));
      return a.v + (b.v - a.v) * ease[b.ease ?? 'inOutCubic'](k);
    }
  }
  return track[track.length - 1].v;
}

/** Shorthand: animate from `from` to `to` between t0 and t1. */
export const span = (t0: number, t1: number, from: number, to: number, e: EaseName = 'inOutCubic'): Track => [
  { t: t0, v: from },
  { t: t1, v: to, ease: e },
];

/** 0 → 1 between t0 and t1. */
export const fade = (t0: number, t1: number, e: EaseName = 'outCubic') => span(t0, t1, 0, 1, e);

/** A clock that plays a scene once (or loops), with pause/seek; respects visibility. */
export class SceneClock {
  time = 0;
  playing = false;
  constructor(public duration: number, public loop = false) {}
  advance(dt: number) {
    if (!this.playing) return this.time;
    this.time += dt;
    if (this.time >= this.duration) {
      if (this.loop) this.time %= this.duration;
      else {
        this.time = this.duration;
        this.playing = false;
      }
    }
    return this.time;
  }
}
