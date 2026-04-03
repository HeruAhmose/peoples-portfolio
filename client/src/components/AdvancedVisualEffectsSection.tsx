import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ADVANCED_VISUAL_EFFECTS_MILESTONE } from "@shared/portfolioAdvancedVisualEffects";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ScrollReveal } from "@/components/AdvancedVisualEffects";

export default function AdvancedVisualEffectsSection() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <ScrollReveal>
        <motion.div
          className="cyber-panel relative mx-auto max-w-4xl overflow-hidden px-6 py-10 md:px-10 md:py-12"
          style={{
            boxShadow:
              "0 0 0 1px color-mix(in oklch, var(--cyan) 28%, transparent), 0 18px 50px oklch(0.04 0.05 270 / 0.55)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `repeating-linear-gradient(
                -12deg,
                transparent,
                transparent 12px,
                color-mix(in oklch, var(--cyan) 35%, transparent) 12px,
                color-mix(in oklch, var(--cyan) 35%, transparent) 13px
              )`,
            }}
          />
          <div className="relative">
            <p className="font-mono text-[10px] tracking-[0.35em] text-cyan-400/85 md:text-xs">
              {ADVANCED_VISUAL_EFFECTS_MILESTONE.eyebrow}
            </p>
            <h2 className="font-hero-display mt-4 text-xl font-bold tracking-tight text-foreground md:text-2xl">
              {ADVANCED_VISUAL_EFFECTS_MILESTONE.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              {ADVANCED_VISUAL_EFFECTS_MILESTONE.lead}
            </p>

            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-foreground/88">
              {ADVANCED_VISUAL_EFFECTS_MILESTONE.achievements.map(line => (
                <li
                  key={line}
                  className="flex gap-3 border-l-2 border-cyan-500/35 pl-3"
                >
                  <Sparkles
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary/90"
                    aria-hidden
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <p className="font-mono text-[10px] tracking-[0.28em] text-muted-foreground">
                COMPONENT LIBRARY /// EXPORTS
              </p>
              <p className="mt-2 font-mono text-[11px] leading-relaxed text-foreground/80 md:text-xs">
                {ADVANCED_VISUAL_EFFECTS_MILESTONE.componentNames.join(" · ")}
              </p>
            </div>

            <div className="mt-10 border-t border-white/10 pt-8">
              <h3 className="font-display text-sm font-semibold tracking-wide text-foreground">
                Next steps on the roadmap
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Gallery, timeline, and testimonials — each with the same motion
                vocabulary as the home shell.
              </p>
              <ol className="mt-5 space-y-4">
                {ADVANCED_VISUAL_EFFECTS_MILESTONE.nextSteps.map((step, i) => (
                  <li
                    key={step.title}
                    className="rounded-lg border border-white/5 bg-background/25 p-4 transition-colors hover:border-cyan-500/25"
                  >
                    <span className="font-mono text-[10px] tracking-[0.2em] text-primary/85">
                      {String(i + 1).padStart(2, "0")} ///
                    </span>
                    <p className="font-display mt-1 text-sm font-semibold text-foreground">
                      {step.title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.detail}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            {!reduceMotion && (
              <motion.div
                className="pointer-events-none absolute -right-6 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_70%)] opacity-70 blur-2xl"
                animate={{ opacity: [0.35, 0.65, 0.35], scale: [1, 1.08, 1] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                aria-hidden
              />
            )}
          </div>
        </motion.div>
      </ScrollReveal>
    </section>
  );
}
