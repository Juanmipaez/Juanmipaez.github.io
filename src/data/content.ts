// Small helpers so every page sorts, counts and translates content the same way.
import { getCollection, render, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n';

const statusRank = { building: 0, done: 1, archived: 2 } as const;

export async function getProjects() {
  const all = await getCollection('projects');
  return all.sort((a, b) => a.data.order - b.data.order || statusRank[a.data.status] - statusRank[b.data.status]);
}

export async function getSubjects() {
  const all = await getCollection('subjects');
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function getNotes() {
  return getCollection('notes', ({ data }) => !data.draft);
}

export function noteSlug(note: CollectionEntry<'notes'>) {
  return note.id.split('/').pop()!;
}

export async function noteCounts() {
  const notes = await getNotes();
  const counts: Record<string, number> = {};
  for (const n of notes) counts[n.data.subject.id] = (counts[n.data.subject.id] ?? 0) + 1;
  return counts;
}

// ---------- translation helpers ----------

/** Project text in the given language. Falls back to English if there's no Spanish file. */
export async function projectText(project: CollectionEntry<'projects'>, lang: Lang) {
  const es = lang === 'es' ? (await getCollection('projectsEs')).find((p) => p.id === project.id) : undefined;
  return {
    title: project.data.title, // names stay in English
    summary: es?.data.summary ?? project.data.summary,
    role: es ? es.data.role : project.data.role,
    translated: lang === 'en' || Boolean(es),
    entry: es ?? project, // render() this for the body
  };
}

export async function renderProject(project: CollectionEntry<'projects'>, lang: Lang) {
  const { entry } = await projectText(project, lang);
  return render(entry);
}

/** Subject name in the given language, plus the name in the other language as a subtitle. */
export function subjectText(subject: CollectionEntry<'subjects'>, lang: Lang) {
  const { title, titleEn, description, descriptionEn } = subject.data;
  return lang === 'en'
    ? { title: titleEn ?? title, sub: titleEn ? title : undefined, description: descriptionEn ?? description }
    : { title, sub: titleEn, description };
}

/** Note title/topics in the given language. The body stays in the note's own language. */
export function noteText(note: CollectionEntry<'notes'>, lang: Lang) {
  const d = note.data;
  if (lang === d.language) return { title: d.title, topics: d.topics };
  return lang === 'en'
    ? { title: d.titleEn ?? d.title, topics: d.topicsEn ?? d.topics }
    : { title: d.titleEs ?? d.title, topics: d.topicsEs ?? d.topics };
}
