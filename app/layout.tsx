import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ashton — Portfolio",
  description: "Software engineer building [your thing]. Projects, writing, and contact.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}>
      <body className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)] antialiased">
        <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/75 backdrop-blur-md">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-8 py-5">
            <Link href="/" className="group flex items-center gap-2.5 text-base font-semibold tracking-tight">
              <span className="relative inline-flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-50" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--accent)] transition-transform group-hover:scale-125" />
              </span>
              Ashton Ma
            </Link>
            <div className="flex items-center gap-8 text-sm font-medium">
              <Link href="/" className="nav-link text-neutral-700 hover:text-[var(--accent)] dark:text-neutral-300">
                Home
              </Link>
              <Link href="/projects" className="nav-link text-neutral-700 hover:text-[var(--accent)] dark:text-neutral-300">
                Projects
              </Link>
              <Link href="/resume.pdf" className="nav-link text-neutral-700 hover:text-[var(--accent)] dark:text-neutral-300">
                Resume
              </Link>
            </div>
          </nav>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-8 py-20">
          {children}
        </main>

        <footer className="mt-20 border-t border-[var(--border)]">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-8 py-10 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} Ashton Ma</span>
            <div className="flex gap-6">
              <a
                href="https://github.com/ashma2583"
                className="nav-link hover:text-[var(--accent)]"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/ashtonma"
                className="nav-link hover:text-[var(--accent)]"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <a href="mailto:you@example.com" className="nav-link hover:text-[var(--accent)]">
                Email
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
