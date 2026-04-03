import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import {
  PATENT_CLAIMS,
  buildClaimDiagramSvg,
  CLAIM_TYPE_LABELS,
  type ClaimCategory,
  type ClaimType,
  type PatentClaim,
} from "@shared/patentClaims";
import { usePortfolioAnalytics } from "@/hooks/usePortfolioAnalytics";
import { Input } from "@/components/ui/input";

const categoryColors: Record<
  ClaimCategory,
  { bg: string; text: string; border: string }
> = {
  composition: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    border: "border-yellow-400/30",
  },
  manufacturing: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-400/30",
  },
  device: {
    bg: "bg-fuchsia-500/10",
    text: "text-fuchsia-400",
    border: "border-fuchsia-400/30",
  },
};

export default function PatentClaimsExplorer() {
  const { logPatentClaimExpand } = usePortfolioAnalytics();
  const [expandedClaim, setExpandedClaim] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    ClaimCategory | "all"
  >("all");
  const [selectedType, setSelectedType] = useState<ClaimType | "all">("all");
  const [search, setSearch] = useState("");

  const categoryGroups = useMemo(
    () => ({
      composition: PATENT_CLAIMS.filter(c => c.category === "composition"),
      manufacturing: PATENT_CLAIMS.filter(c => c.category === "manufacturing"),
      device: PATENT_CLAIMS.filter(c => c.category === "device"),
    }),
    []
  );

  const filteredClaims = useMemo(() => {
    const q = search.trim().toLowerCase();
    return PATENT_CLAIMS.filter(c => {
      if (selectedCategory !== "all" && c.category !== selectedCategory)
        return false;
      if (selectedType !== "all" && c.claimType !== selectedType) return false;
      if (!q) return true;
      const blob =
        `${c.number} ${c.title} ${c.description} ${c.technicalSpecs.join(" ")} ${c.claimType}`.toLowerCase();
      return blob.includes(q);
    });
  }, [search, selectedCategory, selectedType]);

  const toggleExpand = (claim: PatentClaim) => {
    const next = expandedClaim === claim.number ? null : claim.number;
    setExpandedClaim(next);
    if (next === claim.number) logPatentClaimExpand(claim.number);
  };

  useEffect(() => {
    setExpandedClaim(null);
  }, [search, selectedCategory, selectedType]);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search claims, numbers, materials, or keywords…"
          className="pl-10 bg-background border-border font-mono text-sm"
          aria-label="Search patent claims"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <span className="text-xs font-mono text-muted-foreground tracking-widest">
          CATEGORY
        </span>
        <div className="flex gap-2 flex-wrap">
          <FilterChip
            active={selectedCategory === "all"}
            onClick={() => setSelectedCategory("all")}
            label={`ALL (${PATENT_CLAIMS.length})`}
          />
          {(Object.keys(categoryColors) as ClaimCategory[]).map(cat => (
            <FilterChip
              key={cat}
              active={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
              label={`${cat.toUpperCase()} (${categoryGroups[cat].length})`}
              activeClassName={`${categoryColors[cat].bg} ${categoryColors[cat].text} ${categoryColors[cat].border} border-current`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <span className="text-xs font-mono text-muted-foreground tracking-widest">
          TYPE
        </span>
        <div className="flex gap-2 flex-wrap">
          <FilterChip
            active={selectedType === "all"}
            onClick={() => setSelectedType("all")}
            label="ALL TYPES"
          />
          {(Object.keys(CLAIM_TYPE_LABELS) as ClaimType[]).map(t => (
            <FilterChip
              key={t}
              active={selectedType === t}
              onClick={() => setSelectedType(t)}
              label={CLAIM_TYPE_LABELS[t].toUpperCase()}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-2">
        <AnimatePresence mode="popLayout">
          {filteredClaims.map((claim, idx) => {
            const colors = categoryColors[claim.category];
            const isExpanded = expandedClaim === claim.number;
            const svg = buildClaimDiagramSvg(claim);

            return (
              <motion.div
                key={claim.number}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: idx * 0.02 }}
              >
                <motion.button
                  type="button"
                  onClick={() => toggleExpand(claim)}
                  className={`w-full p-4 rounded border text-left transition-all ${colors.bg} ${colors.border} hover:border-primary`}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`font-bold text-lg ${colors.text}`}>
                          CLAIM {claim.number}
                        </span>
                        <span
                          className={`text-xs font-mono ${colors.text} opacity-80`}
                        >
                          {claim.category.toUpperCase()}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground border border-border rounded px-2 py-0.5">
                          {CLAIM_TYPE_LABELS[claim.claimType]}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground">
                        {claim.title}
                      </h3>
                      <p className="text-sm text-foreground/70 mt-1 line-clamp-2">
                        {claim.description}
                      </p>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown
                        className={`w-5 h-5 shrink-0 ${colors.text}`}
                      />
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-current border-opacity-20 space-y-4"
                      >
                        <div>
                          <h4 className="text-xs font-mono tracking-widest text-muted-foreground mb-2">
                            SUMMARY
                          </h4>
                          <p className="text-sm text-foreground/85 leading-relaxed">
                            {claim.description}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-xs font-mono tracking-widest text-muted-foreground mb-2">
                            TECHNICAL SPECIFICATIONS
                          </h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80">
                            {claim.technicalSpecs.map((line, i) => (
                              <li key={i}>{line}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-xs font-mono tracking-widest text-muted-foreground mb-2">
                            DIAGRAM
                          </h4>
                          <p className="text-xs text-foreground/70 mb-2">
                            {claim.diagramCaption}
                          </p>
                          <div
                            className="rounded border border-border bg-[#050814] p-2 overflow-x-auto"
                            dangerouslySetInnerHTML={{ __html: svg }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {filteredClaims.length === 0 && (
          <p className="text-sm text-muted-foreground font-mono text-center py-8">
            No claims match your filters.
          </p>
        )}
      </div>

      <motion.div
        className="grid grid-cols-3 gap-4 p-4 rounded border border-border bg-card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {(Object.keys(categoryGroups) as ClaimCategory[]).map(category => (
          <div key={category} className="text-center">
            <div
              className={`text-2xl font-bold ${categoryColors[category].text}`}
            >
              {categoryGroups[category].length}
            </div>
            <div className="text-xs font-mono text-muted-foreground mt-1">
              {category.toUpperCase()}
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  activeClassName,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  activeClassName?: string;
}) {
  const activeStyles = active
    ? (activeClassName ?? "bg-primary text-background border-primary")
    : "border-border text-foreground hover:border-primary";
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded border font-mono text-[10px] sm:text-xs tracking-widest transition-all ${activeStyles}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {label}
    </motion.button>
  );
}
