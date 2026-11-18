/**
 * Theme toggle (paper ↔ terminal), wired to the button in Header.astro.
 *
 * The initial theme is applied before first paint by a tiny inline script in
 * layouts/Base.astro (it has to stay inline, or the page would flash).
 * This file only handles clicks, keeps the icon in sync, saves the choice,
 * and fires a `themechange` event so the hero canvas can re-read its colors.
 */

type Theme = 'paper' | 'terminal';

const root = document.documentElement;

function currentTheme(): Theme {
  return root.dataset.theme === 'terminal' ? 'terminal' : 'paper';
}

/** Shows the icon of the theme you would switch TO. */
function syncIcons() {
  const t = currentTheme();
  document.querySelectorAll<HTMLElement>('[data-theme-icon]').forEach((el) => {
    el.hidden = el.dataset.themeIcon === t;
  });
}

function toggleTheme() {
  const next: Theme = currentTheme() === 'terminal' ? 'paper' : 'terminal';
  root.dataset.theme = next;
  try {
    localStorage.setItem('theme', next);
  } catch {
    // storage blocked (private mode): the theme still changes for this page
  }
  syncIcons();
  window.dispatchEvent(new CustomEvent('themechange', { detail: next }));
}

syncIcons();
document.querySelector('[data-theme-toggle]')?.addEventListener('click', toggleTheme);
