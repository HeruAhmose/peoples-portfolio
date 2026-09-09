#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const ROOTS = ["client/src", "client/public", "shared"];
const EXTENSIONS = new Set([".ts", ".tsx", ".html", ".json"]);

function walk(directory, files = []) {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    const stats = statSync(path);
    if (stats.isDirectory()) {
      if (["node_modules", "dist", ".git", "_core"].includes(entry)) continue;
      walk(path, files);
    } else if (
      EXTENSIONS.has(extname(path)) &&
      !/\.(test|spec)\.[cm]?[jt]sx?$/.test(path)
    ) {
      files.push(path);
    }
  }
  return files;
}

const files = [...ROOTS.flatMap(root => walk(root)), "README.md"];
const failures = [];

const forbidden = [
  {
    pattern: /queencalifia-cyberai\.web\.app|qc\.tamerian-materials\.com/i,
    reason: "retired Queen Califia endpoint",
  },
  {
    pattern: /§508\(c\)\(1\)\(A\)/i,
    reason: "superseded Peoples Foundation status",
  },
  {
    pattern: /\bEINs? filed\b/i,
    reason: "unsupported entity-status wording",
  },
  {
    pattern: /\bhuman-controlled autonomy\b/i,
    reason:
      "Queen Califia must be described as human-authorized and evidence-bound",
  },
  {
    pattern: /\b(?:358|376|403)\s+(?:passing\s+)?tests\b/i,
    reason: "stale or synthetic CI total",
  },
  {
    pattern: /\bimpact score\b|\bimpactScore\b|\bimpactLabel\b/,
    reason: "unsupported synthetic project scoring",
  },
  {
    pattern: /\bregenerative quantum infrastructure\b|\bnext-generation QPU\b/i,
    reason: "unvalidated infrastructure or processor claim",
  },
  {
    pattern:
      /single composite for simultaneous energy harvesting and room-temperature quantum sensing/i,
    reason: "unvalidated integrated-performance claim",
  },
  {
    pattern: /\bweekly help desk\b/i,
    reason: "TechBridge is planned and has no active public schedule",
  },
];

for (const path of files) {
  const source = readFileSync(path, "utf8");
  for (const rule of forbidden) {
    if (rule.pattern.test(source)) {
      failures.push(`${path}: ${rule.reason}`);
    }
  }
}

const projections = [
  {
    path: "client/src/components/cinematic/LatticeIgnition.tsx",
    required: [
      "Skip intro",
      "USER-PACED",
      "Ignite the lattice",
      "Reveal TRAI",
      "Enter portfolio",
      'aria-label="Peoples Portfolio cinematic introduction"',
    ],
    forbidden: ["autoAdvance", "watchdog"],
  },
  {
    path: "client/src/App.tsx",
    required: [
      'Route path="/materials"',
      'Route path="/community"',
      'Route path="/research"',
      'Route path="/gallery"',
      'Route path="/timeline"',
      'aria-controls="hk-portfolio-assistant"',
    ],
    forbidden: ["introWatchdog", "7000"],
  },
  {
    path: "client/src/pages/Home.tsx",
    required: [
      "one living Sovereignty Stack",
      "seven independently viable, mutually reinforcing organs",
      "Mandate of Mistrust",
      "evidence-bounded, human-authorized",
    ],
    forbidden: [],
  },
  {
    path: "client/index.html",
    required: ['href="%BASE_URL%favicon.svg"'],
    forbidden: ['href="/favicon'],
  },
  {
    path: "shared/organismFacts.ts",
    required: [
      "EIN obtained · tax-exempt status pending counsel confirmation",
      'maturity: "entity-formed"',
      "Designed · not yet operating",
    ],
    forbidden: ["operating-508c1a"],
  },
  {
    path: "shared/projectGallery.ts",
    required: [
      'GallerySortMode = "featured" | "name" | "category"',
      "evidenceLabel",
      "Planned model · not operating",
      "Public demo · human-authorized · evidence-bound",
    ],
    forbidden: ["updatedAt", "impactScore", "impactLabel"],
  },
  {
    path: "client/src/pages/MaterialsScience.tsx",
    required: [
      "Bio-derived multifunctional composites for self-powered sensing",
      "integrated performance remains",
      "ILLUSTRATIVE COUPLING GRAPH — NOT MEASURED DATA",
    ],
    forbidden: ["multi-node interaction (live)"],
  },
  {
    path: "client/src/pages/CommunityImpact.tsx",
    required: [
      "planned Digital Navigator hub model",
      "walk-in services are not yet operating",
      "SPAN planning projections",
      "No host organization is represented here as committed",
      "DETERMINISTIC H.K. TRIAGE",
    ],
    forbidden: ["Lakewood Elementary", "Southeast Raleigh YMCA"],
  },
  {
    path: "shared/hkSystemContext.ts",
    required: [
      "one living Sovereignty Stack",
      "Mandate of Mistrust",
      "separate regenerative-beneficiary affiliate",
      "never invent testimonials",
    ],
    forbidden: ["sort by impact", "extended-workspace CI"],
  },
  {
    path: "shared/publicWorlds.ts",
    required: [
      "https://heruahmose.github.io/QueenCalifia-CyberAI/",
      "https://tamerian-materials.com/",
      "https://techbridge-collective.org/",
      "https://heruahmose.github.io/trai-portfolio/",
    ],
    forbidden: ["web.app"],
  },
];

for (const projection of projections) {
  const source = readFileSync(projection.path, "utf8");
  for (const required of projection.required) {
    if (!source.includes(required)) {
      failures.push(
        `${projection.path}: required projection missing: ${required}`
      );
    }
  }
  for (const forbiddenText of projection.forbidden) {
    if (source.includes(forbiddenText)) {
      failures.push(
        `${projection.path}: forbidden projection present: ${forbiddenText}`
      );
    }
  }
}

if (failures.length) {
  console.error("Facts guard failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Facts guard: ${files.length} public/runtime files clean.`);
