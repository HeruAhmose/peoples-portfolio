# Contributing

This repository is **proprietary** (see [`LICENSE`](LICENSE)). Contributions are accepted only under terms agreed in writing with the rights holder (for example a contractor agreement or corporate CLA). Do not assume an open-source contribution license applies.

## Before you open a PR

1. `pnpm install`
2. `pnpm run ci` (typecheck, tests, Prettier check, production build)
3. Do not commit secrets or local `.env*` files.

## Code style

- TypeScript strict mode is enabled; prefer explicit types at module boundaries.
- Run `pnpm format` if `pnpm format:check` fails.

## Database

Schema changes belong in Drizzle (`drizzle/schema.ts`) with a migration under `drizzle/`. Document any new environment variables in `.env.example` and `README.md`.
