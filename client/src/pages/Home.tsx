import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HolographicText } from "@/components/AdvancedVisuals";
import { usePortfolioAnalytics } from "@/hooks/usePortfolioAnalytics";

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
      <section className="container mx-auto px-4 py-20 md:py-32 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold">
            <HolographicText className="font-bold">
              JONATHAN PEOPLES
            </HolographicText>
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 font-mono tracking-wide">
            Queen Califia CyberAI • Tamerian Materials • TechBridge Collective
          </p>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Sovereign cybersecurity intelligence, hemp-carbon composite
            innovation (where carbon meets crystal), and human-centered digital
            equity across the Triangle — with research tying the threads
            together.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 mt-12"
        >
          <Button
            onClick={() => onNavigate("materials")}
            className="px-8 py-3 bg-primary text-background hover:bg-primary/80 font-mono text-sm tracking-widest"
          >
            EXPLORE MATERIALS SCIENCE
          </Button>
          <Button
            onClick={() => onNavigate("research")}
            variant="outline"
            className="px-8 py-3 border-primary text-primary hover:bg-primary/10 font-mono text-sm tracking-widest"
          >
            VIEW RESEARCH
          </Button>
        </motion.div>
      </section>

      {/* Portfolio Sections Preview */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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
              className="p-6 rounded border border-border hover:border-primary transition-all group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              whileHover={{ scale: 1.05, y: -4 }}
            >
              <div className="text-4xl mb-4 group-hover:text-primary transition-colors">
                {section.icon}
              </div>
              <h3 className="font-bold text-foreground mb-2 text-left">
                {section.title}
              </h3>
              <p className="text-sm text-muted-foreground text-left">
                {section.description}
              </p>
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* Featured Content */}
      <section className="container mx-auto px-4 py-20 border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Featured Highlights
          </h2>

          <div className="space-y-6">
            <motion.div
              className="p-6 rounded border border-border bg-card hover:border-primary transition-colors"
              whileHover={{ x: 4 }}
            >
              <h3 className="font-bold text-primary mb-2">
                <a
                  href="https://tamerian-materials.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Tamerian Materials
                </a>
              </h3>
              <p className="text-foreground/80 text-sm">
                Where carbon meets crystal: hemp-derived carbon matrices with
                embedded piezoelectric, thermoelectric, magnetic, and
                quantum-active phases — one composite for energy harvesting and
                room-temperature quantum sensing. Patent pending · U.S. App. No.
                63/934,269 (25 claims).
              </p>
            </motion.div>

            <motion.div
              className="p-6 rounded border border-border bg-card hover:border-primary transition-colors"
              whileHover={{ x: 4 }}
            >
              <h3 className="font-bold text-primary mb-2">
                <a
                  href="https://techbridge-collective.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  TechBridge Collective
                </a>
              </h3>
              <p className="text-foreground/80 text-sm">
                Building bridges of access, dignity, and opportunity — free,
                human-centered digital help at community sites across the
                Triangle. Weekly help desk, H.K. AI triage (named for Horace
                King), and TechMinutes® reporting. About 1.2M North Carolinians
                lack adequate digital access (per SPAN market analysis on the
                live site).
              </p>
            </motion.div>

            <motion.div
              className="p-6 rounded border border-border bg-card hover:border-primary transition-colors"
              whileHover={{ x: 4 }}
            >
              <h3 className="font-bold text-primary mb-2">
                <a
                  href="https://queencalifia-cyberai.web.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
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
              className="p-6 rounded border border-border bg-card hover:border-primary transition-colors"
              whileHover={{ x: 4 }}
            >
              <h3 className="font-bold text-primary mb-2">
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
      <footer className="border-t border-border mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground font-mono space-y-3">
          <p>© 2026 Jonathan Peoples. All rights reserved.</p>
          <p className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <a
              href="https://queencalifia-cyberai.web.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Queen Califia CyberAI
            </a>
            <a
              href="https://tamerian-materials.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Tamerian Materials
            </a>
            <a
              href="https://techbridge-collective.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              TechBridge Collective
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
