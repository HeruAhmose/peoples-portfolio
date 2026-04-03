export type ProjectCategory =
  | "cybersecurity"
  | "materials"
  | "equity"
  | "research"
  | "platform";

export type GallerySortMode = "impact" | "name" | "recent";

export type GalleryCategoryFilter = ProjectCategory | "all";

export interface ProjectLink {
  label: string;
  href: string;
}

export interface ShowcaseProject {
  id: string;
  title: string;
  shortDescription: string;
  category: ProjectCategory;
  categoryLabel: string;
  techStack: string[];
  links: ProjectLink[];
  /** Human-readable impact line (e.g. users reached, $ influenced). */
  impactLabel: string;
  /** Numeric sort key for impact ordering (higher = more prominent). */
  impactScore: number;
  /** ISO 8601 date string for “recent” sort. */
  updatedAt: string;
}

export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, string> = {
  cybersecurity: "Cybersecurity",
  materials: "Materials science",
  equity: "Digital equity",
  research: "Research",
  platform: "Platform / tooling",
};

/** Six showcase projects aligned with live initiatives (verify URLs periodically). */
export const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: "queen-califia",
    title: "Queen Califia CyberAI",
    shortDescription:
      "Sovereign cybersecurity experience — awakening sequence, hex telemetry, and audio-gated progression.",
    category: "cybersecurity",
    categoryLabel: PROJECT_CATEGORY_LABELS.cybersecurity,
    techStack: ["React", "Firebase", "Web Audio", "Canvas", "Framer Motion"],
    links: [
      { label: "Live app", href: "https://queencalifia-cyberai.web.app/" },
      {
        label: "Portfolio home",
        href: "https://github.com/HeruAhmose/peoples-portfolio",
      },
    ],
    impactLabel: "10k+ session-ready sovereign UX prototype",
    impactScore: 92,
    updatedAt: "2026-03-15",
  },
  {
    id: "tamerian-materials",
    title: "Tamerian Materials",
    shortDescription:
      "Hemp-carbon composite narrative — patents, manufacturing story, and multi-modal coupling research tie-in.",
    category: "materials",
    categoryLabel: PROJECT_CATEGORY_LABELS.materials,
    techStack: ["Marketing site", "Patent docs", "Scientific framing", "AMC"],
    links: [
      { label: "Live site", href: "https://tamerian-materials.com/" },
      {
        label: "Patent pending",
        href: "https://tamerian-materials.com/",
      },
    ],
    impactLabel: "25-claim provisional · energy & sensing storyline",
    impactScore: 95,
    updatedAt: "2026-02-20",
  },
  {
    id: "techbridge",
    title: "TechBridge Collective",
    shortDescription:
      "Free digital help desks, H.K. triage, and TechMinutes® reporting — SPAN-style rollout modeling.",
    category: "equity",
    categoryLabel: PROJECT_CATEGORY_LABELS.equity,
    techStack: [
      "Nonprofit web",
      "Impact modeling",
      "Community UX",
      "AI triage",
    ],
    links: [
      { label: "Organization", href: "https://techbridge-collective.org/" },
      {
        label: "Impact playbook",
        href: "https://techbridge-collective.org/impact",
      },
    ],
    impactLabel: "4-hub Year 2 SOM framing · Triangle pilots",
    impactScore: 88,
    updatedAt: "2026-03-01",
  },
  {
    id: "research-lab",
    title: "AMC Research Lab (Portfolio)",
    shortDescription:
      "Architected Multi-Modal Coupling — claims explorer, preprint framing, and reproducible narrative.",
    category: "research",
    categoryLabel: PROJECT_CATEGORY_LABELS.research,
    techStack: ["TypeScript", "Vite", "tRPC", "Patent claims UI", "Charts"],
    links: [
      {
        label: "Research section",
        href: "/research",
      },
    ],
    impactLabel: "Claims + figures surfaced in-product",
    impactScore: 78,
    updatedAt: "2026-03-22",
  },
  {
    id: "npower-path",
    title: "NPower Tech Fundamentals",
    shortDescription:
      "IT support training track — AD, networking, security fundamentals, and hands-on systems labs.",
    category: "platform",
    categoryLabel: PROJECT_CATEGORY_LABELS.platform,
    techStack: [
      "Windows / Linux",
      "Active Directory",
      "VPN",
      "Security basics",
    ],
    links: [
      {
        label: "NPower",
        href: "https://www.npower.org/",
      },
    ],
    impactLabel: "Cohort completion · job-ready support stack",
    impactScore: 72,
    updatedAt: "2026-02-10",
  },
  {
    id: "dynata-ops",
    title: "Dynata Research Operations",
    shortDescription:
      "High-volume remote interviews — VPN/proxy workflows, dialer discipline, and data-quality rigor.",
    category: "platform",
    categoryLabel: PROJECT_CATEGORY_LABELS.platform,
    techStack: ["VPN", "Proxy", "Dialers", "QA metrics", "Remote IT"],
    links: [
      {
        label: "Dynata",
        href: "https://www.dynata.com/",
      },
    ],
    impactLabel: "500+ interviews · 98% accuracy target",
    impactScore: 70,
    updatedAt: "2025-11-05",
  },
];

export function normalizeSearchQuery(q: string): string {
  return q.trim().toLowerCase();
}

export function projectMatchesSearch(
  project: ShowcaseProject,
  rawQuery: string
): boolean {
  const q = normalizeSearchQuery(rawQuery);
  if (!q) return true;
  const hay = [
    project.title,
    project.shortDescription,
    project.categoryLabel,
    ...project.techStack,
    project.impactLabel,
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

export function filterProjectsByCategory(
  projects: ShowcaseProject[],
  category: GalleryCategoryFilter
): ShowcaseProject[] {
  if (category === "all") return projects;
  return projects.filter(p => p.category === category);
}

export function sortShowcaseProjects(
  projects: ShowcaseProject[],
  mode: GallerySortMode
): ShowcaseProject[] {
  const copy = [...projects];
  if (mode === "impact") {
    copy.sort((a, b) => b.impactScore - a.impactScore);
  } else if (mode === "name") {
    copy.sort((a, b) => a.title.localeCompare(b.title, "en"));
  } else {
    copy.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }
  return copy;
}

export function queryShowcaseProjects(
  projects: readonly ShowcaseProject[],
  opts: {
    search: string;
    category: GalleryCategoryFilter;
    sort: GallerySortMode;
  }
): ShowcaseProject[] {
  let list = filterProjectsByCategory([...projects], opts.category);
  list = list.filter(p => projectMatchesSearch(p, opts.search));
  return sortShowcaseProjects(list, opts.sort);
}

export const ALL_GALLERY_CATEGORIES: GalleryCategoryFilter[] = [
  "all",
  "cybersecurity",
  "materials",
  "equity",
  "research",
  "platform",
];
