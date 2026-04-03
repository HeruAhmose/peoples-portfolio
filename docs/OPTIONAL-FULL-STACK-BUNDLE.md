# Optional full-stack bundle (zip archives)

You may have local copies of:

- `peoples-portfolio-complete-deployment.zip` — A **full alternate tree** (WebSockets, recommendation services, analytics modules, extra tests, and additional UI). Dropping it on top of this repo would **replace** routing, schema, and much of the server surface.
- `peoples-portfolio.zip` / **`Building a Futuristic Cybersecurity Technology Portfolio.zip`** — Course or design artifacts (plans, extra components, deployment prose). Treat as **reference**, not as a blind merge source.

## Recommended approach

1. Keep **this repo** as the integration point; deploy using [DEPLOYMENT.md](DEPLOYMENT.md).
2. When porting a feature from a zip, **copy one module at a time** (e.g. a single router, component, or migration), run `pnpm run ci`, and fix types/tests.
3. Prefer **new migrations** in `drizzle/` over overwriting existing SQL that may already be applied in production.

## Futuristic / course materials

The “futuristic” archive often contains planning markdown and loose `.tsx` files. Align any UI with this project’s **Tailwind 4** and **Radix** patterns before merging.
