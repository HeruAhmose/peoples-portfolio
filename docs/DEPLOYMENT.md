# Deployment (this repository)

This branch is a **Vite 7 + React 19** client, **Express** server, **tRPC** API, **Drizzle ORM** with **PostgreSQL** (e.g. **Neon**), optional **Anthropic** (H.K. Assistant) and **SMTP** for inquiries.

## Prerequisites

- Node.js **20+** (CI uses **22**)
- **pnpm** **10.26+** (addresses known supply-chain advisories; CI pins a current 10.x)
- **PostgreSQL 14+** (managed Neon URL recommended for production)

## Environment

Copy `.env.example` to `.env` and set values. The server loads `.env` then `.env.local` (override).

| Area            | Variables (see `.env.example`)                    |
| --------------- | ------------------------------------------------- |
| Server          | `PORT`, `NODE_ENV`, `DATABASE_URL`                |
| OAuth / session | As in `.env.example` if you use Manus/OAuth flows |
| Anthropic       | `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`            |
| Email           | `SMTP_*`, `OWNER_EMAIL`                           |
| S3 (optional)   | `S3_*` for asset uploads if enabled               |

Never commit real secrets.

## Local

```bash
pnpm install
pnpm run db:migrate   # or your documented Drizzle workflow
pnpm dev
```

## CI parity

```bash
pnpm run ci
```

Same checks run in `.github/workflows/ci.yml` (`pnpm install --frozen-lockfile` then `pnpm run ci`).

## Production build

```bash
pnpm run build
pnpm start
```

Serve behind HTTPS; set `NODE_ENV=production`. Use a process manager or container orchestration as appropriate.

## Container / PaaS

If the repo includes `Dockerfile` or `render.yaml`, use those as the source of truth for image build and env wiring.

## Related docs

- **[Production-Deployment-Guide.md](Production-Deployment-Guide.md)** — Extended feature checklist and env catalog (may exceed this branch).
- **[OPTIONAL-FULL-STACK-BUNDLE.md](OPTIONAL-FULL-STACK-BUNDLE.md)** — What is in `peoples-portfolio-complete-deployment.zip` and how to adopt pieces safely.
