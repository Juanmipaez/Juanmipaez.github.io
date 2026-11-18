# Site spec & roadmap

## Goal
A simple, techy personal site with a bit of math, where people can find things in a few seconds.
It covers three things: **projects** (in progress and finished), a **library** of course notes (written in LaTeX) and **about/contact**.

## Site map
```
/                         hero (terminal intro → animation) · now · featured projects · library subjects
/projects                 grouped: building now / finished / archive
/projects/[slug]          title, summary, status, stack, my part, links; body = README-style write-up
/library                  subjects grouped by area (mathematics / computer science), note counts
/library/[subject]        notes list (title, topics, semester, language, pdf), topic tags
/library/[subject]/[note] metadata, pdf download, .tex source link, optional HTML body with KaTeX
/about                    bio, experience, education, CV (EN/ES), contact
/404                      "no such file or directory"
(later) /writing          blog posts, once 2–3 exist
```
Every page exists in Spanish (default, at the paths above) and English (same paths under `/en`).
At 900px and below, the navigation and social links fold into a ☰ menu panel; search and the theme toggle stay in the bar.
Navigation: `proyectos · biblioteca · escritos (pronto) · sobre mí` (English: `projects · library · writing (soon) · about`), GitHub/LinkedIn icons, ⌘K search and a theme toggle.
A floating `ES | EN` switch in the bottom-right corner links to the same page in the other language.
The footer on every page has GitHub, LinkedIn, CV (in the page's language, downloads on click) and email.

## Hero
- On load, a small terminal card types a command (~1 s), prints `[ok] …`, then dissolves into a canvas.
- **01 · torus → möbius:** a torus twists into a Möbius strip. Its two boundary curves are highlighted (green and orange), and a bead travels the centre line. The surface spins around its own axis and rocks gently. Drag to orbit; **morph ↔** toggles back and forth.
- **02 · ascii torus:** a rotating torus, wireframe on the left of a scanline and z-buffered ASCII shading on the right. **sweep / split** switches between an automatic sweep and a cursor-controlled split.
- **replay ↻** re-runs the intro. Rendering pauses off-screen. With reduced motion, there's no intro and no auto-motion.

## Content model
See `src/content.config.ts`. Key fields:
- projects: `title, summary, status, stack[], role, team, repo, demo, featured, order` (English)
- projectsEs: `summary, role` + body (Spanish translation, same id)
- subjects: `title, titleEn, area, language, description, descriptionEn, order`
- notes: `title, titleEn, titleEs, subject→subjects, topics[], topicsEn[], topicsEs[], language, semester, pdf, tex, updated, draft`

## Roadmap (suggested order of tasks for Claude Code)
1. **Repo + deploy.** Create the GitHub repo (`Juanmipaez/juanmipaez.github.io` gives the cleanest URL), push, enable Pages → GitHub Actions, confirm the site is live. Verify the action versions in `deploy.yml` are current.
2. **CV.** Add the two CV PDFs to `public/cv/`.
3. **Library, phase A.** Sort the `.tex` notes into subjects/topics. For each note, compile it to PDF (`latexmk -pdf`), place it in `public/notes/<subject>/`, and create a note entry with metadata. Add or rename subjects to match the real courses.
4. **Library, phase B.** Convert the best notes to Markdown + KaTeX with `pandoc note.tex -t markdown` and fix the custom macros (TikZ figures → SVG/PNG). Consider Pagefind for full-text search across notes.
5. **Projects.** As each project is finished, fill in its page (what, my part, how to run, results with real numbers and a chart) and set `status: done`.
6. **Polish.** Generate an OG image, add a sitemap (`@astrojs/sitemap`), check Lighthouse scores. ~~Mobile header~~ done: ☰ menu at ≤ 900px.
7. **Domain.** Claim it through the GitHub Student Pack, set `site` in `astro.config.mjs`, add `public/CNAME`, and update the links on LinkedIn, GitHub and the CVs.
8. **Writing** (optional), once there are 2–3 posts.

## Known open items
- Spanish translations of projects/bio are Claude drafts → Juanmi reviews. Official Spanish name of the TA role ("monitor"?) → TODO.
- `budget` project: stack and repo link unknown → TODO.
- KNN_Parallel: description and results → TODO.
- Wompi integration (Fundación Tiempo de Paz) could be a strong project, but only with the client's OK.
- Course list in the library is a starting guess based on the coursework. Adjust it to match the actual .tex notes.
