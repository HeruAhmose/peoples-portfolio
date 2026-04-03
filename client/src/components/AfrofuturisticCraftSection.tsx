import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { AFROFUTURISM_MILESTONE } from "@shared/portfolioAfrofuturism";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function AfrofuturisticCraftSection() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-48px" }}
        transition={{ duration: 0.65 }}
        className="afro-craft-panel relative mx-auto max-w-4xl overflow-hidden px-6 py-10 md:px-10 md:py-12"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, var(--afro-gold) 0%, transparent 45%),
              radial-gradient(circle at 80% 60%, var(--afro-sapphire) 0%, transparent 40%),
              radial-gradient(circle at 50% 100%, var(--afro-emerald) 0%, transparent 50%)`,
          }}
        />
        <div className="relative">
          <p className="font-mono text-[10px] tracking-[0.35em] text-[color:color-mix(in_oklch,var(--afro-copper)_88%,white)] md:text-xs">
            {AFROFUTURISM_MILESTONE.eyebrow}
          </p>
          <div
            className="afro-spectrum-bar mt-4 max-w-md"
            style={
              reduceMotion ? { animation: "none", opacity: 0.95 } : undefined
            }
          />
          <h2 className="font-display mt-6 text-xl font-bold tracking-tight text-foreground md:text-2xl">
            {AFROFUTURISM_MILESTONE.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            {AFROFUTURISM_MILESTONE.lead}
          </p>

          <ul className="mt-6 space-y-3 text-sm leading-relaxed text-foreground/88">
            {AFROFUTURISM_MILESTONE.achievements.map(line => (
              <li
                key={line}
                className="flex gap-3 border-l-2 border-[color:color-mix(in_oklch,var(--afro-emerald)_45%,transparent)] pl-3"
              >
                <Sparkles
                  className="mt-0.5 h-4 w-4 shrink-0 text-[color:color-mix(in_oklch,var(--afro-gold)_90%,transparent)]"
                  aria-hidden
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <p className="font-mono text-[10px] tracking-[0.28em] text-muted-foreground">
              PALETTE /// SIGNAL CHIPS
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {AFROFUTURISM_MILESTONE.palette.map(({ name, token }) => (
                <li
                  key={token}
                  className="rounded-full border border-white/10 bg-background/40 px-3 py-1 font-mono text-[10px] tracking-wide text-foreground/90 backdrop-blur-sm md:text-xs"
                  style={{
                    borderColor: `color-mix(in oklch, var(${token}) 42%, transparent)`,
                    boxShadow: `0 0 14px -4px var(${token})`,
                  }}
                >
                  <span
                    className="mr-2 inline-block h-2 w-2 rounded-full align-middle"
                    style={{ background: `var(${token})` }}
                    aria-hidden
                  />
                  {name}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <p className="font-mono text-[10px] tracking-[0.28em] text-muted-foreground">
              MOTION LIBRARY /// NAMED RECIPES
            </p>
            <p className="mt-2 font-mono text-xs leading-relaxed text-foreground/80">
              {AFROFUTURISM_MILESTONE.animationNames.join(" · ")}
              <span className="text-muted-foreground"> · +6 more</span>
            </p>
          </div>

          <div className="mt-10 border-t border-white/10 pt-8">
            <h3 className="font-display text-sm font-semibold tracking-wide text-foreground">
              Next steps on the roadmap
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Synergistic upgrades that fold this craft layer through hero, nav,
              and every portfolio card.
            </p>
            <ol className="mt-5 space-y-4">
              {AFROFUTURISM_MILESTONE.nextSteps.map((step, i) => (
                <li
                  key={step.title}
                  className="afro-radiance-hover rounded-lg border border-white/5 bg-background/25 p-4 transition-colors hover:border-[color:color-mix(in_oklch,var(--afro-sapphire)_35%,transparent)]"
                >
                  <span className="font-mono text-[10px] tracking-[0.2em] text-[color:color-mix(in_oklch,var(--afro-copper)_85%,white)]">
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
        </div>
      </motion.div>
    </section>
  );
}
