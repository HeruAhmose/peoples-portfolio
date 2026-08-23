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

const founderArchive = [
  {
    src: "/media/founder/football/kannapolis-action.webp",
    alt: "Jonathan Peoples during his Kannapolis football years",
    label: "FORMATION",
    caption: "Competition, repetition, discipline",
  },
  {
    src: "/media/founder/navy/academy-yearbook.webp",
    alt: "Archival Navy academy yearbook image from Jonathan Peoples' service chapter",
    label: "SERVICE",
    caption: "Duty, systems, accountability",
  },
  {
    src: "/media/founder/hero/founder-present-portrait.webp",
    alt: "Jonathan Peoples, founder and systems builder",
    label: "BUILD",
    caption: "Matter, intelligence, infrastructure",
  },
] as const;

export default function CareerTimeline({ onNavigate }: CareerTimelineProps) {
  const { logSectionView } = usePortfolioAnalytics();
  const reduce = usePrefersReducedMotion();
  const milestones = milestonesSortedChronological(CAREER_MILESTONES);

  useEffect(() => {
    logSectionView("timeline");
  }, [logSectionView]);

  return (
    <div className="min-h-screen pb-24" data-peoples-founder-journey="v6-prestige">
      <section className="container mx-auto px-4 py-14 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-black/35 shadow-[0_36px_120px_rgba(0,0,0,.45)]"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(rgba(103,232,249,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(251,191,36,.045) 1px,transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage:
                "radial-gradient(circle at 35% 45%,black 0%,transparent 78%)",
            }}
            aria-hidden
          />
          <div className="relative grid gap-8 p-5 md:grid-cols-[1.03fr_.97fr] md:p-10 lg:p-12">
            <div className="flex flex-col justify-center">
              <p className="font-mono text-[10px] tracking-[0.36em] text-cyan-300/80 md:text-xs">
                LINEAGE ENGINE /// SERVICE → INVENTION → SYSTEMS
              </p>
              <h1 className="font-display mt-5 text-4xl font-black tracking-tight md:text-6xl lg:text-7xl">
                <HolographicText variant="sovereign" className="font-black">
                  FOUNDER JOURNEY
                </HolographicText>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-foreground/75 md:text-lg">
                A life organized around service, systems, and civilization-scale
                design — from Kannapolis and Navy service into advanced
                materials, sovereign intelligence, digital equity, and the
                connected TRAI organism.
              </p>
              <div className="mt-8 grid max-w-xl grid-cols-3 gap-2">
                {["SERVICE", "INVENTION", "SOVEREIGNTY"].map((label, index) => (
                  <div
                    key={label}
                    className="rounded-xl border border-white/10 bg-white/[0.025] px-3 py-3"
                  >
                    <div className="font-mono text-[9px] tracking-[0.2em] text-primary/75">
                      0{index + 1}
                    </div>
                    <div className="mt-1 font-mono text-[9px] tracking-[0.14em] text-foreground/80 md:text-[10px]">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => onNavigate("home")}
                className="mt-8 w-fit rounded-full border border-cyan-300/25 bg-cyan-300/[0.04] px-5 py-2.5 font-mono text-[9px] tracking-[0.2em] text-primary transition hover:border-cyan-200/55 hover:bg-cyan-300/[0.08]"
              >
                ← RETURN TO FOUNDER WORLD
              </button>
            </div>

            <div className="relative min-h-[30rem] overflow-hidden rounded-[1.6rem] border border-white/10 bg-black/30 p-3 md:min-h-[36rem]">
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-cyan-300/12"
                animate={reduce ? {} : { rotate: 360 }}
                transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
              />
              <div className="grid h-full grid-cols-2 grid-rows-2 gap-3">
                {founderArchive.map((image, index) => (
                  <motion.figure
                    key={image.src}
                    initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: reduce ? 0 : 0.15 + index * 0.12 }}
                    className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-black/45 ${
                      index === 2 ? "col-span-2" : ""
                    }`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-full w-full object-cover object-center opacity-75 grayscale-[18%] transition duration-700 group-hover:scale-[1.025] group-hover:opacity-90"
                      loading={index === 2 ? "eager" : "lazy"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                    <figcaption className="absolute inset-x-0 bottom-0 p-4">
                      <span className="font-mono text-[9px] tracking-[0.22em] text-cyan-200/80">
                        {image.label}
                      </span>
                      <p className="mt-1 text-xs font-medium text-white/85 md:text-sm">
                        {image.caption}
                      </p>
                    </figcaption>
                  </motion.figure>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="relative mx-auto mt-20 max-w-5xl">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-[31px] top-0 w-0.5 rounded-full md:left-1/2 md:-translate-x-1/2"
            style={{
              transformOrigin: "top center",
              background:
                "linear-gradient(180deg,color-mix(in oklch,var(--afro-gold) 72%,transparent),color-mix(in oklch,var(--cyan) 58%,transparent),color-mix(in oklch,var(--afro-sapphire) 52%,transparent))",
              boxShadow: "0 0 28px rgba(34,211,238,.2)",
            }}
            initial={reduce ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="relative z-[1]">
            {milestones.map((milestone, index) => (
              <TimelineEvent key={milestone.id} milestone={milestone} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-12">
        <ScrollReveal>
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-cyan-300/14 bg-[linear-gradient(145deg,rgba(8,14,22,.94),rgba(4,7,12,.98))] px-6 py-10 shadow-[0_30px_100px_rgba(0,0,0,.34)] md:px-10 lg:px-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-amber-300/12" aria-hidden />
            <div className="relative">
              <p className="font-mono text-[10px] tracking-[0.32em] text-cyan-300/80">
                {CAREER_TIMELINE_MILESTONE.eyebrow}
              </p>
              <h2 className="font-hero-display mt-4 max-w-4xl text-2xl font-bold leading-tight text-foreground md:text-4xl">
                {CAREER_TIMELINE_MILESTONE.title}
              </h2>
              <p className="mt-5 max-w-4xl text-sm leading-relaxed text-muted-foreground md:text-base">
                {CAREER_TIMELINE_MILESTONE.lead}
              </p>

              <div className="mt-8 grid gap-3 md:grid-cols-2">
                {CAREER_TIMELINE_MILESTONE.achievements.map((line, index) => (
                  <motion.div
                    key={line}
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: reduce ? 0 : index * 0.05 }}
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-5"
                  >
                    <div className="font-mono text-[9px] tracking-[0.22em] text-primary/70">
                      VECTOR 0{index + 1}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-foreground/82">
                      {line}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 border-t border-white/10 pt-8">
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.25em] text-cyan-300/70">
                      CONNECTED VENTURES
                    </p>
                    <h3 className="font-display mt-2 text-xl font-semibold text-foreground md:text-2xl">
                      One mission, expressed through different systems.
                    </h3>
                  </div>
                  <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                    The portfolio is designed as an ecosystem: matter, intelligence,
                    community infrastructure, and governance reinforce one another.
                  </p>
                </div>
                <div className="mt-6 grid gap-3 lg:grid-cols-3">
                  {CAREER_TIMELINE_MILESTONE.nextSteps.map((step, index) => (
                    <div
                      key={step.title}
                      className="group rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:-translate-y-1 hover:border-cyan-300/25 hover:bg-cyan-300/[0.025]"
                    >
                      <span className="font-mono text-[9px] tracking-[0.2em] text-primary/65">
                        SYSTEM 0{index + 1}
                      </span>
                      <h4 className="mt-3 font-display text-base font-semibold text-foreground">
                        {step.title}
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {step.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
