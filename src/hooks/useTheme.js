import { useCallback, useSyncExternalStore } from 'react';

/* One theme shared by every component — each toggle reads and writes the same value */
const listeners = new Set();

function getInitialTheme() {
  const saved = localStorage.getItem('cg-theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('cg-theme', theme);
  // Update meta theme-color
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', theme === 'dark' ? '#0D0D0D' : '#F7F6F2');
  }
}

let currentTheme = getInitialTheme();
applyTheme(currentTheme);

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return currentTheme;
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot);

  const toggleTheme = useCallback(() => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
    listeners.forEach(listener => listener());
  }, []);

  return { theme, toggleTheme, isDark: theme === 'dark' };
}
