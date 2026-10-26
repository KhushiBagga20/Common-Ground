import { useSyncExternalStore } from 'react';
import { originOf, prefersReducedMotion } from './motion';

/* Channel change: switching dock pages sweeps a disc in the page's colour
   across the screen, swaps the page underneath, then lifts away. */
const listeners = new Set();
let current = null;
let nextId = 1;

function emit() {
  listeners.forEach(listener => listener());
}

/**
 * Start a channel change from `target` (element or point).
 * go() swaps the page; it runs once the screen is covered.
 */
export function changeChannel(target, { color, no, label, go }) {
  if (current) return;               // one at a time
  if (prefersReducedMotion()) {
    go();
    return;
  }
  const { x, y } = originOf(target);
  const id = nextId++;
  let swapped = false;
  const goOnce = () => {
    if (swapped) return;
    swapped = true;
    go();
  };
  current = { id, x, y, color, no, label, go: goOnce };
  emit();

  // Never strand someone on the old page if the animation stalls (e.g. a background tab)
  setTimeout(() => {
    if (current?.id !== id) return;
    goOnce();
    finishChannel();
  }, 1600);
}

export function finishChannel() {
  current = null;
  emit();
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useChannel() {
  return useSyncExternalStore(subscribe, () => current);
}
