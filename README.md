# Portfolio

Personal site for Ashton Ma. Next.js 16 (App Router) + Tailwind v4, built as a
static export and hosted on GitHub Pages.

```bash
npm install
npm run dev        # http://localhost:3000
```

`npm run build` writes the deployable site to `./out`. `npm start` does **not**
work here: `output: "export"` produces static files, so there is no server to
start. To preview a production build, serve the folder:

```bash
npm run build
npx serve out
```

## Layout

| Route | File |
| --- | --- |
| `/` | [`app/page.tsx`](app/page.tsx) |
| `/projects` | [`app/projects/page.tsx`](app/projects/page.tsx) |
| `/projects/single-image-to-3d` | [`app/projects/single-image-to-3d/page.tsx`](app/projects/single-image-to-3d/page.tsx) |
| `/projects/shazam-clone` | [`app/projects/shazam-clone/page.tsx`](app/projects/shazam-clone/page.tsx) |
| everything else under `/projects/` | [`app/projects/[slug]/page.tsx`](app/projects/[slug]/page.tsx) |

The nav and footer are not in any page. They live in
[`app/layout.tsx`](app/layout.tsx), which wraps every route.

The home page carries what used to be separate About and Contact pages: hero,
bio, Currently, Toolbox, featured projects, and a contact section anchored at
`/#contact`. Those routes no longer exist.

> `components/Nav.tsx`, `Hero.tsx`, `Footer.tsx`, `Projectgrid.tsx`, and
> `TechTag.tsx` are empty leftovers from scaffolding. Nothing imports them.

## Adding a project

Every project is an entry in [`data/projects.ts`](data/projects.ts). The card
shown in both grids reads exactly four fields — `slug`, `title`, `description`,
`tech` — and both grids share [`components/ProjectCard.tsx`](components/ProjectCard.tsx).
`featured: true` puts it on the home page.

There are two kinds of detail page:

**Generated.** Leave `customPage` off and set `github`. The `[slug]` route
renders a header from `title`, `description`, `longDescription`, `tech`,
`github`, and `demo`, then fetches and renders that repo's README at build time.
Nothing else to write.

**Hand-built.** Create `app/projects/<slug>/page.tsx` and set `customPage: true`
on the entry. Next gives the static route precedence over `[slug]`, and the flag
keeps `generateStaticParams` from emitting the same path twice, which would break
the export. On these pages `longDescription`, `github`, and `demo` are ignored;
the title lives in **two** places (the data entry and the page itself), so
renaming means editing both.

## Writing a hand-built page

[`components/paper.tsx`](components/paper.tsx) is the toolkit — an academic
project-page layout: centered hero, pill link row, narrow justified prose,
wide figures.

`PaperHero` · `PaperSection` · `Prose` · `Figure` · `FigureFrame` ·
`FigureRow` · `FigCaption` · `Diagram` · `CodeBlock` · `ResultsTable` ·
`Callout` · `Math` · `MathBlock` · `Bibtex`

Both existing pages are worked examples.

**Figures** come from the source repo over `raw.githubusercontent.com` rather
than being copied into `public/`, so a page tracks whatever its repo publishes.
`Figure` and `FigureRow` put images on a white card, since those assets are
plots and renders authored against white. `FigureFrame` keeps the page
background instead, for diagrams drawn inline — see
[`app/projects/shazam-clone/figures.tsx`](app/projects/shazam-clone/figures.tsx),
where the SVGs are theme-aware.

**Math** is typeset with KaTeX. `renderToString` runs inside the server
component, so the browser gets finished markup plus a stylesheet, and no math
library ships. Write LaTeX with `String.raw` to avoid escaping every backslash:

```tsx
<MathBlock tag="1">{String.raw`\Delta T = \text{sourceT} - \text{sampleT}`}</MathBlock>
```

## Deploying

Pushing to `main`/`master` triggers
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds and
publishes to GitHub Pages.

One-time setup:

1. Create the repo and push.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.** This is
   not the default, and the workflow's deploy step fails without it.

The workflow derives the base path from the repo name, so nothing needs
configuring by hand:

| Repo name | URL | `NEXT_PUBLIC_BASE_PATH` |
| --- | --- | --- |
| `ashma2583.github.io` | `https://ashma2583.github.io` | *(empty)* |
| anything else, e.g. `portfolio` | `https://ashma2583.github.io/portfolio` | `/portfolio` |

To reproduce a project-site build locally:

```bash
NEXT_PUBLIC_BASE_PATH=/portfolio npm run build
npx serve out
```

## Static-export constraints

There is no server at runtime, which rules a few things out:

- Use `<Link>` for internal links, never a raw `<a href="/...">`. Only `<Link>`
  gets the base path prefixed, so plain anchors 404 on a project site.
- Data fetching in a page runs at **build** time. The workflow passes
  `GITHUB_TOKEN` so the README fetches avoid the anonymous rate limit.
- Routes come only from `generateStaticParams`; `dynamicParams` is `false`.
- `images.unoptimized` is on and pages use plain `<img>`, so anything added to
  `public/` should already be cropped and sized.
- `public/.nojekyll` must stay, or Pages strips the `_next` directory and the
  site loads unstyled.

## Known placeholders

- The Resume nav link is commented out in `app/layout.tsx` and `public/resume.pdf`
  no longer exists. Add the PDF back before uncommenting, or the link 404s.
- `public/images/profile.jpg` is a 0-byte leftover. The photo actually used is
  `public/images/pfp.jpg`.
- The Recipe Finder entry in `data/projects.ts` is commented out.
- `lint` reports a few unused-import warnings on the project pages, from link
  rows that are commented out but may come back.
