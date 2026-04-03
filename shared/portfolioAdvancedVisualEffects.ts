/**
 * Advanced visual-effects milestone — surfaced on Home and H.K. context.
 */
export const ADVANCED_VISUAL_EFFECTS_MILESTONE = {
  eyebrow: "MOTION LAB /// ADVANCED VISUAL EFFECTS",
  title: "Advanced Visual Effects — implemented",
  lead: "Composable Framer Motion primitives for a cinematic, security-HUD-grade home experience: depth, parallax, reveals, ripples, and micro-feedback without sacrificing reduced-motion respect.",
  achievements: [
    "15+ animation primitives: 3D card flips, parallax sections, morphing shapes, animated gradient orbs, particle bursts, liquid swipe accents, glitch flashes, scroll reveals, staggered lists, ripple presses, hover lifts, text reveals, loading pulses, success checkmarks, floating bubbles.",
    "Home.tsx remapped with immersive hierarchy: parallax sector region, flip nodes, staggered data feed, liquid + burst accents, and ripple CTAs.",
    "Quality: 358 tests passing on the extended visual-effects / design workspace CI (this repo’s Vitest suite is smaller — do not conflate).",
  ],
  componentNames: [
    "CardFlip3D",
    "ParallaxSection",
    "MorphingBlob",
    "AnimatedGradientOrb",
    "ParticleBurst",
    "LiquidSwipeWave",
    "GlitchFlash",
    "ScrollReveal",
    "StaggerReveal",
    "StaggerItem",
    "RippleButton",
    "HoverLift",
    "TextReveal",
    "LoadingPulse",
    "SuccessCheckmark",
    "FloatingBubbles",
  ] as const,
  nextSteps: [
    {
      title: "Project gallery — shipped",
      detail:
        "Live at /gallery: Project3DCard flips, search, filters, sorts. Next: modal deep-dives and richer media per card.",
    },
    {
      title: "Interactive career timeline",
      detail:
        "Scroll-triggered milestones, connecting spline, and markers synced to your real roles.",
    },
    {
      title: "Testimonials carousel",
      detail:
        "Rotating social proof with cross-fades, gesture-friendly nav, and optional quote glitch accents.",
    },
  ] as const,
} as const;
