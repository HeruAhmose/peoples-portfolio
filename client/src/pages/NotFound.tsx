import { Button } from "@/components/ui/button";
import { Home, Radio } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="flex min-h-[min(85vh,720px)] w-full flex-col items-center justify-center px-4 py-16">
      <div className="cyber-panel relative max-w-lg px-8 py-12 text-center">
        <div
          className="pointer-events-none absolute -top-3 left-1/2 h-px w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent"
          aria-hidden
        />
        <div className="mb-6 flex justify-center">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-primary/40 bg-primary/10 shadow-[0_0_32px_-8px_oklch(0.65_0.25_45/0.5)]">
            <Radio className="h-9 w-9 text-primary" aria-hidden />
          </div>
        </div>
        <p className="font-mono text-[10px] tracking-[0.4em] text-cyan-400/80">
          SIGNAL LOST /// 404
        </p>
        <h1 className="font-display mt-4 text-5xl font-bold tracking-tight text-foreground">
          OFF-GRID
        </h1>
        <p className="mt-2 font-mono text-xs tracking-widest text-muted-foreground">
          NODE NOT FOUND IN ROUTING MATRIX
        </p>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          This path is not mapped in the portfolio. Return to the home sector or
          use the navigation above.
        </p>
        <Button
          onClick={() => setLocation("/")}
          className="mt-8 font-mono text-xs tracking-[0.2em]"
        >
          <Home className="mr-2 h-4 w-4" />
          RETURN HOME
        </Button>
      </div>
    </div>
  );
}
