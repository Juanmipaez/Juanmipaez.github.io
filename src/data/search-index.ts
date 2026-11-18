// Builds the ⌘K search index at build time, in one language.
// Search.astro writes it into the page as JSON; scripts/search.ts reads it.
import { getNotes, getProjects, getSubjects, noteSlug, noteText, projectText, subjectText } from './content';
import { href, useT, type Lang } from '../i18n';

export type SearchItem = { title: string; meta: string; href: string; kind: string };

export async function buildSearchIndex(lang: Lang): Promise<SearchItem[]> {
  const t = useT(lang);

  const pages: SearchItem[] = [
    { title: t('nav.projects'), meta: t('search.projectsMeta'), href: href(lang, '/projects'), kind: t('kind.page') },
    { title: t('nav.library'), meta: t('search.libraryMeta'), href: href(lang, '/library'), kind: t('kind.page') },
    { title: t('nav.about'), meta: t('search.aboutMeta'), href: href(lang, '/about'), kind: t('kind.page') },
  ];

  const projects: SearchItem[] = await Promise.all(
    (await getProjects()).map(async (p) => {
      const { title, summary } = await projectText(p, lang);
      return {
        title,
        meta: `${summary} ${p.data.stack.join(' ')}`,
        href: href(lang, `/projects/${p.id}`),
        kind: t('kind.project'),
      };
    })
  );

  const subjects: SearchItem[] = (await getSubjects()).map((s) => {
    const { title, sub } = subjectText(s, lang);
    return { title, meta: sub ?? '', href: href(lang, `/library/${s.id}`), kind: t('kind.subject') };
  });

  const notes: SearchItem[] = (await getNotes()).map((n) => {
    const { title, topics } = noteText(n, lang);
    // Also include the original title, so a Spanish search works on the English site.
    const original = title === n.data.title ? '' : n.data.title;
    return {
      title,
      meta: [topics.join(' · '), original].filter(Boolean).join(' · '),
      href: href(lang, `/library/${n.data.subject.id}/${noteSlug(n)}`),
      kind: t('kind.note'),
    };
  });

  return [...pages, ...projects, ...subjects, ...notes];
}
