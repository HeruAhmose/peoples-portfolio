import { useState, useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import SovereignAwakening from "./components/SovereignAwakening";
import Navigation from "./components/Navigation";
import HKAssistant from "./components/HKAssistant";
import Home from "./pages/Home";
import MaterialsScience from "./pages/MaterialsScience";
import CommunityImpact from "./pages/CommunityImpact";
import ResearchLab from "./pages/ResearchLab";
import NotFound from "./pages/NotFound";
import { useAudioSystem } from "./hooks/useAudioSystem";
import { ParticleBackground } from "./components/AdvancedVisuals";

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
      <Route
        path="/materials"
        component={() => (
          <MaterialsScience
            activeSection={activeSection}
            onNavigate={onNavigate}
          />
        )}
      />
      <Route
        path="/community"
        component={() => (
          <CommunityImpact
            activeSection={activeSection}
            onNavigate={onNavigate}
          />
        )}
      />
      <Route
        path="/research"
        component={() => (
          <ResearchLab activeSection={activeSection} onNavigate={onNavigate} />
        )}
      />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
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
    // Force dark theme
    document.documentElement.classList.add("dark");
  }, []);

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

          {/* Sovereign Awakening Sequence */}
          {showAwakening && (
            <SovereignAwakening onComplete={() => setShowAwakening(false)} />
          )}

          {/* Main Content */}
          {!showAwakening && (
            <>
              <Navigation
                activeSection={activeSection}
                onNavigate={handleNavClick}
                audioEnabled={!isMuted}
                onAudioToggle={toggleMute}
              />

              <main className="relative z-10 overflow-x-hidden pt-16 min-h-screen space-bg">
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

              {/* H.K. Assistant Button */}
              <button
                onClick={() => setHkAssistantOpen(!hkAssistantOpen)}
                className="fixed bottom-4 left-4 p-4 rounded-full bg-primary text-background hover:bg-primary/80 transition-colors shadow-lg z-40"
                title="Open H.K. Assistant"
              >
                <span className="text-xl font-bold">◉</span>
              </button>

              {/* H.K. Assistant */}
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
