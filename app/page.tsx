import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

export default function Home() {
  const featured = projects.filter((p) => p.featured);

  return (
    <div className="relative">
      {/* Decorative blue blob in background */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-20 -z-10 h-[480px] w-[480px] rounded-full bg-[var(--accent)]/10 blur-3xl animate-blob"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 -left-32 -z-10 h-[360px] w-[360px] rounded-full bg-[var(--accent)]/5 blur-3xl animate-blob delay-500"
      />

      <section className="mb-28 max-w-5xl">
        <h1 className="animate-fade-in-up text-6xl font-semibold leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl">
          Hi, I&apos;m{" "}
          <span className="relative inline-block">
            <span
              className="relative z-10 italic font-normal text-[var(--accent)]"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              Ashton Ma
            </span>
            <span
              aria-hidden
              className="absolute bottom-2 left-0 z-0 h-3 w-full rounded-sm bg-[var(--accent)]/15"
            />
          </span>
          .
        </h1>

        <p className="mt-8 max-w-3xl animate-fade-in-up delay-200 text-xl leading-relaxed text-neutral-600 sm:text-2xl dark:text-neutral-400">
          Data Science student at the University of Michigan interested in{" "}
          <span className="font-medium text-[var(--foreground)]">software engineering</span>,{" "}
          <span className="font-medium text-[var(--foreground)]">machine learning</span>, and{" "}
          <span className="font-medium text-[var(--foreground)]">artificial intelligence</span>.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3 animate-fade-in-up delay-300">
          <a href="/projects" className="btn-primary group">
            View my work
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M5 12h14" />
              <path d="M13 5l7 7-7 7" />
            </svg>
          </a>
          <a href="mailto:ashtonma@umich.edu" className="btn-ghost">
            Get in touch
          </a>
        </div>
      </section>

      <section className="animate-fade-in-up delay-500">
        <div className="mb-10 border-b border-[var(--border)] pb-4">
          <h2 className="text-3xl font-semibold tracking-tight">Featured Projects</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
