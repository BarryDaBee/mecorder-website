import { SITE_URL } from './site-url.mjs';

export const SITE = {
  name: 'MeCorder',
  url: SITE_URL,
  tagline: 'Program your screen videos.',
  description:
    'MeCorder is a screen recorder and video editor for Mac. Record once, then program how the video behaves: when you click a button, the camera focuses and the button lights up.',
  requirements: 'macOS 14 or later · Apple Silicon',
};

/**
 * Release infrastructure (signing, notarisation, a download host) doesn't exist
 * yet. Every download control reads this, so the real URL goes in one place.
 * `null` means "not available yet" and the UI says so instead of linking.
 */
export const DOWNLOAD = {
  url: null as string | null,
  version: null as string | null,
  fileName: 'MeCorder.dmg',
};

export const NAV = [
  { label: 'Product', href: '/#product' },
  { label: 'Program', href: '/#program' },
  { label: 'Docs', href: '/docs' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Changelog', href: '/changelog' },
];

export const FOOTER = [
  { label: 'Product', href: '/' },
  { label: 'Download', href: '/download' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Docs', href: '/docs' },
  { label: 'Changelog', href: '/changelog' },
  { label: 'About', href: '/about' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
];
