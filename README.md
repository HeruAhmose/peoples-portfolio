# Peoples Portfolio

Standalone full-stack portfolio (React 19, Vite 7, Express, tRPC, Drizzle/MySQL, Tailwind 4, Three.js).

## Prerequisites

- Node.js 20+
- pnpm 10.x
- MySQL 8+ (for analytics, inquiries, and email triggers)

## Setup

```bash
cp .env.example .env
pnpm install
```

Apply database migrations (creates `visitorEvents`, `inquiries`, `notificationPreferences`, `timelineEvents`, and existing `users`):

```bash
pnpm db:migrate
```

## Develop

```bash
pnpm dev
```

Open http://localhost:3000 (or the next free port logged in the terminal).

## Environment highlights

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | MySQL connection string for Drizzle |
| `ANTHROPIC_API_KEY` | Claude API for H.K. Assistant (`hk.chat`) |
| `OWNER_NOTIFY_EMAIL` | Destination for first-visit section alerts and inquiries |
| `SMTP_*` | SMTP delivery for owner notifications (`nodemailer`) |

## Build & run (production)

```bash
pnpm build
pnpm start
```

## Hosting

- **Docker**: `docker build -t peoples-portfolio .` then run with `-p 3000:3000` and pass env vars (including `DATABASE_URL`, `ANTHROPIC_API_KEY`, SMTP).
- **Render**: see `render.yaml` for a Docker web service template. Create a MySQL instance (or external DB), set `DATABASE_URL`, run `pnpm db:migrate` against that database once, then deploy.

## API surface (tRPC)

- `hk.chat` — Claude-backed assistant with AMC/preprint system context.
- `portfolio.logEvent` — client analytics (section views, patent expand, assistant open).
- `portfolio.submitInquiry` — stores inquiry + emails owner when SMTP is configured.
- `portfolio.setNotificationPreferences` — upsert visitor notification preferences.

See `todo.md` for the broader product checklist.
