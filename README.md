# William Nascimento — Portfolio

Bilingual (English / Brazilian Portuguese) portfolio website for William Nascimento,
Technical Lead & Senior Software Engineer based in Dublin, Ireland. Built to support
applications for senior backend / technical leadership roles in Ireland and Europe.

## Stack

- **React 18 + TypeScript** — components and app logic
- **Vite** — build tool, static output suited for S3 + CloudFront
- **react-i18next** — bilingual content (EN default, PT-BR secondary), with
  browser language detection and `localStorage` persistence
- **CSS Modules + design tokens** — no UI framework; a small custom design
  system (`src/styles/tokens.css`) keeps the site distinct from résumé templates
- **ESLint + Prettier** — linting and formatting

No component library, animation library, or CSS framework is used, to keep the
dependency surface minimal per the project's clean-code guidelines.

## Folder structure

```
AboutMe/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/       # Header, Container — structural chrome
│   │   ├── ui/           # Button, LanguageSwitch, SectionHeading — reusable primitives
│   │   ├── icons/        # inline SVG icons (no icon package dependency)
│   │   └── sections/     # Hero, About, Experience, Expertise, Certifications
│   ├── content/          # non-translatable content (profile.ts: links, CV paths)
│   ├── i18n/              # i18next config + locales/en.json, locales/pt.json
│   ├── hooks/             # useHtmlLang, etc.
│   ├── styles/            # tokens.css (design system) + global.css
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── vite.config.ts
└── package.json
```

Professional/translatable copy lives in `src/i18n/locales/*.json`; structural
placeholders (LinkedIn, GitHub, CV files) live in `src/content/profile.ts`.
Components read from both but never hard-code copy.

## Visual concept

Dark, engineering-led aesthetic rather than a generic résumé template:

- Near-black / graphite background (`#070B14`) with a cyan accent (`#22D3EE`)
  and a muted green as a secondary accent, used sparingly
- Inter for UI text, JetBrains Mono for small technical accents (kicker text,
  the Hero's terminal-style status panel)
- Generous spacing, restrained motion (a single fade/rise on load, respecting
  `prefers-reduced-motion`), strong focus-visible states for keyboard users
- No skill percentage bars, no stock photography, no heavy visual effects

## Homepage structure (target — full site)

1. Header — logo, responsive nav, language switch, Contact CTA ✅
2. Hero — name, role, summary, focus areas, Contact / Download CV, LinkedIn / GitHub ✅
3. About ✅
4. Professional Experience ✅
5. Expertise ✅
6. Certifications & Education ✅
7. Selected Projects — pending
8. International Journey — pending
9. Contact — pending
10. Footer — pending

## Implementation roadmap

- **Stage 1 (done)** — foundation, design system, bilingual architecture,
  responsive header/nav, Hero section
- **Stage 2 (done)** — About + Professional Experience (Itaú Unibanco,
  Bradesco)
- **Stage 3 (done)** — Expertise + Certifications & Education (AZ-900, FIAP)
- **Stage 4** — Selected Projects (data-driven, empty-state ready for future
  GitHub projects)
- **Stage 5** — International Journey + Contact section (form with
  validation/honeypot) + Footer
- **Stage 6** — SEO (meta/OG/Twitter cards, sitemap, robots.txt, Person
  schema), accessibility audit, performance tuning
- **Stage 7** — AWS infrastructure (S3 + CloudFront, OAC, IaC) + GitHub
  Actions deploy via OIDC — **not started; requires explicit approval before
  any AWS resource is created**

## Current status (Stages 1–3)

Implemented: project scaffold, design tokens, global styles, i18n setup with
EN/PT locale files, responsive `Header` (desktop nav + mobile slide-down menu,
accessible toggle, Escape-to-close), `LanguageSwitch`, `Hero`, `About` (intro +
quick stats), `Experience` (Bradesco and Itaú Unibanco timeline, with Itaú's
3-D Secure 2.0 / Celular Seguro / product onboarding initiatives), `Expertise`
(5 skill-group cards, no invented percentages) and `Certifications & Education`
(AZ-900 + FIAP, marked as not completed).

No professional experience, employer, date, metric, certification or academic
detail has been invented — every fact reflects what William provided. Where
something isn't confirmed yet, the UI shows an explicit placeholder (e.g. "CV
available soon", "Credential link pending") rather than a dead link or
fabricated content.

### Known placeholders (`src/content/profile.ts`)

- `linkedinUrl` / `githubUrl` — set to William's real profile links
- `cv.en` / `cv.pt` — no CV file wired in yet; the Download CV button renders
  disabled with "CV available soon" until real files are added

### Content still pending confirmation

- Professional email (currently using William's personal Gmail as a stand-in)
- AZ-900 credential verification URL
- CV file(s) (EN and PT)
- Exact name/category of the 2024 Itaú Unibanco recognition
- Exact start date of the Itaú Unibanco tenure (currently shown as "~6 years
  — until Jul 2024")
- Personal GitHub projects to populate the future Projects section
- Future custom domain

### Updating content

- Copy for every implemented section lives in
  `src/i18n/locales/en.json` / `pt.json`, under the `about`, `experience`,
  `expertise` and `certifications` namespaces — edit the JSON, no component
  changes needed.
- To add a new job, append an object to `experience.items` in both locale
  files (same shape as the existing Bradesco/Itaú entries).
- To add a new certification or education entry, append to
  `certifications.certificationsList` / `certifications.educationList` in
  both locale files.
- Links and files that aren't translatable (LinkedIn, GitHub, CV) live in
  `src/content/profile.ts`.
- The Hero photo is `src/assets/images/profile.jpg`, imported directly in
  `Hero.tsx`. To replace it, swap the file (same name) or update the import
  path.

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (typically `http://localhost:5173`) in a
browser. The dev server supports hot reload — edits to any file under `src/`
appear immediately.

Other scripts:

```bash
npm run build     # type-check + production build to dist/
npm run preview   # serve the dist/ build locally, to sanity-check the build
npm run lint       # ESLint
npm run format     # Prettier
```

## Deployment

Not deployed yet. The build (`vite build`) outputs static files to `dist/`
with relative asset paths, suited for an S3 + CloudFront static site. GitHub
Actions + AWS OIDC deploy automation is planned for a later phase and will
not run, and no AWS resources will be created, without explicit approval.
