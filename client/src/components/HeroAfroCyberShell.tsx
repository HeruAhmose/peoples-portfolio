import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Signature hero chrome: sovereign HUD frame + soft Afrofuturistic orbitals.
 * Keeps children as the semantic hero content.
 */
export default function HeroAfroCyberShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <div className="hero-afro-root relative mx-auto w-full max-w-4xl px-2 sm:px-4">
      <div className="hero-afro-chamber pointer-events-none absolute inset-0 -z-10 scale-[1.02] rounded-[calc(var(--radius-lg)+12px)] opacity-90 blur-sm" />
      {!reduceMotion && (
        <>
          <motion.div
            className="pointer-events-none absolute -top-8 -left-6 h-36 w-36 rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--afro-gold)_42%,transparent)_0%,transparent_68%)] md:-left-10 md:h-44 md:w-44"
            animate={{ opacity: [0.35, 0.65, 0.35], scale: [1, 1.06, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />
          <motion.div
            className="pointer-events-none absolute -right-8 -bottom-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--afro-sapphire)_38%,transparent)_0%,transparent_70%)] md:-right-12 md:h-48 md:w-48"
            animate={{ opacity: [0.3, 0.55, 0.3], scale: [1.03, 1, 1.03] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            aria-hidden
          />
          <motion.div
            className="pointer-events-none absolute top-1/2 -right-4 h-24 w-24 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--afro-emerald)_35%,transparent)_0%,transparent_72%)]"
            animate={{ opacity: [0.25, 0.5, 0.25] }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            aria-hidden
          />
        </>
      )}
      <div className="hero-hud-frame relative">
        <span className="hero-hud-corner hero-hud-corner--tl" aria-hidden />
        <span className="hero-hud-corner hero-hud-corner--tr" aria-hidden />
        <span className="hero-hud-corner hero-hud-corner--bl" aria-hidden />
        <span className="hero-hud-corner hero-hud-corner--br" aria-hidden />
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}
