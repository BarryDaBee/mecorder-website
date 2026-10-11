/**
 * Plans and prices, in one place. Prices are proposals until Barry confirms
 * them; buying isn't wired up yet, so every plan button starts the trial.
 * The trial length matches the app (Licensing/License.swift: trialDays = 14).
 */
export const TRIAL_DAYS = 14;

export interface Plan {
  id: 'monthly' | 'yearly' | 'lifetime';
  name: string;
  blurb: string;
  price: number;
  period: string;
  note: string;
  featured?: boolean;
  badge?: string;
}

export const PLANS: Plan[] = [
  { id: 'monthly', name: 'Monthly', blurb: 'For a project or two.', price: 9, period: 'per month', note: 'Cancel any time.' },
  {
    id: 'yearly',
    name: 'Yearly',
    blurb: 'For regular recording.',
    price: 79,
    period: 'per year',
    note: 'About $6.58 a month, saving 27%.',
    featured: true,
    badge: 'Best value',
  },
  { id: 'lifetime', name: 'Lifetime', blurb: 'Pay once, keep it.', price: 149, period: 'one-off', note: 'A licence that never expires.' },
];

export const INCLUDED = [
  'Recording, editing and export, with nothing locked',
  'Programs, Behaviours, scenes and the Ask box',
  'Every effect, Effect Studio and looks',
  'Captions and narration clean-up, on your Mac',
  'No watermark on exports',
  'No account, nothing uploaded',
];
