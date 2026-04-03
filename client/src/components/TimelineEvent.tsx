import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { CareerMilestone } from "@shared/careerTimeline";
import { MARKER_TONE_CSS_VAR } from "@shared/careerTimeline";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

export default function TimelineEvent({
  milestone,
  index,
}: {
  milestone: CareerMilestone;
  index: number;
}) {
  const reduce = usePrefersReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const expandable = Boolean(milestone.detail?.trim());
  const panelId = useId();
  const toneVar = MARKER_TONE_CSS_VAR[milestone.markerTone];
  const alignRight = index % 2 === 0;

  return (
    <div
      className={cn(
        "relative pb-14 pl-12 md:pb-20 md:pl-0",
        alignRight ? "md:pr-[calc(50%+1.75rem)]" : "md:pl-[calc(50%+1.75rem)]"
      )}
    >
      <div
        className="absolute top-7 left-[31px] z-10 h-4 w-4 -translate-x-1/2 rounded-full border-2 bg-card shadow-[0_0_14px_color-mix(in_oklch,var(--foreground)_15%,transparent)] md:top-8 md:left-1/2"
        style={{
          borderColor: `var(${toneVar})`,
          boxShadow: `0 0 18px color-mix(in oklch, var(${toneVar}) 45%, transparent)`,
        }}
        aria-hidden
      />

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
        className={cn(
          "cyber-panel--subtle rounded-xl border border-cyan-500/20 p-5 md:p-6",
          alignRight && "md:text-right"
        )}
      >
        <div
          className={cn(
            "flex flex-wrap items-center gap-2",
            alignRight ? "md:flex-row-reverse md:justify-end" : ""
          )}
        >
          <span className="font-mono text-[10px] tracking-[0.28em] text-primary">
            {milestone.periodLabel}
          </span>
          {milestone.highlight ? (
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[9px] tracking-wider text-primary">
              {milestone.highlight}
            </span>
          ) : null}
        </div>

        <h2 className="font-display mt-2 text-lg font-bold tracking-tight text-foreground md:text-xl">
          {milestone.title}
        </h2>
        <p className="font-mono text-xs tracking-wide text-cyan-400/85">
          {milestone.org}
          {milestone.location ? ` · ${milestone.location}` : ""}
        </p>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {milestone.summary}
        </p>

        <ul
          className={cn(
            "mt-4 flex flex-wrap gap-2",
            alignRight ? "md:justify-end" : ""
          )}
        >
          {milestone.achievements.map(b => (
            <li
              key={b.label}
              title={b.detail}
              className="rounded-md border border-white/10 bg-background/40 px-2.5 py-1 font-mono text-[10px] text-foreground/90"
            >
              {b.label}
            </li>
          ))}
        </ul>

        {expandable ? (
          <div
            className={cn("mt-4", alignRight ? "md:flex md:justify-end" : "")}
          >
            <button
              type="button"
              id={`${panelId}-btn`}
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() => setExpanded(e => !e)}
              className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-background/40 px-3 py-2 font-mono text-[10px] tracking-[0.2em] text-primary transition-colors hover:border-primary/50 hover:bg-primary/10"
            >
              {expanded ? "Collapse detail" : "Expand detail"}
              <motion.span
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.25 }}
              >
                <ChevronDown className="h-4 w-4" aria-hidden />
              </motion.span>
            </button>
          </div>
        ) : null}

        <AnimatePresence initial={false}>
          {expandable && expanded ? (
            <motion.div
              id={panelId}
              role="region"
              aria-labelledby={`${panelId}-btn`}
              initial={reduce ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={reduce ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-relaxed text-foreground/85">
                {milestone.detail}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
