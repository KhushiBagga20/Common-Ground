import { useSyncExternalStore } from 'react';
import { originOf, prefersReducedMotion } from './motion';

/* Confetti bursts for good moments — joining, RSVPing, posting.
   celebrate(element | {x, y}) from anywhere; <Confetti /> draws them. */
const listeners = new Set();
let bursts = [];
let nextId = 1;

const PALETTE = ['var(--yellow)', 'var(--pink)', 'var(--blue)', 'var(--green)', 'var(--orange)', 'var(--purple)'];
const SHAPES = ['dot', 'star', 'heart', 'square'];

function emit() {
  listeners.forEach(listener => listener());
}

/**
 * Burst from an element or point. Also tells the dock sunflower to do a happy spin.
 * options.count: number of pieces; options.shapes: subset of SHAPES
 */
export function celebrate(target, { count = 16, shapes = SHAPES } = {}) {
  window.dispatchEvent(new Event('cg-celebrate'));
  if (prefersReducedMotion() || !target) return;

  const { x, y } = originOf(target);
  const id = nextId++;
  const pieces = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
    const distance = 50 + Math.random() * 70;
    return {
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance - 30, // a little upward kick
      rot: (Math.random() - 0.5) * 540,
      size: 7 + Math.random() * 7,
      color: PALETTE[i % PALETTE.length],
      shape: shapes[i % shapes.length],
      delay: Math.random() * 60,
    };
  });

  bursts = [...bursts, { id, x, y, pieces }];
  emit();
  setTimeout(() => {
    bursts = bursts.filter(b => b.id !== id);
    emit();
  }, 1200);
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useBursts() {
  return useSyncExternalStore(subscribe, () => bursts);
}
