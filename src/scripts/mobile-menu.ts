/**
 * Compact-header menu (900px and below): the ☰ button in Header.astro opens and closes the
 * panel with the navigation and social links.
 *
 * Opening moves focus to the first link. Closes on: the button again, Escape
 * (focus returns to the button), a tap outside the header, or the window
 * growing past the breakpoint.
 * State lives in `data-menu-open` on the header; the CSS does the rest.
 */

const MOBILE = window.matchMedia('(max-width: 900px)');

const header = document.querySelector<HTMLElement>('[data-site-header]');
const button = header?.querySelector<HTMLButtonElement>('[data-menu-toggle]');

if (header && button) {
  const icons = button.querySelectorAll<HTMLElement>('[data-menu-icon]');

  const setOpen = (open: boolean) => {
    header.toggleAttribute('data-menu-open', open);
    button.setAttribute('aria-expanded', String(open));
    icons.forEach((el) => {
      el.hidden = el.dataset.menuIcon !== (open ? 'close' : 'open');
    });
  };
  const isOpen = () => header.hasAttribute('data-menu-open');

  button.addEventListener('click', () => {
    const open = !isOpen();
    setOpen(open);
    // The panel comes before the button in the HTML (so desktop keeps its order),
    // so move focus into it; otherwise Tab would skip past the links.
    if (open) header.querySelector<HTMLElement>('#site-menu a')?.focus();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      setOpen(false);
      button.focus();
    }
  });

  document.addEventListener('click', (e) => {
    if (isOpen() && !header.contains(e.target as Node)) setOpen(false);
  });

  MOBILE.addEventListener('change', () => {
    if (!MOBILE.matches) setOpen(false);
  });

  // Opening the ⌘K search from the bar closes the menu first.
  header.querySelector('[data-open-search]')?.addEventListener('click', () => setOpen(false));
}
