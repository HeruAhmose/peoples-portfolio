/** Shown while lazy route chunks load. */
export default function PageLoadFallback() {
  return (
    <div
      className="flex min-h-[min(70vh,560px)] flex-col items-center justify-center gap-4 p-8"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div
        className="portfolio-route-spinner h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin"
        aria-hidden
      />
      <p className="font-mono text-xs tracking-widest text-muted-foreground">
        LOADING SECTOR…
      </p>
    </div>
  );
}
