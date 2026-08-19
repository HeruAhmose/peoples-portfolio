# Working in this repo

Context for Claude Code. Read before touching anything.

## The two-repo architecture — settled

**`peoples-portfolio` is the entry gate. `trai-portfolio` is the estate.**

A visitor lands here. The opening sequence names all seven organs; two have a
page in the gate, five open outward into the estate. No organ is a dead end.

| Organ                              | Destination                  |
| ---------------------------------- | ---------------------------- |
| Skeleton · Tamerian Materials      | gate `/materials`            |
| Heart · True Melange Φ             | blue-gold-daily world        |
| Brain · Queen Califia              | queencalifia-cyberai.web.app |
| Vessels · Mela Nation              | estate `/mela-nation`        |
| Skin · MeLaNiNa                    | estate `/melanina`           |
| Hands · TechBridge Collective      | gate `/community`            |
| Lymphatic · The Peoples Foundation | estate `/peoples-foundation` |

What this means in practice:

- **Keep the gate lean.** Depth belongs in the estate. Do not port estate pages
  here; link to them. If a page here grows past the point of being an
  introduction, that is a signal it belongs in the estate.
- **`shared/organismFacts.ts` is canonical for the whole estate.** Claim data
  lives here and nowhere else. If the estate needs a status string, it consumes
  this — it does not keep a parallel copy.
- **`client/src/lib/organism.ts` holds the routing.** `route` is a page in this
  repo; `external` is a destination outside it. Every organ must have at least
  one. A `null` for both is a dead end and a bug.

## What this is

Jonathan Peoples' portfolio, and the front door for TRAI — the Tamerian
Renaissance Alliance Initiative. Seven ventures framed as organs of one
organism. React 19 + Vite + wouter + Tailwind, with an Express/tRPC server that
does **not** run on the deployed site.

Deployed as a static GitHub Pages project site at
`https://heruahmose.github.io/peoples-portfolio/`.

## The governing standard

**"Vast in Vision, Exact in Claim."** This is not decoration — it is the rule
that decides what you are allowed to write.

- Never invent a measurement, a benchmark, a validation, or a URL.
- Anything projected must be visibly labelled as projected. The
  `CompositeConfigurator` is the pattern: it interpolates across ranges stated
  in the patent filing and prints "Design envelope · not measured data" on its
  face.
- `shared/organismFacts.ts` is the canonical fact table. Organ status and claim
  register derive from it, and `shared/organismFacts.test.ts` enforces that.
  **Never hardcode a status string in `client/src/lib/organism.ts`** — a prior
  attempt did exactly that and broke the test by dropping the `key` field.
- If you cannot source a fact, leave the gap and say so. A `null` external URL
  is correct; a plausible-looking invented one is not.

## Before you start: check HEAD

This repo moves fast — several releases a day at times. Twice, work was built
against a commit that was already stale, and the resulting patch would have
reverted newer work.

```bash
git log -1 --oneline
git fetch && git status
```

Publication scripts require you to be on `main`. A stale
`deploy/github-pages-*` branch has tripped this before.

## Hard constraints

**Do not touch `package.json` or `pnpm-lock.yaml` casually.** CI runs
`pnpm install --frozen-lockfile`; any drift fails every workflow at step two.
If you add a dependency, regenerate and commit the lockfile in the same commit.

**Actions are SHA-pinned.** Keep them that way. Dependabot's `github-actions`
ecosystem updates them.

**CSP is live** in `client/index.html` with `script-src 'self'`. No inline
scripts, ever — they will be blocked. `style-src` keeps `'unsafe-inline'`
because React and Radix set styles at runtime.

**`format:check` already fails on ~13 pre-existing files.** That is a known
debt, not something you caused. Always run
`npx prettier --write` on files you touch so you do not add to it, and do not
read a red `pnpm run ci` as evidence your change broke something — check which
files.

## Verification discipline

This is the part that matters most. Repeated failures in this codebase came
from trusting green output.

**A passing build proves almost nothing.** An unused component compiles
perfectly. A feature can be written, imported nowhere, tree-shaken out, and
every check still passes. This happened.

After adding any component, prove it ships:

```bash
PEOPLES_STATIC_PAGES=true npx vite build --base /peoples-portfolio/
grep -c "YourComponentName" client/src/pages/ThePage.tsx   # >= 2: import + usage
cat dist/public/assets/*.js | grep -c "Some distinctive string from it"
```

**`ComponentShowcase.tsx` is not routed.** It is 1,440 lines with 17 handlers
and it reaches no visitor. Anything imported only by it is tree-shaken — that
is why `Prose` and its URL allowlist currently ship nothing.

**Write a negative control for any test you add.** Reintroduce the bug, confirm
the test fails, restore. A suite that has only ever passed proves nothing.

**Re-measure, do not carry numbers forward.** A bundle-size claim measured on
one commit was repeated after the target changed and was wrong.

## Commands

```bash
pnpm install --frozen-lockfile
pnpm check                                          # tsc, must be 0 errors
pnpm test                                           # vitest, 88+ passing
PEOPLES_STATIC_PAGES=true npx vite build --base /peoples-portfolio/
```

The deploy workflow gates on three things — check them before pushing:
no root-relative `"/assets/"` refs, assets prefixed with `/peoples-portfolio/`,
and no `manus.computer` string anywhere in `dist/public`.

## Current state and priorities

Interactivity audit, measured per page:

| Page              | Lines     | Hooks | Handlers | Status             |
| ----------------- | --------- | ----- | -------- | ------------------ |
| ResearchLab       | 456 → 470 | 2 → 7 | 0 → 3    | Configurator added |
| CommunityImpact   | 388       | 2     | 0        | **static**         |
| Home              | 400       | 2     | 2        | thin               |
| ComponentShowcase | 1,440     | 14    | 17       | **not routed**     |
| ProjectGallery    | 195       | 6     | 4        | genuinely works    |

**Next, in order:**

1. **Route `ComponentShowcase`**, or harvest the good parts into routed pages.
   The best interactive work in the repo is invisible. Cheapest win available.
2. **`CommunityImpact`** — 388 static lines. It states hub and Digital
   Navigator figures that want a model the reader can move, the way
   `ResearchLab` wanted the configurator. Two hubs, four Navigators, $20/hr in
   year one — all sourced, all currently inert prose.
3. **`Home`** — 400 lines, two handlers. The front door should demonstrate,
   not describe.
4. **Point `HKAssistant` at `Prose`** (one-line import). H.K. currently renders
   plain text; `Prose` exists, handles links and emphasis, and carries a URL
   allowlist blocking `javascript:` and `data:`. It ships nothing today.

## Repo settings that still need a human

Not code, but they matter as much: enable Secret scanning and **Push
protection**, protect `main` (it currently takes direct pushes), and set the
default workflow token to read-only.
