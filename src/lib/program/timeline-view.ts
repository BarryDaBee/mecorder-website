/**
 * A miniature of the app's Timeline: Clicks, Camera and Effects tracks drawn
 * from the recording and the compiled edit, with a playhead. It shows what a
 * Program compiles to: ordinary camera moves and effects you could still edit.
 */
import { EVENTS, DURATION, TARGETS } from './recording';
import type { CompiledEdit } from './executor';
import { targetName } from './blocks';

export interface MiniTimelineOptions {
  duration?: number;
  tracks?: ('clicks' | 'camera' | 'effects')[];
}

export class MiniTimeline {
  private playhead: HTMLElement;
  private camTrack: HTMLElement | null;
  private fxTrack: HTMLElement | null;
  private duration: number;

  constructor(private root: HTMLElement, opts: MiniTimelineOptions = {}) {
    this.duration = opts.duration ?? DURATION;
    const tracks = opts.tracks ?? ['clicks', 'camera', 'effects'];
    const pct = (t: number) => `${((t / this.duration) * 100).toFixed(3)}%`;
    const rows = tracks
      .map((k) => {
        const label = { clicks: 'Clicks', camera: 'Camera', effects: 'Effects' }[k];
        let lane = '';
        if (k === 'clicks') {
          lane = EVENTS.filter((e) => e.type === 'click')
            .map((e) => `<i class="mt-dot" style="left:${pct(e.t)}" title="Click ${TARGETS[e.target!]?.label ?? ''}"></i>`)
            .join('');
        }
        return `<div class="mt-row mt-${k}"><span class="mt-label">${label}</span><div class="mt-lane" data-lane="${k}">${lane}</div></div>`;
      })
      .join('');
    root.classList.add('mini-timeline');
    root.innerHTML = `${rows}<div class="mt-playhead" aria-hidden="true"></div>`;
    this.playhead = root.querySelector('.mt-playhead')!;
    this.camTrack = root.querySelector('[data-lane="camera"]');
    this.fxTrack = root.querySelector('[data-lane="effects"]');
  }

  setEdit(edit: CompiledEdit | null) {
    const pct = (t: number) => `${((Math.max(0, Math.min(this.duration, t)) / this.duration) * 100).toFixed(3)}%`;
    if (this.camTrack) {
      const segs: string[] = [];
      const keys = edit?.cameraKeys ?? [];
      // A camera move runs from a key that leaves the full view until the camera is back at 1×.
      let start: number | null = null;
      let label = '';
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        const next = keys[i + 1];
        if (start === null && next && next.zoom > 1.001) {
          start = k.t;
          const step = edit!.steps.find((s) => Math.abs(s.t0 - k.t) < 0.01 && s.action >= 0);
          const match = edit!.matches.find((m) => m.event.id === step?.matchId);
          label = match?.event.target ? `Focus ${targetName(match.event.target)}` : 'Focus';
        }
        if (start !== null && k.zoom <= 1.001 && k.t > start) {
          segs.push(`<span class="mt-seg" style="left:${pct(start)};width:calc(${pct(k.t)} - ${pct(start)})"><em>${label}</em></span>`);
          start = null;
        }
      }
      if (start !== null) segs.push(`<span class="mt-seg open" style="left:${pct(start)};right:0"><em>${label}</em></span>`);
      this.camTrack.innerHTML = segs.join('');
    }
    if (this.fxTrack) {
      this.fxTrack.innerHTML = (edit?.effects ?? [])
        .map((e) =>
          e.type === 'highlight'
            ? `<span class="mt-fx" style="left:${pct(e.t0)};width:calc(${pct(e.t1)} - ${pct(e.t0)})"><em>Highlight</em></span>`
            : `<span class="mt-fx ripple" style="left:${pct(e.t0)};width:calc(${pct(e.t1)} - ${pct(e.t0)})"></span>`,
        )
        .join('');
    }
  }

  setTime(t: number) {
    this.playhead.style.setProperty('--x', String(Math.max(0, Math.min(1, t / this.duration))));
  }
}
