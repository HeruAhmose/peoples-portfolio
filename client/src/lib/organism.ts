import {
  ORGAN_FACTS,
  type OrganKey,
  type OrganPublicFact,
} from "../../../shared/organismFacts";
export type {
  ClaimRegister,
  EvidenceRegister,
  VentureMaturity,
} from "../../../shared/organismFacts";
import type { ClaimRegister } from "../../../shared/organismFacts";

/**
 * organism.ts — the canonical TRAI organ graph.
 *
 * TRAI has seven organs. That is true of the architecture regardless of how
 * many pages this site has, so all seven are listed here and the ignition
 * sequence names all seven.
 *
 * `route` is nullable on purpose. Two organs currently have a page on this
 * site; the other five are named, coloured and part of the circuit, but inert.
 * Naming only the ones with URLs would misrepresent the architecture by
 * omission; linking to pages that do not exist would just be broken. This is
 * the honest middle.
 *
 * `order` is anatomical, not arbitrary: substrate -> metabolism -> cognition ->
 * circulation -> surface -> reach -> return.
 *
 * Epistemic register (`claim`) drives typography:
 *   'fact'   -> mono        (filed, issued, verifiable)
 *   'build'  -> interface   (built and standing)
 *   'vision' -> display     (designed, projected, not yet real)
 * "Vast in Vision, Exact in Claim."
 */

export interface Organ extends OrganPublicFact {
  /** Stable manifest key. */
  key: OrganKey;
  /** Ring position, 0-indexed. Drives ignition order. */
  order: number;
  /** Zero-padded display index. */
  num: string;
  /** Anatomical role in the organism. */
  role: string;
  /** Venture name. */
  name: string;
  /** Sovereignty domain this organ holds. */
  domain: string;
  /** Internal route, or null when this organ has no page on this site yet. */
  route: string | null;
  /** Live external site, or null if none is standing yet. */
  external: string | null;
  /** Accent used for this organ's ignition filament. */
  hex: string;
}

export const ORGANS: Organ[] = [
  {
    key: "tamerian",
    ...ORGAN_FACTS.tamerian,
    order: 0,
    num: "01",
    role: "Skeleton",
    name: "Tamerian Materials",
    domain: "Material sovereignty",
    route: "/materials",
    external: "https://tamerian-materials.com/",
    hex: "#d6a33a",
  },
  {
    key: "true-melange",
    ...ORGAN_FACTS["true-melange"],
    order: 1,
    num: "02",
    role: "Heart",
    name: "True Mélange \u03a6",
    domain: "Biological sovereignty",
    route: null,
    external: "https://heruahmose.github.io/blue-gold-daily/layers.html",
    hex: "#a8522f",
  },
  {
    key: "queen-califia",
    ...ORGAN_FACTS["queen-califia"],
    order: 2,
    num: "03",
    role: "Brain",
    name: "Queen Califia",
    domain: "Cognitive sovereignty",
    route: null,
    external: "https://queencalifia-cyberai.web.app/",
    hex: "#6ea8da",
  },
  {
    key: "mela-nation",
    ...ORGAN_FACTS["mela-nation"],
    order: 3,
    num: "04",
    role: "Vessels",
    name: "Mela Nation",
    domain: "Mobility sovereignty",
    route: null,
    external: "https://heruahmose.github.io/trai-portfolio/mela-nation",
    hex: "#1f66ad",
  },
  {
    key: "melanina",
    ...ORGAN_FACTS.melanina,
    order: 4,
    num: "05",
    role: "Skin",
    name: "MeLaNiNa",
    domain: "Identity sovereignty",
    route: null,
    external: "https://heruahmose.github.io/trai-portfolio/melanina",
    hex: "#d98758",
  },
  {
    key: "techbridge",
    ...ORGAN_FACTS.techbridge,
    order: 5,
    num: "06",
    role: "Hands",
    name: "TechBridge Collective",
    domain: "Community reach",
    route: "/community",
    external: "https://techbridge-collective.org/",
    hex: "#2f765d",
  },
  {
    key: "peoples-foundation",
    ...ORGAN_FACTS["peoples-foundation"],
    order: 6,
    num: "07",
    role: "Lymphatic",
    name: "The Peoples Foundation",
    domain: "Regenerative return",
    route: null,
    external: "https://heruahmose.github.io/trai-portfolio/peoples-foundation",
    hex: "#f0cc79",
  },
];

/** Organs a visitor can actually navigate to right now. */
export const NAVIGABLE_ORGANS = ORGANS.filter(
  (o): o is Organ & { route: string } => o.route !== null
);

/** The organ owning a route, if any. */
export function organForRoute(path: string): Organ | undefined {
  return ORGANS.find(o => o.route !== null && o.route === path);
}

/** Accent for a route, falling back to saffron. */
export function routeAccent(path: string): string {
  return organForRoute(path)?.hex ?? "#d6a33a";
}

/** Type register mapped to this site's font variables. */
export const CLAIM_FONT: Record<ClaimRegister, string> = {
  fact: "var(--font-mono, ui-monospace, monospace)",
  build: "var(--font-sans, system-ui, sans-serif)",
  vision: "var(--font-display, Syne, sans-serif)",
};

export const CLAIM_LABEL: Record<ClaimRegister, string> = {
  fact: "Filed",
  build: "Built",
  vision: "Designed",
};

/** Fixed heptagon geometry, shared by the shader and the DOM overlay. */
export const RING_ANGLES = ORGANS.map(
  o => -Math.PI / 2 + (o.order / ORGANS.length) * Math.PI * 2
);
