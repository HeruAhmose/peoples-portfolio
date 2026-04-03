import { lazy, Suspense, useState, useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import SovereignAwakening from "./components/SovereignAwakening";
import Navigation from "./components/Navigation";
import HKAssistant from "./components/HKAssistant";
import Home from "./pages/Home";
import PageLoadFallback from "./components/PageLoadFallback";
import { useAudioSystem } from "./hooks/useAudioSystem";
import { ParticleBackground } from "./components/AdvancedVisuals";

const MaterialsScience = lazy(() => import("./pages/MaterialsScience"));
const CommunityImpact = lazy(() => import("./pages/CommunityImpact"));
const ResearchLab = lazy(() => import("./pages/ResearchLab"));
const NotFound = lazy(() => import("./pages/NotFound"));

function pathToSection(loc: string): string {
  const raw = loc.split("?")[0] || "/";
  const path = raw.replace(/\/$/, "") || "/";
  if (path === "/" || path === "") return "home";
  const seg = path.slice(1).split("/")[0];
  if (seg === "materials" || seg === "community" || seg === "research")
    return seg;
  return "home";
}

function sectionToPath(section: string): string {
  if (section === "home") return "/";
  return `/${section}`;
}

const SECTION_TITLES: Record<string, string> = {
  home: "Jonathan Peoples | Portfolio",
  materials: "Materials Science | Jonathan Peoples",
  community: "Community Impact | Jonathan Peoples",
  research: "Research Lab | Jonathan Peoples",
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
  const [showAwakening, setShowAwakening] = useState(true);
  const [hkAssistantOpen, setHkAssistantOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    document.title =
      SECTION_TITLES[activeSection] ?? SECTION_TITLES.home ?? "Portfolio";
  }, [activeSection]);

  const handleNavigate = (section: string) => {
    if (pathToSection(location) !== section) {
      void playSectionTransition();
    }
    setLocation(sectionToPath(section));
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
            <SovereignAwakening onComplete={() => setShowAwakening(false)} />
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
                <div
                  className="pointer-events-none absolute inset-0 z-[1] scan-effect opacity-[0.18]"
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
                className="fixed bottom-4 left-4 z-40 rounded-full bg-primary p-4 text-background shadow-lg transition-colors hover:bg-primary/80"
                title="Open H.K. Assistant"
                aria-label="Open H.K. Assistant"
              >
                <span className="text-xl font-bold">◉</span>
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
