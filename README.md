This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Adding a project

Projects are listed in [`data/projects.ts`](data/projects.ts). Two kinds of page exist:

- **Default** — leave `customPage` off and set `github`. The route
  `app/projects/[slug]/` renders the project header and fetches the repo's README
  at build time.
- **Hand-built** — create `app/projects/<slug>/page.tsx` and set `customPage: true`
  on the entry. The static route wins over `[slug]`, and the flag keeps
  `generateStaticParams` from emitting a duplicate of the same slug.

`components/paper.tsx` holds the layout used for hand-built pages: an
academic-project-page structure (centered hero, pill link row, teaser figure,
narrow justified prose with wide figures, results tables, BibTeX). See
[`app/projects/single-image-to-3d/page.tsx`](app/projects/single-image-to-3d/page.tsx)
for a worked example.

Figures are pulled straight from the source repo over
`raw.githubusercontent.com` rather than copied into `public/`, so the page
tracks whatever the repo publishes. Every figure sits on a white card, since the
assets are plots and renders authored against white.

## Deploying to GitHub Pages

The site is a static export (`output: "export"` in
[`next.config.ts`](next.config.ts)), published by
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) on every push to
`main`/`master`.

One-time setup:

1. Push this directory to a GitHub repo.
2. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.

The workflow picks the base path automatically:

| Repo name | URL | `NEXT_PUBLIC_BASE_PATH` |
| --- | --- | --- |
| `ashma2583.github.io` | `https://ashma2583.github.io` | *(empty)* |
| anything else, e.g. `portfolio` | `https://ashma2583.github.io/portfolio` | `/portfolio` |

To reproduce a project-site build locally:

```bash
NEXT_PUBLIC_BASE_PATH=/portfolio npm run build   # writes ./out
npx serve out
```

Things to keep in mind, since there is no server at runtime:

- Use `<Link>` (or `next/image`) rather than raw `<a href="/...">` for internal
  links — only those get the base path prefixed.
- Any data fetching in a page runs at **build** time. The workflow passes
  `GITHUB_TOKEN` so the README fetches don't hit the anonymous rate limit.
- `public/.nojekyll` must stay, or GitHub Pages strips the `_next` directory.
- Routes come from `generateStaticParams`; `dynamicParams` is `false`.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
