import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "@/components/Markdown";
import { projects } from "@/data/projects";
import { fetchReadme } from "@/lib/github";

// Static export: only the slugs listed here exist, and projects with a
// hand-built page under `app/projects/<slug>/` are served by that route.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.filter((p) => !p.customPage).map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const readme = project.github ? await fetchReadme(project.github) : null;

  return (
    <article className="mx-auto max-w-4xl animate-fade-in-up">
      <Link
        href="/projects"
        className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-[var(--accent)]"
      >
        <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">←</span>
        All projects
      </Link>

      <h1 className="mt-8 text-5xl font-semibold tracking-tight sm:text-6xl">
        {project.title}
        <span
          className="italic font-normal text-[var(--accent)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          .
        </span>
      </h1>
      <p className="mt-4 text-xl text-neutral-600 dark:text-neutral-400">
        {project.description}
      </p>

      {project.longDescription && (
        <p className="mt-8 text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
          {project.longDescription}
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <span
            key={t}
            className="rounded-md border border-[var(--accent)]/20 bg-[var(--accent-soft)] px-2.5 py-1 font-mono text-xs font-medium text-[var(--accent)]"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        {project.github && (
          <a
            href={project.github}
            className="btn-primary group"
            target="_blank"
            rel="noreferrer"
          >
            View on GitHub
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </a>
        )}
        {project.demo && (
          <a
            href={project.demo}
            className="btn-ghost group"
            target="_blank"
            rel="noreferrer"
          >
            Live demo
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </a>
        )}
      </div>

      {readme && (
        <section className="mt-16 border-t border-[var(--border)] pt-10">
          <h2 className="mb-6 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            / README
          </h2>
          <Markdown source={readme} />
        </section>
      )}
    </article>
  );
}
