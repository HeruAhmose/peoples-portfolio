/**
 * Career timeline milestones (2018–2026 arc) — align with résumé / About when updating.
 */
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

/** CSS variable names (see client index.css theme). */
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
  /** Longer copy shown when expanded. */
  detail?: string;
  achievements: CareerAchievementBadge[];
  markerTone: TimelineMarkerTone;
  /** Optional ribbon (e.g. “Pivot”). */
  highlight?: string;
}

export const CAREER_MILESTONES: CareerMilestone[] = [
  {
    id: "m2018-nsp-scale",
    year: 2018,
    periodLabel: "2018",
    title: "Sales & systems integration",
    org: "National Sales Partners",
    location: "Ohio",
    summary:
      "Scaled team selling with Salesforce CRM, automation, and first-touch resolution coaching across a 15-person pod.",
    detail:
      "Laid the operational spine for later IT support work: pipeline hygiene, escalation paths, and translating customer pain into ticket-style workflows before formal IT roles.",
    achievements: [
      {
        label: "CRM rollout",
        detail: "Salesforce adoption + workflow automation",
      },
      {
        label: "Team leadership",
        detail: "Coached for faster resolution paths",
      },
    ],
    markerTone: "gold",
    highlight: "Revenue engine",
  },
  {
    id: "m2019-srt",
    year: 2019,
    periodLabel: "2019",
    title: "Commercial transport operations",
    org: "Southern Refrigerated Transport",
    location: "Regional",
    summary:
      "Executed 1,200+ refrigerated loads with 99% on-time delivery, zero spoilage, and full DOT compliance.",
    detail:
      "High-stakes logistics discipline — checklists, safety culture, and uptime thinking that maps directly to production IT support habits.",
    achievements: [
      { label: "1,200+ loads" },
      { label: "100% safety record window" },
      { label: "DOT compliance" },
    ],
    markerTone: "terracotta",
  },
  {
    id: "m2020-integrity",
    year: 2020,
    periodLabel: "2020",
    title: "Energy brokerage & compliance",
    org: "Integrity Energy",
    location: "Ohio",
    summary:
      "Negotiated $500K+ in energy contracts with a 95% retention story while keeping regulatory guardrails tight.",
    detail:
      "Consultative selling under compliance pressure — documentation, risk language, and stakeholder trust similar to security-adjacent support conversations.",
    achievements: [
      { label: "$500K+ contracts" },
      { label: "95% retention" },
      { label: "Regulatory diligence" },
    ],
    markerTone: "sapphire",
    highlight: "Compliance mindset",
  },
  {
    id: "m2021-nsp-peak",
    year: 2021,
    periodLabel: "2021",
    title: "Revenue & tech support peak",
    org: "National Sales Partners",
    location: "Ohio",
    summary:
      "Pushed $1M+ in new business contribution while tightening tech-enabled sales motions and team throughput.",
    achievements: [
      { label: "$1M+ impact" },
      { label: "+40% productivity claim (CRM era)" },
      { label: "Tech+sales hybrid" },
    ],
    markerTone: "magenta",
  },
  {
    id: "m2022-relatecare",
    year: 2022,
    periodLabel: "2022",
    title: "Healthcare IT & Epic support",
    org: "RelateCare",
    location: "Remote",
    summary:
      "Patient services at scale — 10,000+ Epic users, 95% satisfaction, 90% first-contact resolution.",
    detail:
      "Formalized enterprise support: triage, empathy under HIPAA pressure, and metrics-driven call discipline.",
    achievements: [
      { label: "Epic power user support" },
      { label: "95% satisfaction" },
      { label: "90% FCR" },
    ],
    markerTone: "emerald",
    highlight: "Healthcare pivot",
  },
  {
    id: "m2023-dynata",
    year: 2023,
    periodLabel: "2023",
    title: "Research operations & secure access",
    org: "Dynata",
    location: "Remote",
    summary:
      "500+ technical interviews, VPN/proxy configuration, and 98% data-accuracy rigor on global research programs.",
    detail:
      "Remote stack hardening for interviewers — secure tunnels, session stability, and QA telemetry that mirrors SOC-style attention to detail.",
    achievements: [
      { label: "500+ interviews" },
      { label: "VPN / proxy ops" },
      { label: "98% accuracy target" },
    ],
    markerTone: "cyan",
  },
  {
    id: "m2025-npower",
    year: 2025,
    periodLabel: "2025",
    title: "NPower Tech Fundamentals",
    org: "NPower",
    location: "United States",
    summary:
      "Intensive IT support pathway — Windows/Linux/macOS, AD, networking, security labs, and virtualization drills.",
    detail:
      "Purposeful reskilling toward cybersecurity and platform support roles; cohort-driven accountability and hands-on break/fix cycles.",
    achievements: [
      { label: "IT fundamentals" },
      { label: "Security labs" },
      { label: "Alumni network" },
    ],
    markerTone: "copper",
    highlight: "Credential sprint",
  },
  {
    id: "m2026-portfolio",
    year: 2026,
    periodLabel: "2026",
    title: "Public portfolio & research stack",
    org: "Jonathan Peoples — multi-initiative",
    location: "North Carolina",
    summary:
      "Queen Califia CyberAI, Tamerian Materials, TechBridge Collective, and AMC research surfaced in one sovereign, Afrofuturistic portfolio shell.",
    detail:
      "Unifies cybersecurity storytelling, materials patent narrative, digital equity impact modeling, and reproducible research UX — built as a production-ready Vite + tRPC experience.",
    achievements: [
      { label: "CyberAI experience" },
      { label: "Patent-pending composite story" },
      { label: "Digital equity SPAN model" },
      { label: "AMC claims explorer" },
    ],
    markerTone: "gold",
    highlight: "Shipping in public",
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
  return milestones.find(m => m.id === id);
}

export function timelineYearBounds(milestones: readonly CareerMilestone[]): {
  min: number;
  max: number;
} {
  if (milestones.length === 0) return { min: NaN, max: NaN };
  let min = milestones[0]!.year;
  let max = milestones[0]!.year;
  for (const m of milestones) {
    if (m.year < min) min = m.year;
    if (m.year > max) max = m.year;
  }
  return { min, max };
}

export function totalAchievementCount(
  milestones: readonly CareerMilestone[]
): number {
  return milestones.reduce((acc, m) => acc + m.achievements.length, 0);
}

export function milestoneHasExpandableDetail(m: CareerMilestone): boolean {
  return Boolean(m.detail && m.detail.trim().length > 0);
}

export function isValidMarkerTone(x: string): x is TimelineMarkerTone {
  return (TIMELINE_MARKER_TONES as readonly string[]).includes(x);
}

export function countExpandableMilestones(
  milestones: readonly CareerMilestone[]
): number {
  return milestones.filter(milestoneHasExpandableDetail).length;
}
