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
      className="fixed top-0 left-0 right-0 z-40 border-b border-border bg-background/80 backdrop-blur-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="container flex h-16 items-center justify-between">
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-2xl font-bold text-primary neon-text">◉</div>
          <span className="hidden font-mono text-sm tracking-widest text-foreground sm:inline">
            JONATHAN PEOPLES
          </span>
        </motion.div>

        <div className="hidden items-center gap-8 md:flex">
          {sections.map(section => (
            <motion.button
              key={section.id}
              type="button"
              onClick={() => onNavigate(section.id)}
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
              className="relative font-mono text-xs tracking-widest transition-colors"
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
                className="border-border md:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100vw,20rem)]">
              <SheetHeader>
                <SheetTitle className="font-mono text-xs tracking-widest">
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
                    className={`rounded-md px-4 py-3 text-left font-mono text-sm tracking-widest transition-colors ${
                      activeSection === section.id
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
            className="rounded border border-border p-2 transition-colors hover:border-primary"
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
