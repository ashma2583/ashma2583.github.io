import type { NextConfig } from "next";

/**
 * Deployed as a static export to GitHub Pages.
 *
 * If the site lives at `ashma2583.github.io` (a user site), leave
 * NEXT_PUBLIC_BASE_PATH unset. If it lives at `ashma2583.github.io/<repo>`
 * (a project site), set NEXT_PUBLIC_BASE_PATH=/<repo> at build time — the
 * deploy workflow does this automatically.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // GitHub Pages serves directories, so emit `/projects/index.html`.
  trailingSlash: true,
  // No image optimization server exists on Pages.
  images: { unoptimized: true },
};

export default nextConfig;
