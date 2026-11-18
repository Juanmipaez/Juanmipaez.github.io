# juanmi-site

Source of my personal website: projects, a library of my course notes (LaTeX) and contact.
Built with [Astro](https://astro.build) and KaTeX, and deployed to GitHub Pages.

```bash
npm install
npm run dev     # http://localhost:4321
npm run build
```

- Content: `src/content/` (projects, subjects, notes)
- Personal info and links: `src/data/site.ts`
- Design tokens: `src/styles/global.css`
- Hero animation: `src/components/Hero.astro`, `src/scripts/hero.ts`

See `CLAUDE.md` and `docs/SITE_SPEC.md` for the structure and the roadmap.
