import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavigationProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  audioEnabled: boolean;
  onAudioToggle: () => void;
}

const sections = [
  { id: "home", label: "HOME" },
  { id: "materials", label: "TAMERIAN / AMC" },
  { id: "community", label: "TECHBRIDGE" },
  { id: "research", label: "RESEARCH LAB" },
];

/** Warm Vite lazy chunks (matches `App.tsx` dynamic imports). */
function prefetchSection(id: string) {
  switch (id) {
    case "materials":
      void import("@/pages/MaterialsScience");
      break;
    case "community":
      void import("@/pages/CommunityImpact");
      break;
    case "research":
      void import("@/pages/ResearchLab");
      break;
    default:
      break;
  }
}

export default function Navigation({
  activeSection,
  onNavigate,
  audioEnabled,
  onAudioToggle,
}: NavigationProps) {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <motion.nav
      className="cyber-nav-glow fixed top-0 right-0 left-0 z-40 border-b border-cyan-500/25 bg-background/65 backdrop-blur-xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent"
        aria-hidden
      />
      <div className="container flex h-16 items-center justify-between">
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="font-display text-2xl font-bold text-primary neon-text drop-shadow-[0_0_12px_oklch(0.65_0.25_45/0.55)]">
            ◉
          </div>
          <span className="font-display hidden text-xs font-semibold tracking-[0.2em] text-foreground/95 sm:inline md:text-sm">
            JONATHAN PEOPLES
          </span>
        </motion.div>

        <div className="hidden items-center gap-8 md:flex">
          {sections.map(section => (
            <motion.button
              key={section.id}
              type="button"
              onClick={() => onNavigate(section.id)}
              onPointerEnter={() => prefetchSection(section.id)}
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
              className="relative font-mono text-[11px] tracking-[0.18em] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span
                className={`${
                  activeSection === section.id
                    ? "text-primary neon-text"
                    : hoveredSection === section.id
                      ? "text-cyan-400"
                      : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {section.label}
              </span>
              {activeSection === section.id && (
                <motion.div
                  className="absolute right-0 bottom-0 left-0 h-0.5 bg-primary"
                  layoutId="activeIndicator"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="border-cyan-500/30 bg-background/50 hover:border-primary/50 md:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[min(100vw,20rem)] border-l border-cyan-500/20 bg-card/95 backdrop-blur-xl"
            >
              <SheetHeader>
                <SheetTitle className="font-display text-xs font-semibold tracking-[0.28em] text-primary">
                  SECTORS
                </SheetTitle>
              </SheetHeader>
              <nav
                className="mt-6 flex flex-col gap-1 px-2"
                aria-label="Mobile"
              >
                {sections.map(section => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => go(section.id)}
                    onPointerEnter={() => prefetchSection(section.id)}
                    className={`rounded-lg border px-4 py-3 text-left font-mono text-sm tracking-[0.14em] transition-colors ${
                      activeSection === section.id
                        ? "border-primary/40 bg-primary/15 text-primary shadow-[inset_0_0_20px_oklch(0.65_0.25_45/0.12)]"
                        : "border-transparent text-muted-foreground hover:border-border hover:bg-muted/40 hover:text-foreground"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <motion.button
            type="button"
            onClick={onAudioToggle}
            className="rounded-lg border border-cyan-500/25 bg-background/40 p-2 transition-colors hover:border-primary/60 hover:shadow-[0_0_16px_-4px_oklch(0.65_0.25_45/0.45)]"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={audioEnabled ? "Mute audio" : "Unmute audio"}
            aria-label={audioEnabled ? "Mute audio" : "Unmute audio"}
          >
            {audioEnabled ? (
              <Volume2 className="h-5 w-5 text-primary" />
            ) : (
              <VolumeX className="h-5 w-5 text-muted-foreground" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
