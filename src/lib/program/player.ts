/**
 * RecordingView: draws the demo recording at a time t, optionally through a
 * compiled edit (camera keyframes + effects). It is a pure render: the same
 * (t, edit) always gives the same picture, so it can be driven by a clock,
 * by scroll progress or by a scrubber.
 */
import { SCREEN, TARGETS, cursorAt, appStateAt, EVENTS } from './recording';
import { type Camera, type CompiledEdit, BASE_CAMERA, cameraAt } from './executor';
import { clamp } from '../animation/motion';

export interface RenderOptions {
  t: number;
  edit?: CompiledEdit | null;
  /** Override the camera (e.g. a choreographed dolly). */
  camera?: Camera;
  /** Polished cursor: larger, with a press squeeze. */
  polished?: boolean;
  /** Show a neutral click marker (what a raw recording shows). */
  rawClicks?: boolean;
  cursorVisible?: boolean;
}

export class RecordingView {
  readonly root: HTMLElement;
  private fit: HTMLElement;
  private cam: HTMLElement;
  private cursor: HTMLElement;
  private searchText: HTMLElement | null;
  private searchPh: HTMLElement | null;
  private newCard: HTMLElement | null;
  private navItems: HTMLElement[];
  private els: Map<string, HTMLElement>;
  private hl: HTMLElement | null;
  private ripples: HTMLElement[];
  private clickDot: HTMLElement | null;
  private labels: Map<string, HTMLElement>;
  private ro: ResizeObserver;
  private last = { cam: '', cursor: '', state: '' };
  scale = 1;

  constructor(root: HTMLElement) {
    this.root = root;
    const q = <T extends HTMLElement>(s: string) => root.querySelector<T>(s);
    this.fit = q('[data-fit]')!;
    this.cam = q('[data-cam]')!;
    this.cursor = q('[data-cursor]')!;
    this.searchText = q('[data-search-text]');
    this.searchPh = q('[data-search-ph]');
    this.newCard = q('[data-new-card]');
    this.navItems = [...root.querySelectorAll<HTMLElement>('[data-nav-item]')];
    this.els = new Map([...root.querySelectorAll<HTMLElement>('[data-el]')].map((e) => [e.dataset.el!, e]));
    this.hl = q('[data-highlight]');
    this.ripples = [...root.querySelectorAll<HTMLElement>('[data-ripple]')];
    this.clickDot = q('[data-click-dot]');
    this.labels = new Map([...root.querySelectorAll<HTMLElement>('[data-label]')].map((e) => [e.dataset.label!, e]));

    const applyFit = () => {
      const w = root.clientWidth;
      if (!w) return;
      this.scale = w / SCREEN.w;
      root.style.setProperty('--fit', String(this.scale));
      root.classList.add('is-fitted');
    };
    this.ro = new ResizeObserver(applyFit);
    this.ro.observe(root);
    applyFit();
  }

  destroy() {
    this.ro.disconnect();
  }

  /** Show semantic labels for these target ids (staggered by order). */
  setLabels(ids: string[] | null, stagger = 90) {
    this.labels.forEach((el, id) => {
      const i = ids ? ids.indexOf(id) : -1;
      el.style.setProperty('--d', String(Math.max(0, i) * stagger));
      el.classList.toggle('is-on', i >= 0);
    });
  }

  /** Convert a screen-space point into viewport pixels (for overlays outside the camera). */
  toViewport(x: number, y: number, cam: Camera = BASE_CAMERA) {
    const z = cam.zoom;
    const vx = (SCREEN.w / 2 + (x - cam.x) * z) * this.scale;
    const vy = (SCREEN.h / 2 + (y - cam.y) * z) * this.scale;
    return { x: vx, y: vy };
  }

  render(o: RenderOptions) {
    const t = o.t;
    // Camera.
    const cam = o.camera ?? (o.edit ? cameraAt(o.edit.cameraKeys, t) : BASE_CAMERA);
    const tx = SCREEN.w / 2 - cam.x * cam.zoom;
    const ty = SCREEN.h / 2 - cam.y * cam.zoom;
    const camStr = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${cam.zoom.toFixed(4)})`;
    if (camStr !== this.last.cam) {
      this.cam.style.transform = camStr;
      this.last.cam = camStr;
    }

    // Cursor.
    const p = cursorAt(t);
    const pressed = EVENTS.some((e) => e.type === 'click' && t >= e.t && t < e.t + 0.18);
    const s = (o.polished ? 1.45 : 1) * (pressed && o.polished ? 0.82 : 1);
    const curStr = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0) scale(${s})`;
    if (curStr !== this.last.cursor) {
      this.cursor.style.transform = curStr;
      this.last.cursor = curStr;
    }
    this.cursor.style.opacity = o.cursorVisible === false ? '0' : '1';

    // The recorded app's own state.
    const st = appStateAt(t);
    const key = JSON.stringify(st);
    if (key !== this.last.state) {
      this.last.state = key;
      if (this.searchText) this.searchText.textContent = st.searchText;
      this.searchPh?.classList.toggle('is-hidden', !!st.searchText);
      this.els.get('search')?.classList.toggle('is-focused', st.searchFocused);
      this.newCard?.classList.toggle('is-shown', st.newCard);
      this.navItems.forEach((n) => n.classList.toggle('is-active', n.dataset.navItem === st.activeNav));
      this.els.forEach((el, id) => {
        el.classList.toggle('is-pressed', st.pressed === id);
        el.classList.toggle('is-hover', st.hovered === id);
      });
    }

    // Effects from the edit.
    const fx = o.edit?.effects ?? [];
    const hl = fx.find((e) => e.type === 'highlight' && t >= e.t0 - 0.05 && t < e.t1 + 0.25);
    if (this.hl) {
      if (hl && hl.type === 'highlight') {
        const r = TARGETS[hl.target];
        const pad = 8;
        const inK = clamp((t - hl.t0) / 0.18);
        const outK = clamp((hl.t1 + 0.25 - t) / 0.25);
        const pulse = 1 + Math.sin((t - hl.t0) * 7) * 0.012;
        Object.assign(this.hl.style, {
          left: `${r.x - pad}px`,
          top: `${r.y - pad}px`,
          width: `${r.w + pad * 2}px`,
          height: `${r.h + pad * 2}px`,
          opacity: String(Math.min(inK, outK)),
          transform: `scale(${(1.12 - 0.12 * inK) * pulse})`,
        });
      } else this.hl.style.opacity = '0';
    }
    const rips = fx.filter((e) => e.type === 'ripple' && t >= e.t0 && t < e.t1);
    this.ripples.forEach((el, i) => {
      const r = rips[i];
      if (r && r.type === 'ripple') {
        const k = (t - r.t0) / (r.t1 - r.t0);
        el.style.left = `${r.x}px`;
        el.style.top = `${r.y}px`;
        el.style.opacity = String((1 - k) * 0.95);
        el.style.transform = `scale(${0.2 + k * 0.9})`;
      } else el.style.opacity = '0';
    });
    if (this.clickDot) {
      const c = o.rawClicks ? EVENTS.find((e) => e.type === 'click' && t >= e.t && t < e.t + 0.3) : undefined;
      if (c) {
        const k = (t - c.t) / 0.3;
        this.clickDot.style.left = `${c.x}px`;
        this.clickDot.style.top = `${c.y}px`;
        this.clickDot.style.opacity = String(1 - k);
      } else this.clickDot.style.opacity = '0';
    }
    return cam;
  }
}
