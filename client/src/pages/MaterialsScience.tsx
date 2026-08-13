import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useLocation, useSearch } from "wouter";
import AMCVisualization from "@/components/AMCVisualization";
import { HolographicText, NeuralNetwork } from "@/components/AdvancedVisuals";
import PatentClaimsExplorer from "@/components/PatentClaimsExplorer";
import ManufacturingProcess from "@/components/ManufacturingProcess";
import { usePortfolioAnalytics } from "@/hooks/usePortfolioAnalytics";
import { TAMERIAN_PATENT } from "@shared/siteFacts";

interface MaterialsScienceProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const VALID_TABS = ["visualization", "patents", "manufacturing"] as const;
type MaterialsTab = (typeof VALID_TABS)[number];

export default function MaterialsScience({
  activeSection,
}: MaterialsScienceProps) {
  const [location] = useLocation();
  const search = useSearch();
  const [activeTab, setActiveTab] = useState<MaterialsTab>("visualization");
  const { logSectionView } = usePortfolioAnalytics();

  const applyTabFromUrl = useCallback(() => {
    const tab = new URLSearchParams(window.location.search).get("tab");
    if (tab && (VALID_TABS as readonly string[]).includes(tab)) {
      setActiveTab(tab as MaterialsTab);
    }
  }, []);

  useEffect(() => {
    logSectionView("materials");
  }, [logSectionView]);

  useEffect(() => {
    applyTabFromUrl();
  }, [location, search, applyTabFromUrl]);

  const selectTab = (id: MaterialsTab) => {
    setActiveTab(id);
    const url = new URL(window.location.href);
    if (id === "visualization") {
      url.searchParams.delete("tab");
    } else {
      url.searchParams.set("tab", id);
    }
    const qs = url.searchParams.toString();
    window.history.replaceState(
      null,
      "",
      qs ? `${url.pathname}?${qs}` : url.pathname
    );
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h1 className="font-display text-5xl font-bold tracking-tight md:text-6xl">
            <HolographicText className="font-bold">
              MATERIAL SCIENCE
            </HolographicText>
          </h1>
          <p className="font-mono text-lg tracking-wide text-primary">
            Tamerian Materials — Where Carbon Meets Crystal ·{" "}
            {TAMERIAN_PATENT.publicStatus} · {TAMERIAN_PATENT.filedDate} ·{" "}
            {TAMERIAN_PATENT.claimCount} claims
          </p>
          <p className="text-xl text-foreground/80 max-w-2xl">
            Hemp-derived carbon matrices with embedded piezoelectric,
            thermoelectric, magnetic, and quantum-active crystalline phases — a
            single composite for simultaneous energy harvesting and
            room-temperature quantum sensing (narrative aligned with{" "}
            <a
              href="https://tamerian-materials.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              tamerian-materials.com
            </a>
            ). This section pairs that public story with the AMC research
            framing and claim explorer.
          </p>
        </motion.div>
      </section>

      {/* Tab Navigation */}
      <section className="container mx-auto px-4 py-6">
        <div className="cyber-panel rounded-xl p-4 md:p-5">
          <p className="font-mono text-[10px] tracking-[0.35em] text-muted-foreground">
            INTERFACE /// SELECT MODULE
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { id: "visualization", label: "AMC VISUALIZATION" },
              { id: "patents", label: "PATENT CLAIMS" },
              { id: "manufacturing", label: "MANUFACTURING" },
            ].map(tab => (
              <motion.button
                key={tab.id}
                type="button"
                onClick={() => selectTab(tab.id as MaterialsTab)}
                className={`relative rounded-lg border px-4 py-2.5 font-mono text-[11px] tracking-[0.14em] transition-all md:text-xs ${
                  activeTab === tab.id
                    ? "border-primary/55 bg-primary/12 text-primary shadow-[0_0_20px_-6px_oklch(0.65_0.25_45/0.45)]"
                    : "border-transparent text-muted-foreground hover:border-border hover:bg-muted/25 hover:text-foreground"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.span
                    className="absolute inset-x-2 -bottom-1 h-0.5 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent"
                    layoutId="tabIndicator"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-16">
        {activeTab === "visualization" && (
          <motion.div
            key="visualization"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Visualization */}
              <div className="lg:col-span-2 min-h-[min(50vh,480px)]">
                <AMCVisualization isActive={activeTab === "visualization"} />
              </div>

              {/* Constituents Info */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="font-bold text-foreground text-lg">
                  CONSTITUENTS
                </h3>
                {[
                  {
                    name: "Hemp Carbon",
                    color: "#ffd700",
                    role: "Structural backbone & electron transport",
                  },
                  {
                    name: "Quartz",
                    color: "#00d9ff",
                    role: "Piezoelectric response & rigidity",
                  },
                  {
                    name: "Tourmaline",
                    color: "#ff00ff",
                    role: "Dual piezo/pyroelectric capability",
                  },
                  {
                    name: "Magnetite",
                    color: "#00ff88",
                    role: "Ferrimagnetic coupling",
                  },
                ].map((constituent, idx) => (
                  <motion.div
                    key={idx}
                    className="p-4 rounded border border-border bg-card hover:border-primary transition-colors"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: constituent.color }}
                      />
                      <h4 className="font-semibold text-foreground">
                        {constituent.name}
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {constituent.role}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-mono text-muted-foreground tracking-widest">
                COUPLING GRAPH — multi-node interaction (live)
              </p>
              <NeuralNetwork />
            </div>

            {/* Description */}
            <motion.div
              className="p-6 rounded border border-border bg-card neon-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="font-bold text-foreground mb-4">
                HYPOTHESIS OVERVIEW
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                The central hypothesis proposes that a structured composite
                integrating hemp-derived carbon, quartz, tourmaline, magnetite,
                and rare-earth-doped crystalline particles within a polymer
                binder may exhibit system-level multi-modal
                transduction—converting mechanical, thermal, and magnetic
                perturbations into detectable electrical and/or optical
                output—if the spatial arrangement and mechanical coupling among
                constituents are deliberately engineered to create constructive
                interaction pathways.
              </p>
            </motion.div>
          </motion.div>
        )}

        {activeTab === "patents" && (
          <motion.div
            key="patents"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <PatentClaimsExplorer />
          </motion.div>
        )}

        {activeTab === "manufacturing" && (
          <motion.div
            key="manufacturing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <ManufacturingProcess />
          </motion.div>
        )}
      </section>

      {/* Key Metrics */}
      <section className="container mx-auto px-4 py-16 border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            {
              label: "PATENT CLAIMS",
              value: String(TAMERIAN_PATENT.claimCount),
            },
            { label: "CONSTITUENTS", value: "5" },
            { label: "VALIDATION PHASES", value: "5" },
            { label: "MANUFACTURING STEPS", value: "7" },
          ].map((metric, idx) => (
            <motion.div
              key={idx}
              className="p-6 rounded border border-border bg-card text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-bold">
                <HolographicText className="font-bold">
                  {metric.value}
                </HolographicText>
              </div>
              <p className="text-xs font-mono text-muted-foreground mt-2 tracking-widest">
                {metric.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <a
          href="https://tamerian-materials.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3 border border-primary text-primary hover:bg-primary/10 rounded font-mono text-sm tracking-widest transition-colors"
        >
          OPEN TAMERIAN MATERIALS (LIVE SITE) →
        </a>
      </section>
    </div>
  );
}
