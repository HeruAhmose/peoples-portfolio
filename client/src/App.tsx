import { useState, useEffect } from "react";
import { Route, Switch } from "wouter";
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
  const [showAwakening, setShowAwakening] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [hkAssistantOpen, setHkAssistantOpen] = useState(false);

  useEffect(() => {
    // Force dark theme
    document.documentElement.classList.add("dark");
  }, []);

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    // In a real app, you'd use wouter's navigation here
    window.location.hash = section === "home" ? "/" : `/${section}`;
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
                onNavigate={handleNavigate}
                audioEnabled={audioEnabled}
                onAudioToggle={() => setAudioEnabled(!audioEnabled)}
              />

              <main className="pt-16 min-h-screen bg-background space-bg">
                <Router
                  activeSection={activeSection}
                  onNavigate={handleNavigate}
                />
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
