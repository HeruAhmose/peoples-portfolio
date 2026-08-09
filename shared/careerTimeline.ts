export type TimelineMarkerTone =
  | "gold"
  | "cyan"
  | "emerald"
  | "sapphire"
  | "terracotta"
  | "magenta"
  | "copper";

export const TIMELINE_MARKER_TONES: readonly TimelineMarkerTone[] = [
  "gold",
  "cyan",
  "emerald",
  "sapphire",
  "terracotta",
  "magenta",
  "copper",
] as const;

export const MARKER_TONE_CSS_VAR: Record<TimelineMarkerTone, string> = {
  gold: "--afro-gold",
  cyan: "--cyan",
  emerald: "--afro-emerald",
  sapphire: "--afro-sapphire",
  terracotta: "--afro-terracotta",
  magenta: "--magenta",
  copper: "--afro-copper",
};

export interface CareerAchievementBadge {
  label: string;
  detail?: string;
}

export interface CareerMilestone {
  id: string;
  year: number;
  periodLabel: string;
  title: string;
  org: string;
  location?: string;
  summary: string;
  detail?: string;
  achievements: CareerAchievementBadge[];
  markerTone: TimelineMarkerTone;
  highlight?: string;
}

export const CAREER_MILESTONES: CareerMilestone[] = [
  {
    id: "m2004-navy-football",
    year: 2004,
    periodLabel: "2004",
    title: "Football discipline meets Navy service",
    org: "United States Naval Academy / U.S. Navy",
    location: "Annapolis, MD",
    summary:
      "From Kannapolis football to Navy: listed by Naval Academy Athletics as a 2004 slot-back recruit from Kannapolis, North Carolina.",
    detail:
      "The football-to-service chapter anchors the portfolio's operating culture: preparation, repetition, accountability, team execution, and mission focus.",
    achievements: [
      { label: "Kannapolis roots" },
      { label: "Navy football recruit", detail: "Slot back · 2004" },
      { label: "U.S. Navy veteran" },
    ],
    markerTone: "gold",
    highlight: "Discipline",
  },
  {
    id: "m2024-tamerian-circuit",
    year: 2024,
    periodLabel: "2024",
    title: "The Tamerian Circuit & Project",
    org: "Tamerian",
    location: "North Carolina",
    summary:
      "The materials-and-systems thesis takes form: regenerative quantum infrastructure, biomimetic materials, and a next-generation QPU concept.",
    detail:
      "LinkedIn lists The Tamerian Circuit and The Tamerian Project as projects beginning in October 2024, marking the shift from separate technical interests into one systems framework.",
    achievements: [
      { label: "Next-generation QPU concept" },
      { label: "Regenerative infrastructure" },
      { label: "Biomimetic systems thesis" },
    ],
    markerTone: "cyan",
    highlight: "Convergence",
  },
  {
    id: "m2025-tamerian-ore",
    year: 2025,
    periodLabel: "2025",
    title: "Tamerian Ore",
    org: "Tamerian Materials",
    location: "North Carolina",
    summary:
      "A hemp-based crystalline composite thesis designed around multiple functions: energy harvesting, quantum sensing, and future information-system applications.",
    detail:
      "Jonathan's LinkedIn writing describes a U.S. provisional patent filing in December 2025 and frames the work with peer-reviewed support for the component capabilities while distinguishing what is demonstrated from what remains projected.",
    achievements: [
      { label: "Provisional patent filing", detail: "December 2025" },
      { label: "Energy harvesting" },
      { label: "Quantum sensing" },
      { label: "Materials research" },
    ],
    markerTone: "emerald",
    highlight: "Inventor",
  },
  {
    id: "m2026-queen-califia",
    year: 2026,
    periodLabel: "2026",
    title: "Queen Califia CyberAI",
    org: "Sovereign cybersecurity architecture",
    location: "Digital",
    summary:
      "A unified cybersecurity platform built from first principles around shared security signals, biomimetic defense, post-quantum readiness, and human-controlled autonomy.",
    detail:
      "LinkedIn describes Queen Califia as thirteen security engines sharing signals through one codebase, one dashboard, and one command surface.",
    achievements: [
      { label: "13-engine architecture" },
      { label: "Biomimetic defense" },
      { label: "Post-quantum readiness" },
      { label: "Human-controlled autonomy" },
    ],
    markerTone: "magenta",
    highlight: "Protect",
  },
  {
    id: "m2026-techbridge",
    year: 2026,
    periodLabel: "2026",
    title: "TechBridge Collective",
    org: "Community technology infrastructure",
    location: "Raleigh-Durham, NC",
    summary:
      "A human-centered digital-equity operating model built around paid Digital Navigators, H.K. AI triage, and measurable service delivery.",
    detail:
      "The current LinkedIn story positions TechBridge as infrastructure for people who need practical help with portals, forms, job applications, telehealth, and devices—not another abstract access campaign.",
    achievements: [
      { label: "Paid Digital Navigators" },
      { label: "H.K. AI triage" },
      { label: "TechMinutes® reporting" },
      { label: "Hub-host model" },
    ],
    markerTone: "sapphire",
    highlight: "Expand access",
  },
  {
    id: "m2026-organism",
    year: 2026,
    periodLabel: "NOW",
    title: "One connected organism",
    org: "Peoples Portfolio + TRAI + connected worlds",
    location: "Six-world digital ecosystem",
    summary:
      "The portfolio becomes an interoperable organism: founder story, materials, cybersecurity, research, AI, and community infrastructure connected without collapsing their distinct identities.",
    detail:
      "The current build preserves six separate worlds while giving each one a shared portal, matched cinematic transport, accessibility, and a common systems language.",
    achievements: [
      { label: "Six connected worlds" },
      { label: "Cinematic transport" },
      { label: "Accessible interaction" },
      { label: "Founder-centered narrative" },
    ],
    markerTone: "copper",
    highlight: "Living system",
  },
];

export function milestonesSortedChronological(
  milestones: readonly CareerMilestone[]
): CareerMilestone[] {
  return [...milestones].sort((a, b) => a.year - b.year);
}

export function getMilestoneById(
  id: string,
  milestones: readonly CareerMilestone[] = CAREER_MILESTONES
): CareerMilestone | undefined {
  return milestones.find(milestone => milestone.id === id);
}

export function timelineYearBounds(milestones: readonly CareerMilestone[]): {
  min: number;
  max: number;
} {
  if (milestones.length === 0) {
    return { min: Number.NaN, max: Number.NaN };
  }

  return {
    min: Math.min(...milestones.map(milestone => milestone.year)),
    max: Math.max(...milestones.map(milestone => milestone.year)),
  };
}

export function totalAchievementCount(
  milestones: readonly CareerMilestone[]
): number {
  return milestones.reduce(
    (total, milestone) => total + milestone.achievements.length,
    0
  );
}

export function milestoneHasExpandableDetail(
  milestone: CareerMilestone
): boolean {
  return Boolean(milestone.detail?.trim());
}

export function isValidMarkerTone(value: string): value is TimelineMarkerTone {
  return (TIMELINE_MARKER_TONES as readonly string[]).includes(value);
}

export function countExpandableMilestones(
  milestones: readonly CareerMilestone[]
): number {
  return milestones.filter(milestoneHasExpandableDetail).length;
}
