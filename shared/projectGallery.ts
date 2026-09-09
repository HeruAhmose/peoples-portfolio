import { PUBLIC_WORLD_URLS } from "./publicWorlds";

export type ProjectCategory =
  "cybersecurity" | "materials" | "equity" | "research" | "platform";

export type GallerySortMode = "featured" | "name" | "category";

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
  evidenceLabel: string;
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
      "A public cybersecurity interface demo for exploring biomimetic defense, post-quantum readiness, and shared security signals under explicit human authorization.",
    category: "cybersecurity",
    categoryLabel: PROJECT_CATEGORY_LABELS.cybersecurity,
    techStack: [
      "React",
      "GitHub Pages",
      "Framer Motion",
      "Security orchestration",
      "Post-quantum design",
    ],
    links: [
      {
        label: "Live app",
        href: PUBLIC_WORLD_URLS.queenCalifia,
      },
    ],
    evidenceLabel: "Public demo · human-authorized · evidence-bound",
  },
  {
    id: "tamerian-materials",
    title: "Tamerian Materials",
    shortDescription:
      "Bio-derived multifunctional composites for self-powered sensing: a filed research architecture whose integrated performance remains unvalidated.",
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
        href: PUBLIC_WORLD_URLS.tamerian,
      },
    ],
    evidenceLabel: "Filed research concept · performance unvalidated",
  },
  {
    id: "techbridge",
    title: "TechBridge Collective",
    shortDescription:
      "A planned digital-equity model combining paid Digital Navigators, deterministic H.K. triage, and proposed measurement for real-world digital tasks. It is not yet operating.",
    category: "equity",
    categoryLabel: PROJECT_CATEGORY_LABELS.equity,
    techStack: [
      "Community UX",
      "Deterministic triage",
      "Service design",
      "Impact measurement",
      "Digital navigation",
    ],
    links: [
      {
        label: "Organization",
        href: PUBLIC_WORLD_URLS.techBridge,
      },
    ],
    evidenceLabel: "Planned model · not operating",
  },
  {
    id: "trai-organism",
    title: "TRAI",
    shortDescription:
      "The systems world connecting a seven-organ Sovereignty Stack across six public experiences without collapsing each organ's identity.",
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
        href: PUBLIC_WORLD_URLS.trai,
      },
    ],
    evidenceLabel: "Public map · seven-organ Sovereignty Stack",
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
    evidenceLabel: "Public research interface · explicit boundaries",
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
    evidenceLabel: "Documented training pathway",
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
    project.evidenceLabel,
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

  if (mode === "name") {
    copy.sort((a, b) => a.title.localeCompare(b.title, "en"));
  } else if (mode === "category") {
    copy.sort(
      (a, b) =>
        a.categoryLabel.localeCompare(b.categoryLabel, "en") ||
        a.title.localeCompare(b.title, "en")
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
