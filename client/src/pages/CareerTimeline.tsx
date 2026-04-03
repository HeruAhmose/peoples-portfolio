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
    <div className="min-h-screen pb-24">
      <section className="container mx-auto px-4 py-14 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="font-mono text-[10px] tracking-[0.35em] text-cyan-400/85 md:text-xs">
            CAREER SPINE /// SCROLL-TRIGGERED
          </p>
          <h1 className="font-display mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            <HolographicText variant="sovereign" className="font-bold">
              CAREER TIMELINE
            </HolographicText>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Eight milestones from 2018–2026 — alternating layout, tone-mapped
            markers, and expandable deep-dives. Scroll to reveal each era.
          </p>
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="mt-6 font-mono text-xs tracking-[0.2em] text-primary underline-offset-4 hover:underline"
          >
            ← BACK TO HOME
          </button>
        </motion.div>

        <div className="relative mx-auto mt-16 max-w-5xl">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-0 bottom-0 left-[31px] w-0.5 rounded-full md:left-1/2 md:-translate-x-1/2"
            style={{
              transformOrigin: "top center",
              background:
                "linear-gradient(180deg, color-mix(in oklch, var(--afro-gold) 65%, transparent), color-mix(in oklch, var(--cyan) 55%, transparent), color-mix(in oklch, var(--afro-sapphire) 50%, transparent))",
            }}
            initial={reduce ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
          />

          <div className="relative z-[1]">
            {milestones.map((m, i) => (
              <TimelineEvent key={m.id} milestone={m} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-12">
        <ScrollReveal>
          <div className="cyber-panel mx-auto max-w-4xl px-6 py-10 md:px-10">
            <p className="font-mono text-[10px] tracking-[0.32em] text-cyan-400/85">
              {CAREER_TIMELINE_MILESTONE.eyebrow}
            </p>
            <h2 className="font-hero-display mt-3 text-xl font-bold text-foreground md:text-2xl">
              {CAREER_TIMELINE_MILESTONE.title}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">
              {CAREER_TIMELINE_MILESTONE.lead}
            </p>
            <ul className="mt-6 space-y-2 text-sm text-foreground/85">
              {CAREER_TIMELINE_MILESTONE.achievements.map(line => (
                <li
                  key={line}
                  className="border-l-2 border-emerald-500/35 pl-3"
                >
                  {line}
                </li>
              ))}
            </ul>
            <div className="mt-8 border-t border-white/10 pt-6">
              <h3 className="font-display text-sm font-semibold text-foreground">
                Next steps
              </h3>
              <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
                {CAREER_TIMELINE_MILESTONE.nextSteps.map((s, i) => (
                  <li key={s.title}>
                    <span className="font-mono text-primary/90">{i + 1}. </span>
                    <span className="font-medium text-foreground/90">
                      {s.title}:{" "}
                    </span>
                    {s.detail}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
