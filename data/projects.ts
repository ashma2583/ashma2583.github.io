export type Project = {
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  tech: string[];
  image?: string;
  github?: string;
  demo?: string;
  featured?: boolean;
  /**
   * Set when the project has a hand-built page at `app/projects/<slug>/`.
   * That static route wins over `[slug]`, so the generic README page must not
   * also generate this slug.
   */
  customPage?: boolean;
};

export const projects: Project[] = [
  {
    slug: "single-image-to-3d",
    title: "Single Image to 3D",
    description:
      "One photo in, an orbitable 3D model out — diffusion, NeRF, and Gaussian splatting written from scratch.",
    longDescription:
      "A full single-image-to-3D pipeline. The DDPM, the NeRF (with hierarchical sampling), and the Gaussian splatting rasterizer are all implemented from scratch in PyTorch, then joined to a pretrained Zero123++ multi-view diffusion model by a pose bridge that converts generated view angles into Blender-format camera matrices. Hierarchical sampling is worth +3 dB on the NeRF; the end-to-end reconstruction is blurry, and the write-up digs into why six generated views are not the same thing as six photographs.",
    tech: ["Python", "PyTorch", "NeRF", "3DGS", "Diffusion"],
    github: "https://github.com/ashma2583/3D-Reconstruction-Pipeline",
    featured: true,
    customPage: true,
  },
  {
    slug: "wattson",
    title: "Wattson",
    description:
      "Gamified energy-saving app: nurture a virtual pet by keeping the lights off.",
    longDescription:
      "Built at MHacks 2025 — winner of the Greenprint sustainability track and Best Use of FREE-WiLi. Wattson uses an OpenCV computer-vision model to detect ambient light changes every 15 seconds. Leaving lights on drains the pet's health; conserving energy earns points the player can spend on cosmetics. The frontend is a custom Pillow-rendered GUI running on a FREE-WiLi device, with a Python backend tracking health and points.",
    tech: ["Python", "OpenCV", "Pillow", "FREE-WiLi"],
    demo: "https://devpost.com/software/wattson-5btsyd",
    featured: true,
  },
  {
    slug: "shazam-clone",
    title: "Shazam Clone",
    description:
      "Audio fingerprinting clone of Shazam — spectrogram peaks to 32-bit hashes to a phone app that names the song.",
    longDescription:
      "A working Shazam clone, built over a semester with the Michigan Data Science Team. Audio is reduced to a constellation map of spectrogram peaks, pairs of peaks are packed into 32-bit hashes, and recognition becomes a database lookup scored by histogramming time offsets — so a noisy ten-second phone recording still matches the studio master. Served over Flask to a React Native client that listens through the microphone and plays back the match.",
    tech: ["Python", "SQLite", "Flask", "React Native"],
    github: "https://github.com/ashma2583/working-shazam-clone",
    featured: true,
    customPage: true,
  },
  // Hidden from the site. Uncomment to bring it back — the page is generated
  // from this entry by `app/projects/[slug]/`, so nothing else needs changing.
  // {
  //   slug: "recipe-finder",
  //   title: "Recipe Finder",
  //   description:
  //     "Full-stack recipe search app with a Python backend and a TypeScript frontend.",
  //   longDescription:
  //     "[TODO: one paragraph on what Recipe Finder does, what problem it solves, the recipe data source/API, and any interesting technical bits — e.g. how the frontend talks to the backend, search/ranking, etc.]",
  //   tech: ["Python", "TypeScript", "CSS"],
  //   github: "https://github.com/ashma2583/recipe-finder",
  //   featured: true,
  // },
  {
    slug: "testosterone-health-correlation",
    title: "Correlation: Testosterone & Health",
    description:
      "Statistical analysis in R exploring the relationship between testosterone levels and health markers.",
    longDescription:
      "Class project analyzing how testosterone levels correlate with various health indicators. [TODO: replace with the course name, dataset, methods (linear regression / hypothesis test / etc.), and one or two sentences on the key finding.]",
    tech: ["R", "ggplot2", "tidyverse"],
    github: "https://github.com/ashma2583/Correlation-Testosterone-and-Health",
    featured: true,
  },
];
