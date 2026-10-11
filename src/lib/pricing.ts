/**
 * Plans and prices, in one place. Prices are proposals until Barry confirms
 * them; buying isn't wired up yet, so every plan button starts the trial.
 * The trial length matches the app (Licensing/License.swift: trialDays = 14).
 */
export const TRIAL_DAYS = 14;

/** Monthly gets $1 cheaper each month you stay, down to a floor; cancelling resets it. */
export const MONTHLY_LADDER = { start: 9, step: 1, floor: 3 };
export const monthlyPrice = (month: number) =>
  Math.max(MONTHLY_LADDER.floor, MONTHLY_LADDER.start - (month - 1) * MONTHLY_LADDER.step);
/** Months 1… until the floor is reached, e.g. [9, 8, 7, 6, 5, 4, 3]. */
export const LADDER = Array.from(
  { length: (MONTHLY_LADDER.start - MONTHLY_LADDER.floor) / MONTHLY_LADDER.step + 1 },
  (_, i) => monthlyPrice(i + 1),
);

export interface Plan {
  id: 'monthly' | 'lifetime';
  name: string;
  blurb: string;
  price: number;
  period: string;
  note: string;
  featured?: boolean;
  badge?: string;
}

export const PLANS: Plan[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    blurb: 'Gets cheaper the longer you stay.',
    price: 9,
    period: 'first month',
    note: '$1 less every month, down to $3. Cancelling starts it again at $9.',
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    blurb: 'Pay once, keep it.',
    price: 149,
    period: 'one-off',
    note: 'A licence that never expires.',
    featured: true,
    badge: 'Pay once',
  },
];

export const INCLUDED = [
  'Recording, editing and export, with nothing locked',
  'Programs, Behaviours, scenes and the Ask box',
  'Every effect, Effect Studio and looks',
  'Captions and narration clean-up, on your Mac',
  'No watermark on exports',
  'No account, nothing uploaded',
];
