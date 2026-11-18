/**
 * Language switch (components/layout/LangSwitch.astro).
 * The links already point to the same page in the other language;
 * this only carries the #hash over, e.g. /about#contact → /en/about#contact.
 */
document.querySelectorAll<HTMLAnchorElement>('[data-lang-link]').forEach((a) => {
  a.addEventListener('click', () => {
    if (location.hash) a.hash = location.hash;
  });
});
