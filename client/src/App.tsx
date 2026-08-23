import { lazy, Suspense, useState, useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LatticeIgnition } from "./components/cinematic/LatticeIgnition";
import Navigation from "./components/Navigation";
import HKAssistant from "./components/HKAssistant";
import Home from "./pages/Home";
import PageLoadFallback from "./components/PageLoadFallback";
import { useAudioSystem } from "./hooks/useAudioSystem";
import { ParticleBackground } from "./components/AdvancedVisuals";

const MaterialsScience = lazy(() => import("./pages/MaterialsScience"));
const CommunityImpact = lazy(() => import("./pages/CommunityImpact"));
const ResearchLab = lazy(() => import("./pages/ResearchLab"));
const ProjectGallery = lazy(() => import("./pages/ProjectGallery"));
const CareerTimeline = lazy(() => import("./pages/CareerTimeline"));
const NotFound = lazy(() => import("./pages/NotFound"));

function pathToSection(loc: string): string {
  const raw = loc.split("?")[0] || "/";
  const path = raw.replace(/\/$/, "") || "/";
  if (path === "/" || path === "") return "home";
  const seg = path.slice(1).split("/")[0];
  if (
    seg === "materials" ||
    seg === "community" ||
    seg === "research" ||
    seg === "gallery" ||
    seg === "timeline"
  )
    return seg;
  return "home";
}

function sectionToPath(section: string): string {
  if (section === "home") return "/";
  return `/${section}`;
}

const SECTION_TITLES: Record<string, string> = {
  home: "Jonathan Peoples | Afrofuturistic Cyber Portfolio",
  materials: "Materials Science | Jonathan Peoples",
  community: "Community Impact | Jonathan Peoples",
  research: "Research Lab | Jonathan Peoples",
  gallery: "3D Project Gallery | Jonathan Peoples",
  timeline: "Founder Journey | Jonathan Peoples",
};

function Router({
  activeSection,
  onNavigate,
}: {
  activeSection: string;
  onNavigate: (section: string) => void;
}) {
  return (
    <Switch>
      <Route
        path="/"
        component={() => (
          <Home activeSection={activeSection} onNavigate={onNavigate} />
        )}
      />
      <Route path="/materials">
        <Suspense fallback={<PageLoadFallback />}>
          <MaterialsScience
            activeSection={activeSection}
            onNavigate={onNavigate}
          />
        </Suspense>
      </Route>
      <Route path="/community">
        <Suspense fallback={<PageLoadFallback />}>
          <CommunityImpact
            activeSection={activeSection}
            onNavigate={onNavigate}
          />
        </Suspense>
      </Route>
      <Route path="/research">
        <Suspense fallback={<PageLoadFallback />}>
          <ResearchLab activeSection={activeSection} onNavigate={onNavigate} />
        </Suspense>
      </Route>
      <Route path="/gallery">
        <Suspense fallback={<PageLoadFallback />}>
          <ProjectGallery
            activeSection={activeSection}
            onNavigate={onNavigate}
          />
        </Suspense>
      </Route>
      <Route path="/timeline">
        <Suspense fallback={<PageLoadFallback />}>
          <CareerTimeline
            activeSection={activeSection}
            onNavigate={onNavigate}
          />
        </Suspense>
      </Route>
      <Route path="/404">
        <Suspense fallback={<PageLoadFallback />}>
          <NotFound />
        </Suspense>
      </Route>
      <Route>
        <Suspense fallback={<PageLoadFallback />}>
          <NotFound />
        </Suspense>
      </Route>
    </Switch>
  );
}

function App() {
  const [location, setLocation] = useLocation();
  const activeSection = pathToSection(location);
  const { isMuted, toggleMute, playSectionTransition, playClickSound } =
    useAudioSystem();
  const [showAwakening, setShowAwakening] = useState(
    () => activeSection === "home"
  );
  const [introBrief] = useState(() => {
    try {
      const seen = sessionStorage.getItem("trai_ignition_seen") === "1";
      sessionStorage.setItem("trai_ignition_seen", "1");
      return seen;
    } catch {
      return false;
    }
  });
  const [hkAssistantOpen, setHkAssistantOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.documentElement.dataset.peoplesAppMounted = "true";
  }, []);

  useEffect(() => {
    document.title =
      SECTION_TITLES[activeSection] ?? SECTION_TITLES.home ?? "Portfolio";
  }, [activeSection]);

  // Production fail-open: the cinematic intro must never become a permanent
  // black overlay. The normal sequence completes in under four seconds; this
  // watchdog gives slow devices generous headroom, then reveals the site.
  useEffect(() => {
    if (!showAwakening) return;
    const watchdog = window.setTimeout(() => setShowAwakening(false), 7000);
    return () => window.clearTimeout(watchdog);
  }, [showAwakening]);

  const handleNavigate = (section: string) => {
    if (pathToSection(location) !== section) {
      void playSectionTransition();
    }
    const nextPath = sectionToPath(section);
    const transition = (window as any).TRAIOrganismV5?.transitionInternal;
    if (typeof transition === "function") {
      void transition(() => setLocation(nextPath), { label: section });
      return;
    }
    setLocation(nextPath);
  };

  const handleNavClick = (section: string) => {
    void playClickSound();
    handleNavigate(section);
  };

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />

          {showAwakening && (
            <LatticeIgnition
              brief={introBrief}
              onComplete={() => setShowAwakening(false)}
            />
          )}

          {!showAwakening && (
            <>
              <Navigation
                activeSection={activeSection}
                onNavigate={handleNavClick}
                audioEnabled={!isMuted}
                onAudioToggle={toggleMute}
              />

              <main className="relative z-10 min-h-screen space-bg overflow-x-hidden pt-16">
                <ParticleBackground className="absolute inset-0" />
                <div className="cyber-grid-overlay" aria-hidden />
                <div className="afro-aurora-veil" aria-hidden />
                <div className="film-grain" aria-hidden />
                <div className="cyber-vignette" aria-hidden />
                <div
                  className="pointer-events-none absolute inset-0 z-[1] scan-effect opacity-[0.12]"
                  aria-hidden
                />
                <div className="relative z-10">
                  <Router
                    activeSection={activeSection}
                    onNavigate={handleNavigate}
                  />
                </div>
              </main>

              <button
                type="button"
                onClick={() => setHkAssistantOpen(!hkAssistantOpen)}
                className="group fixed bottom-4 left-4 z-40 flex items-center gap-3 rounded-full border border-[color:color-mix(in_oklch,var(--afro-emerald)_42%,var(--cyan))] bg-background/90 px-2.5 py-2.5 text-left text-foreground shadow-[0_0_36px_-4px_oklch(0.65_0.25_45/0.75),0_0_24px_-6px_color-mix(in_oklch,var(--afro-sapphire)_35%,transparent)] backdrop-blur-md transition-all hover:scale-[1.02] hover:border-cyan-300/55 hover:shadow-[0_0_48px_0_oklch(0.6_0.2_200/0.38)] sm:px-3"
                title={
                  hkAssistantOpen
                    ? "Close H.K. Assistant"
                    : "Open H.K. Assistant"
                }
                aria-label={
                  hkAssistantOpen
                    ? "Close H.K. Assistant"
                    : "Open H.K. Assistant"
                }
                aria-expanded={hkAssistantOpen}
              >
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-300/30 bg-primary text-primary-foreground shadow-[0_0_18px_-2px_oklch(0.65_0.25_45/0.7)]">
                  <span
                    className="absolute inset-1 rounded-full border border-white/10"
                    aria-hidden
                  />
                  <span className="font-display text-xs font-bold tracking-[0.08em]">
                    HK
                  </span>
                </span>
                <span className="hidden pr-2 sm:block">
                  <span className="block font-display text-xs font-semibold tracking-[0.22em] text-foreground">
                    H.K.
                  </span>
                  <span className="mt-0.5 block font-mono text-[9px] tracking-[0.18em] text-cyan-200/75">
                    PORTFOLIO GUIDE
                  </span>
                </span>
              </button>

              <HKAssistant
                isOpen={hkAssistantOpen}
                onClose={() => setHkAssistantOpen(false)}
              />
            </>
          )}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
