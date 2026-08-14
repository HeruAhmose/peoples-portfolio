import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  FOUNDER_MEDIA_CHAPTERS,
  founderMediaForChapter,
  type FounderMediaAsset,
  type FounderMediaChapter,
} from "@/data/founderMedia";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function chapterAccent(chapter: FounderMediaChapter) {
  switch (chapter) {
    case "origins":
      return "from-amber-300/45 via-white/10 to-transparent";
    case "football":
      return "from-emerald-300/45 via-cyan-300/12 to-transparent";
    case "track":
      return "from-cyan-300/45 via-white/10 to-transparent";
    case "navy":
      return "from-blue-300/45 via-amber-200/10 to-transparent";
    case "present":
      return "from-amber-200/38 via-emerald-300/14 to-cyan-300/18";
    default:
      return "from-cyan-300/35 via-white/10 to-transparent";
  }
}

function MediaCard({
  asset,
  index,
  onOpen,
}: {
  asset: FounderMediaAsset;
  index: number;
  onOpen: (asset: FounderMediaAsset, trigger: HTMLButtonElement) => void;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const landscape = asset.width / asset.height > 1.15;
  const featured = index === 0 && landscape;

  return (
    <motion.button
      type="button"
      onClick={event => onOpen(asset, event.currentTarget)}
      aria-label={`Open image: ${asset.title}`}
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-black/35 text-left shadow-[0_24px_90px_-50px_rgba(34,211,238,.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 ${
        featured
          ? "min-h-[420px] md:col-span-2"
          : asset.kind === "archive"
            ? "min-h-[390px]"
            : "min-h-[340px]"
      }`}
      initial={reduceMotion ? false : { opacity: 0, y: 22, rotateX: 3 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{
        duration: reduceMotion ? 0.15 : 0.62,
        delay: Math.min(index * 0.055, 0.28),
      }}
      whileHover={
        reduceMotion
          ? {}
          : {
              y: -7,
              rotateX: -1.4,
              rotateY: index % 2 === 0 ? 1.2 : -1.2,
              scale: 1.01,
            }
      }
    >
      <img
        src={asset.src}
        alt=""
        width={asset.width}
        height={asset.height}
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 h-full w-full transition duration-700 group-hover:scale-[1.025] ${
          asset.kind === "archive"
            ? "bg-[#080b11] object-contain p-2"
            : "object-cover"
        }`}
        style={{ objectPosition: asset.focal }}
      />

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent"
        aria-hidden
      />
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${chapterAccent(
          asset.chapter
        )}`}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-8 top-6 h-px origin-left bg-gradient-to-r from-amber-200/0 via-amber-200/30 to-transparent transition-transform duration-700 group-hover:scale-x-110"
        aria-hidden
      />

      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[8px] tracking-[0.25em] text-cyan-100/72">
              {asset.eyebrow}
            </p>
            <h3 className="mt-2 font-display text-xl font-semibold text-white">
              {asset.title}
            </h3>
          </div>
          <span
            className="rounded-full border border-white/15 bg-black/35 p-2 text-white/72 backdrop-blur-md"
            aria-hidden
          >
            <Expand className="h-4 w-4" />
          </span>
        </div>

        <p className="mt-3 max-w-2xl text-xs leading-relaxed text-white/72 md:text-sm">
          {asset.caption}
        </p>
      </div>
    </motion.button>
  );
}

function MediaLightbox({
  asset,
  onClose,
  onPrevious,
  onNext,
}: {
  asset: FounderMediaAsset;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const titleId = `founder-media-title-${asset.id}`;
  const descriptionId = `founder-media-description-${asset.id}`;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onPrevious();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        onNext();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ??
          []
      ).filter(element => !element.hasAttribute("disabled"));

      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, onNext, onPrevious]);

  return (
    <motion.div
      className="fixed inset-0 z-[2147482600] grid place-items-center bg-[#010308]/92 p-3 backdrop-blur-xl md:p-8"
      role="presentation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0.12 : 0.28 }}
      onMouseDown={event => {
        if (event.currentTarget === event.target) {
          onClose();
        }
      }}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="relative grid max-h-[94vh] w-full max-w-6xl overflow-hidden rounded-3xl border border-cyan-300/15 bg-[#030711] shadow-[0_0_110px_-35px_rgba(34,211,238,.55)] lg:grid-cols-[1.4fr_.6fr]"
        initial={
          reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.965, y: 18 }
        }
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={
          reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.975, y: 10 }
        }
        transition={{ duration: reduceMotion ? 0.12 : 0.34 }}
      >
        <div className="relative min-h-[50vh] overflow-hidden bg-black">
          <img
            src={asset.src}
            alt={asset.alt}
            width={asset.width}
            height={asset.height}
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_45%,rgba(0,0,0,.45)_100%)]"
            aria-hidden
          />
        </div>

        <div className="relative flex max-h-[94vh] flex-col justify-between overflow-y-auto p-6 md:p-8">
          <div>
            <p className="font-mono text-[9px] tracking-[0.28em] text-cyan-300/72">
              {asset.eyebrow} /// {asset.series.toUpperCase()}
            </p>
            <h3
              id={titleId}
              className="mt-3 font-display text-2xl font-bold text-white"
            >
              {asset.title}
            </h3>

            <div id={descriptionId} className="mt-6 space-y-5">
              <div>
                <p className="font-mono text-[8px] tracking-[0.22em] text-white/38">
                  DOCUMENTARY CONTEXT
                </p>
                <p className="mt-2 text-sm leading-7 text-white/72">
                  {asset.caption}
                </p>
              </div>

              <div className="border-l border-amber-200/25 pl-4">
                <p className="font-mono text-[8px] tracking-[0.22em] text-amber-200/58">
                  THROUGHLINE
                </p>
                <p className="mt-2 text-sm leading-7 text-white/66">
                  {asset.throughline}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onPrevious}
              className="rounded-full border border-white/12 p-3 text-white/75 transition hover:border-cyan-200/45 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
              aria-label="Previous image"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <p className="font-mono text-[8px] tracking-[0.18em] text-white/35">
              PREVIOUS /// NEXT
            </p>
            <button
              type="button"
              onClick={onNext}
              className="rounded-full border border-white/12 p-3 text-white/75 transition hover:border-cyan-200/45 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
              aria-label="Next image"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/55 p-2 text-white/78 backdrop-blur-md transition hover:border-white/35 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
            aria-label="Close image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FounderMediaJourney() {
  const reduceMotion = usePrefersReducedMotion();
  const [chapter, setChapter] = useState<FounderMediaChapter>("origins");
  const [openAsset, setOpenAsset] = useState<FounderMediaAsset | null>(null);
  const returnFocusRef = useRef<HTMLButtonElement | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const chapterMeta =
    FOUNDER_MEDIA_CHAPTERS.find(item => item.id === chapter) ??
    FOUNDER_MEDIA_CHAPTERS[0];

  const assets = useMemo(() => founderMediaForChapter(chapter), [chapter]);

  const openIndex = openAsset
    ? assets.findIndex(asset => asset.id === openAsset.id)
    : -1;

  const closeLightbox = () => {
    setOpenAsset(null);
    window.setTimeout(() => returnFocusRef.current?.focus(), 0);
  };

  const navigateLightbox = (offset: number) => {
    if (assets.length === 0) {
      return;
    }

    const current = openIndex >= 0 ? openIndex : 0;
    const next = (current + offset + assets.length) % assets.length;
    setOpenAsset(assets[next]);
  };

  const activateTab = (index: number) => {
    const target = FOUNDER_MEDIA_CHAPTERS[index];

    if (!target) {
      return;
    }

    setChapter(target.id as FounderMediaChapter);
    window.requestAnimationFrame(() => {
      tabRefs.current[index]?.focus();
    });
  };

  const handleChapterKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % FOUNDER_MEDIA_CHAPTERS.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex =
        (index - 1 + FOUNDER_MEDIA_CHAPTERS.length) %
        FOUNDER_MEDIA_CHAPTERS.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = FOUNDER_MEDIA_CHAPTERS.length - 1;
    }

    if (nextIndex === null) {
      return;
    }

    event.preventDefault();
    activateTab(nextIndex);
  };

  return (
    <section
      className="container mx-auto px-4 py-16 md:py-24"
      data-founder-media-journey="v5.5.4"
    >
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-cyan-300/12 bg-[#030711]/82 p-4 shadow-[0_40px_120px_-70px_rgba(34,211,238,.8)] backdrop-blur-xl md:p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(103,232,249,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(251,191,36,.045) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(circle at 50% 36%,black 0%,transparent 76%)",
          }}
          aria-hidden
        />

        <motion.div
          className="pointer-events-none absolute left-[8%] right-[8%] top-6 h-px origin-left bg-gradient-to-r from-amber-200/10 via-amber-200/55 to-cyan-200/10"
          initial={reduceMotion ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reduceMotion ? 0.1 : 1.4, ease: "easeOut" }}
          aria-hidden
        />

        <div className="relative z-10">
          <p className="font-mono text-[9px] tracking-[0.34em] text-cyan-300/72 md:text-[10px]">
            LIVING ARCHIVE /// FOUNDER JOURNEY
          </p>

          <div className="mt-3 grid gap-5 lg:grid-cols-[1fr_.48fr] lg:items-end">
            <div>
              <h2 className="font-display text-3xl font-black tracking-tight text-white md:text-5xl">
                A life behind the systems
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/68 md:text-base">
                Before the systems came a sequence of environments that trained
                different forms of attention: Salisbury and Kannapolis roots;
                football and track under pressure; Navy service; deliberate
                technology and cybersecurity training; family, partnership, and
                the work of building now.
              </p>
            </div>

            <div className="lg:text-right">
              <p className="font-mono text-[8px] tracking-[0.22em] text-amber-200/55">
                DOCUMENTARY PRINCIPLE
              </p>
              <p className="mt-2 text-xs leading-6 text-white/45">
                Context first. Interpretation second. The images remain the
                evidence.
              </p>
            </div>
          </div>

          <div className="relative mt-8">
            <div
              className="pointer-events-none absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-amber-200/16 to-transparent"
              aria-hidden
            />
            <div
              className="relative flex gap-2 overflow-x-auto pb-2"
              role="tablist"
              aria-label="Founder journey chapters"
            >
              {FOUNDER_MEDIA_CHAPTERS.map((item, index) => {
                const selected = item.id === chapter;
                const tabId = `founder-tab-${item.id}`;
                const panelId = `founder-panel-${item.id}`;

                return (
                  <button
                    key={item.id}
                    ref={element => {
                      tabRefs.current[index] = element;
                    }}
                    id={tabId}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={panelId}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setChapter(item.id as FounderMediaChapter)}
                    onKeyDown={event => handleChapterKeyDown(event, index)}
                    className={`shrink-0 rounded-full border px-4 py-2 font-mono text-[8px] tracking-[0.17em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 md:text-[9px] ${
                      selected
                        ? "border-cyan-200/50 bg-[#07111a] text-cyan-100 shadow-[0_0_24px_-10px_rgba(34,211,238,.8)]"
                        : "border-white/10 bg-[#030711] text-white/48 hover:border-white/20 hover:text-white/75"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")} ///{" "}
                    {item.label.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={chapter}
              id={`founder-panel-${chapter}`}
              role="tabpanel"
              aria-labelledby={`founder-tab-${chapter}`}
              initial={
                reduceMotion
                  ? { opacity: 1 }
                  : {
                      opacity: 0,
                      clipPath: "inset(0 12% 0 12% round 28px)",
                      filter: "blur(7px)",
                    }
              }
              animate={{
                opacity: 1,
                clipPath: "inset(0 0% 0 0% round 28px)",
                filter: "blur(0px)",
              }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      clipPath: "inset(0 9% 0 9% round 28px)",
                      filter: "blur(5px)",
                    }
              }
              transition={{ duration: reduceMotion ? 0.12 : 0.5 }}
              className="mt-7"
            >
              <div className="mb-5 overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                <p className="font-mono text-[8px] tracking-[0.22em] text-amber-200/68">
                  {chapterMeta.signal}
                </p>
                <p className="mt-2 max-w-4xl text-sm leading-relaxed text-white/66">
                  {chapterMeta.description}
                </p>
              </div>

              <div
                className={`grid gap-4 ${
                  assets.length >= 4
                    ? "md:grid-cols-2 xl:grid-cols-3"
                    : "md:grid-cols-2"
                }`}
              >
                {assets.map((asset, index) => (
                  <MediaCard
                    key={asset.id}
                    asset={asset}
                    index={index}
                    onOpen={(selected, trigger) => {
                      returnFocusRef.current = trigger;
                      setOpenAsset(selected);
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {openAsset ? (
          <MediaLightbox
            asset={openAsset}
            onClose={closeLightbox}
            onPrevious={() => navigateLightbox(-1)}
            onNext={() => navigateLightbox(1)}
          />
        ) : null}
      </AnimatePresence>
    </section>
  );
}
