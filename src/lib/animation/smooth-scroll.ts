/**
 * Inertial smooth scrolling (Lenis) for wheel and trackpad. It moves the real
 * document scroll, so sticky scenes, IntersectionObservers and ScrollScene keep
 * working unchanged. Off for reduced motion; touch keeps native scrolling.
 */
import Lenis from 'lenis';
import { prefersReducedMotion } from './motion';

let lenis: Lenis | null = null;

export function initSmoothScroll() {
  if (lenis || prefersReducedMotion()) return null;
  lenis = new Lenis({ lerp: 0.095, smoothWheel: true, wheelMultiplier: 0.95, autoRaf: true, anchors: { offset: -72 } });
  // Elements marked data-lenis-prevent (dialogs, docs sidebars) scroll natively.
  return lenis;
}

export const smoothScroll = () => lenis;
