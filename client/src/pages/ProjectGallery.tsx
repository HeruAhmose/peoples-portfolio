import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { HolographicText } from "@/components/AdvancedVisuals";
import {
  ScrollReveal,
  StaggerItem,
  StaggerReveal,
} from "@/components/AdvancedVisualEffects";
import Project3DCard from "@/components/Project3DCard";
import { Input } from "@/components/ui/input";
import { usePortfolioAnalytics } from "@/hooks/usePortfolioAnalytics";
import {
  ALL_GALLERY_CATEGORIES,
  PROJECT_CATEGORY_LABELS,
  type GalleryCategoryFilter,
  type GallerySortMode,
  queryShowcaseProjects,
  SHOWCASE_PROJECTS,
} from "@shared/projectGallery";
import { PROJECT_GALLERY_MILESTONE } from "@shared/portfolioProjectGalleryMilestone";

interface ProjectGalleryProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const SORT_LABELS: Record<GallerySortMode, string> = {
  impact: "Impact (high → low)",
  name: "Name (A → Z)",
  recent: "Recently updated",
};

export default function ProjectGallery({ onNavigate }: ProjectGalleryProps) {
  const { logSectionView } = usePortfolioAnalytics();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<GalleryCategoryFilter>("all");
  const [sort, setSort] = useState<GallerySortMode>("impact");

  useEffect(() => {
    logSectionView("gallery");
  }, [logSectionView]);

  const visible = useMemo(
    () =>
      queryShowcaseProjects(SHOWCASE_PROJECTS, {
        search,
        category,
        sort,
      }),
    [search, category, sort]
  );

  return (
    <div className="min-h-screen pb-24">
      <section className="container mx-auto px-4 py-14 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="font-mono text-[10px] tracking-[0.35em] text-cyan-400/85 md:text-xs">
            INTERACTIVE SHOWCASE /// 3D FLIP DECK
          </p>
          <h1 className="font-display mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            <HolographicText variant="sovereign" className="font-bold">
              PROJECT GALLERY
            </HolographicText>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Search, filter by category, and sort the stack. Flip each card to
            read the tech spine and jump out to live sites and deep links.
          </p>
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="mt-6 font-mono text-xs tracking-[0.2em] text-primary underline-offset-4 hover:underline"
          >
            ← BACK TO HOME
          </button>
        </motion.div>

        <ScrollReveal className="mx-auto mt-12 max-w-6xl">
          <div className="cyber-panel--subtle flex flex-col gap-4 rounded-xl border border-cyan-500/20 p-4 md:flex-row md:items-end md:justify-between md:gap-6 md:p-6">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search title, stack, impact…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border-cyan-500/25 bg-background/40 pl-10 font-mono text-sm"
                aria-label="Search projects"
              />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <label className="flex flex-col gap-1 font-mono text-[10px] tracking-[0.15em] text-muted-foreground">
                CATEGORY
                <select
                  value={category}
                  onChange={e =>
                    setCategory(e.target.value as GalleryCategoryFilter)
                  }
                  className="rounded-md border border-cyan-500/25 bg-background/50 px-3 py-2 font-mono text-xs text-foreground"
                >
                  {ALL_GALLERY_CATEGORIES.map(c => (
                    <option key={c} value={c}>
                      {c === "all"
                        ? "All categories"
                        : PROJECT_CATEGORY_LABELS[c]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 font-mono text-[10px] tracking-[0.15em] text-muted-foreground">
                SORT
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value as GallerySortMode)}
                  className="rounded-md border border-cyan-500/25 bg-background/50 px-3 py-2 font-mono text-xs text-foreground"
                >
                  {(Object.keys(SORT_LABELS) as GallerySortMode[]).map(k => (
                    <option key={k} value={k}>
                      {SORT_LABELS[k]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </ScrollReveal>

        <p className="mx-auto mt-6 max-w-6xl text-center font-mono text-xs text-muted-foreground">
          Showing <span className="text-primary">{visible.length}</span> of{" "}
          {SHOWCASE_PROJECTS.length} projects
        </p>

        <StaggerReveal className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
          {visible.map(project => (
            <StaggerItem key={project.id}>
              <Project3DCard project={project} />
            </StaggerItem>
          ))}
        </StaggerReveal>

        {visible.length === 0 && (
          <p className="mt-12 text-center font-mono text-sm text-muted-foreground">
            No projects match that query — try clearing search or setting
            category to “All categories”.
          </p>
        )}
      </section>

      <section className="container mx-auto px-4 pb-8">
        <ScrollReveal>
          <div className="cyber-panel mx-auto max-w-4xl px-6 py-10 md:px-10">
            <p className="font-mono text-[10px] tracking-[0.32em] text-cyan-400/85">
              {PROJECT_GALLERY_MILESTONE.eyebrow}
            </p>
            <h2 className="font-hero-display mt-3 text-xl font-bold text-foreground md:text-2xl">
              {PROJECT_GALLERY_MILESTONE.title}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">
              {PROJECT_GALLERY_MILESTONE.lead}
            </p>
            <ul className="mt-6 space-y-2 text-sm text-foreground/85">
              {PROJECT_GALLERY_MILESTONE.achievements.map(line => (
                <li key={line} className="border-l-2 border-primary/35 pl-3">
                  {line}
                </li>
              ))}
            </ul>
            <div className="mt-8 border-t border-white/10 pt-6">
              <h3 className="font-display text-sm font-semibold text-foreground">
                Next steps
              </h3>
              <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
                {PROJECT_GALLERY_MILESTONE.nextSteps.map((s, i) => (
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
