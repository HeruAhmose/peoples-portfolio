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
      "The materials-and-systems thesis takes form as a research concept joining bio-derived composites, self-powered sensing, and testable coupling hypotheses.",
    detail:
      "This chapter marks the shift from separate technical interests into a single research framework. It records an intellectual direction, not a validated device, deployed infrastructure, or operating quantum processor.",
    achievements: [
      { label: "Systems research concept" },
      { label: "Self-powered sensing thesis" },
      { label: "Testable coupling hypotheses" },
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
      "Bio-derived multifunctional composites for self-powered sensing: a filed architecture whose integrated system performance remains unvalidated.",
    detail:
      "The public record describes a U.S. provisional filing in December 2025. Constituent mechanisms have literature support; the proposed integrated architecture still requires experimental validation and falsification testing.",
    achievements: [
      { label: "Provisional patent filing", detail: "December 2025" },
      { label: "Energy-harvesting direction" },
      { label: "Quantum-sensing hypothesis" },
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
      "A public, human-authorized cybersecurity interface demo exploring shared security signals, biomimetic defense, and post-quantum readiness.",
    detail:
      "The public command surface demonstrates an evidence-bounded architecture concept. It is not represented as an autonomous operator, production security service, or proof that every proposed engine is operational.",
    achievements: [
      { label: "Public interface demo" },
      { label: "Biomimetic defense" },
      { label: "Post-quantum readiness" },
      { label: "Explicit human authorization" },
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
      "A planned digital-equity model built around paid Digital Navigators, deterministic H.K. triage, and proposed service measurement. It is not yet operating.",
    detail:
      "The public plan focuses on practical help with portals, forms, job applications, telehealth, and devices. Hub counts, navigator counts, and service volumes remain planning targets rather than active schedules or outcomes.",
    achievements: [
      { label: "Paid Navigator model" },
      { label: "Deterministic H.K. triage" },
      { label: "Proposed TechMinutes® reporting" },
      { label: "Planned hub-host model" },
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
    location: "Seven-organ Sovereignty Stack",
    summary:
      "The Sovereignty Stack becomes publicly navigable: seven independently viable, mutually reinforcing organs connected across distinct experiences without collapsing their identities.",
    detail:
      "The current build presents six distinct public experiences while preserving the seven-organ architecture, matched cinematic transport, accessibility, and a common systems language.",
    achievements: [
      { label: "Seven organs · six public experiences" },
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
