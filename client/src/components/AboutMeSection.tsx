import { useState } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  MapPin,
  Shield,
  Sparkles,
  Waypoints,
} from "lucide-react";
import {
  aboutContact,
  aboutHeadline,
  aboutSkillBullets,
  aboutSummary,
  currentWorlds,
  founderOriginFacts,
  founderThesis,
} from "@shared/aboutMe";

const FOUNDER_PORTRAIT_PATH =
  `${import.meta.env.BASE_URL}media/founder/hero/founder-present-portrait.webp`;

export default function AboutMeSection() {
  const [portraitAvailable, setPortraitAvailable] = useState(true);
  const [activeOrigin, setActiveOrigin] = useState(0);
  const active = founderOriginFacts[activeOrigin];

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="cyber-panel relative mx-auto max-w-6xl overflow-hidden px-5 py-8 md:px-9 md:py-12"
        data-peoples-founder-world="v5.5.1"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(103,232,249,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(251,191,36,.055) 1px,transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage:
              "radial-gradient(circle at 40% 42%, black 0%, transparent 72%)",
          }}
          aria-hidden
        />

        <motion.div
          className="pointer-events-none absolute -right-28 -top-32 h-80 w-80 rounded-full border border-cyan-300/15"
          animate={{ rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          aria-hidden
        />
        <motion.div
          className="pointer-events-none absolute -right-12 -top-10 h-52 w-72 rounded-[50%] border border-amber-300/12"
          animate={{ rotate: -360 }}
          transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
          aria-hidden
        />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] tracking-[0.32em] text-cyan-300/80 md:text-xs">
                HUMAN NODE /// FOUNDER WORLD
              </p>
              <h2 className="font-display mt-3 text-3xl font-black tracking-tight text-foreground md:text-5xl">
                JONATHAN PEOPLES
              </h2>
              <p className="mt-2 font-mono text-[10px] tracking-[0.18em] text-primary md:text-xs">
                {aboutHeadline}
              </p>
            </div>

            <a
              href={aboutContact.linkedinHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/[0.05] px-4 py-2 font-mono text-[9px] tracking-[0.16em] text-cyan-100 transition hover:-translate-y-0.5 hover:border-cyan-200/55 hover:bg-cyan-300/[0.09]"
            >
              LINKEDIN
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="mt-8 grid gap-7 lg:grid-cols-[300px_1fr]">
            <motion.div
              className="group relative min-h-[390px] overflow-hidden rounded-3xl border border-cyan-300/25 bg-black/40 shadow-[0_0_80px_-26px_rgba(34,211,238,0.75)] [transform-style:preserve-3d]"
              whileHover={{ rotateY: 4, rotateX: -2, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 150, damping: 18 }}
            >
              {portraitAvailable ? (
                <img
                  src={FOUNDER_PORTRAIT_PATH}
                  alt="Portrait of Jonathan Peoples"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  onError={() => setPortraitAvailable(false)}
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_center,rgba(34,211,238,.15),rgba(2,5,11,.96)_68%)]">
                  <motion.div
                    className="absolute h-52 w-52 rounded-full border border-cyan-300/25"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <motion.div
                    className="absolute h-36 w-60 rounded-[50%] border border-amber-300/20"
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 27,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <div className="relative text-center">
                    <p className="font-display text-6xl font-black tracking-[0.2em] text-cyan-100">
                      JP
                    </p>
                    <p className="mt-3 font-mono text-[8px] tracking-[0.28em] text-cyan-300/60">
                      FOUNDER PORTRAIT NODE
                    </p>
                  </div>
                </div>
              )}

              <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_18%,rgba(34,211,238,.14)_47%,rgba(251,191,36,.09)_53%,transparent_77%)] mix-blend-screen"
                aria-hidden
              />
              <div className="absolute inset-x-5 bottom-5 rounded-xl border border-white/10 bg-black/55 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-2 font-mono text-[8px] tracking-[0.18em] text-cyan-200/70">
                  <MapPin className="h-3.5 w-3.5" />
                  NORTH CAROLINA
                </div>
                <p className="mt-2 text-xs leading-relaxed text-white/65">
                  Born in Salisbury. Raised in Kannapolis. Built through
                  football, service, invention, and systems work.
                </p>
              </div>
            </motion.div>

            <div>
              <p className="max-w-3xl text-sm leading-7 text-foreground/82 md:text-base">
                {aboutSummary}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {founderOriginFacts.map((fact, index) => {
                  const selected = index === activeOrigin;

                  return (
                    <motion.button
                      key={fact.label}
                      type="button"
                      onClick={() => setActiveOrigin(index)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        selected
                          ? "border-cyan-300/45 bg-cyan-300/[0.075] shadow-[0_0_34px_-18px_rgba(34,211,238,.75)]"
                          : "border-white/8 bg-white/[0.025] hover:border-white/18 hover:bg-white/[0.045]"
                      }`}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.985 }}
                      aria-pressed={selected}
                    >
                      <p className="font-mono text-[8px] tracking-[0.23em] text-cyan-300/65">
                        {fact.label}
                      </p>
                      <p className="mt-2 font-display text-sm font-semibold text-foreground">
                        {fact.value}
                      </p>
                    </motion.button>
                  );
                })}
              </div>

              <motion.div
                key={active.label}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.35 }}
                className="mt-4 rounded-2xl border border-amber-300/18 bg-amber-300/[0.035] p-5"
                aria-live="polite"
              >
                <div className="flex items-center gap-2 font-mono text-[8px] tracking-[0.22em] text-amber-200/70">
                  <Waypoints className="h-3.5 w-3.5" />
                  ACTIVE LINEAGE NODE
                </div>
                <p className="mt-3 text-sm leading-relaxed text-foreground/78">
                  {active.detail}
                </p>
              </motion.div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-3xl border border-white/8 bg-black/20 p-5 md:p-6">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-cyan-300/75" />
                <h3 className="font-display text-sm font-semibold tracking-wide text-foreground">
                  Operating thesis
                </h3>
              </div>
              <ul className="mt-4 space-y-3">
                {founderThesis.map((line, index) => (
                  <motion.li
                    key={line}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.07 }}
                    className="border-l border-cyan-300/25 pl-3 text-sm leading-relaxed text-foreground/72"
                  >
                    {line}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-white/8 bg-black/20 p-5 md:p-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-200/75" />
                <h3 className="font-display text-sm font-semibold tracking-wide text-foreground">
                  Current systems
                </h3>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {currentWorlds.map(world => (
                  <motion.a
                    key={world.id}
                    href={world.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.025] p-4 transition hover:border-cyan-300/25"
                    whileHover={{ y: -4, rotateX: 1.5, rotateY: -1.5 }}
                  >
                    <div
                      className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full border border-cyan-300/10 transition-transform duration-700 group-hover:scale-125"
                      aria-hidden
                    />
                    <p className="font-mono text-[7px] tracking-[0.2em] text-cyan-300/55">
                      {world.eyebrow}
                    </p>
                    <p className="mt-2 font-display text-sm font-semibold text-foreground">
                      {world.title}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {world.description}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 font-mono text-[8px] tracking-[0.16em] text-primary">
                      ENTER SYSTEM <ExternalLink className="h-3 w-3" />
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {aboutSkillBullets.map(line => (
              <div
                key={line}
                className="rounded-xl border border-white/7 bg-white/[0.02] px-3 py-3 text-xs leading-relaxed text-muted-foreground"
              >
                {line}
              </div>
            ))}
          </div>

          <motion.div
            whileHover={{ y: -3, scale: 1.005 }}
            className="mt-8 overflow-hidden rounded-2xl border border-amber-300/22 bg-amber-300/[0.035] px-5 py-5"
          >
            <p className="font-mono text-[8px] tracking-[0.24em] text-amber-200/65">
              INSTITUTIONAL NODE
            </p>
            <div className="mt-2 flex flex-wrap items-baseline justify-between gap-3">
              <p className="font-display text-lg font-semibold text-foreground">
                The Peoples Foundation
              </p>
              <p className="font-mono text-xs tracking-[0.18em] text-amber-200">
                508(c)(1)(a)
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
