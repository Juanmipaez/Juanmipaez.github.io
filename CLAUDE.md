# CLAUDE.md: juanmi-site

Personal website of **Juan Miguel Paez Tatis ("Juanmi")**, Computer Science student at UNAL.
Read this file and `docs/SITE_SPEC.md` before changing anything.

## Stack
- **Astro 7**, static output. Content collections live in `src/content/`, and their schemas are in `src/content.config.ts`.
- Markdown goes through `@astrojs/markdown-remark` with **remark-math + rehype-katex**: `$…$` and `$$…$$` render as math. KaTeX CSS is imported in `src/layouts/Base.astro`.
- No UI framework and no Tailwind: plain CSS in `src/styles/global.css` plus scoped `<style>` in components.
- Deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

## Commands
```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # must pass with no errors before any commit
npm run preview
```

## Where things are
| What | Where |
|---|---|
| Name, email, links, "now" list, experience (es + en) | `src/data/site.ts` (single source of truth) |
| UI strings (both languages), URL helpers | `src/i18n/ui.ts`, `src/i18n/index.ts` |
| Pages (one file builds `/x` and `/en/x`) | `src/pages/[...lang]/` |
| Floating ES/EN switch | `src/components/LangSwitch.astro` |
| Design tokens (both themes) | top of `src/styles/global.css` |
| Hero animation (terminal intro → torus/Möbius, ASCII torus) | `src/components/Hero.astro` + `src/scripts/hero.ts` |
| Header / footer / ⌘K search | `src/components/Header.astro`, `Footer.astro`, `Search.astro` |
| Projects | `src/content/projects/*.md` (English) + `src/content/projects-es/*.md` (Spanish text) → `/projects/<id>`, `/en/projects/<id>` |
| Library subjects | `src/content/subjects/*.md` → `/library`, `/library/<subject>` |
| Notes | `src/content/notes/<subject>/*.md` → `/library/<subject>/<note>` |
| Note PDFs / CV PDFs | `public/notes/<subject>/`, `public/cv/` |

## Rules (important)
1. **Never invent facts.** No made-up metrics, speedups, course codes, page counts, dates, employers or project details. If something is unknown, write `TODO(juanmi): …` and ask. (An earlier AI prototype invented things like "6.4x speedup", "MATH-201" and a fake email. None of that belongs here.)
2. **Juanmi makes all git commits himself.** Don't commit, push or open PRs. Prepare the changes, show the diff, and suggest a commit message. He works on feature branches, not on `main`.
3. Keep it fast and calm: the hero is the only animated element. Respect `prefers-reduced-motion` and add no new JS libraries without asking.
4. Accessibility: real `<a>`/`<button>`, visible focus, `aria-label` on icon-only buttons, text contrast ≥ 4.5:1 in **both** themes.
5. Every page must work at 390px width, so check mobile.
6. Colors come only from the CSS variables, never hard-coded in components (the canvas reads them too).
7. **Two languages.** Spanish is the default at `/`, English lives at `/en/`. URLs are the same in both (`/projects` ↔ `/en/projects`); only the link text changes. Every UI string goes in `src/i18n/ui.ts` (both languages, never hard-coded in a page), and every internal link goes through `href(lang, path)`. Project **names** stay in English. Notes keep their body and PDF in the original language (mostly Spanish); only their title and topics are translated.

## Design in one paragraph
"A LaTeX paper that became a website." Warm paper background (`--bg #F3EFE6`), serif body (Source Serif 4), monospace (JetBrains Mono) for nav, labels, dates and metadata. Green accent (`--accent`) for links and active states, burnt orange (`--accent2`) for status/kicker labels. A second "terminal" theme (dark, green, all-monospace) is toggled from the header and saved in localStorage. Lists over cards: rows with a title, a one-line description and mono metadata on the right. Cards only for library subjects and the "now" items.

## Adding content
- **Project:** copy an existing file in `src/content/projects/`, then fill the frontmatter (`status: building | done | archived`, `featured: true` to show it on the home page). The body sections are *What it is*, *My part*, *How to run*, *Results*.
- **Project translation:** add `src/content/projects-es/<same id>.md` with the Spanish `summary`, `role` and body. Without it, the Spanish site shows the English text with a notice.
- **Subject:** add `src/content/subjects/<id>.md` (`title` in Spanish, `titleEn`, optional `description`/`descriptionEn`, `area: math | cs`, `order`).
- **Note:** copy `src/content/notes/algebra-lineal/plantilla.md` (a draft template) to `src/content/notes/<subject>/<name>.md` and set `draft: false`. `subject` must match a subject file name. Add `titleEn` (and `topicsEn`) so the note reads well on the English site.
