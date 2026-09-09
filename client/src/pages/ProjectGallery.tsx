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

interface ProjectGalleryProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const SORT_LABELS: Record<GallerySortMode, string> = {
  featured: "Featured order",
  name: "Name (A → Z)",
  category: "Category (A → Z)",
};

export default function ProjectGallery({ onNavigate }: ProjectGalleryProps) {
  const { logSectionView } = usePortfolioAnalytics();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<GalleryCategoryFilter>("all");
  const [sort, setSort] = useState<GallerySortMode>("featured");

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
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="font-mono text-[10px] tracking-[0.35em] text-cyan-400/85 md:text-xs">
            PUBLIC WORK /// INTERACTIVE PROJECT FIELD
          </p>
          <h1 className="font-display mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            <HolographicText variant="sovereign" className="font-bold">
              PROJECT GALLERY
            </HolographicText>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Each card presents a public project surface, its implementation
            context, and its evidence state. Filter by domain, then flip a card
            to inspect the stack and open the corresponding public record.
          </p>
          <div className="mx-auto mt-6 grid max-w-2xl grid-cols-1 gap-2 sm:grid-cols-3">
            {[
              ["01", "WATCH", "Core behavior in motion"],
              ["02", "INSPECT", "Flip for the working stack"],
              ["03", "OPEN", "Visit the public record"],
            ].map(([index, label, detail]) => (
              <div
                key={index}
                className="rounded-lg border border-cyan-500/15 bg-background/25 px-3 py-3 text-left backdrop-blur-sm"
              >
                <span className="font-mono text-[9px] tracking-[0.2em] text-primary/85">
                  {index} / {label}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {detail}
                </span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="mt-7 font-mono text-xs tracking-[0.2em] text-primary underline-offset-4 hover:underline"
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
                placeholder="Search projects, systems, materials, evidence…"
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
          {SHOWCASE_PROJECTS.length} public project surfaces
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
    </div>
  );
}
