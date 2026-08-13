import { publicFactFor } from "./organismFacts";

/**
 * Short, citable facts aligned with live marketing sites (verify periodically).
 * TechBridge: https://techbridge-collective.org/impact · https://techbridge-collective.org/about
 * Tamerian: https://tamerian-materials.com/
 */
export const TAMERIAN_PATENT = {
  publicStatus: publicFactFor("tamerian").status,
  filedDate: "December 11, 2025",
  claimCount: 25,
  status: "Patent pending",
} as const;

export const TECHBRIDGE_SPAN_IMPACT_URL =
  "https://techbridge-collective.org/impact";

/** Pilot and scale targets as stated on techbridge-collective.org/impact (SPAN-verified projections). */
export const TECHBRIDGE_ROLLOUT = {
  year1Hubs: 2,
  year1Navigators: 4,
  year1PilotSites: ["Durham County Library", "Raleigh Digital Impact"] as const,
  year2Hubs: 4,
  year2ResidentsSom: 3200,
  investmentNote: "$250K total investment over 2 years",
  year2ExpansionExamples: [
    "Durham Housing Authority",
    "Raleigh Housing Authority",
    "El Centro Hispano",
  ] as const,
} as const;

/** Horace King — dates from TechBridge get-help page. */
export const HORACE_KING_LIFESPAN = "1807–1885";
