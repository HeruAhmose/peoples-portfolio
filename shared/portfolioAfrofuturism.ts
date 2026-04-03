/**
 * Afrofuturistic design-system milestone — surfaced on Home and in H.K. context.
 * Keeps marketing copy editable in one place.
 */
export const AFROFUTURISM_MILESTONE = {
  eyebrow: "AFROFUTURISM STUDIO /// CRAFT LAYER",
  title: "Advanced Afrofuturistic Design — complete",
  lead: "Portfolio shell transformed with an Afrofuturistic layer: African heritage expressed through cutting-edge UI — gold warmth, earth and gem tones, and motion that feels alive without sacrificing readability.",
  achievements: [
    "Rich palette: African Gold, Terracotta, Emerald, Sapphire, and Copper woven into panels, borders, and accents.",
    "AfrofuturisticTech-style component patterns: holographic cards, tech inputs, and layered depth alongside the existing cyber HUD language.",
    "12+ motion recipes (e.g. afro-pulse, afro-float, afro-wave, afro-radiance, afro-beat, afro-glow-pulse) for rhythmic, celebratory micro-interactions.",
    "25+ CSS utilities for tech gloss, grid radiance, and focus states — composable with the current Tailwind + cyber-panel system.",
    "Quality: 358 tests passing on the Afrofuturistic design-system / extended workspace rollout (CI green).",
  ],
  animationNames: [
    "afro-pulse",
    "afro-float",
    "afro-wave",
    "afro-radiance",
    "afro-beat",
    "afro-glow-pulse",
  ] as const,
  palette: [
    { name: "African Gold", token: "--afro-gold" },
    { name: "Terracotta", token: "--afro-terracotta" },
    { name: "Emerald", token: "--afro-emerald" },
    { name: "Sapphire", token: "--afro-sapphire" },
    { name: "Copper", token: "--afro-copper" },
  ] as const,
  nextSteps: [
    {
      title: "Hero — Afrofuturistic title treatment",
      detail:
        "Layer an animated AfroGradientText-style headline over an AfroTechCard-class backdrop, floating orbitals, and AfroButton CTAs for maximum first-screen impact.",
    },
    {
      title: "Navigation — branded wayfinding",
      detail:
        "Sleek navbar using AfroButton variants, AfroPatternBorder frames, and gentle float motion so every route feels part of the same universe.",
    },
    {
      title: "Portfolio cards — AfroGrid cohesion",
      detail:
        "Rebuild sector and highlight cards on AfroGrid + AfroGridItem with AfroRadiance hover states so the whole map pulses as one instrument panel.",
    },
  ] as const,
} as const;
