# Peoples Portfolio

Full-stack portfolio: **React 19**, **Vite 7**, **Express**, **tRPC**, **Drizzle/PostgreSQL** (e.g. **Neon**), **Tailwind 4**, **Three.js**. Includes a **Claude-powered H.K. Assistant** (Anthropic), patent-claims explorer, and optional owner email notifications.

[![CI](https://github.com/HeruAhmose/peoples-portfolio/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/HeruAhmose/peoples-portfolio/actions/workflows/ci.yml)

**Proprietary:** [LICENSE](LICENSE) · [PROPRIETARY.md](PROPRIETARY.md)

---

## Part of TRAI

This is the **entry gate** to TRAI — the Tamerian Renaissance Alliance
Initiative — framed as seven organs of one regenerative organism. A visitor
lands here first; two organs live on this site, the rest open outward.

| #   | Organ · role                    | Venture                | Status                           | Where it lives                                                                                                                                                                                                       |
| --- | ------------------------------- | ---------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01  | Skeleton — material sovereignty | Tamerian Materials     | U.S. provisional filed           | [`/materials`](client/src/pages/MaterialsScience.tsx) here · own repo: [tamerian-materials](https://github.com/HeruAhmose/tamerian-materials) → [tamerian-materials.com](https://tamerian-materials.com/)            |
| 02  | Heart — biological sovereignty  | True Melange Φ         | Formulation set · entity pending | own repo: [blue-gold-daily](https://github.com/HeruAhmose/blue-gold-daily) → [blue-gold-daily site](https://heruahmose.github.io/blue-gold-daily/layers.html)                                                        |
| 03  | Brain — cognitive sovereignty   | Queen Califia          | Demo standing                    | own repo: [QueenCalifia-CyberAI](https://github.com/HeruAhmose/QueenCalifia-CyberAI) → [queencalifia-cyberai.web.app](https://queencalifia-cyberai.web.app/)                                                         |
| 04  | Vessels — mobility sovereignty  | Mela Nation            | EIN filed · early development    | a page inside the estate — no separate repo                                                                                                                                                                          |
| 05  | Skin — identity sovereignty     | MeLaNiNa               | EIN filed · early development    | a page inside the estate — no separate repo                                                                                                                                                                          |
| 06  | Hands — community reach         | TechBridge Collective  | Designed · not yet operating     | [`/community`](client/src/pages/CommunityImpact.tsx) here · own repo: [techbridge-collective](https://github.com/HeruAhmose/techbridge-collective) → [techbridge-collective.org](https://techbridge-collective.org/) |
| 07  | Lymphatic — regenerative return | The Peoples Foundation | EIN obtained · exemption pending | a page inside the estate — no separate repo                                                                                                                                                                          |

**The estate** — [trai-portfolio](https://github.com/HeruAhmose/trai-portfolio)
— is where organs 04, 05, and 07 actually live, alongside deeper material on
every other organ. This gate stays intentionally thin; depth belongs there.

Statuses and routing above are sourced from [`shared/organismFacts.ts`](shared/organismFacts.ts)
and [`client/src/lib/organism.ts`](client/src/lib/organism.ts) — the
canonical fact table for this whole graph — not restated from memory here.
If those files change, this table is what's now out of date, not the other
way around.

---

## For reviewers

Suggested review order:

1. **Security** — [`SECURITY.md`](SECURITY.md); confirm no credentials in repo; tRPC procedures are `publicProcedure` by design for this marketing/analytics surface—validate rate limits and payload sizes if exposing publicly at scale.
2. **API** — `server/portfolioRouter.ts` (`hk`, `portfolio`); `server/_core/claude.ts` (Anthropic Messages API).
3. **Data** — `drizzle/schema.ts`, `drizzle/0000_postgres_init.sql`, `server/portfolioService.ts`.
4. **Client** — `client/src/App.tsx` routing/intro; `PatentClaimsExplorer.tsx`, `HKAssistant.tsx`; shared copy in `shared/`.
5. **Build** — `pnpm run ci` matches [GitHub Actions](.github/workflows/ci.yml).

---

## Architecture

```
Browser  →  Express (dev: Vite middleware; prod: dist/public static)
              └── /api/trpc  →  tRPC  →  PostgreSQL (Drizzle) | Anthropic | SMTP
```

- **Auth**: existing OAuth/session helpers (`server/_core/oauth.ts`, `sdk.ts`); many portfolio routes are intentionally public.
- **Env**: `server/_core/index.ts` loads `.env` then `.env.local` (override).

---

## Repository layout

| Path       | Role                                                |
| ---------- | --------------------------------------------------- |
| `client/`  | Vite React app                                      |
| `server/`  | Express entry, tRPC routers, services               |
| `shared/`  | Shared TS (e.g. patent claims, H.K. system context) |
| `drizzle/` | Schema + SQL migrations                             |

---

## Deployment

Production-oriented steps and env reference: **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**. Extended roadmap and env catalog: [docs/Production-Deployment-Guide.md](docs/Production-Deployment-Guide.md).

## Prerequisites

- Node.js **20+** (CI uses **22**)
- **pnpm** **10.26+** (see `packageManager` in `package.json`)
- **PostgreSQL** (for analytics, inquiries, preferences, timeline; **Neon** works well with `render.yaml` + Docker)

## Setup

```bash
cp .env.example .env
pnpm install
```

Apply migrations:

```bash
pnpm db:migrate
```

## Scripts

| Script                              | Purpose                      |
| ----------------------------------- | ---------------------------- |
| `pnpm dev`                          | Dev server (Vite + API)      |
| `pnpm build` / `pnpm start`         | Production build + run       |
| `pnpm check`                        | `tsc --noEmit`               |
| `pnpm test`                         | Vitest                       |
| `pnpm format` / `pnpm format:check` | Prettier                     |
| `pnpm run ci`                       | Same gates as GitHub Actions |

## Develop

```bash
pnpm dev
```

Open http://localhost:3000 (or the port printed in the terminal).

## Environment (high level)

| Variable                        | Purpose                                       |
| ------------------------------- | --------------------------------------------- |
| `DATABASE_URL`                  | PostgreSQL (e.g. Neon pooled URL) for Drizzle |
| `ANTHROPIC_API_KEY`             | Claude (`hk.chat`)                            |
| `OWNER_NOTIFY_EMAIL` + `SMTP_*` | Owner notifications (`nodemailer`)            |

See `.env.example` for the full list.

## Optional analytics

Umami (or similar) was removed from `index.html` to avoid shipping broken `%VITE_*%` placeholders. To add analytics, inject a script via Vite env or a small plugin, and document `VITE_*` vars in `.env.example`.

## Hosting

- **Docker**: `docker build -t peoples-portfolio .` — run with `-p 3000:3000` and required env vars.
- **Render**: see `render.yaml`. Set `DATABASE_URL` to your Neon connection string in the service env, then run `pnpm db:migrate` once against that database before or after first deploy.

## tRPC surface

- `hk.chat` — Claude assistant with AMC/preprint system context.
- `portfolio.logEvent` — client analytics.
- `portfolio.submitInquiry` — inquiry row + owner email when SMTP is set.
- `portfolio.setNotificationPreferences` — visitor notification prefs.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

Internal roadmap notes: `todo.md`.
