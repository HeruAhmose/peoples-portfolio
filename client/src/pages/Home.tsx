import { useEffect } from "react";
import { motion } from "framer-motion";
import { HolographicText } from "@/components/AdvancedVisuals";
import {
  AnimatedGradientOrb,
  CardFlip3D,
  FloatingBubbles,
  GlitchFlash,
  LiquidSwipeWave,
  LoadingPulse,
  MorphingBlob,
  ParallaxSection,
  ParticleBurst,
  RippleButton,
  ScrollReveal,
  StaggerItem,
  StaggerReveal,
  SuccessCheckmark,
  TextReveal,
} from "@/components/AdvancedVisualEffects";
import { usePortfolioAnalytics } from "@/hooks/usePortfolioAnalytics";
import AboutMeSection from "@/components/AboutMeSection";
import FounderMediaJourney from "@/components/FounderMediaJourney";
import AfrofuturisticCraftSection from "@/components/AfrofuturisticCraftSection";
import AdvancedVisualEffectsSection from "@/components/AdvancedVisualEffectsSection";
import HeroAfroCyberShell from "@/components/HeroAfroCyberShell";
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
      {/* Hero — sovereign Afro × cyber security centerpiece */}
      <section className="container mx-auto flex flex-col items-center justify-center px-4 py-16 text-center md:py-28">
        <HeroAfroCyberShell>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85 }}
            className="cyber-panel cyber-panel--hero relative max-w-3xl overflow-hidden px-6 pt-10 pb-12 text-center md:px-12 md:pt-14 md:pb-14"
          >
            <MorphingBlob className="-top-24 -left-20 h-48 w-48 md:-left-28 md:h-64 md:w-64" />
            <AnimatedGradientOrb className="-top-32 right-[-20%] h-72 w-72 md:right-[-10%]" />
            <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
              <ParticleBurst />
            </div>
            <LiquidSwipeWave className="z-[2]" />

            <div className="relative z-10">
              <div className="pointer-events-none absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-[color:color-mix(in_oklch,var(--afro-gold)_55%,var(--cyan))] to-transparent" />
              <p className="font-mono text-[10px] tracking-[0.4em] text-cyan-400/85 md:text-xs">
                FOUNDER WORLD /// LIVING PORTFOLIO
              </p>
              <p className="font-hero-display mt-2 text-[10px] font-semibold tracking-[0.2em] text-[color:color-mix(in_oklch,var(--afro-emerald)_78%,white)] md:text-[11px] md:tracking-[0.26em]">
                SERVICE × INVENTION × SOVEREIGN SYSTEMS
              </p>
              <p className="mt-2 font-mono text-[9px] tracking-[0.18em] text-muted-foreground/90 md:text-[10px] md:tracking-[0.22em]">
                <GlitchFlash>
                  SOVEREIGN STACK /// ZERO-TRUST VISUAL · CIPHER-ORBIT HUD
                </GlitchFlash>
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
                <SuccessCheckmark label="SYSTEMS NOMINAL" />
                <LoadingPulse className="opacity-80" />
              </div>
              <div className="mt-7 space-y-5">
                <h1 className="font-display text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                  <HolographicText variant="sovereign" className="font-bold">
                    JONATHAN PEOPLES
                  </HolographicText>
                </h1>
                <p className="font-hero-display text-sm font-medium tracking-[0.12em] text-foreground/88 md:text-base md:tracking-[0.14em]">
                  Navy veteran · founder · inventor · systems builder
                </p>
                <p className="font-mono text-base tracking-wide text-foreground/90 md:text-xl">
                  <span className="text-primary">Queen Califia CyberAI</span>
                  <span className="text-cyan-400/80"> · </span>
                  <span className="text-foreground/85">Tamerian Materials</span>
                  <span className="text-fuchsia-400/75"> · </span>
                  <span className="text-foreground/85">
                    TechBridge Collective
                  </span>
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  <TextReveal text="Born in Salisbury and raised in Kannapolis, Jonathan Peoples carries the discipline of football and Navy service into a connected body of work spanning advanced materials, sovereign cybersecurity, AI systems, research, and community technology infrastructure." />
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.75 }}
                className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center"
              >
                <RippleButton
                  type="button"
                  onClick={() => onNavigate("materials")}
                  className="btn-afro-primary font-mono text-xs tracking-[0.2em] md:text-sm"
                >
                  EXPLORE MATERIALS SCIENCE
                </RippleButton>
                <RippleButton
                  type="button"
                  variant="outline"
                  onClick={() => onNavigate("research")}
                  className="btn-afro-outline font-mono text-xs tracking-[0.2em] text-primary backdrop-blur-sm hover:border-cyan-400/50 hover:bg-primary/10 md:text-sm"
                >
                  VIEW RESEARCH
                </RippleButton>
              </motion.div>
            </div>
          </motion.div>
        </HeroAfroCyberShell>
      </section>

      <AboutMeSection />
      <FounderMediaJourney />

      <AfrofuturisticCraftSection />

      <AdvancedVisualEffectsSection />

      {/* Portfolio Sections Preview — parallax + 3D flip nodes */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <ParallaxSection className="py-2" intensity={28}>
          <div className="relative">
            <FloatingBubbles className="rounded-[2rem] opacity-90" />
            <ScrollReveal>
              <p className="font-hero-display text-center text-[11px] font-semibold tracking-[0.28em] text-muted-foreground mb-10 md:text-xs">
                SECTOR MAP /// SELECT NODE
              </p>
            </ScrollReveal>
            <div className="relative z-10 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
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
                  id: "gallery",
                  title: "3D Project Gallery",
                  description:
                    "Flip cards, live search, category filters, and three sort modes — six builds",
                  icon: "⎔",
                },
                {
                  id: "timeline",
                  title: "Founder Journey",
                  description:
                    "Kannapolis football → Navy service → materials → cyber → community systems",
                  icon: "◐",
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
              ].map(section => (
                <CardFlip3D
                  key={section.id}
                  className="min-h-[220px]"
                  ariaLabel={`Open ${section.title}`}
                  onActivate={() => {
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
                  front={
                    <div className="cyber-panel--subtle sector-node-card flex h-full min-h-[220px] flex-col rounded-xl p-6 text-left">
                      <div className="mb-4 font-display text-3xl text-primary/90">
                        {section.icon}
                      </div>
                      <h3 className="font-display mb-2 text-sm font-semibold tracking-wide text-foreground md:text-base">
                        {section.title}
                      </h3>
                      <p className="text-left text-xs leading-relaxed text-muted-foreground md:text-sm">
                        {section.description}
                      </p>
                    </div>
                  }
                  back={
                    <div className="cyber-panel--subtle flex h-full min-h-[220px] flex-col items-center justify-center rounded-xl border-primary/35 bg-card/90 p-6 text-center shadow-[inset_0_0_40px_oklch(0.65_0.25_45/0.06)]">
                      <p className="font-mono text-[10px] tracking-[0.35em] text-primary">
                        ENTER NODE
                      </p>
                      <p className="font-display mt-3 text-sm font-semibold text-foreground">
                        {section.title}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Hover to preview · Click or Enter to open
                      </p>
                    </div>
                  }
                />
              ))}
            </div>
          </div>
        </ParallaxSection>
      </section>

      {/* Featured Content */}
      <section className="container mx-auto border-t border-cyan-500/15 px-4 py-20">
        <ScrollReveal className="mx-auto max-w-3xl">
          <h2 className="font-hero-display mb-2 text-2xl font-bold tracking-wide text-foreground md:text-3xl">
            Featured Highlights
          </h2>
          <p className="font-mono mb-10 text-[10px] tracking-[0.3em] text-[color:color-mix(in_oklch,var(--afro-copper)_65%,var(--muted-foreground))]">
            DATA FEED /// LIVE WORK
          </p>

          <StaggerReveal className="space-y-5">
            <StaggerItem>
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
                  quantum-active phases — one composite for energy harvesting
                  and room-temperature quantum sensing. {TAMERIAN_PATENT.status}{" "}
                  · U.S. App. No. {TAMERIAN_PATENT.applicationNo}, filed{" "}
                  {TAMERIAN_PATENT.filedDate} · {TAMERIAN_PATENT.claimCount}{" "}
                  claims (source: live patents section on the site above).
                </p>
              </motion.div>
            </StaggerItem>

            <StaggerItem>
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
                  human-centered digital help at Triangle community sites.
                  Weekly help desk, H.K. AI triage (named for Horace King), and
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
            </StaggerItem>

            <StaggerItem>
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
                  awakening sequence with hex mesh telemetry, cinematic transition geometry, and
                  transition matrix — matching the public experience on the live
                  Firebase app.
                </p>
              </motion.div>
            </StaggerItem>

            <StaggerItem>
              <motion.div
                className="cyber-panel--subtle rounded-xl p-6 transition-colors hover:border-primary/40"
                whileHover={{ x: 4 }}
              >
                <h3 className="font-display mb-2 text-sm font-semibold tracking-wide text-primary md:text-base">
                  Architected Multi-Modal Coupling (AMC)
                </h3>
                <p className="text-foreground/80 text-sm">
                  Research-side framing for the composite hypothesis (preprint
                  on this site). For the full product narrative, patents, and
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
            </StaggerItem>
          </StaggerReveal>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer className="mt-16 border-t border-[color:color-mix(in_oklch,var(--cyan)_25%,var(--afro-gold))] py-10">
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
