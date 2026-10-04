import Link from "next/link";
import type { Project } from "@/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="project-card group isolate relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[var(--accent)]/40"
    >
      {/* Gradient sheen on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[var(--accent)]/0 via-[var(--accent)]/0 to-[var(--accent)]/0 opacity-0 transition-opacity duration-500 group-hover:from-[var(--accent)]/8 group-hover:to-transparent group-hover:opacity-100"
      />

      {/* Vertical accent bar */}
      <span
        aria-hidden
        className="absolute left-0 top-6 h-8 w-0.5 origin-top scale-y-0 bg-[var(--accent)] transition-transform duration-300 group-hover:scale-y-100"
      />

      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-xl tracking-tight transition-colors duration-300 group-hover:text-[var(--accent)]">
          {project.title}
        </h3>
        <span
          aria-hidden
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-neutral-400 transition-all duration-300 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white group-hover:rotate-[-45deg]"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
          >
            <path d="M5 12h14" />
            <path d="M13 5l7 7-7 7" />
          </svg>
        </span>
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        {project.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <span
            key={t}
            className="rounded-md border border-[var(--border)] bg-neutral-50/50 px-2 py-0.5 font-mono text-[11px] font-medium text-neutral-600 transition-colors duration-300 group-hover:border-[var(--accent)]/30 group-hover:bg-[var(--accent-soft)] group-hover:text-[var(--accent)] dark:bg-neutral-900/40 dark:text-neutral-400"
          >
            {t}
          </span>
        ))}
      </div>
    </Link>
  );
}
