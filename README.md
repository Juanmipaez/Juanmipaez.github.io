# juanmi-site

Source of my personal website: projects, a library of my course notes (LaTeX) and contact.
Built with [Astro](https://astro.build) and KaTeX, in Spanish and English, and deployed to GitHub Pages.

**Live:** https://juanmipaez.github.io (Spanish) · https://juanmipaez.github.io/en (English)

```bash
npm install
npm run dev     # http://localhost:4321
npm run build   # static site in dist/
```

## How it's organized

Markup, styles and behavior live in separate files: `.astro` components hold only markup,
`src/styles/` holds the CSS and `src/scripts/` holds the browser JavaScript.

```
src/
├── pages/                    one file per route
│   ├── [...lang]/            each page builds twice: /x (Spanish) and /en/x (English)
│   │   ├── index.astro       home: hero, "now", featured projects, library
│   │   ├── about.astro
│   │   ├── projects/         list + [slug] detail page
│   │   └── library/          subjects → [subject] → [note]
│   └── 404.astro             bilingual "no such file or directory"
│
├── layouts/Base.astro        <html> shell: head, header, footer, search, language switch
│
├── components/
│   ├── layout/               on every page: Header, Footer, Search (⌘K), LangSwitch
│   ├── home/                 Hero (intro + animation)
│   └── ui/                   small building blocks: Icon, ProjectRow, SubjectCard
│
├── styles/
│   ├── global.css            index: imports the shared files below, in order
│   ├── tokens.css            colors and fonts for both themes (paper / terminal)
│   ├── base.css              reset, typography, focus ring, utilities
│   ├── layout/               header, footer, page structure
│   └── components/           buttons, rows, cards, prose, search, lang-switch, hero
│
├── scripts/                  browser code
│   ├── hero.ts               canvas animation: torus → Möbius strip, ASCII torus
│   ├── search.ts             ⌘K search dialog
│   ├── theme.ts              paper ↔ terminal toggle
│   └── lang-switch.ts        keeps the #hash when switching language
│
├── i18n/                     Spanish/English: UI strings (ui.ts) + URL helpers (index.ts)
├── data/                     site.ts (personal info), content.ts (queries), search-index.ts
├── content/                  Markdown: projects, projects-es, subjects, notes
└── content.config.ts         content schemas
```

See `CLAUDE.md` and `docs/SITE_SPEC.md` for the conventions and the roadmap.
