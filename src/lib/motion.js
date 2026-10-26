/* Shared motion helpers for the app pages */

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Centre of an element, or the point itself — for things that spring from a click */
export function originOf(target) {
  if (target && typeof target.getBoundingClientRect === 'function') {
    const r = target.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  return target;
}

/** Spread onto a motion element: fades up the first time it scrolls into view */
export const revealOnScroll = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -60px 0px' },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

/** Same, with a small stagger for items in a row or grid */
export function revealAt(index, perRow = 3) {
  return {
    ...revealOnScroll,
    transition: { ...revealOnScroll.transition, delay: (index % perRow) * 0.06 },
  };
}

/** True for dark hex colours (e.g. Chess's #111111) that need light text on top */
export function isDarkColor(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex ?? '');
  if (!m) return false;
  const n = parseInt(m[1], 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return (0.299 * r + 0.587 * g + 0.114 * b) < 90;
}
