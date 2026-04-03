import { useCallback, useEffect, useId, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Check } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const defaultViewport = { once: true, margin: "-60px" as const };

/** Scroll-driven vertical parallax wrapper (subtle). */
export function ParallaxSection({
  children,
  className,
  intensity = 36,
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [intensity, -intensity]
  );

  return (
    <div ref={ref} className={cn("relative", className)} role="presentation">
      <motion.div style={{ y }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}

/** Fade + rise when entering the viewport. */
export function ScrollReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = usePrefersReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={defaultViewport}
      transition={{
        duration: reduce ? 0 : 0.55,
        delay: reduce ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function StaggerReveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = usePrefersReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={defaultViewport}
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = usePrefersReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}

/** 3D flip: front / back; hover or focus-within; reduced motion = no flip. */
export function CardFlip3D({
  front,
  back,
  className,
  onActivate,
  ariaLabel = "Open sector node",
}: {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
  onActivate?: () => void;
  ariaLabel?: string;
}) {
  const reduce = usePrefersReducedMotion();
  const [hover, setHover] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const flipped = !reduce && (hover || focusWithin);

  return (
    <motion.div
      className={cn(
        "cursor-pointer rounded-xl [perspective:1400px] outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
        className
      )}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      onFocusCapture={() => setFocusWithin(true)}
      onBlurCapture={e => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setFocusWithin(false);
        }
      }}
      onClick={() => onActivate?.()}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onActivate?.();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
    >
      <motion.div
        className="relative min-h-[220px] w-full [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="absolute inset-0 [backface-visibility:hidden]"
          style={{ WebkitBackfaceVisibility: "hidden" }}
        >
          {front}
        </div>
        <div
          className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{ WebkitBackfaceVisibility: "hidden" }}
        >
          {back}
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Decorative morphing border-radius blob. */
export function MorphingBlob({ className }: { className?: string }) {
  const reduce = usePrefersReducedMotion();
  return (
    <motion.div
      className={cn(
        "pointer-events-none absolute rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-[radial-gradient(circle_at_30%_30%,color-mix(in_oklch,var(--afro-emerald)_22%,transparent),transparent_65%)] opacity-50 blur-2xl",
        className
      )}
      animate={
        reduce
          ? false
          : {
              borderRadius: [
                "42% 58% 62% 38% / 44% 48% 52% 56%",
                "55% 45% 48% 52% / 58% 42% 55% 45%",
                "42% 58% 62% 38% / 44% 48% 52% 56%",
              ],
              scale: [1, 1.06, 1],
            }
      }
      transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
    />
  );
}

/** Slow drifting gradient orb (hero / section accents). */
export function AnimatedGradientOrb({ className }: { className?: string }) {
  const reduce = usePrefersReducedMotion();
  return (
    <motion.div
      className={cn(
        "pointer-events-none absolute rounded-full bg-[conic-gradient(from_180deg,var(--afro-gold),var(--cyan),var(--afro-sapphire),var(--afro-terracotta),var(--afro-gold))] opacity-[0.14] blur-3xl",
        className
      )}
      animate={
        reduce
          ? false
          : {
              rotate: [0, 360],
              scale: [1, 1.08, 1],
              opacity: [0.12, 0.2, 0.12],
            }
      }
      transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      aria-hidden
    />
  );
}

type BurstParticle = { id: number; angle: number; dist: number; hue: string };

/** One-shot radial particle burst (mount). */
export function ParticleBurst({
  className,
  particleCount = 18,
}: {
  className?: string;
  particleCount?: number;
}) {
  const reduce = usePrefersReducedMotion();
  const [particles] = useState<BurstParticle[]>(() =>
    Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      angle: (Math.PI * 2 * i) / particleCount + Math.random() * 0.4,
      dist: 48 + Math.random() * 56,
      hue: ["#ffd700", "#00d9ff", "#34d399", "#c2704e", "#6b8cff"][
        i % 5
      ] as string,
    }))
  );

  if (reduce) return null;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-visible",
        className
      )}
      aria-hidden
    >
      <div className="absolute top-1/2 left-1/2 h-0 w-0">
        {particles.map(p => (
          <motion.span
            key={p.id}
            className="absolute top-1/2 left-1/2 h-1.5 w-1.5 rounded-full"
            style={{
              marginLeft: -3,
              marginTop: -3,
              backgroundColor: p.hue,
            }}
            initial={{ x: 0, y: 0, opacity: 0.95, scale: 1 }}
            animate={{
              x: Math.cos(p.angle) * p.dist,
              y: Math.sin(p.angle) * p.dist,
              opacity: 0,
              scale: 0.2,
            }}
            transition={{ duration: 0.85, ease: "easeOut" }}
          />
        ))}
      </div>
    </div>
  );
}

/** SVG wave accent (hero base). */
export function LiquidSwipeWave({ className }: { className?: string }) {
  const reduce = usePrefersReducedMotion();
  return (
    <div
      className={cn(
        "pointer-events-none absolute right-0 bottom-0 left-0 overflow-hidden rounded-b-[inherit]",
        className
      )}
      aria-hidden
    >
      <motion.div
        className="w-[140%] -translate-x-[14%] text-primary/25"
        animate={reduce ? false : { x: [0, -18, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.svg
          className="h-14 w-full md:h-16"
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
        >
          <motion.path
            fill="currentColor"
            d="M0,40 Q300,0 600,40 T1200,40 L1200,80 L0,80 Z"
            animate={
              reduce
                ? false
                : {
                    d: [
                      "M0,40 Q300,0 600,40 T1200,40 L1200,80 L0,80 Z",
                      "M0,48 Q320,72 600,32 T1200,48 L1200,80 L0,80 Z",
                      "M0,40 Q300,0 600,40 T1200,40 L1200,80 L0,80 Z",
                    ],
                  }
            }
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.svg>
      </motion.div>
    </div>
  );
}

/** Short chromatic jitter on children. */
export function GlitchFlash({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = usePrefersReducedMotion();
  return (
    <motion.span
      className={cn("relative inline-block", className)}
      animate={
        reduce
          ? false
          : {
              x: [0, -1, 1, 0],
              textShadow: [
                "0 0 0 transparent",
                "1px 0 0 color-mix(in oklch, var(--cyan) 55%, transparent)",
                "-1px 0 0 color-mix(in oklch, var(--afro-gold) 55%, transparent)",
                "0 0 0 transparent",
              ],
            }
      }
      transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.span>
  );
}

export function HoverLift({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = usePrefersReducedMotion();
  return (
    <motion.div
      className={className}
      whileHover={reduce ? undefined : { y: -5, scale: 1.01 }}
      whileTap={reduce ? undefined : { scale: 0.99 }}
      transition={{ type: "spring", stiffness: 420, damping: 22 }}
    >
      {children}
    </motion.div>
  );
}

type Ripple = { x: number; y: number; id: number };

/** shadcn Button + material-style ripple. */
export function RippleButton({
  className,
  children,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const reduce = usePrefersReducedMotion();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!reduce && e.currentTarget) {
        const r = e.currentTarget.getBoundingClientRect();
        setRipples(x => [
          ...x,
          { x: e.clientX - r.left, y: e.clientY - r.top, id: Date.now() },
        ]);
      }
      onClick?.(e);
    },
    [onClick, reduce]
  );

  useEffect(() => {
    if (ripples.length === 0) return;
    const t = window.setTimeout(() => setRipples([]), 650);
    return () => clearTimeout(t);
  }, [ripples]);

  return (
    <Button
      {...props}
      className={cn("relative overflow-hidden", className)}
      onClick={handleClick}
    >
      {children}
      {!reduce &&
        ripples.map(r => (
          <motion.span
            key={r.id}
            className="pointer-events-none absolute rounded-full bg-white/35"
            style={{
              left: r.x,
              top: r.y,
              width: 8,
              height: 8,
              marginLeft: -4,
              marginTop: -4,
            }}
            initial={{ scale: 0, opacity: 0.55 }}
            animate={{ scale: 24, opacity: 0 }}
            transition={{ duration: 0.62, ease: "easeOut" }}
          />
        ))}
    </Button>
  );
}

/** Word-by-word reveal. */
export function TextReveal({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const reduce = usePrefersReducedMotion();
  const words = text.split(/\s+/);
  return (
    <span className={className}>
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          className="mr-[0.28em] inline-block last:mr-0"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={defaultViewport}
          transition={{
            delay: reduce ? 0 : i * 0.035,
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {w}
        </motion.span>
      ))}
    </span>
  );
}

/** Indeterminate loading bars (decorative “systems check”). */
export function LoadingPulse({ className }: { className?: string }) {
  const reduce = usePrefersReducedMotion();
  return (
    <div className={cn("flex gap-1.5", className)} aria-hidden>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="h-6 w-1 rounded-full bg-primary/45"
          animate={
            reduce
              ? false
              : {
                  opacity: [0.25, 1, 0.25],
                  scaleY: [0.65, 1, 0.65],
                }
          }
          transition={{
            duration: 0.9,
            repeat: Infinity,
            delay: i * 0.18,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/** Success / “systems nominal” badge with animated check. */
export function SuccessCheckmark({
  className,
  label = "NOMINAL",
}: {
  className?: string;
  label?: string;
}) {
  const reduce = usePrefersReducedMotion();
  const uid = useId();
  return (
    <motion.div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-primary/35 bg-background/40 px-3 py-1 font-mono text-[9px] tracking-[0.2em] text-primary/90 backdrop-blur-sm",
        className
      )}
      initial={reduce ? false : { opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={defaultViewport}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.span
        className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400"
        initial={reduce ? false : { rotate: -40, scale: 0.5 }}
        whileInView={{ rotate: 0, scale: 1 }}
        viewport={defaultViewport}
        transition={{ type: "spring", stiffness: 320, damping: 18 }}
        aria-hidden
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </motion.span>
      <span id={uid}>{label}</span>
    </motion.div>
  );
}

/** Ambient bubbles (section depth). */
export function FloatingBubbles({ className }: { className?: string }) {
  const reduce = usePrefersReducedMotion();
  const bubbles = [0, 1, 2, 3, 4, 5];
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      aria-hidden
    >
      {bubbles.map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-cyan-400/15 bg-primary/5"
          style={{
            width: 12 + (i % 3) * 10,
            height: 12 + (i % 3) * 10,
            left: `${12 + i * 15}%`,
            bottom: "-8%",
          }}
          animate={
            reduce
              ? false
              : {
                  y: [0, -320, -640],
                  x: [0, i % 2 === 0 ? 24 : -18, 0],
                  opacity: [0, 0.5, 0],
                }
          }
          transition={{
            duration: 14 + i * 2,
            repeat: Infinity,
            delay: i * 2.2,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
