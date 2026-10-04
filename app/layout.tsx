import type { Metadata } from "next";
import { Cormorant_Garamond, Geist_Mono, Source_Serif_4 } from "next/font/google";
import Link from "next/link";
import SealNote from "@/components/SealNote";
import WaterScene from "@/components/WaterScene";
import WaveRule from "@/components/WaveRule";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ashton Ma",
  description:
    "Data Science student at the University of Michigan interested in machine learning, generative AI, and software engineering.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${sourceSerif.variable} ${cormorant.variable} ${geistMono.variable}`}>
      <body className="flex min-h-screen flex-col bg-transparent text-[var(--foreground)] antialiased">
        <div aria-hidden className="water-backdrop" />
        <WaterScene />
        <header className="sticky top-0 z-40 border-b border-[var(--border)]/80 bg-[var(--background)]/86 backdrop-blur-md">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-8 py-5">
            <div className="flex items-center gap-2.5">
              <SealNote />
              <Link href="/" className="text-base font-semibold tracking-tight">
                Ashton Ma
              </Link>
            </div>
            <div className="flex items-center gap-8 text-sm font-medium">
              <Link href="/" className="nav-link text-neutral-700 hover:text-[var(--accent)] dark:text-neutral-300">
                Home
              </Link>
              <Link href="/projects" className="nav-link text-neutral-700 hover:text-[var(--accent)] dark:text-neutral-300">
                Projects
              </Link>
              {/* Contact is a section at the bottom of the home page — reachable
                  from the footer links rather than the top bar. */}
              {/* Hidden for now — the PDF is still at public/resume.pdf.
                  Uncomment to bring the link back.
              <Link href="/resume.pdf" className="nav-link text-neutral-700 hover:text-[var(--accent)] dark:text-neutral-300">
                Resume
              </Link>
              */}
            </div>
          </nav>
        </header>

        <main className="water-sheet relative z-10 mx-auto w-full max-w-6xl flex-1 px-8 py-20">
          {children}
        </main>

        <footer className="water-footer relative z-10 mt-20">
          <WaveRule />
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
              <a href="mailto:ashtonma@umich.edu" className="nav-link hover:text-[var(--accent)]">
                Email
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
