import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

// Mirrors the Technical Skills block on the resume verbatim — same three
// groups, same order. Keep the two in sync when either changes.
const skills = {
  Programming: [
    "Python",
    "C/C++",
    "R",
    "SQL",
    "Java",
    "Javascript",
    "HTML/CSS",
    "Assembly",
  ],
  Technologies: [
    "Pandas",
    "NumPy",
    "PyTorch",
    "TensorFlow",
    "Scikit-learn",
    "PostgreSQL",
    "Flask",
    "React",
    "Node.js",
  ],
  "Developer Tools": ["Git & GitHub", "Jupyter Notebooks"],
};

const contacts = [
  {
    label: "ashtonma@umich.edu",
    href: "mailto:ashtonma@umich.edu",
    external: false,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m2 7 10 6 10-6" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/ashma2583",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
        <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.5 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.69.42.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/ashtonma",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
      </svg>
    ),
  },
];

const now = [
  "Studying Data Science at the University of Michigan.",
  "Exploring machine learning, generative models and software engineering through coursework, research and side projects.",
  "Student researcher at the University of Michigan Extreme Generation Intelligent Systems Laboratory and U-M Transportation Research Institute SIM Lab",
  "Project Lead on the Michigan Data Science Team",
  "Member of the University of Michigan Google Student Developer Club",
];

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

      {/* ------------------------ Hero: text + photo ------------------------ */}

      <section className="mb-24 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16">
        <div>
          {/* Capped at 7xl rather than 8xl: the photo takes a column now, so
              the larger display size wraps awkwardly beside it. */}
          <h1 className="animate-fade-in-up text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
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

          <p className="mt-7 max-w-2xl animate-fade-in-up delay-200 text-xl leading-relaxed text-neutral-600 dark:text-neutral-400">
            Data Science student at the University of Michigan interested in{" "}
            <span className="font-medium text-[var(--foreground)]">machine learning</span>,{" "}
            <span className="font-medium text-[var(--foreground)]">generative AI</span>, and{" "}
            <span className="font-medium text-[var(--foreground)]">software engineering</span>.
          </p>

          <p className="mt-5 max-w-2xl animate-fade-in-up delay-300 text-lg leading-relaxed text-neutral-500 dark:text-neutral-400">
            When I&apos;m not coding, I enjoy competitive swimming, playing water polo, or out trying new restaurants with friends.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3 animate-fade-in-up delay-300">
            <Link href="/projects" className="btn-primary group">
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
            </Link>
            <a href="mailto:ashtonma@umich.edu" className="btn-ghost">
              Get in touch
            </a>
          </div>
        </div>

        {/* Plain <img>: the static export has no image optimizer, and the file
            is already cropped and sized for the slot it renders in.
            order-first lifts it above the name once the grid collapses. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/pfp.jpg"
          alt="Ashton Ma"
          width={1000}
          height={1250}
          className="order-first w-40 shrink-0 animate-fade-in-up rounded-2xl border border-[var(--border)] object-cover shadow-[0_20px_50px_-24px_rgba(0,0,0,0.35)] sm:w-48 lg:order-none lg:w-56"
        />
      </section>

      {/* -------------------------- Now + toolbox -------------------------- */}

      <div className="mb-28 grid animate-fade-in-up delay-500 gap-14 sm:grid-cols-2 sm:gap-16">
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
            </span>
            Currently
          </h2>
          <ul className="space-y-3 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
            {now.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]/60" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Toolbox
          </h2>
          <div className="space-y-5">
            {Object.entries(skills).map(([group, items]) => (
              <div key={group}>
                <p className="mb-2 font-mono text-xs uppercase tracking-[0.15em] text-[var(--accent)]">
                  {group}
                </p>
                <div className="flex flex-wrap gap-2">
                  {items.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1 text-sm text-[var(--foreground)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ----------------------- Featured projects ----------------------- */}

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

      {/* ------------------------------ Contact ------------------------------ */}

      <section
        id="contact"
        className="mt-28 scroll-mt-24 border-t border-[var(--border)] pt-14"
      >
        <h2 className="text-3xl font-semibold tracking-tight">
          Contact{" "}
          <span
            className="italic font-normal text-[var(--accent)]"
            style={{ fontFamily: "var(--font-instrument-serif)" }}
          >
            me
          </span>
          
        </h2>

        <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-4">
          {contacts.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.external ? "_blank" : undefined}
              rel={c.external ? "noreferrer" : undefined}
              className="group inline-flex items-center gap-2.5 text-[15px] font-medium text-neutral-600 transition-colors hover:text-[var(--accent)] dark:text-neutral-400"
            >
              <span className="text-neutral-400 transition-colors group-hover:text-[var(--accent)]">
                {c.icon}
              </span>
              <span className="nav-link">{c.label}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
