export type ThemeChoice = 'auto' | 'light' | 'dark';

const STORAGE_KEY = 'biatlon-theme';
const THEME_COLORS = { light: '#f5f5f7', dark: '#000000' };

export function getThemeChoice(): ThemeChoice {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : 'auto';
  } catch {
    return 'auto';
  }
}

function resolvedTheme(choice: ThemeChoice): 'light' | 'dark' {
  if (choice !== 'auto') return choice;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Applies the choice to <html data-theme> and the status-bar colour. `auto` follows the system. */
export function applyTheme(choice: ThemeChoice): void {
  const root = document.documentElement;
  if (choice === 'auto') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', choice);
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', THEME_COLORS[resolvedTheme(choice)]);
}

export function setThemeChoice(choice: ThemeChoice): void {
  try {
    if (choice === 'auto') localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // Storage unavailable (private mode): the choice still applies for this session.
  }
  applyTheme(choice);
}

/** Keeps the status-bar colour in sync when the system theme changes while on `auto`. */
export function watchSystemTheme(): void {
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => applyTheme(getThemeChoice()));
}
