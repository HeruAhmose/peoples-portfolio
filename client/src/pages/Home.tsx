import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
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
          <h1 className="text-5xl md:text-7xl font-bold text-foreground">
            <span className="text-primary neon-text">JONATHAN PEOPLES</span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 font-mono tracking-wide">
            Sovereign Intelligence • Material Science • Community Impact
          </p>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Architecting the future through advanced materials science,
            cybersecurity innovation, and human-centered technology solutions.
            Bridging the gap between cutting-edge research and real-world
            impact.
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
              id: "home",
              title: "Sovereign Intelligence",
              description:
                "Cybersecurity expertise and advanced threat intelligence",
              icon: "◉",
            },
            {
              id: "materials",
              title: "Material Science",
              description:
                "Architected Multi-Modal Coupling and advanced composites",
              icon: "◆",
            },
            {
              id: "community",
              title: "Community Impact",
              description:
                "TechBridge initiatives and digital equity solutions",
              icon: "◇",
            },
            {
              id: "research",
              title: "Research Lab",
              description: "Preprint publications and experimental validation",
              icon: "◈",
            },
          ].map((section, idx) => (
            <motion.button
              key={section.id}
              onClick={() => section.id !== "home" && onNavigate(section.id)}
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
                Architected Multi-Modal Coupling (AMC)
              </h3>
              <p className="text-foreground/80 text-sm">
                A novel materials hypothesis integrating hemp-derived carbon,
                quartz, tourmaline, magnetite, and rare-earth dopants to achieve
                system-level multi-modal transduction. Currently under
                experimental validation with 25 patent claims filed.
              </p>
            </motion.div>

            <motion.div
              className="p-6 rounded border border-border bg-card hover:border-primary transition-colors"
              whileHover={{ x: 4 }}
            >
              <h3 className="font-bold text-primary mb-2">
                TechBridge Collective
              </h3>
              <p className="text-foreground/80 text-sm">
                Building bridges of access, dignity, and opportunity through
                human-centered digital help. Free, community-based digital
                navigation services across the Triangle Area with H.K. AI triage
                support.
              </p>
            </motion.div>

            <motion.div
              className="p-6 rounded border border-border bg-card hover:border-primary transition-colors"
              whileHover={{ x: 4 }}
            >
              <h3 className="font-bold text-primary mb-2">
                Cybersecurity & Sovereign Intelligence
              </h3>
              <p className="text-foreground/80 text-sm">
                Advanced threat intelligence, security architecture, and
                sovereign computing solutions. Expertise in quantum-resistant
                cryptography and distributed systems security.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground font-mono">
          <p>© 2026 Jonathan Peoples. All rights reserved.</p>
          <p className="mt-2">
            Architecting the future through innovation, research, and community
            impact.
          </p>
        </div>
      </footer>
    </div>
  );
}
