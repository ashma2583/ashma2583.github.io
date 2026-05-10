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
};

export const projects: Project[] = [
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
    slug: "recipe-finder",
    title: "Recipe Finder",
    description:
      "Full-stack recipe search app with a Python backend and a TypeScript frontend.",
    longDescription:
      "[TODO: one paragraph on what Recipe Finder does, what problem it solves, the recipe data source/API, and any interesting technical bits — e.g. how the frontend talks to the backend, search/ranking, etc.]",
    tech: ["Python", "TypeScript", "CSS"],
    github: "https://github.com/ashma2583/recipe-finder",
    featured: true,
  },
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
