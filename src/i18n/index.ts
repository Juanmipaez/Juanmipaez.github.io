// Languages: Spanish is the default and lives at the root (/projects),
// English lives under /en (/en/projects). URLs are the same in both languages;
// only the visible text changes.
//
// Pages live in src/pages/[...lang]/ and call `langPaths()` so one file builds
// both versions. UI strings are in ./ui.ts.

export const languages = ['es', 'en'] as const;
export type Lang = (typeof languages)[number];
export const defaultLang: Lang = 'es';

/** The `[...lang]` route param: undefined for Spanish (root), 'en' for English. */
export function langFromParam(param: string | undefined): Lang {
  return param === 'en' ? 'en' : 'es';
}

/** getStaticPaths entries for the `[...lang]` segment. */
export function langPaths() {
  return languages.map((l) => ({ params: { lang: l === defaultLang ? undefined : l } }));
}

/** Detects the language from a URL path, e.g. "/en/projects" -> "en". */
export function langFromPath(pathname: string): Lang {
  return /^\/en(\/|$)/.test(pathname) ? 'en' : 'es';
}

/** Builds a link in the given language: href('en', '/projects') -> '/en/projects'. */
export function href(lang: Lang, path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  if (lang === defaultLang) return p;
  return p === '/' ? `/${lang}` : `/${lang}${p}`;
}

/** Removes the language prefix: '/en/projects' -> '/projects'. */
export function stripLang(pathname: string): string {
  const rest = pathname.replace(/^\/en(?=\/|$)/, '');
  return rest === '' ? '/' : rest;
}

/** The same page in the other language. */
export function alternate(pathname: string, to: Lang): string {
  return href(to, stripLang(pathname));
}

export { ui, useT } from './ui';
