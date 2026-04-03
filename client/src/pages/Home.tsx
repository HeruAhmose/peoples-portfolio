import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HolographicText } from "@/components/AdvancedVisuals";
import { usePortfolioAnalytics } from "@/hooks/usePortfolioAnalytics";
import AboutMeSection from "@/components/AboutMeSection";
import AfrofuturisticCraftSection from "@/components/AfrofuturisticCraftSection";
import {
  TAMERIAN_PATENT,
  TECHBRIDGE_ROLLOUT,
  TECHBRIDGE_SPAN_IMPACT_URL,
} from "@shared/siteFacts";

interface HomeProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

export default function Home({ activeSection, onNavigate }: HomeProps) {
  const { logSectionView } = usePortfolioAnalytics();
  useEffect(() => {
    logSectionView("home");
  }, [logSectionView]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto flex flex-col items-center justify-center px-4 py-16 text-center md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85 }}
          className="cyber-panel relative max-w-3xl px-6 py-10 md:px-12 md:py-14"
        >
          <p className="font-mono text-[10px] tracking-[0.4em] text-cyan-400/85 md:text-xs">
            NEURAL PORTFOLIO /// 2060-READY
          </p>
          <p className="mt-2 font-mono text-[9px] tracking-[0.22em] text-[color:color-mix(in_oklch,var(--afro-emerald)_72%,white)] md:text-[10px] md:tracking-[0.28em]">
            AFROFUTURISTIC CRAFT · HERITAGE × FRONTIER TECH
          </p>
          <div className="pointer-events-none absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
          <div className="mt-6 space-y-5">
            <h1 className="font-display text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              <HolographicText className="font-bold">
                JONATHAN PEOPLES
              </HolographicText>
            </h1>
            <p className="font-mono text-base tracking-wide text-foreground/90 md:text-xl">
              <span className="text-primary">Queen Califia CyberAI</span>
              <span className="text-cyan-400/80"> · </span>
              <span className="text-foreground/85">Tamerian Materials</span>
              <span className="text-fuchsia-400/75"> · </span>
              <span className="text-foreground/85">TechBridge Collective</span>
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              Sovereign cybersecurity intelligence, hemp-carbon composite
              innovation (where carbon meets crystal), and human-centered
              digital equity across the Triangle — with research tying the
              threads together. The interface layer celebrates African diaspora
              futurism through gold, gem, and earth tones, motion, and HUD depth
              alongside the cyber-neon spine.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.75 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center"
          >
            <Button
              onClick={() => onNavigate("materials")}
              className="font-mono text-xs tracking-[0.2em] shadow-[0_0_24px_-6px_oklch(0.65_0.25_45/0.65)] md:text-sm"
            >
              EXPLORE MATERIALS SCIENCE
            </Button>
            <Button
              onClick={() => onNavigate("research")}
              variant="outline"
              className="border-primary/60 bg-background/30 font-mono text-xs tracking-[0.2em] text-primary backdrop-blur-sm hover:border-cyan-400/50 hover:bg-primary/10 md:text-sm"
            >
              VIEW RESEARCH
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <AboutMeSection />

      <AfrofuturisticCraftSection />

      {/* Portfolio Sections Preview */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <p className="font-mono text-center text-[10px] tracking-[0.35em] text-muted-foreground mb-10">
          SECTOR MAP /// SELECT NODE
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-4"
        >
          {[
            {
              id: "califia",
              title: "Queen Califia CyberAI",
              description:
                "Sovereign cybersecurity intelligence — sovereign awakening experience",
              icon: "◉",
              externalUrl: "https://queencalifia-cyberai.web.app/",
            },
            {
              id: "materials",
              title: "Tamerian Materials",
              description:
                "Where carbon meets crystal — hemp-carbon matrices, harvesting & quantum sensing",
              icon: "◆",
            },
            {
              id: "community",
              title: "TechBridge Collective",
              description:
                "Free digital help at Triangle community sites — walk in, get help, cross the bridge",
              icon: "◇",
            },
            {
              id: "research",
              title: "Research Lab",
              description: "AMC preprint, claims, and experimental framing",
              icon: "◈",
            },
          ].map((section, idx) => (
            <motion.button
              key={section.id}
              type="button"
              onClick={() => {
                if ("externalUrl" in section && section.externalUrl) {
                  window.open(
                    section.externalUrl,
                    "_blank",
                    "noopener,noreferrer"
                  );
                  return;
                }
                onNavigate(section.id);
              }}
              className="cyber-panel--subtle group cursor-pointer rounded-xl p-6 text-left transition-all hover:border-primary/45 hover:shadow-[0_0_28px_-8px_oklch(0.65_0.25_45/0.35)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              whileHover={{ scale: 1.03, y: -6 }}
            >
              <div className="mb-4 font-display text-3xl text-primary/90 transition-all group-hover:scale-110 group-hover:text-primary group-hover:drop-shadow-[0_0_12px_oklch(0.65_0.25_45/0.5)]">
                {section.icon}
              </div>
              <h3 className="font-display mb-2 text-sm font-semibold tracking-wide text-foreground md:text-base">
                {section.title}
              </h3>
              <p className="text-left text-xs leading-relaxed text-muted-foreground md:text-sm">
                {section.description}
              </p>
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* Featured Content */}
      <section className="container mx-auto border-t border-cyan-500/15 px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mx-auto max-w-3xl"
        >
          <h2 className="font-display mb-2 text-2xl font-bold tracking-wide text-foreground md:text-3xl">
            Featured Highlights
          </h2>
          <p className="font-mono mb-10 text-[10px] tracking-[0.3em] text-muted-foreground">
            DATA FEED /// LIVE NARRATIVES
          </p>

          <div className="space-y-5">
            <motion.div
              className="cyber-panel--subtle rounded-xl p-6 transition-colors hover:border-primary/40"
              whileHover={{ x: 4 }}
            >
              <h3 className="font-display mb-2 text-sm font-semibold tracking-wide text-primary md:text-base">
                <a
                  href="https://tamerian-materials.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-cyan-300 hover:underline"
                >
                  Tamerian Materials
                </a>
              </h3>
              <p className="text-foreground/80 text-sm">
                Where carbon meets crystal: hemp-derived carbon matrices with
                embedded piezoelectric, thermoelectric, magnetic, and
                quantum-active phases — one composite for energy harvesting and
                room-temperature quantum sensing. {TAMERIAN_PATENT.status} ·
                U.S. App. No. {TAMERIAN_PATENT.applicationNo}, filed{" "}
                {TAMERIAN_PATENT.filedDate} · {TAMERIAN_PATENT.claimCount}{" "}
                claims (source: live patents section on the site above).
              </p>
            </motion.div>

            <motion.div
              className="cyber-panel--subtle rounded-xl p-6 transition-colors hover:border-primary/40"
              whileHover={{ x: 4 }}
            >
              <h3 className="font-display mb-2 text-sm font-semibold tracking-wide text-primary md:text-base">
                <a
                  href="https://techbridge-collective.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-cyan-300 hover:underline"
                >
                  TechBridge Collective
                </a>
              </h3>
              <p className="text-foreground/80 text-sm">
                Building bridges of access, dignity, and opportunity — free,
                human-centered digital help at Triangle community sites. Weekly
                help desk, H.K. AI triage (named for Horace King), and
                TechMinutes® reporting. SPAN-modeled rollout: Year{" "}
                {TECHBRIDGE_ROLLOUT.year1Hubs} pilot hubs (
                {TECHBRIDGE_ROLLOUT.year1PilotSites.join(", ")}) and Year{" "}
                {TECHBRIDGE_ROLLOUT.year2Hubs} hubs with a Year 2 SOM of ~
                {TECHBRIDGE_ROLLOUT.year2ResidentsSom.toLocaleString()}{" "}
                residents — see{" "}
                <a
                  href={TECHBRIDGE_SPAN_IMPACT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  techbridge-collective.org/impact
                </a>
                .
              </p>
            </motion.div>

            <motion.div
              className="cyber-panel--subtle rounded-xl p-6 transition-colors hover:border-primary/40"
              whileHover={{ x: 4 }}
            >
              <h3 className="font-display mb-2 text-sm font-semibold tracking-wide text-primary md:text-base">
                <a
                  href="https://queencalifia-cyberai.web.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-cyan-300 hover:underline"
                >
                  Queen Califia CyberAI
                </a>
              </h3>
              <p className="text-foreground/80 text-sm">
                Sovereign cybersecurity intelligence — interactive sovereign
                awakening sequence with hex mesh telemetry, audio unlock, and
                transition matrix — matching the public experience on the live
                Firebase app.
              </p>
            </motion.div>

            <motion.div
              className="cyber-panel--subtle rounded-xl p-6 transition-colors hover:border-primary/40"
              whileHover={{ x: 4 }}
            >
              <h3 className="font-display mb-2 text-sm font-semibold tracking-wide text-primary md:text-base">
                Architected Multi-Modal Coupling (AMC)
              </h3>
              <p className="text-foreground/80 text-sm">
                Research-side framing for the composite hypothesis (preprint on
                this site). For the full product narrative, patents, and
                manufacturing story, use{" "}
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
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="mt-16 border-t border-cyan-500/15 py-10">
        <div className="container mx-auto space-y-4 px-4 text-center">
          <p className="font-mono text-[10px] tracking-[0.35em] text-muted-foreground">
            END OF LINE /// STAY CONNECTED
          </p>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Jonathan Peoples. All rights reserved.
          </p>
          <p className="flex flex-wrap justify-center gap-x-5 gap-y-2 font-mono text-xs tracking-wide">
            <a
              href="https://queencalifia-cyberai.web.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400/80 transition-colors hover:text-primary"
            >
              Queen Califia CyberAI
            </a>
            <a
              href="https://tamerian-materials.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400/80 transition-colors hover:text-primary"
            >
              Tamerian Materials
            </a>
            <a
              href="https://techbridge-collective.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400/80 transition-colors hover:text-primary"
            >
              TechBridge Collective
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
