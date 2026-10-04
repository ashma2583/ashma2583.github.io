import katex from "katex";
import type { ReactNode } from "react";
import "katex/dist/katex.min.css";

/* ------------------------------------------------------------------ */
/* Building blocks for academic-style project pages.                   */
/* Layout mirrors the usual paper/project-page template: centered hero, */
/* pill link row, teaser, then narrow justified prose with wide figures.*/
/* ------------------------------------------------------------------ */

export type PaperLink = {
  label: string;
  href: string;
  icon?: ReactNode;
  primary?: boolean;
};

export function PaperHero({
  eyebrow,
  title,
  subtitle,
  authors,
  affiliation,
  links,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  authors: { name: string; href?: string }[];
  affiliation?: string;
  links?: PaperLink[];
}) {
  return (
    <header className="animate-fade-in-up text-center">
      {eyebrow && (
        <p className="mb-5 font-mono text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
          {eyebrow}
        </p>
      )}

      <h1 className="mx-auto max-w-4xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
        {title}
      </h1>

      {subtitle && (
        <p
          className="mx-auto mt-5 max-w-3xl text-xl italic leading-snug text-neutral-600 sm:text-2xl dark:text-neutral-400"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {subtitle}
        </p>
      )}

      <p className="mt-8 text-lg">
        {authors.map((a, i) => (
          <span key={a.name}>
            {i > 0 && <span className="text-neutral-400">, </span>}
            {a.href ? (
              <a
                href={a.href}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[var(--accent)] hover:underline"
              >
                {a.name}
              </a>
            ) : (
              <span className="font-medium">{a.name}</span>
            )}
          </span>
        ))}
      </p>

      {affiliation && (
        <p className="mt-1.5 text-base text-neutral-500">{affiliation}</p>
      )}

      {links && links.length > 0 && (
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className={l.primary ? "btn-primary group" : "btn-ghost group"}
            >
              {l.icon}
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

export function PaperSection({
  id,
  title,
  children,
}: {
  id?: string;
  title?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mt-20 scroll-mt-24">
      {title && (
        <h2 className="mb-8 text-center text-3xl font-semibold tracking-tight">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

/** Narrow, justified body column — the reading width of the page. */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl space-y-5 text-justify text-[1.05rem] leading-[1.75] text-neutral-700 hyphens-auto dark:text-neutral-300">
      {children}
    </div>
  );
}

/**
 * Figures always sit on white: every asset here is a matplotlib plot or a
 * render authored against a white background, so a dark page behind them
 * reads as a printing error rather than a theme.
 */
export function Figure({
  src,
  alt,
  caption,
  maxWidth,
  className,
}: {
  src: string;
  alt: string;
  caption?: ReactNode;
  maxWidth?: number;
  className?: string;
}) {
  return (
    <figure className={`mx-auto mt-10 ${className ?? ""}`}>
      <div
        className="mx-auto overflow-hidden rounded-xl border border-[var(--border)] bg-white p-3"
        style={maxWidth ? { maxWidth } : undefined}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="mx-auto block h-auto w-full" />
      </div>
      {caption && <FigCaption>{caption}</FigCaption>}
    </figure>
  );
}

export function FigCaption({ children }: { children: ReactNode }) {
  return (
    <figcaption className="mx-auto mt-4 max-w-3xl text-center text-sm leading-relaxed text-neutral-500">
      {children}
    </figcaption>
  );
}

/**
 * Frame for a figure drawn in the page rather than loaded as an image — the
 * inline SVG diagrams. Unlike `Figure` it keeps the page background, since
 * these are authored theme-aware rather than baked against white.
 */
export function FigureFrame({
  children,
  caption,
  maxWidth,
}: {
  children: ReactNode;
  caption?: ReactNode;
  maxWidth?: number;
}) {
  return (
    <figure className="mt-10">
      <div
        className="mx-auto overflow-x-auto rounded-xl border border-[var(--border)] px-5 py-6"
        style={maxWidth ? { maxWidth } : undefined}
      >
        {children}
      </div>
      {caption && <FigCaption>{caption}</FigCaption>}
    </figure>
  );
}

/**
 * A row of labelled panels — the README's comparison tables, rendered as
 * figures instead. `cols` is the desktop column count; everything collapses
 * to two columns on small screens.
 */
export function FigureRow({
  items,
  cols = 2,
  caption,
  maxWidth,
}: {
  items: { src: string; alt: string; label?: ReactNode }[];
  cols?: 2 | 3 | 4;
  caption?: ReactNode;
  maxWidth?: number;
}) {
  const colClass = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4" }[cols];

  return (
    <figure className="mt-10">
      <div
        className={`mx-auto grid grid-cols-2 gap-4 ${colClass}`}
        style={maxWidth ? { maxWidth } : undefined}
      >
        {items.map((item, i) => (
          <div key={i} className="flex flex-col">
            <div className="flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-[var(--border)] bg-white p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={item.alt} className="block h-auto w-full" />
            </div>
            {item.label && (
              <p className="mt-3 text-center text-[13px] leading-snug text-neutral-500">
                {item.label}
              </p>
            )}
          </div>
        ))}
      </div>
      {caption && <FigCaption>{caption}</FigCaption>}
    </figure>
  );
}

/**
 * Math is typeset with KaTeX at build time — `renderToString` runs in the
 * server component, so no math library ships to the browser, only the stylesheet
 * and its fonts. `throwOnError: false` renders a bad expression in red rather
 * than taking the build down.
 */
function tex(source: string, displayMode: boolean) {
  return katex.renderToString(source, {
    displayMode,
    throwOnError: false,
    // Default output keeps the MathML copy alongside the visual one, which is
    // what screen readers actually read.
  });
}

/** Inline math, sized to sit inside a line of body text. */
export function Math({ children }: { children: string }) {
  return (
    <span
      className="whitespace-nowrap"
      dangerouslySetInnerHTML={{ __html: tex(children, false) }}
    />
  );
}

/**
 * Display equation, set centered on its own line the way a paper would.
 * No box or background — it is prose, not a code listing. `tag` adds a
 * right-aligned equation number.
 */
export function MathBlock({
  children,
  tag,
}: {
  children: string;
  tag?: string;
}) {
  return (
    <div className="mx-auto my-10 flex max-w-3xl items-center gap-4 text-neutral-800 dark:text-neutral-200">
      <div
        className="min-w-0 flex-1 overflow-x-auto overflow-y-hidden py-1 text-[1rem]"
        dangerouslySetInnerHTML={{ __html: tex(children, true) }}
      />
      {tag && (
        <span className="shrink-0 font-mono text-xs tabular-nums text-neutral-400">
          ({tag})
        </span>
      )}
    </div>
  );
}

/** Wide monospace block for the pipeline / file-tree diagrams. */
export function Diagram({
  children,
  caption,
}: {
  children: ReactNode;
  caption?: ReactNode;
}) {
  return (
    <figure className="mt-10">
      <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-neutral-950 px-6 py-6">
        <pre className="font-mono text-[12.5px] leading-[1.7] text-neutral-200">
          {children}
        </pre>
      </div>
      {caption && <FigCaption>{caption}</FigCaption>}
    </figure>
  );
}

export function CodeBlock({ children }: { children: ReactNode }) {
  return (
    <div className="mt-8 overflow-x-auto rounded-xl border border-[var(--border)] bg-neutral-950 px-6 py-5">
      <pre className="font-mono text-[12.5px] leading-[1.8] text-neutral-200">
        {children}
      </pre>
    </div>
  );
}

export function ResultsTable({
  head,
  rows,
  caption,
}: {
  head: string[];
  rows: ReactNode[][];
  caption?: ReactNode;
}) {
  return (
    <figure className="mx-auto mt-10 max-w-3xl">
      <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full border-collapse text-[15px]">
          <thead>
            <tr className="border-b border-[var(--border)] bg-neutral-50/70 dark:bg-neutral-900/50">
              {head.map((h, i) => (
                <th
                  key={h}
                  className={`px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500 ${
                    i === 0 ? "text-left" : "text-right"
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr
                key={r}
                className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--accent-soft)]/40"
              >
                {row.map((cell, c) => (
                  <td
                    key={c}
                    className={`px-5 py-3 ${
                      c === 0
                        ? "text-left text-neutral-700 dark:text-neutral-300"
                        : "text-right font-mono text-[13.5px] tabular-nums"
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && <FigCaption>{caption}</FigCaption>}
    </figure>
  );
}

/** Pull-quote style highlight for the one finding worth stopping on. */
export function Callout({
  label,
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <aside className="mx-auto mt-10 max-w-3xl rounded-xl border border-[var(--accent)]/25 bg-[var(--accent-soft)] px-6 py-5">
      {label && (
        <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
          {label}
        </p>
      )}
      <div className="text-[1.02rem] leading-[1.7] text-neutral-700 dark:text-neutral-300">
        {children}
      </div>
    </aside>
  );
}

export function Bibtex({ children }: { children: string }) {
  return (
    <div className="mx-auto mt-8 max-w-3xl overflow-x-auto rounded-xl border border-[var(--border)] bg-neutral-50/70 px-6 py-5 dark:bg-neutral-900/50">
      <pre className="font-mono text-[12.5px] leading-[1.75] text-neutral-700 dark:text-neutral-300">
        {children}
      </pre>
    </div>
  );
}

/* ---------------------------- icons ---------------------------- */

export const GithubIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
    <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.5 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.69.42.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);

export const DocIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
    <path d="M8 13h8M8 17h5" />
  </svg>
);

export const CubeIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden
  >
    <path d="m12 2 9 5v10l-9 5-9-5V7Z" />
    <path d="m3 7 9 5 9-5M12 12v10" />
  </svg>
);
