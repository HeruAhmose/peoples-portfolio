import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface SovereignAwakeningProps {
  onComplete: () => void;
}

interface ParticleSeed {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
}

interface LineageNode {
  label: string;
  x: number;
  y: number;
}

const LINEAGE_NODES: readonly LineageNode[] = [
  { label: "FOUNDER", x: 50, y: 8 },
  { label: "MATERIALS", x: 82, y: 27 },
  { label: "COMMUNITY", x: 84, y: 68 },
  { label: "RESEARCH", x: 50, y: 90 },
  { label: "SOVEREIGN SYSTEMS", x: 16, y: 68 },
  { label: "FUTURE", x: 18, y: 27 },
];

const STAGE_COPY = [
  "LINEAGE FIELD INITIALIZING",
  "HUMAN NODE AUTHENTICATED",
  "CONNECTED WORLDS SYNCHRONIZED",
  "PORTFOLIO READY",
] as const;

function createParticles(): ParticleSeed[] {
  return Array.from({ length: 42 }, (_, index) => {
    const a = Math.sin((index + 1) * 12.9898) * 43758.5453;
    const b = Math.sin((index + 1) * 78.233) * 12414.234;
    const c = Math.sin((index + 1) * 44.113) * 9517.913;

    return {
      id: index,
      left: (a - Math.floor(a)) * 100,
      top: (b - Math.floor(b)) * 100,
      size: 1 + (index % 3),
      delay: (c - Math.floor(c)) * 3,
      duration: 3.8 + (index % 7) * 0.45,
    };
  });
}

export default function SovereignAwakening({
  onComplete,
}: SovereignAwakeningProps) {
  const particles = useMemo(createParticles, []);
  const [stage, setStage] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isDeparting, setIsDeparting] = useState(false);

  const ready = stage >= 3;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(media.matches);

    updatePreference();
    media.addEventListener?.("change", updatePreference);

    return () => {
      media.removeEventListener?.("change", updatePreference);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setStage(3);
      return undefined;
    }

    const timers = [
      window.setTimeout(() => setStage(1), 1450),
      window.setTimeout(() => setStage(2), 3100),
      window.setTimeout(() => setStage(3), 4850),
    ];

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [reducedMotion]);

  const enterPortfolio = () => {
    if (!ready || isDeparting) {
      return;
    }

    if (reducedMotion) {
      onComplete();
      return;
    }

    setIsDeparting(true);
    window.setTimeout(onComplete, 900);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setStage(3);
        return;
      }

      if (event.key === "Enter" && ready) {
        enterPortfolio();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [ready, isDeparting, reducedMotion]);

  return (
    <AnimatePresence>
      <motion.section
        key="peoples-cinematic-awakening-v5.4.9"
        data-peoples-cinematic-intro="v5.4.9"
        className="fixed inset-0 z-[2147481000] overflow-hidden bg-[#02050b] text-white"
        initial={{ opacity: 1 }}
        animate={{
          opacity: isDeparting ? 0 : 1,
          scale: isDeparting ? 1.035 : 1,
          filter: isDeparting ? "blur(12px)" : "blur(0px)",
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: isDeparting ? 0.9 : 0.45, ease: "easeInOut" }}
        aria-label="Peoples Portfolio cinematic introduction"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(18,196,255,0.11),transparent_28%),radial-gradient(circle_at_50%_55%,rgba(245,176,65,0.10),transparent_42%),linear-gradient(180deg,#02050b_0%,#050814_50%,#020409_100%)]"
          aria-hidden
        />

        <motion.div
          className="pointer-events-none absolute inset-[-40%] opacity-60"
          style={{
            background:
              "conic-gradient(from 30deg at 50% 50%, transparent 0deg, rgba(34,211,238,0.08) 30deg, transparent 60deg, rgba(251,191,36,0.07) 120deg, transparent 160deg, rgba(34,211,238,0.06) 230deg, transparent 300deg)",
          }}
          animate={reducedMotion ? {} : { rotate: 360 }}
          transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
          aria-hidden
        />

        <div
          className="pointer-events-none absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "linear-gradient(rgba(103,232,249,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.05) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
            maskImage:
              "radial-gradient(circle at 50% 55%, black 0%, rgba(0,0,0,.92) 28%, transparent 76%)",
          }}
          aria-hidden
        />

        <motion.div
          className="pointer-events-none absolute left-1/2 top-[60%] h-[75vmax] w-[75vmax] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10"
          style={{
            rotateX: 72,
            transformStyle: "preserve-3d",
            boxShadow:
              "0 0 80px rgba(34,211,238,0.08), inset 0 0 100px rgba(251,191,36,0.04)",
          }}
          animate={reducedMotion ? {} : { rotateZ: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          aria-hidden
        />

        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {particles.map((particle) => (
            <motion.span
              key={particle.id}
              className="absolute rounded-full bg-cyan-200"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                width: particle.size,
                height: particle.size,
                boxShadow:
                  particle.id % 4 === 0
                    ? "0 0 16px rgba(251,191,36,0.8)"
                    : "0 0 12px rgba(34,211,238,0.8)",
              }}
              animate={
                reducedMotion
                  ? { opacity: 0.3 }
                  : {
                      y: [0, -22 - (particle.id % 5) * 9, 0],
                      opacity: [0.08, 0.9, 0.08],
                      scale: [0.6, 1.35, 0.6],
                    }
              }
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 grid min-h-screen place-items-center px-5 py-8">
          <div className="mx-auto grid w-full max-w-6xl gap-7 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
            <div className="order-2 lg:order-1">
              <motion.p
                className="font-mono text-[10px] tracking-[0.34em] text-cyan-200/70 sm:text-xs"
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                HUMAN LINEAGE /// FOUNDER WORLD /// NODE 01
              </motion.p>

              <motion.h1
                className="mt-4 max-w-3xl font-display text-4xl font-black uppercase leading-[0.94] tracking-[-0.035em] text-white sm:text-6xl lg:text-7xl"
                initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.05, delay: reducedMotion ? 0 : 0.25 }}
              >
                Jonathan
                <span className="block bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">
                  Peoples
                </span>
              </motion.h1>

              <motion.div
                className="mt-5 h-px max-w-xl bg-gradient-to-r from-cyan-300/80 via-white/35 to-amber-300/80"
                initial={{ scaleX: 0, transformOrigin: "left" }}
                animate={{ scaleX: stage >= 1 ? 1 : 0.15 }}
                transition={{ duration: 1.1, ease: "easeOut" }}
                aria-hidden
              />

              <motion.p
                className="mt-5 max-w-2xl text-sm leading-relaxed text-white/68 sm:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: stage >= 1 ? 1 : 0.35 }}
              >
                Materials innovation, sovereign technology, community
                infrastructure, research, and connected digital worlds
                converging through one human portfolio.
              </motion.p>

              <div className="mt-7 grid max-w-xl grid-cols-2 gap-2 sm:grid-cols-4">
                {STAGE_COPY.map((label, index) => {
                  const active = stage >= index;

                  return (
                    <motion.div
                      key={label}
                      className={`rounded-lg border px-3 py-3 font-mono text-[8px] leading-relaxed tracking-[0.15em] sm:text-[9px] ${
                        active
                          ? "border-cyan-300/30 bg-cyan-300/[0.06] text-cyan-100"
                          : "border-white/8 bg-white/[0.02] text-white/30"
                      }`}
                      animate={{
                        y: active ? 0 : 5,
                        opacity: active ? 1 : 0.45,
                      }}
                    >
                      <span
                        className={`mr-2 inline-block h-1.5 w-1.5 rounded-full ${
                          active
                            ? "bg-cyan-200 shadow-[0_0_10px_rgba(103,232,249,0.95)]"
                            : "bg-white/20"
                        }`}
                      />
                      {label}
                    </motion.div>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                {ready ? (
                  <motion.div
                    key="ready"
                    className="mt-8 flex flex-wrap items-center gap-3"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65 }}
                  >
                    <motion.button
                      type="button"
                      onClick={enterPortfolio}
                      disabled={isDeparting}
                      className="group relative overflow-hidden rounded-full border border-cyan-200/55 bg-cyan-200 px-7 py-3 font-mono text-[10px] font-bold tracking-[0.22em] text-[#031018] shadow-[0_0_42px_rgba(34,211,238,0.24)] transition hover:border-white hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[#02050b] disabled:cursor-wait"
                      whileHover={reducedMotion ? {} : { scale: 1.035 }}
                      whileTap={reducedMotion ? {} : { scale: 0.97 }}
                    >
                      <span className="relative z-10">
                        ENTER PEOPLES PORTFOLIO
                      </span>
                      <motion.span
                        className="absolute inset-y-0 -left-1/3 w-1/3 bg-white/55 blur-md"
                        animate={reducedMotion ? {} : { x: ["0%", "420%"] }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          repeatDelay: 1.4,
                          ease: "easeInOut",
                        }}
                        aria-hidden
                      />
                    </motion.button>

                    <span className="font-mono text-[9px] tracking-[0.18em] text-white/36">
                      ENTER ↵
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="building"
                    className="mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="h-px max-w-md overflow-hidden bg-white/10">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-300 via-white to-amber-300"
                        animate={{ width: `${25 + stage * 25}%` }}
                        transition={{ duration: 0.75, ease: "easeOut" }}
                      />
                    </div>
                    <p className="mt-3 font-mono text-[9px] tracking-[0.22em] text-white/40">
                      {STAGE_COPY[Math.min(stage, STAGE_COPY.length - 1)]}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="order-1 flex justify-center lg:order-2">
              <div
                className="relative aspect-square w-[min(78vw,470px)]"
                style={{ perspective: 1100 }}
              >
                <motion.div
                  className="absolute inset-[8%] rounded-full border border-cyan-200/30"
                  style={{ transformStyle: "preserve-3d", rotateX: 68 }}
                  animate={
                    reducedMotion
                      ? {}
                      : {
                          rotateZ: 360,
                          boxShadow: [
                            "0 0 30px rgba(34,211,238,0.08)",
                            "0 0 70px rgba(34,211,238,0.22)",
                            "0 0 30px rgba(34,211,238,0.08)",
                          ],
                        }
                  }
                  transition={{
                    rotateZ: {
                      duration: 18,
                      repeat: Infinity,
                      ease: "linear",
                    },
                    boxShadow: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                  aria-hidden
                />

                <motion.div
                  className="absolute inset-[18%] rounded-full border border-amber-200/25"
                  style={{ transformStyle: "preserve-3d", rotateY: 72 }}
                  animate={reducedMotion ? {} : { rotateZ: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  aria-hidden
                />

                <motion.div
                  className="absolute inset-[27%] rounded-full border border-white/16"
                  animate={
                    reducedMotion
                      ? {}
                      : {
                          rotate: 360,
                          scale: [0.96, 1.04, 0.96],
                        }
                  }
                  transition={{
                    rotate: {
                      duration: 11,
                      repeat: Infinity,
                      ease: "linear",
                    },
                    scale: {
                      duration: 3.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                  aria-hidden
                />

                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  viewBox="0 0 100 100"
                  aria-hidden
                >
                  <defs>
                    <linearGradient
                      id="peoples-lineage-gradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="rgba(103,232,249,.7)" />
                      <stop offset="50%" stopColor="rgba(255,255,255,.28)" />
                      <stop offset="100%" stopColor="rgba(251,191,36,.65)" />
                    </linearGradient>
                  </defs>

                  {LINEAGE_NODES.map((node) => (
                    <motion.line
                      key={`line-${node.label}`}
                      x1="50"
                      y1="50"
                      x2={node.x}
                      y2={node.y}
                      stroke="url(#peoples-lineage-gradient)"
                      strokeWidth="0.22"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{
                        pathLength: stage >= 2 ? 1 : 0.18,
                        opacity: stage >= 2 ? 0.65 : 0.15,
                      }}
                      transition={{
                        duration: reducedMotion ? 0 : 1.3,
                        delay: reducedMotion ? 0 : 0.1,
                      }}
                    />
                  ))}
                </svg>

                {LINEAGE_NODES.map((node, index) => (
                  <motion.div
                    key={node.label}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{
                      opacity: stage >= 2 ? 1 : 0.35,
                      scale: stage >= 2 ? 1 : 0.72,
                    }}
                    transition={{
                      delay: reducedMotion ? 0 : 0.05 * index,
                      duration: 0.55,
                    }}
                  >
                    <motion.div
                      className="h-3 w-3 rounded-full border border-cyan-100/70 bg-[#04131c] shadow-[0_0_16px_rgba(34,211,238,0.75)]"
                      animate={
                        reducedMotion
                          ? {}
                          : {
                              scale: [1, 1.5, 1],
                              boxShadow: [
                                "0 0 10px rgba(34,211,238,.45)",
                                "0 0 24px rgba(251,191,36,.65)",
                                "0 0 10px rgba(34,211,238,.45)",
                              ],
                            }
                      }
                      transition={{
                        duration: 3 + index * 0.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <span className="absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap font-mono text-[7px] tracking-[0.16em] text-cyan-100/55 sm:text-[8px]">
                      {node.label}
                    </span>
                  </motion.div>
                ))}

                <motion.div
                  className="absolute left-1/2 top-1/2 grid h-[31%] w-[31%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-[#030a12]/80 shadow-[0_0_80px_rgba(34,211,238,0.18),inset_0_0_45px_rgba(251,191,36,0.06)] backdrop-blur-md"
                  animate={
                    reducedMotion
                      ? {}
                      : {
                          scale: [0.98, 1.025, 0.98],
                          rotate: [0, 2, 0, -2, 0],
                        }
                  }
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="text-center">
                    <motion.div
                      className="mx-auto h-3 w-3 rounded-full bg-white shadow-[0_0_16px_white,0_0_36px_rgba(34,211,238,0.85),0_0_56px_rgba(251,191,36,0.5)]"
                      animate={
                        reducedMotion
                          ? {}
                          : { scale: [1, 1.7, 1], opacity: [0.8, 1, 0.8] }
                      }
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <p className="mt-4 font-display text-lg font-black tracking-[0.18em] text-white sm:text-2xl">
                      JP
                    </p>
                    <p className="mt-1 font-mono text-[7px] tracking-[0.2em] text-cyan-100/55">
                      HUMAN NODE
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="pointer-events-none absolute inset-[3%] rounded-full border border-dashed border-cyan-100/10"
                  animate={reducedMotion ? {} : { rotate: -360 }}
                  transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
                  aria-hidden
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setStage(3)}
          className="absolute right-4 top-4 z-20 rounded-full border border-white/12 bg-black/35 px-4 py-2 font-mono text-[8px] tracking-[0.18em] text-white/45 backdrop-blur-md transition hover:border-cyan-200/35 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
        >
          SKIP TO ENTRY
        </button>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent"
          aria-hidden
        />

        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/80 to-transparent"
          animate={
            reducedMotion
              ? {}
              : {
                  y: ["8vh", "92vh", "8vh"],
                  opacity: [0.1, 0.5, 0.1],
                }
          }
          transition={{
            duration: 7.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          aria-hidden
        />
      </motion.section>
    </AnimatePresence>
  );
}
