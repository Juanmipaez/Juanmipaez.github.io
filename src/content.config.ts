import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Projects: one Markdown file per project in src/content/projects/.
 * Written in English. The body is the project page (what / my part / how to run / results).
 * Project titles stay in English in both languages (they are names).
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(), // one line, shown in lists
    status: z.enum(['building', 'done', 'archived']),
    stack: z.array(z.string()).default([]),
    role: z.string().optional(), // what *you* did (important for team projects)
    team: z.boolean().default(false),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    featured: z.boolean().default(false), // shown on the home page
    order: z.number().default(100), // lower = first
    started: z.coerce.date().optional(),
  }),
});

/**
 * Spanish translations of projects: src/content/projects-es/<same id>.md
 * Only the text: summary, role and the body. Everything else comes from the English file.
 * If a project has no translation, the Spanish site falls back to the English text.
 */
const projectsEs = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/projects-es' }),
  schema: z.object({
    summary: z.string(),
    role: z.string().optional(),
  }),
});

/**
 * Library subjects: one file per course in src/content/subjects/.
 */
const subjects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/subjects' }),
  schema: z.object({
    title: z.string(), // course name as it appears at UNAL (Spanish)
    titleEn: z.string().optional(),
    area: z.enum(['math', 'cs']),
    language: z.enum(['es', 'en']).default('es'),
    description: z.string().optional(), // Spanish
    descriptionEn: z.string().optional(),
    order: z.number().default(100),
  }),
});

/**
 * Library notes: src/content/notes/<subject-id>/<note>.md
 * The note itself (body, PDF) stays in its original language (`language`);
 * only the title and topics are translated, so it can be listed on the other site.
 * Phase A: metadata + link to the compiled PDF (put PDFs in public/notes/<subject>/).
 * Phase B: the Markdown body holds the note converted from .tex (KaTeX renders $…$ and $$…$$).
 */
const notes = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(), // in the note's language
    titleEn: z.string().optional(), // English title (used on /en when language is es)
    titleEs: z.string().optional(), // Spanish title (used on / when language is en)
    subject: reference('subjects'),
    topics: z.array(z.string()).default([]),
    topicsEn: z.array(z.string()).optional(),
    topicsEs: z.array(z.string()).optional(),
    language: z.enum(['es', 'en']).default('es'),
    semester: z.string().optional(), // e.g. "2025-2"
    pdf: z.string().optional(), // e.g. "/notes/algebra-lineal/espacios-vectoriales.pdf"
    tex: z.string().optional(), // link to the .tex source on GitHub, if public
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, projectsEs, subjects, notes };
