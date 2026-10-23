import { useSyncExternalStore, useCallback } from 'react';

// The data-theme attribute on <html> is the single source of truth.
// An inline script in index.html sets it before first paint (no light flash),
// and every useTheme() caller subscribes to the same store so they stay in sync.
const STORAGE_KEY = 'cg-theme';
const THEME_COLORS = { light: '#F7F6F2', dark: '#0D0D0D' };
const listeners = new Set();

function getTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme]);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage unavailable (private mode) — theme still applies for this session
  }
  listeners.forEach(listener => listener());
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme);

  const toggleTheme = useCallback(() => {
    applyTheme(getTheme() === 'light' ? 'dark' : 'light');
  }, []);

  return { theme, toggleTheme, isDark: theme === 'dark' };
}
