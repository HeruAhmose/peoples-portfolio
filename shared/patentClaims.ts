export type ClaimCategory = "composition" | "manufacturing" | "device";
export type ClaimType = "material" | "process" | "apparatus";

export type PatentClaim = {
  number: number;
  title: string;
  description: string;
  category: ClaimCategory;
  claimType: ClaimType;
  technicalSpecs: string[];
  diagramCaption: string;
};

const accent = (cat: ClaimCategory) =>
  cat === "composition"
    ? "#ffd700"
    : cat === "manufacturing"
      ? "#00d9ff"
      : "#ff4ecd";

/** Compact schematic SVG per claim (layer stack / process / device block). */
export function buildClaimDiagramSvg(claim: PatentClaim): string {
  const stroke = accent(claim.category);
  if (claim.category === "composition") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 140" role="img" aria-label="Composition stack diagram">
      <rect width="240" height="140" fill="#0a0e27" rx="6"/>
      <text x="12" y="22" fill="#e0e0e0" font-size="11" font-family="ui-monospace, monospace">CLAIM ${claim.number}</text>
      <rect x="30" y="36" width="180" height="18" fill="none" stroke="${stroke}" stroke-width="1.5"/>
      <rect x="30" y="58" width="180" height="18" fill="none" stroke="${stroke}" stroke-width="1.5" opacity="0.85"/>
      <rect x="30" y="80" width="180" height="18" fill="none" stroke="${stroke}" stroke-width="1.5" opacity="0.7"/>
      <rect x="30" y="102" width="180" height="18" fill="none" stroke="${stroke}" stroke-width="1.5" opacity="0.55"/>
      <text x="120" y="128" fill="#a0a0a0" font-size="9" text-anchor="middle" font-family="ui-monospace, monospace">multi-layer composite coupling</text>
    </svg>`;
  }
  if (claim.category === "manufacturing") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 140" role="img" aria-label="Process flow diagram">
      <rect width="240" height="140" fill="#0a0e27" rx="6"/>
      <text x="12" y="22" fill="#e0e0e0" font-size="11" font-family="ui-monospace, monospace">CLAIM ${claim.number}</text>
      <circle cx="52" cy="72" r="14" fill="none" stroke="${stroke}" stroke-width="1.5"/>
      <line x1="66" y1="72" x2="100" y2="72" stroke="${stroke}" stroke-width="1.5"/>
      <rect x="100" y="58" width="40" height="28" fill="none" stroke="${stroke}" stroke-width="1.5"/>
      <line x1="140" y1="72" x2="174" y2="72" stroke="${stroke}" stroke-width="1.5"/>
      <polygon points="188,72 204,64 204,80" fill="${stroke}"/>
      <text x="120" y="128" fill="#a0a0a0" font-size="9" text-anchor="middle" font-family="ui-monospace, monospace">sequenced process stage</text>
    </svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 140" role="img" aria-label="Device embodiment diagram">
    <rect width="240" height="140" fill="#0a0e27" rx="6"/>
    <text x="12" y="22" fill="#e0e0e0" font-size="11" font-family="ui-monospace, monospace">CLAIM ${claim.number}</text>
    <rect x="40" y="44" width="160" height="56" fill="none" stroke="${stroke}" stroke-width="1.5" rx="4"/>
    <line x1="60" y1="100" x2="60" y2="118" stroke="${stroke}" stroke-width="1.5"/>
    <line x1="120" y1="100" x2="120" y2="118" stroke="${stroke}" stroke-width="1.5"/>
    <line x1="180" y1="100" x2="180" y2="118" stroke="${stroke}" stroke-width="1.5"/>
    <text x="120" y="132" fill="#a0a0a0" font-size="9" text-anchor="middle" font-family="ui-monospace, monospace">electrodes / readout interface</text>
  </svg>`;
}

const raw: Omit<PatentClaim, "claimType" | "diagramCaption">[] = [
  {
    number: 1,
    title: "Hemp-Carbon Matrix Pyrolysis",
    description:
      "Pyrolysis at 700–1400°C. Conductivity 10²–10⁶ S/m. Fiber Ø 5–50 μm, aspect ratios >100:1.",
    category: "composition",
    technicalSpecs: [
      "Pyrolysis temperature: 700–1400°C",
      "Conductivity: 10²–10⁶ S/m",
      "Fiber diameter: 5–50 μm",
      "Aspect ratio: >100:1",
    ],
  },
  {
    number: 2,
    title: "Crystalline Phase Integration",
    description:
      "Quartz SiO₂ (15–45%), tourmaline (3–25%), magnetite Fe₃O₄ (2–20%), rare-earth (0.3–10%).",
    category: "composition",
    technicalSpecs: [
      "Quartz SiO₂: 15–45%",
      "Tourmaline: 3–25%",
      "Magnetite Fe₃O₄: 2–20%",
      "Rare-earth elements: 0.3–10%",
    ],
  },
  {
    number: 3,
    title: "Multi-Modal Harvesting",
    description:
      "Simultaneous piezoelectric + thermoelectric + spin-Seebeck. Combined output at 250–350 K.",
    category: "composition",
    technicalSpecs: [
      "Simultaneous piezoelectric, thermoelectric, and spin-Seebeck transduction",
      "Combined output at 250–350 K",
    ],
  },
  {
    number: 4,
    title: "Quantum Sensing",
    description:
      "Eu, Nd, Er, Yb, Ce in quartz host. Self-powered quantum sensors at room temperature.",
    category: "composition",
    technicalSpecs: [
      "Lanthanide dopants: Eu, Nd, Er, Yb, Ce in quartz host",
      "Self-powered quantum sensors at room temperature",
    ],
  },
  {
    number: 5,
    title: "Polymer Binder Architecture",
    description:
      "PDMS or PVDF matrix controls spatial distribution and mechanical stress transfer.",
    category: "composition",
    technicalSpecs: [
      "PDMS or PVDF matrix",
      "Controls spatial distribution of constituents",
      "Mediates mechanical stress transfer",
    ],
  },
  {
    number: 6,
    title: "Piezoelectric Coupling",
    description:
      "Quartz and tourmaline provide dual-mode piezoelectric response with optimized orientation.",
    category: "composition",
    technicalSpecs: [
      "Quartz and tourmaline dual-mode piezoelectric response",
      "Orientation optimized for coupling efficiency",
    ],
  },
  {
    number: 7,
    title: "Pyroelectric Response",
    description:
      "Tourmaline enables thermal gradient detection with integrated signal conditioning.",
    category: "composition",
    technicalSpecs: [
      "Tourmaline enables thermal gradient detection",
      "Integrated signal conditioning",
    ],
  },
  {
    number: 8,
    title: "Ferrimagnetic Interaction",
    description:
      "Magnetite Fe₃O₄ with T_C ≈ 850–860 K enables magnetic field coupling.",
    category: "composition",
    technicalSpecs: [
      "Magnetite Fe₃O₄ constituent",
      "Curie temperature T_C ≈ 850–860 K",
      "Enables magnetic field coupling",
    ],
  },
  {
    number: 9,
    title: "Rare-Earth Dopant Embedding",
    description:
      "Lanthanide ions in crystalline hosts with optimized crystal field splitting.",
    category: "composition",
    technicalSpecs: [
      "Lanthanide ions embedded in crystalline hosts",
      "Optimized crystal field splitting",
    ],
  },
  {
    number: 10,
    title: "Electrical Conductivity Control",
    description:
      "Hemp-derived carbon matrix with tunable sp²/sp³ bonding for electron delocalization.",
    category: "composition",
    technicalSpecs: [
      "Hemp-derived carbon matrix",
      "Tunable sp²/sp³ bonding",
      "Enables electron delocalization",
    ],
  },
  {
    number: 11,
    title: "Thermal Stability",
    description:
      "Composite maintains structural integrity and transduction efficiency across -40°C to +85°C.",
    category: "composition",
    technicalSpecs: [
      "Maintains structural integrity across -40°C to +85°C",
      "Transduction efficiency preserved across range",
    ],
  },
  {
    number: 12,
    title: "Mechanical Fatigue Resistance",
    description:
      "High mechanical quality factor with tolerance to cyclic stress >10⁶ cycles.",
    category: "composition",
    technicalSpecs: [
      "High mechanical quality factor",
      "Tolerant to cyclic stress beyond 10⁶ cycles",
    ],
  },
  {
    number: 13,
    title: "Surface Area Optimization",
    description:
      "Hemp-derived activated carbons with >1500 m²/g surface area for enhanced transduction.",
    category: "composition",
    technicalSpecs: [
      "Hemp-derived activated carbon",
      "Surface area >1500 m²/g",
      "Enhances transduction",
    ],
  },
  {
    number: 14,
    title: "Biocompatibility",
    description:
      "Hemp-derived carbon and mineral constituents suitable for biomedical applications.",
    category: "composition",
    technicalSpecs: [
      "Hemp-derived carbon and mineral constituents",
      "Suitable for biomedical applications",
    ],
  },
  {
    number: 15,
    title: "Scalability",
    description:
      "Domestically available hemp feedstock enables cost-effective large-scale manufacturing.",
    category: "composition",
    technicalSpecs: [
      "Domestically available hemp feedstock",
      "Enables cost-effective large-scale manufacturing",
    ],
  },
  {
    number: 16,
    title: "Fiber Preparation Method",
    description:
      "Source, clean, and cut industrial hemp bast fibers. Pre-condition for optimal pyrolysis.",
    category: "manufacturing",
    technicalSpecs: [
      "Source industrial hemp bast fibers",
      "Clean and cut fibers",
      "Pre-condition for optimal pyrolysis",
    ],
  },
  {
    number: 17,
    title: "Pyrolysis Process",
    description:
      "Controlled heating at 700–1400°C in inert atmosphere. Temperature and duration optimize carbon yield.",
    category: "manufacturing",
    technicalSpecs: [
      "Controlled heating at 700–1400°C",
      "Inert atmosphere",
      "Temperature and duration optimize carbon yield",
    ],
  },
  {
    number: 18,
    title: "Crystal Synthesis Integration",
    description:
      "Quartz, tourmaline, magnetite, and rare-earth particles synthesized and dispersed in polymer binder.",
    category: "manufacturing",
    technicalSpecs: [
      "Quartz, tourmaline, magnetite, and rare-earth particles synthesized",
      "Dispersed in polymer binder",
    ],
  },
  {
    number: 19,
    title: "Multi-Modal Transduction Device",
    description:
      "Composite material configured as sensor or energy harvester with integrated electrodes.",
    category: "device",
    technicalSpecs: [
      "Configured as sensor or energy harvester",
      "Integrated electrodes",
    ],
  },
  {
    number: 20,
    title: "Mechanical Vibration Harvester",
    description:
      "Piezoelectric mode activated by vibration. Output >100 mV under 1g acceleration.",
    category: "device",
    technicalSpecs: [
      "Piezoelectric mode activated by vibration",
      "Output >100 mV under 1g acceleration",
    ],
  },
  {
    number: 21,
    title: "Thermal Energy Harvester",
    description:
      "Pyroelectric mode activated by thermal gradient. Output >50 mV across 10°C/min ramp.",
    category: "device",
    technicalSpecs: [
      "Pyroelectric mode activated by thermal gradient",
      "Output >50 mV across 10°C/min ramp",
    ],
  },
  {
    number: 22,
    title: "Magnetic Field Sensor",
    description:
      "Magnetite-enabled sensing of external magnetic fields with sensitivity >10 mV/mT.",
    category: "device",
    technicalSpecs: [
      "Magnetite-enabled sensing of external magnetic fields",
      "Sensitivity >10 mV/mT",
    ],
  },
  {
    number: 23,
    title: "Quantum Sensing Array",
    description:
      "Rare-earth dopants enable simultaneous detection of multiple physical parameters.",
    category: "device",
    technicalSpecs: [
      "Rare-earth dopants",
      "Simultaneous detection of multiple physical parameters",
    ],
  },
  {
    number: 24,
    title: "Integrated Signal Conditioning",
    description:
      "On-board electronics for signal amplification, filtering, and digital output.",
    category: "device",
    technicalSpecs: [
      "On-board electronics",
      "Signal amplification and filtering",
      "Digital output",
    ],
  },
  {
    number: 25,
    title: "System-Level Performance Validation",
    description:
      "End-to-end transduction with measured sensitivity, repeatability, and manufacturability.",
    category: "device",
    technicalSpecs: [
      "End-to-end transduction",
      "Measured sensitivity, repeatability, and manufacturability",
    ],
  },
];

function claimTypeFor(cat: ClaimCategory): ClaimType {
  if (cat === "composition") return "material";
  if (cat === "manufacturing") return "process";
  return "apparatus";
}

export const PATENT_CLAIMS: PatentClaim[] = raw.map(c => {
  const claimType = claimTypeFor(c.category);
  return {
    ...c,
    claimType,
    diagramCaption: `Schematic lens for Claim ${c.number}: ${c.title} (${claimType}).`,
  };
});

export const CLAIM_TYPE_LABELS: Record<ClaimType, string> = {
  material: "Material / composition",
  process: "Process / method",
  apparatus: "Apparatus / device",
};
