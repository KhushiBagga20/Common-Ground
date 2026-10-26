import { useSyncExternalStore } from 'react';

/* Tiny global toast store — call toast() from anywhere, <Toasts /> renders them */
const listeners = new Set();
let toasts = [];
let nextId = 1;

function emit() {
  listeners.forEach(listener => listener());
}

/**
 * Show a toast.
 * tone: 'ink' | 'yellow' | 'green' | 'pink' | 'blue' | 'red'
 */
export function toast({ title, body, tone = 'ink' }) {
  // Keep at most four on screen
  toasts = [...toasts.slice(-3), { id: nextId++, title, body, tone }];
  emit();
}

export function dismissToast(id) {
  toasts = toasts.filter(t => t.id !== id);
  emit();
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useToasts() {
  return useSyncExternalStore(subscribe, () => toasts);
}
