import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

export const metadata = {
  title: "Projects — Ashton Ma",
};

export default function ProjectsPage() {
  return (
    <div>
      <header className="mb-16 max-w-3xl animate-fade-in-up">
        <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
          / Work
        </p>
        <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
          Projects
          <span
            className="italic font-normal text-[var(--accent)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            .
          </span>
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          A selection of things I&apos;ve built — side projects, coursework, and experiments.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in-up delay-200">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </div>
  );
}
