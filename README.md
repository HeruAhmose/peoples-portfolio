# Peoples Portfolio

Full-stack portfolio: **React 19**, **Vite 7**, **Express**, **tRPC**, **Drizzle/MySQL**, **Tailwind 4**, **Three.js**. Includes a **Claude-powered H.K. Assistant** (Anthropic), patent-claims explorer, and optional owner email notifications.

[![CI](https://github.com/HeruAhmose/peoples-portfolio/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/HeruAhmose/peoples-portfolio/actions/workflows/ci.yml)

**License:** [MIT](LICENSE)

---

## For reviewers

Suggested review order:

1. **Security** — [`SECURITY.md`](SECURITY.md); confirm no credentials in repo; tRPC procedures are `publicProcedure` by design for this marketing/analytics surface—validate rate limits and payload sizes if exposing publicly at scale.
2. **API** — `server/portfolioRouter.ts` (`hk`, `portfolio`); `server/_core/claude.ts` (Anthropic Messages API).
3. **Data** — `drizzle/schema.ts`, `drizzle/0001_portfolio_engagement.sql`, `server/portfolioService.ts`.
4. **Client** — `client/src/App.tsx` routing/intro; `PatentClaimsExplorer.tsx`, `HKAssistant.tsx`; shared copy in `shared/`.
5. **Build** — `pnpm run ci` matches [GitHub Actions](.github/workflows/ci.yml).

---

## Architecture

```
Browser  →  Express (dev: Vite middleware; prod: dist/public static)
              └── /api/trpc  →  tRPC  →  MySQL (Drizzle) | Anthropic | SMTP
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

## Prerequisites

- Node.js **20+** (CI uses **22**)
- **pnpm** 10.x
- **MySQL 8+** (for analytics, inquiries, preferences, timeline)

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

| Variable                        | Purpose                            |
| ------------------------------- | ---------------------------------- |
| `DATABASE_URL`                  | MySQL for Drizzle                  |
| `ANTHROPIC_API_KEY`             | Claude (`hk.chat`)                 |
| `OWNER_NOTIFY_EMAIL` + `SMTP_*` | Owner notifications (`nodemailer`) |

See `.env.example` for the full list.

## Optional analytics

Umami (or similar) was removed from `index.html` to avoid shipping broken `%VITE_*%` placeholders. To add analytics, inject a script via Vite env or a small plugin, and document `VITE_*` vars in `.env.example`.

## Hosting

- **Docker**: `docker build -t peoples-portfolio .` — run with `-p 3000:3000` and required env vars.
- **Render**: see `render.yaml`. Run `pnpm db:migrate` against production MySQL once before or after first deploy.

## tRPC surface

- `hk.chat` — Claude assistant with AMC/preprint system context.
- `portfolio.logEvent` — client analytics.
- `portfolio.submitInquiry` — inquiry row + owner email when SMTP is set.
- `portfolio.setNotificationPreferences` — visitor notification prefs.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

Internal roadmap notes: `todo.md`.
