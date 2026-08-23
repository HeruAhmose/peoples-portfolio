import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Atom, ChevronDown, Cpu, Factory, Search } from "lucide-react";
import {
  PATENT_CLAIMS,
  buildClaimDiagramSvg,
  CLAIM_TYPE_LABELS,
  type ClaimCategory,
  type PatentClaim,
} from "@shared/patentClaims";
import { usePortfolioAnalytics } from "@/hooks/usePortfolioAnalytics";
import { Input } from "@/components/ui/input";

const categoryMeta = {
  composition: {
    text: "text-amber-300",
    border: "border-amber-300/28",
    glow: "rgba(252,211,77,.13)",
    label: "Material Architecture",
    description:
      "What the material system is made of and how its constituent layers relate.",
    Icon: Atom,
  },
  manufacturing: {
    text: "text-cyan-300",
    border: "border-cyan-300/28",
    glow: "rgba(103,232,249,.12)",
    label: "Process Architecture",
    description:
      "How the material system is fabricated, assembled, conditioned, or integrated.",
    Icon: Factory,
  },
  device: {
    text: "text-fuchsia-300",
    border: "border-fuchsia-300/28",
    glow: "rgba(240,171,252,.12)",
    label: "Device Architecture",
    description:
      "How the material system is configured into functional sensing, energy, or device structures.",
    Icon: Cpu,
  },
} satisfies Record<
  ClaimCategory,
  {
    text: string;
    border: string;
    glow: string;
    label: string;
    description: string;
    Icon: typeof Atom;
  }
>;

export default function PatentClaimsExplorer() {
  const reduceMotion = !!useReducedMotion();
  const { logPatentClaimExpand } = usePortfolioAnalytics();
  const [expandedClaim, setExpandedClaim] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    ClaimCategory | "all"
  >("all");
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
      if (!q) return true;
      return `${c.number} ${c.title} ${c.description} ${c.technicalSpecs.join(" ")} ${c.claimType}`
        .toLowerCase()
        .includes(q);
    });
  }, [search, selectedCategory]);

  const toggleExpand = (claim: PatentClaim) => {
    const next = expandedClaim === claim.number ? null : claim.number;
    setExpandedClaim(next);
    if (next === claim.number) logPatentClaimExpand(claim.number);
  };

  useEffect(() => setExpandedClaim(null), [search, selectedCategory]);

  return (
    <motion.div
      className="space-y-7"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      data-claim-instruments="prestige-v1"
    >
      <div className="rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(8,13,21,.9),rgba(4,7,12,.96))] p-4 md:p-5">
        <p className="font-mono text-[9px] tracking-[0.25em] text-primary/70">
          CLAIM INTELLIGENCE /// EVIDENCE INDEX
        </p>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search claims, materials, processes, devices…"
            className="border-white/10 bg-black/25 pl-10 font-mono text-sm"
            aria-label="Search patent claims"
          />
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {filteredClaims.length} claim{filteredClaims.length === 1 ? "" : "s"}{" "}
        match the current filters.
      </p>

      <div className="grid gap-3 md:grid-cols-3">
        {(Object.keys(categoryMeta) as ClaimCategory[]).map(category => {
          const meta = categoryMeta[category];
          const Icon = meta.Icon;
          const active = selectedCategory === category;
          return (
            <motion.button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(active ? "all" : category)}
              aria-pressed={active}
              whileHover={reduceMotion ? undefined : { y: -3 }}
              className={`relative overflow-hidden rounded-2xl border p-5 text-left transition ${meta.border} ${active ? "bg-white/[0.055]" : "bg-white/[0.02] hover:bg-white/[0.035]"}`}
              style={{
                boxShadow: active ? `0 24px 70px ${meta.glow}` : undefined,
              }}
            >
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl"
                style={{ background: meta.glow }}
                aria-hidden
              />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div
                    className={`inline-flex rounded-xl border border-current/15 bg-black/20 p-2.5 ${meta.text}`}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <p
                    className={`mt-4 font-mono text-[9px] tracking-[0.22em] ${meta.text}`}
                  >
                    {category.toUpperCase()} /{" "}
                    {String(categoryGroups[category].length).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1 font-display text-base font-semibold text-foreground">
                    {meta.label}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {meta.description}
                  </p>
                </div>
                <span className="font-mono text-[9px] text-foreground/35">
                  {active ? "ACTIVE" : "FILTER"}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="max-h-[36rem] space-y-4 overflow-y-auto pr-2">
        <AnimatePresence mode="popLayout">
          {filteredClaims.map((claim, idx) => {
            const meta = categoryMeta[claim.category];
            const Icon = meta.Icon;
            const isExpanded = expandedClaim === claim.number;
            const svg = buildClaimDiagramSvg(claim);
            return (
              <motion.article
                key={claim.number}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: reduceMotion ? 0 : idx * 0.018 }}
                className={`relative overflow-hidden rounded-2xl border ${meta.border} bg-[linear-gradient(145deg,rgba(9,14,23,.93),rgba(4,7,12,.97))]`}
                style={{
                  boxShadow: isExpanded
                    ? `0 28px 90px ${meta.glow}`
                    : undefined,
                }}
              >
                <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-current to-transparent opacity-50" />
                <button
                  type="button"
                  onClick={() => toggleExpand(claim)}
                  aria-expanded={isExpanded}
                  aria-controls={`claim-${claim.number}-details`}
                  className="w-full p-5 text-left md:p-6"
                >
                  <div className="grid gap-5 md:grid-cols-[auto_1fr_auto] md:items-start">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl border border-current/15 bg-black/25 ${meta.text}`}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`font-mono text-[10px] tracking-[0.2em] ${meta.text}`}
                        >
                          CLAIM {String(claim.number).padStart(2, "0")}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/[0.025] px-2 py-1 font-mono text-[9px] tracking-[0.12em] text-muted-foreground">
                          {CLAIM_TYPE_LABELS[claim.claimType]}
                        </span>
                      </div>
                      <h3 className="mt-2 font-display text-lg font-semibold leading-tight text-foreground md:text-xl">
                        {claim.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-foreground/68">
                        {claim.description}
                      </p>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: reduceMotion ? 0 : 0.2 }}
                      className={meta.text}
                    >
                      <ChevronDown className="h-5 w-5" aria-hidden />
                    </motion.div>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded ? (
                    <motion.div
                      id={`claim-${claim.number}-details`}
                      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={
                        reduceMotion ? undefined : { height: 0, opacity: 0 }
                      }
                      className="overflow-hidden"
                    >
                      <div className="grid gap-6 border-t border-white/10 p-5 md:grid-cols-[.8fr_1.2fr] md:p-6">
                        <div className="space-y-5">
                          <div>
                            <h4 className="font-mono text-[9px] tracking-[0.22em] text-muted-foreground">
                              CLAIM READING
                            </h4>
                            <p className="mt-2 text-sm leading-relaxed text-foreground/82">
                              {claim.description}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-mono text-[9px] tracking-[0.22em] text-muted-foreground">
                              TECHNICAL PARAMETERS
                            </h4>
                            <ul className="mt-3 space-y-2 text-sm text-foreground/78">
                              {claim.technicalSpecs.map((line, i) => (
                                <li key={i} className="flex gap-2">
                                  <span className={meta.text}>—</span>
                                  <span>{line}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-[#050814] p-4 shadow-inner shadow-black/50">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <div>
                              <h4 className="font-mono text-[9px] tracking-[0.22em] text-muted-foreground">
                                SYSTEM DIAGRAM
                              </h4>
                              <p className="mt-1 text-xs leading-relaxed text-foreground/60">
                                {claim.diagramCaption}
                              </p>
                            </div>
                            <span
                              className={`font-mono text-[9px] ${meta.text}`}
                            >
                              {claim.category.toUpperCase()}
                            </span>
                          </div>
                          <div
                            className="overflow-x-auto rounded-xl border border-white/5 bg-black/25 p-2"
                            dangerouslySetInnerHTML={{ __html: svg }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </AnimatePresence>
        {filteredClaims.length === 0 ? (
          <p className="py-8 text-center font-mono text-sm text-muted-foreground">
            No claims match your filters.
          </p>
        ) : null}
      </div>
    </motion.div>
  );
}
