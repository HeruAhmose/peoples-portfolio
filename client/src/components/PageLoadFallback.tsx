/** Shown while lazy route chunks load. */
export default function PageLoadFallback() {
  return (
    <div
      className="flex min-h-[min(70vh,560px)] flex-col items-center justify-center gap-5 p-8"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="relative">
        <div
          className="absolute inset-0 animate-pulse rounded-full bg-primary/15 blur-md"
          aria-hidden
        />
        <div
          className="portfolio-route-spinner relative h-11 w-11 rounded-full border-2 border-cyan-500/35 border-t-primary animate-spin shadow-[0_0_24px_-6px_oklch(0.65_0.25_45/0.45)]"
          aria-hidden
        />
      </div>
      <p className="font-mono text-[10px] tracking-[0.4em] text-cyan-400/75">
        LOADING SECTOR…
      </p>
    </div>
  );
}
