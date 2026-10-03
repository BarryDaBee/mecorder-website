/**
 * A tiny analytics seam. Pages call `track(name, props)` (or mark elements with
 * `data-track="name"`); the provider decides where events go. The default
 * provider records nothing beyond the current page and keeps no identifiers,
 * so swapping in a real, privacy-respecting provider later is one line.
 */
export type AnalyticsEvent =
  | 'landing_view'
  | 'download_click'
  | 'docs_view'
  | 'docs_search'
  | 'program_demo_interaction'
  | 'program_block_modified'
  | 'program_target_picked'
  | 'pricing_interaction'
  | 'contribution_selected'
  | 'comparison_dragged';

export interface AnalyticsProvider {
  track(event: AnalyticsEvent, props?: Record<string, string | number | boolean>): void;
}

const debugProvider: AnalyticsProvider = {
  track(event, props) {
    if (import.meta.env.DEV) console.debug('[analytics]', event, props ?? {});
  },
};

let provider: AnalyticsProvider = debugProvider;

export function setAnalyticsProvider(next: AnalyticsProvider) {
  provider = next;
}

const onceKeys = new Set<string>();

export function track(event: AnalyticsEvent, props?: Record<string, string | number | boolean>) {
  try {
    provider.track(event, props);
  } catch {
    /* analytics must never break the page */
  }
}

/** Track an event only the first time in this page view (e.g. "interacted with the demo"). */
export function trackOnce(event: AnalyticsEvent, props?: Record<string, string | number | boolean>) {
  if (onceKeys.has(event)) return;
  onceKeys.add(event);
  track(event, props);
}

/** Delegated `data-track` clicks, so markup can declare what it measures. */
export function bindDeclarativeTracking(root: Document = document) {
  root.addEventListener('click', (e) => {
    const el = (e.target as Element | null)?.closest?.('[data-track]') as HTMLElement | null;
    if (!el) return;
    const name = el.dataset.track as AnalyticsEvent;
    const props: Record<string, string> = {};
    for (const [k, v] of Object.entries(el.dataset)) {
      if (k.startsWith('track') && k !== 'track' && v) props[k.slice(5).toLowerCase()] = v;
    }
    track(name, props);
  });
}
