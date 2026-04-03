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
      className={cn(
        "group min-h-[300px] rounded-xl [perspective:1600px] outline-none focus-visible:ring-2 focus-visible:ring-primary/55 md:min-h-[320px]"
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocusCapture={() => setFocusWithin(true)}
      onBlurCapture={e => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setFocusWithin(false);
        }
      }}
      aria-label={`${project.title} — hover or focus to view tech stack and links`}
    >
      <motion.div
        className="relative h-full min-h-[300px] w-full [transform-style:preserve-3d] md:min-h-[320px]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 26 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col [backface-visibility:hidden]"
          style={{ WebkitBackfaceVisibility: "hidden" }}
        >
          <div className="cyber-panel--subtle sector-node-card flex h-full flex-col rounded-xl border border-cyan-500/20 p-6">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="rounded-full border border-primary/35 bg-primary/10 px-2.5 py-0.5 font-mono text-[9px] tracking-[0.2em] text-primary">
                {project.categoryLabel.toUpperCase()}
              </span>
              <Layers className="h-4 w-4 text-cyan-400/60" aria-hidden />
            </div>
            <h2 className="font-display text-lg font-bold tracking-tight text-foreground md:text-xl">
              {project.title}
            </h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
              {project.shortDescription}
            </p>
            <div className="mt-4 border-t border-white/10 pt-4">
              <p className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground">
                IMPACT
              </p>
              <p className="mt-1 text-sm font-medium text-foreground/90">
                {project.impactLabel}
              </p>
              <p className="mt-3 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/80">
                Hover or focus to flip · stack & links on reverse
              </p>
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{ WebkitBackfaceVisibility: "hidden" }}
        >
          <div className="flex h-full min-h-[300px] flex-col rounded-xl border border-primary/35 bg-card/95 p-6 shadow-[inset_0_0_48px_oklch(0.65_0.25_45/0.08)] backdrop-blur-md md:min-h-[320px]">
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
            <p className="mt-5 font-mono text-[10px] tracking-[0.28em] text-primary">
              LINKS
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
