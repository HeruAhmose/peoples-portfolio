import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Layers } from "lucide-react";
import { Link } from "wouter";
import type { ShowcaseProject } from "@shared/projectGallery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

function GalleryOutboundLink({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  const isInternal = href.startsWith("/") && !href.startsWith("//");
  if (isInternal) {
    return (
      <Link
        href={href}
        className={cn(
          "inline-flex items-center gap-1 font-mono text-[11px] tracking-wide text-cyan-300/95 underline-offset-2 hover:text-primary hover:underline",
          className
        )}
        onClick={e => e.stopPropagation()}
      >
        {label}
        <ArrowUpRight className="h-3 w-3 opacity-80" aria-hidden />
      </Link>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-1 font-mono text-[11px] tracking-wide text-cyan-300/95 underline-offset-2 hover:text-primary hover:underline",
        className
      )}
      onClick={e => e.stopPropagation()}
    >
      {label}
      <ExternalLink className="h-3 w-3 opacity-70" aria-hidden />
    </a>
  );
}

function ProjectFeatureVisual({ project }: { project: ShowcaseProject }) {
  const common =
    "relative h-36 overflow-hidden rounded-lg border border-white/10 bg-black/35";

  if (project.id === "tamerian-materials") {
    return (
      <div
        className={common}
        aria-label="Animated materials lattice and energy harvesting preview"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.12),transparent_55%)]" />
        {[0, 1, 2, 3, 4].map(row =>
          [0, 1, 2, 3, 4, 5].map(col => (
            <motion.span
              key={`${row}-${col}`}
              className="absolute h-1.5 w-1.5 rounded-full bg-cyan-300"
              style={{ left: `${12 + col * 15}%`, top: `${16 + row * 17}%` }}
              animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1.35, 0.8] }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                delay: (row + col) * 0.08,
              }}
            />
          ))
        )}
        <motion.div
          className="absolute left-[8%] right-[8%] top-1/2 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"
          animate={{ x: ["-18%", "18%", "-18%"], opacity: [0.2, 0.9, 0.2] }}
          transition={{ duration: 3.6, repeat: Infinity }}
        />
        <div className="absolute bottom-2 left-3 font-mono text-[9px] tracking-[0.18em] text-cyan-200/90">
          HEMP-CARBON LATTICE · ENERGY FLOW
        </div>
      </div>
    );
  }

  if (project.id === "queen-califia") {
    return (
      <div
        className={common}
        aria-label="Animated sovereign cyber defense orchestration preview"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(168,85,247,0.16),transparent_58%)]" />
        <motion.div
          className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-fuchsia-300/55"
          animate={{
            boxShadow: [
              "0 0 0 rgba(217,70,239,0)",
              "0 0 28px rgba(217,70,239,.35)",
              "0 0 0 rgba(217,70,239,0)",
            ],
          }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
        {[
          [18, 24, "IDENTITY"],
          [73, 23, "PQC"],
          [15, 70, "BEHAVIOR"],
          [72, 70, "SIGNALS"],
        ].map(([left, top, label], index) => (
          <motion.div
            key={String(label)}
            className="absolute rounded border border-cyan-300/30 bg-black/45 px-2 py-1 font-mono text-[8px] tracking-wide text-cyan-200"
            style={{ left: `${left}%`, top: `${top}%` }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: index * 0.3 }}
          >
            {label}
          </motion.div>
        ))}
        <div className="absolute bottom-2 left-3 font-mono text-[9px] tracking-[0.18em] text-fuchsia-200/90">
          MULTI-ENGINE DEFENSE · HUMAN CONTROL
        </div>
      </div>
    );
  }

  if (project.id === "trai-organism") {
    return (
      <div
        className={common}
        aria-label="Animated TRAI organism network preview"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.14),transparent_60%)]" />
        {[
          [50, 50],
          [22, 25],
          [78, 24],
          [18, 69],
          [82, 68],
          [50, 18],
          [50, 82],
        ].map(([left, top], index) => (
          <motion.span
            key={index}
            className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/70 bg-blue-500/30"
            style={{ left: `${left}%`, top: `${top}%` }}
            animate={{ scale: [0.8, 1.25, 0.8], opacity: [0.45, 1, 0.45] }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              delay: index * 0.16,
            }}
          />
        ))}
        <svg
          className="absolute inset-0 h-full w-full opacity-55"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          {["22,25", "78,24", "18,69", "82,68", "50,18", "50,82"].map(
            (point, index) => {
              const [x, y] = point.split(",");
              return (
                <line
                  key={index}
                  x1="50"
                  y1="50"
                  x2={x}
                  y2={y}
                  stroke="rgba(103,232,249,.55)"
                  strokeWidth="0.5"
                />
              );
            }
          )}
        </svg>
        <div className="absolute bottom-2 left-3 font-mono text-[9px] tracking-[0.18em] text-cyan-200/90">
          INTEROPERABLE ORGANISM · CROSS-SITE ROUTING
        </div>
      </div>
    );
  }

  if (project.id === "techbridge") {
    return (
      <div
        className={common}
        aria-label="Animated Digital Navigator and impact flow preview"
      >
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,185,129,.08),transparent_60%)]" />
        {[16, 38, 60, 82].map((left, index) => (
          <motion.div
            key={left}
            className="absolute bottom-7 w-10 rounded-t border border-emerald-300/25 bg-emerald-400/10"
            style={{ left: `${left - 5}%`, height: `${26 + index * 14}px` }}
            animate={{ opacity: [0.35, 0.9, 0.35] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: index * 0.2 }}
          />
        ))}
        <motion.div
          className="absolute left-[8%] top-8 h-1.5 w-[84%] rounded-full bg-gradient-to-r from-emerald-400/15 via-emerald-300 to-cyan-300/20"
          animate={{ scaleX: [0.35, 1, 0.35], transformOrigin: "left" }}
          transition={{ duration: 3.2, repeat: Infinity }}
        />
        <div className="absolute bottom-2 left-3 font-mono text-[9px] tracking-[0.18em] text-emerald-200/90">
          NAVIGATOR FLOW · TECHMINUTES IMPACT
        </div>
      </div>
    );
  }

  if (project.id === "research-lab") {
    return (
      <div
        className={common}
        aria-label="Animated evidence graph and research trace preview"
      >
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 45"
          preserveAspectRatio="none"
          aria-hidden
        >
          <polyline
            points="0,36 14,30 28,33 42,19 55,24 68,11 82,17 100,7"
            fill="none"
            stroke="rgba(34,211,238,.8)"
            strokeWidth="1.2"
          />
          <polyline
            points="0,40 14,35 28,37 42,28 55,30 68,21 82,25 100,15"
            fill="none"
            stroke="rgba(168,85,247,.55)"
            strokeWidth="0.8"
          />
        </svg>
        {[18, 42, 68, 86].map((left, index) => (
          <motion.span
            key={left}
            className="absolute h-2 w-2 rounded-full bg-cyan-300"
            style={{ left: `${left}%`, top: `${62 - index * 12}%` }}
            animate={{ scale: [0.7, 1.45, 0.7], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              delay: index * 0.25,
            }}
          />
        ))}
        <div className="absolute bottom-2 left-3 font-mono text-[9px] tracking-[0.18em] text-cyan-200/90">
          CLAIM → EVIDENCE → BOUNDARY TRACE
        </div>
      </div>
    );
  }

  return (
    <div
      className={common}
      aria-label="Animated technology training terminal preview"
    >
      <div className="absolute left-3 right-3 top-3 rounded border border-cyan-300/20 bg-black/55 p-3 font-mono text-[9px] leading-5 text-cyan-200/90">
        <motion.div
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          $ network-status --secure
        </motion.div>
        <div className="text-emerald-300">✓ endpoint hardening</div>
        <div className="text-emerald-300">✓ linux administration</div>
        <div className="text-amber-200">→ security fundamentals</div>
      </div>
      <div className="absolute bottom-2 left-3 font-mono text-[9px] tracking-[0.18em] text-cyan-200/90">
        HANDS-ON SYSTEMS · SECURITY TRAINING
      </div>
    </div>
  );
}

export default function Project3DCard({
  project,
}: {
  project: ShowcaseProject;
}) {
  const reduce = usePrefersReducedMotion();
  const [hover, setHover] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const flipped = !reduce && (hover || focusWithin);

  return (
    <article
      tabIndex={0}
      className="group min-h-[390px] rounded-xl [perspective:1600px] outline-none focus-visible:ring-2 focus-visible:ring-primary/55 md:min-h-[410px]"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocusCapture={() => setFocusWithin(true)}
      onBlurCapture={e => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setFocusWithin(false);
        }
      }}
      aria-label={`${project.title} — live feature preview; hover or focus to view stack and links`}
    >
      <motion.div
        className="relative h-full min-h-[390px] w-full [transform-style:preserve-3d] md:min-h-[410px]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 205, damping: 28 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="absolute inset-0 flex flex-col [backface-visibility:hidden]"
          style={{ WebkitBackfaceVisibility: "hidden" }}
        >
          <div className="cyber-panel--subtle sector-node-card flex h-full flex-col rounded-xl border border-cyan-500/20 p-5 md:p-6">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="rounded-full border border-primary/35 bg-primary/10 px-2.5 py-0.5 font-mono text-[9px] tracking-[0.2em] text-primary">
                {project.categoryLabel.toUpperCase()}
              </span>
              <Layers className="h-4 w-4 text-cyan-400/60" aria-hidden />
            </div>
            <ProjectFeatureVisual project={project} />
            <h2 className="font-display mt-4 text-lg font-bold tracking-tight text-foreground md:text-xl">
              {project.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {project.shortDescription}
            </p>
            <div className="mt-auto border-t border-white/10 pt-3">
              <p className="font-mono text-[9px] tracking-[0.18em] text-cyan-200/75">
                HOVER / FOCUS FOR STACK + LIVE LINKS
              </p>
            </div>
          </div>
        </div>

        <div
          className="absolute inset-0 flex flex-col [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{ WebkitBackfaceVisibility: "hidden" }}
        >
          <div className="flex h-full min-h-[390px] flex-col rounded-xl border border-primary/35 bg-card/95 p-6 shadow-[inset_0_0_48px_oklch(0.65_0.25_45/0.08)] backdrop-blur-md md:min-h-[410px]">
            <p className="font-mono text-[10px] tracking-[0.28em] text-primary">
              TECH STACK
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.techStack.map(tech => (
                <li
                  key={tech}
                  className="rounded-md border border-cyan-500/25 bg-background/50 px-2 py-1 font-mono text-[10px] text-foreground/85"
                >
                  {tech}
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-lg border border-white/10 bg-background/35 p-4">
              <p className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
                IMPACT SIGNAL
              </p>
              <p className="mt-1 text-sm font-medium text-foreground/90">
                {project.impactLabel}
              </p>
            </div>
            <p className="mt-5 font-mono text-[10px] tracking-[0.28em] text-primary">
              OPEN PROJECT
            </p>
            <ul className="mt-2 flex flex-col gap-2">
              {project.links.map(link => (
                <li key={`${link.label}-${link.href}`}>
                  <GalleryOutboundLink href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
            <div className="mt-auto border-t border-white/10 pt-4">
              <p className="font-mono text-[10px] text-muted-foreground">
                Impact score ·{" "}
                <span className="text-primary">{project.impactScore}</span>
                <span className="text-muted-foreground">
                  {" "}
                  · Updated {project.updatedAt}
                </span>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </article>
  );
}
