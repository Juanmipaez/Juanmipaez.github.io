# Personal website: plan (v3, 2026-11-18)

## Status
The project scaffold has been built: `juanmi-site` (Astro 7 + KaTeX, static, deployed to GitHub Pages via Actions).
Its own `CLAUDE.md` and `docs/SITE_SPEC.md` are the working spec for Claude Code.

## Decisions
- Hero: a terminal intro dissolves into a canvas with two modes, from the Gemini prototype: **01 torus → Möbius** and **02 ASCII torus**. The sinc-mesh and DFA modes were dropped, as was the linear-map terminal idea.
- Möbius mode spins around its own axis (never edge-on). Rendering pauses off-screen, and reduced motion means no intro and no auto-motion.
- Two themes: paper (default) and terminal (dark, all-mono), saved in localStorage.
- Lists over cards. Cards only for library subjects and "now".
- Name: Juan Miguel Paez Tatis ("Juanmi"). Only UNAL, no city. Email juan.paeztatis@gmail.com, LinkedIn /in/juanmiguelpaez, GitHub Juanmipaez.
- Gemini's invented content (metrics, course codes, page counts, fake email) was discarded. Rule: never invent facts.
- Juanmi makes all git commits himself.

## Site map
/ · /projects · /projects/[slug] · /library · /library/[subject] · /library/[subject]/[note] · /about · /404 · (later) /writing

## Next steps
1. Create the GitHub repo and enable Pages (Actions).
2. Add the CV PDFs.
3. Library phase A: sort the .tex notes → PDFs + metadata.
4. Library phase B: convert the best notes to Markdown + KaTeX.
5. Fill in project pages as projects finish.
6. Polish: OG image, sitemap, Lighthouse, compact mobile header.
7. Domain.
