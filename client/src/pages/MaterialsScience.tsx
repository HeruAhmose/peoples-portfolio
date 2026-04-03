import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AMCVisualization from "@/components/AMCVisualization";
import { HolographicText, NeuralNetwork } from "@/components/AdvancedVisuals";
import PatentClaimsExplorer from "@/components/PatentClaimsExplorer";
import ManufacturingProcess from "@/components/ManufacturingProcess";
import { usePortfolioAnalytics } from "@/hooks/usePortfolioAnalytics";

interface MaterialsScienceProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

export default function MaterialsScience({
  activeSection,
}: MaterialsScienceProps) {
  const [activeTab, setActiveTab] = useState<
    "visualization" | "patents" | "manufacturing"
  >("visualization");
  const { logSectionView } = usePortfolioAnalytics();
  useEffect(() => {
    logSectionView("materials");
  }, [logSectionView]);

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
          <h1 className="text-5xl md:text-6xl font-bold">
            <HolographicText className="font-bold">
              MATERIAL SCIENCE
            </HolographicText>
          </h1>
          <p className="text-lg font-mono text-primary tracking-wide">
            Tamerian Materials — Where Carbon Meets Crystal · Patent pending ·
            U.S. App. No. 63/934,269
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
      <section className="container mx-auto px-4 py-8">
        <div className="flex gap-4 flex-wrap border-b border-border pb-4">
          {[
            { id: "visualization", label: "AMC VISUALIZATION" },
            { id: "patents", label: "PATENT CLAIMS" },
            { id: "manufacturing", label: "MANUFACTURING" },
          ].map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 font-mono text-sm tracking-widest transition-colors relative ${
                activeTab === tab.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  layoutId="tabIndicator"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
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
            { label: "PATENT CLAIMS", value: "25" },
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
