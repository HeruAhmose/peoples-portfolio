/**
 * organismFacts.ts — public-safe verified claim projection for the TRAI graph.
 *
 * This module deliberately stores only facts approved for public presentation.
 * Supporting records may contain more detail; the client bundle should not.
 *
 * evidenceRef values are opaque traceability keys, not document contents.
 */

export type OrganKey =
  | "tamerian"
  | "true-melange"
  | "queen-califia"
  | "mela-nation"
  | "melanina"
  | "techbridge"
  | "peoples-foundation";

export type ClaimRegister = "fact" | "build" | "vision";
export type EvidenceRegister = "verified" | "operational" | "planned";

export type VentureMaturity =
  | "filed"
  | "entity-pending"
  | "demo-standing"
  | "early-development"
  | "designed"
  | "entity-formed";

export interface OrganPublicFact {
  /** Existing typography/epistemic register used by the client. */
  claim: ClaimRegister;
  /** Nature of the evidence supporting today's public statement. */
  evidence: EvidenceRegister;
  /** Current venture maturity, independent from evidence quality. */
  maturity: VentureMaturity;
  /** Public-safe status text. */
  status: string;
  /** Opaque pointer to the supporting verified-facts record. */
  evidenceRef: string;
}

export const ORGAN_FACTS = {
  tamerian: {
    claim: "fact",
    evidence: "verified",
    maturity: "filed",
    status: "U.S. provisional filed",
    evidenceRef: "verified-facts:tamerian-provisional",
  },
  "true-melange": {
    claim: "build",
    evidence: "operational",
    maturity: "entity-pending",
    status: "Formulation set · entity pending",
    evidenceRef: "verified-facts:true-melange-formulation",
  },
  "queen-califia": {
    claim: "build",
    evidence: "operational",
    maturity: "demo-standing",
    status: "Demo standing",
    evidenceRef: "verified-facts:queen-califia-demo",
  },
  "mela-nation": {
    claim: "vision",
    evidence: "planned",
    maturity: "early-development",
    status: "Early development · not operating",
    evidenceRef: "verified-facts:mela-nation-development",
  },
  melanina: {
    claim: "vision",
    evidence: "planned",
    maturity: "early-development",
    status: "Early development · not operating",
    evidenceRef: "verified-facts:melanina-development",
  },
  techbridge: {
    claim: "vision",
    evidence: "planned",
    maturity: "designed",
    status: "Designed · not yet operating",
    evidenceRef: "verified-facts:techbridge-operating-status",
  },
  "peoples-foundation": {
    claim: "build",
    evidence: "verified",
    maturity: "entity-formed",
    status: "EIN obtained · tax-exempt status pending counsel confirmation",
    evidenceRef: "verified-facts:peoples-foundation-ein",
  },
} as const satisfies Record<OrganKey, OrganPublicFact>;

export function publicFactFor(key: OrganKey): OrganPublicFact {
  return ORGAN_FACTS[key];
}
