export type ProjectCategory =
  "cybersecurity" | "materials" | "equity" | "research" | "platform";

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
  impactLabel: string;
  impactScore: number;
  updatedAt: string;
}

export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, string> = {
  cybersecurity: "Cybersecurity",
  materials: "Materials science",
  equity: "Digital equity",
  research: "Research",
  platform: "Platform / tooling",
};

export const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: "queen-califia",
    title: "Queen Califia CyberAI",
    shortDescription:
      "Sovereign cybersecurity architecture with biomimetic defense, post-quantum readiness, unified security signals, and human-controlled autonomy.",
    category: "cybersecurity",
    categoryLabel: PROJECT_CATEGORY_LABELS.cybersecurity,
    techStack: [
      "React",
      "Firebase Hosting",
      "Framer Motion",
      "Security orchestration",
      "Post-quantum design",
    ],
    links: [
      {
        label: "Live app",
        href: "https://queencalifia-cyberai.web.app/",
      },
    ],
    impactLabel: "Sovereign multi-engine security architecture",
    impactScore: 94,
    updatedAt: "2026-08-07",
  },
  {
    id: "tamerian-materials",
    title: "Tamerian Materials",
    shortDescription:
      "Advanced-materials work centered on a hemp-based crystalline composite thesis spanning energy harvesting, sensing, and future information systems.",
    category: "materials",
    categoryLabel: PROJECT_CATEGORY_LABELS.materials,
    techStack: [
      "Materials research",
      "Biomimetic systems",
      "Energy harvesting",
      "Quantum-sensing concepts",
      "Interactive research UX",
    ],
    links: [
      {
        label: "Live site",
        href: "https://tamerian-materials.com/",
      },
    ],
    impactLabel: "Materials + energy + sensing research program",
    impactScore: 96,
    updatedAt: "2026-08-07",
  },
  {
    id: "techbridge",
    title: "TechBridge Collective",
    shortDescription:
      "Community technology infrastructure combining paid Digital Navigators, H.K. AI triage, and measurable support for real-world digital tasks.",
    category: "equity",
    categoryLabel: PROJECT_CATEGORY_LABELS.equity,
    techStack: [
      "Community UX",
      "AI triage",
      "Service design",
      "Impact measurement",
      "Digital navigation",
    ],
    links: [
      {
        label: "Organization",
        href: "https://techbridge-collective.org/",
      },
    ],
    impactLabel: "Human-centered digital-equity infrastructure",
    impactScore: 90,
    updatedAt: "2026-08-07",
  },
  {
    id: "trai-organism",
    title: "TRAI",
    shortDescription:
      "The systems world connecting research, interfaces, orchestration, six-world navigation, and cinematic cross-site transport without collapsing each world's identity.",
    category: "platform",
    categoryLabel: PROJECT_CATEGORY_LABELS.platform,
    techStack: [
      "React",
      "TypeScript",
      "Vite",
      "Wouter",
      "Framer Motion",
      "Accessible interaction",
    ],
    links: [
      {
        label: "Enter TRAI",
        href: "https://heruahmose.github.io/trai-portfolio/",
      },
    ],
    impactLabel: "Six-world interoperable organism",
    impactScore: 93,
    updatedAt: "2026-08-07",
  },
  {
    id: "research-lab",
    title: "Research Lab",
    shortDescription:
      "Interactive research surfaces for claims, figures, technical hypotheses, evidence boundaries, and reproducible systems thinking.",
    category: "research",
    categoryLabel: PROJECT_CATEGORY_LABELS.research,
    techStack: [
      "TypeScript",
      "Vite",
      "Research UX",
      "Charts",
      "Evidence mapping",
    ],
    links: [
      {
        label: "Research section",
        href: "/research",
      },
    ],
    impactLabel: "Evidence-first research interface",
    impactScore: 82,
    updatedAt: "2026-08-07",
  },
  {
    id: "npower-path",
    title: "NPower Technology & Cybersecurity Training",
    shortDescription:
      "Technology and cybersecurity training supporting the transition from service and operations into modern systems, security, and infrastructure work.",
    category: "platform",
    categoryLabel: PROJECT_CATEGORY_LABELS.platform,
    techStack: [
      "Windows",
      "Linux",
      "Networking",
      "Security fundamentals",
      "Systems administration",
    ],
    links: [
      {
        label: "NPower",
        href: "https://www.npower.org/",
      },
    ],
    impactLabel: "Technology and cybersecurity training",
    impactScore: 72,
    updatedAt: "2026-08-07",
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

  if (!q) {
    return true;
  }

  const haystack = [
    project.title,
    project.shortDescription,
    project.categoryLabel,
    ...project.techStack,
    project.impactLabel,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(q);
}

export function filterProjectsByCategory(
  projects: ShowcaseProject[],
  category: GalleryCategoryFilter
): ShowcaseProject[] {
  if (category === "all") {
    return projects;
  }

  return projects.filter(project => project.category === category);
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
  options: {
    search: string;
    category: GalleryCategoryFilter;
    sort: GallerySortMode;
  }
): ShowcaseProject[] {
  let list = filterProjectsByCategory([...projects], options.category);
  list = list.filter(project => projectMatchesSearch(project, options.search));

  return sortShowcaseProjects(list, options.sort);
}

export const ALL_GALLERY_CATEGORIES: GalleryCategoryFilter[] = [
  "all",
  "cybersecurity",
  "materials",
  "equity",
  "research",
  "platform",
];
