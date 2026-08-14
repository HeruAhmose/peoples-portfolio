import { useEffect } from "react";
import { motion } from "framer-motion";
import { HolographicText } from "@/components/AdvancedVisuals";
import { ScrollReveal } from "@/components/AdvancedVisualEffects";
import TimelineEvent from "@/components/TimelineEvent";
import { usePortfolioAnalytics } from "@/hooks/usePortfolioAnalytics";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  CAREER_MILESTONES,
  milestonesSortedChronological,
} from "@shared/careerTimeline";
import { CAREER_TIMELINE_MILESTONE } from "@shared/portfolioCareerTimelineMilestone";

interface CareerTimelineProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

export default function CareerTimeline({ onNavigate }: CareerTimelineProps) {
  const { logSectionView } = usePortfolioAnalytics();
  const reduce = usePrefersReducedMotion();
  const milestones = milestonesSortedChronological(CAREER_MILESTONES);

  useEffect(() => {
    logSectionView("timeline");
  }, [logSectionView]);

  return (
    <div className="min-h-screen pb-24" data-peoples-founder-journey="v5.5.1">
      <section className="container mx-auto px-4 py-14 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-cyan-300/14 bg-black/20 px-5 py-10 text-center md:px-10 md:py-14"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-35"
            style={{
              backgroundImage:
                "linear-gradient(rgba(103,232,249,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(251,191,36,.05) 1px,transparent 1px)",
              backgroundSize: "46px 46px",
              maskImage:
                "radial-gradient(circle at center,black 0%,transparent 75%)",
            }}
            aria-hidden
          />

          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/12"
            animate={reduce ? {} : { rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            aria-hidden
          />

          <div className="relative">
            <p className="font-mono text-[10px] tracking-[0.35em] text-cyan-300/80 md:text-xs">
              LINEAGE ENGINE /// SERVICE → INVENTION → SYSTEMS
            </p>
            <h1 className="font-display mt-4 text-4xl font-black tracking-tight md:text-6xl">
              <HolographicText variant="sovereign" className="font-black">
                FOUNDER JOURNEY
              </HolographicText>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Born in Salisbury and raised in Kannapolis. Football and Navy
              service formed the discipline. The current chapter is about
              building materials, security systems, AI, and community
              infrastructure that did not exist in this form before.
            </p>

            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="mt-7 rounded-full border border-cyan-300/25 bg-cyan-300/[0.04] px-5 py-2 font-mono text-[9px] tracking-[0.2em] text-primary transition hover:border-cyan-200/55 hover:bg-cyan-300/[0.08]"
            >
              ← RETURN TO FOUNDER WORLD
            </button>
          </div>
        </motion.div>

        <div className="relative mx-auto mt-16 max-w-5xl">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-[31px] top-0 w-0.5 rounded-full md:left-1/2 md:-translate-x-1/2"
            style={{
              transformOrigin: "top center",
              background:
                "linear-gradient(180deg,color-mix(in oklch,var(--afro-gold) 72%,transparent),color-mix(in oklch,var(--cyan) 58%,transparent),color-mix(in oklch,var(--afro-sapphire) 52%,transparent))",
              boxShadow: "0 0 24px rgba(34,211,238,.18)",
            }}
            initial={reduce ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
          />

          <div className="relative z-[1]">
            {milestones.map((milestone, index) => (
              <TimelineEvent
                key={milestone.id}
                milestone={milestone}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-12">
        <ScrollReveal>
          <div className="cyber-panel relative mx-auto max-w-4xl overflow-hidden px-6 py-10 md:px-10">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full border border-amber-300/12"
              aria-hidden
            />
            <div className="relative">
              <p className="font-mono text-[10px] tracking-[0.32em] text-cyan-300/80">
                {CAREER_TIMELINE_MILESTONE.eyebrow}
              </p>
              <h2 className="font-hero-display mt-3 text-xl font-bold text-foreground md:text-2xl">
                {CAREER_TIMELINE_MILESTONE.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                {CAREER_TIMELINE_MILESTONE.lead}
              </p>

              <ul className="mt-6 space-y-2 text-sm text-foreground/82">
                {CAREER_TIMELINE_MILESTONE.achievements.map(line => (
                  <li key={line} className="border-l-2 border-cyan-300/25 pl-3">
                    {line}
                  </li>
                ))}
              </ul>

              <div className="mt-8 border-t border-white/10 pt-6">
                <h3 className="font-display text-sm font-semibold text-foreground">
                  Next evidence layers
                </h3>
                <ol className="mt-3 space-y-3 text-sm text-muted-foreground">
                  {CAREER_TIMELINE_MILESTONE.nextSteps.map((step, index) => (
                    <li key={step.title}>
                      <span className="font-mono text-primary/90">
                        {index + 1}.{" "}
                      </span>
                      <span className="font-medium text-foreground/90">
                        {step.title}:{" "}
                      </span>
                      {step.detail}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
