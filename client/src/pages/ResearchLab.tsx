import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { HolographicText } from "@/components/AdvancedVisuals";
import { usePortfolioAnalytics } from "@/hooks/usePortfolioAnalytics";
import { TAMERIAN_PATENT } from "@shared/siteFacts";

/** Preprint PDF is not bundled in-repo; live narrative and updates ship on Tamerian. */
const PREPRINT_LIVE_URL = "https://tamerian-materials.com/";

interface ResearchLabProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

export default function ResearchLab({ activeSection }: ResearchLabProps) {
  const { logSectionView } = usePortfolioAnalytics();
  useEffect(() => {
    logSectionView("research");
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
          <h1 className="font-display text-5xl font-bold tracking-tight md:text-6xl">
            <HolographicText className="font-bold">
              RESEARCH LAB
            </HolographicText>
          </h1>
          <p className="text-xl text-foreground/80 max-w-2xl">
            Preprint publications, experimental validation frameworks, and
            scientific hypothesis development — companion to the public Tamerian
            Materials narrative at{" "}
            <a
              href="https://tamerian-materials.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              tamerian-materials.com
            </a>
            .
          </p>
        </motion.div>
      </section>

      {/* Featured Publication */}
      <section className="container mx-auto px-4 py-16 border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl"
        >
          <h2 className="text-2xl font-bold text-foreground mb-8">
            FEATURED PREPRINT
          </h2>
          <div className="p-8 rounded border border-primary bg-card neon-border space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-2">
                Architecture-Driven Emergent Behavior in Multi-Component
                Composites
              </h3>
              <p className="mb-4 font-mono text-sm text-muted-foreground">
                Peoples (2026) — Preprint — Not peer reviewed
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Patent portfolio on the public site: U.S. App. No.{" "}
                {TAMERIAN_PATENT.applicationNo}, filed{" "}
                {TAMERIAN_PATENT.filedDate} · {TAMERIAN_PATENT.claimCount}{" "}
                claims · {TAMERIAN_PATENT.status} (
                <a
                  href="https://tamerian-materials.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-2 hover:underline"
                >
                  tamerian-materials.com
                </a>
                ).
              </p>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-3">ABSTRACT</h4>
              <p className="text-foreground/80 leading-relaxed">
                Current multi-modal sensing and energy harvesting approaches
                typically rely on single-mechanism transducers optimized for
                narrow operating domains. Composite architectures integrating
                multiple transduction mechanisms within a single material system
                represent a less-explored alternative. Whether such
                architectures can be engineered to produce constructive coupling
                among constituent-level physical behaviors is an open question.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-3">HYPOTHESIS</h4>
              <p className="text-foreground/80 leading-relaxed">
                A structured composite integrating five functional
                constituents—a hemp-derived carbonaceous matrix, quartz,
                tourmaline, magnetite, and rare-earth-doped crystalline
                particles within a polymer binder—may exhibit system-level
                multi-modal transduction (mechanical, thermal, magnetic, and
                optical) that is not available from any single constituent,
                provided that the coupling geometry is deliberately engineered.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-3">SIGNIFICANCE</h4>
              <p className="text-foreground/80 leading-relaxed">
                No system-level performance data are reported. The contribution
                of this work is the formulation of a specific, testable
                materials hypothesis grounded in independently documented
                constituent physics, supported by a structured experimental
                program with explicit success criteria and falsification
                conditions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
              <a
                href={PREPRINT_LIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-primary text-background hover:bg-primary/80 rounded font-mono text-sm tracking-widest transition-colors text-center"
              >
                VIEW PREPRINT (LIVE SITE)
              </a>
              <a
                href="https://tamerian-materials.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 border border-primary text-primary hover:bg-primary/10 rounded font-mono text-sm tracking-widest transition-colors text-center"
              >
                TAMERIAN MATERIALS (LIVE)
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Claim Classification Framework */}
      <section className="container mx-auto px-4 py-16 border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-8">
            CLAIM CLASSIFICATION FRAMEWORK
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                level: "ESTABLISHED",
                description:
                  "Independently documented in peer-reviewed literature; cited with primary sources",
                color: "border-yellow-400",
                bg: "bg-yellow-500/10",
              },
              {
                level: "PROPOSED",
                description:
                  "Hypothesized interaction pathways; require experimental confirmation",
                color: "border-cyan-400",
                bg: "bg-cyan-500/10",
              },
              {
                level: "VALIDATION PENDING",
                description:
                  "End-to-end transduction, sensitivity, repeatability, manufacturability TBD",
                color: "border-fuchsia-400",
                bg: "bg-fuchsia-500/10",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className={`p-6 rounded border ${item.color} ${item.bg}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="font-bold text-foreground mb-3">{item.level}</h3>
                <p className="text-sm text-foreground/80">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Experimental Validation Program */}
      <section
        id="experimental-validation-program"
        className="container mx-auto scroll-mt-24 px-4 py-16 border-t border-border"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-8">
            EXPERIMENTAL VALIDATION PROGRAM
          </h2>
          <div className="space-y-4">
            {[
              {
                phase: "PHASE 1",
                title: "Constituent Characterization",
                description:
                  "Verify individual constituent properties: piezoelectric coefficients (quartz, tourmaline), ferrimagnetic moments (magnetite), carbon conductivity (hemp matrix).",
              },
              {
                phase: "PHASE 2",
                title: "Composite Fabrication",
                description:
                  "Synthesize and characterize composite samples with varying constituent ratios and coupling geometries.",
              },
              {
                phase: "PHASE 3",
                title: "Multi-Modal Transduction Testing",
                description:
                  "Measure mechanical, thermal, and magnetic responses. Quantify coupling efficiency and system-level output.",
              },
              {
                phase: "PHASE 4",
                title: "Rare-Earth Optical Characterization",
                description:
                  "Photoluminescence spectroscopy to confirm 4f emission features. Validate optical transduction pathway.",
              },
              {
                phase: "PHASE 5",
                title: "System Integration & Scalability",
                description:
                  "Integrate electrodes, signal conditioning, and packaging. Demonstrate manufacturability and reproducibility.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="p-6 rounded border border-border bg-card hover:border-primary transition-colors"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + idx * 0.05 }}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-start gap-4">
                  <span className="text-primary font-bold font-mono text-sm whitespace-nowrap">
                    {item.phase}
                  </span>
                  <div>
                    <h3 className="font-bold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-foreground/80">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Constituent Materials */}
      <section className="container mx-auto px-4 py-16 border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-8">
            CONSTITUENT MATERIALS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: "Hemp-Derived Carbonaceous Matrix",
                properties: [
                  "Pyrolysis at 700–1400°C",
                  "Conductivity: 10²–10⁶ S/m",
                  "Surface area: >1500 m²/g",
                  "Tunable sp²/sp³ bonding",
                ],
              },
              {
                name: "Quartz (SiO₂)",
                properties: [
                  "Direct piezoelectric effect",
                  "High mechanical Q-factor",
                  "Excellent electrical resistivity",
                  "Stable resonance curves",
                ],
              },
              {
                name: "Tourmaline",
                properties: [
                  "Piezoelectric + pyroelectric",
                  "Higher output than quartz",
                  "Dual-mode transduction",
                  "Scalable and efficient",
                ],
              },
              {
                name: "Magnetite (Fe₃O₄)",
                properties: [
                  "Ferrimagnetic order (T_C ≈ 850–860 K)",
                  "Half-metallic properties",
                  "Spin-orbit coupling dominant",
                  "~21% spin-to-lattice conversion",
                ],
              },
              {
                name: "Rare-Earth Dopants",
                properties: [
                  "Partially filled 4f shells",
                  "Narrow spectral emission lines",
                  "Persistent magnetic moments",
                  "Host-dependent energy levels",
                ],
              },
              {
                name: "Polymer Binder",
                properties: [
                  "Controls spatial distribution",
                  "Mediates stress transfer",
                  "Environmental encapsulation",
                  "PDMS or PVDF matrix",
                ],
              },
            ].map((material, idx) => (
              <motion.div
                key={idx}
                className="p-6 rounded border border-border bg-card hover:border-primary transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + idx * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="font-bold text-foreground mb-4">
                  {material.name}
                </h3>
                <ul className="space-y-2">
                  {material.properties.map((prop, pidx) => (
                    <li
                      key={pidx}
                      className="flex gap-2 text-sm text-foreground/80"
                    >
                      <span className="text-primary">•</span>
                      <span>{prop}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Falsification Condition */}
      <section className="container mx-auto px-4 py-16 border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="max-w-3xl"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">
            FALSIFICATION CONDITION
          </h2>
          <div className="p-6 rounded border-2 border-destructive bg-destructive/10">
            <p className="text-foreground/80 leading-relaxed">
              If rare-earth dopants embedded in crystalline particles within the
              composite matrix do not produce identifiable 4f emission features
              under photoluminescence spectroscopy (Phase 4 of the validation
              program), the proposed end-to-end transduction chain would not be
              supported, and the hypothesis would require substantial revision.
            </p>
          </div>
        </motion.div>
      </section>

      {/* References & Resources */}
      <section className="container mx-auto px-4 py-16 border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-8">RESOURCES</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
              href={PREPRINT_LIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded border border-border bg-card hover:border-primary transition-colors group"
            >
              <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                Full preprint (live site)
              </h3>
              <p className="text-sm text-muted-foreground">
                Read the materials narrative, figures context, and updates on
                Tamerian Materials (opens in a new tab).
              </p>
            </a>
            <Link
              href="/materials?tab=patents"
              className="block h-full p-6 rounded border border-border bg-card hover:border-primary transition-colors group"
            >
              <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                Patent claims explorer
              </h3>
              <p className="text-sm text-muted-foreground">
                Open the interactive 25-claim explorer under Materials → Patent
                Claims.
              </p>
            </Link>
            <a
              href="#experimental-validation-program"
              className="p-6 rounded border border-border bg-card hover:border-primary transition-colors group"
            >
              <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                Experimental validation program
              </h3>
              <p className="text-sm text-muted-foreground">
                Jump to the five-phase validation outline on this page.
              </p>
            </a>
            <a
              href="https://techbridge-collective.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded border border-border bg-card hover:border-primary transition-colors group"
            >
              <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                Collaboration &amp; community
              </h3>
              <p className="text-sm text-muted-foreground">
                TechBridge Collective — digital equity, help desk model, and
                partnership pathways (opens in a new tab).
              </p>
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
