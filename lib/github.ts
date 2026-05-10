export type GitHubRepo = {
  description: string | null;
  stargazers_count: number;
  language: string | null;
  pushed_at: string;
  topics: string[];
  html_url: string;
};

function parseRepo(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git|\/|$)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

function authHeaders(): HeadersInit {
  const headers: HeadersInit = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

const isDev = process.env.NODE_ENV !== "production";
const fetchOpts = isDev
  ? ({ cache: "no-store" } as const)
  : ({ next: { revalidate: 3600 } } as const);

export async function fetchRepo(url: string): Promise<GitHubRepo | null> {
  const parsed = parseRepo(url);
  if (!parsed) return null;
  const { owner, repo } = parsed;

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: authHeaders(),
      ...fetchOpts,
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchReadme(url: string): Promise<string | null> {
  const parsed = parseRepo(url);
  if (!parsed) return null;
  const { owner, repo } = parsed;

  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: { ...authHeaders(), Accept: "application/vnd.github.raw" },
        ...fetchOpts,
      },
    );
    if (!res.ok) return null;
    return res.text();
  } catch {
    return null;
  }
}
