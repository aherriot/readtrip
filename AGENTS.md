# AGENTS.md

High-level orientation for agents working in this repo. Keep this file lean —
detailed design lives in `docs/`, and procedures live in skills (see below). Update
this file only for facts that are stable and broadly useful; put everything else where
it belongs.

## What this is

**ReadTrip** — a kid-facing (ages ~5–12) curiosity engine: pick a topic, get an
age-appropriate explanation, take a quiz, earn rewards, steer where to go next. It's a
portfolio project demonstrating how to productionize LLMs (adaptive content, reading-level
calibration, model routing, prompt caching, evals, content-safety guardrails).

## Stack

Next.js (App Router) + TypeScript on Vercel · Neon (serverless Postgres) + Drizzle ORM ·
Auth.js (NextAuth) · Anthropic Claude API. Full rationale + diagrams in
[`docs/02-architecture.md`](docs/02-architecture.md).

## Where things live

| Path                 | What                                                                         |
| -------------------- | ---------------------------------------------------------------------------- |
| `app/`               | Next.js App Router routes + API route handlers                               |
| `lib/db/`            | Drizzle schema (`schema.ts`) + singleton client (`index.ts`)                 |
| `drizzle/`           | Generated SQL migrations (never hand-edit)                                   |
| `e2e/`               | Playwright tests (`*.spec.ts`) — real-browser behavior, a11y, visual         |
| `**/*.test.ts`       | Vitest unit tests, co-located with source — pure logic only                  |
| `docs/`              | Product spec, architecture, data model, milestone plan — the source of truth |
| `.github/workflows/` | CI                                                                           |

## Non-obvious constraints (read before changing things)

- **ORM is Drizzle, not Prisma.** Edit the schema in `lib/db/schema.ts`, then
  `npm run db:generate` (creates a migration) → `npm run db:migrate` (applies it). Don't
  write migration SQL by hand.
- **Two DB URLs:** the app uses pooled `DATABASE_URL`; migrations use direct `DIRECT_URL`.
  Environments are isolated via **Neon branches** — never point dev/CI at the prod branch.
  See the "Environments & databases" section of `docs/02-architecture.md`.
- **Local secrets go in `.env.local`** (gitignored). `drizzle.config.ts` loads it explicitly.
- **All LLM calls are server-side only** — the Anthropic key never reaches the browser.
  Default to the latest Claude models; see [`docs/03-llm-integration.md`](docs/03-llm-integration.md).
- **Two test layers, split by what the test needs.** If it needs the DOM,
  computed styles, or layout → **Playwright** (`e2e/`, `*.spec.ts`, real browser).
  If it's a pure function (validation, math, parsing, schemas) → **Vitest**
  (co-located `*.test.ts`, runs in node). Don't unit-test components in jsdom —
  it can't compute layout/styles, so it gives weaker coverage than the Playwright
  specs already do. Vitest never scans `e2e/`; Playwright only scans `e2e/`.
- **Node is pinned** via `.nvmrc` (local and CI must match).
- **Children are not auth users** — a parent `User` owns child sub-profiles. See
  [`docs/06-data-model.md`](docs/06-data-model.md).

## Build order

Work the milestones in [`docs/09-implementation-plan.md`](docs/09-implementation-plan.md).
M0 (foundations + deploy), M1 (design system), M2 (auth & profiles), and M3 (LLM service
layer) are done; M4 (the core loop) is next.

## Common commands

```
npm run dev          # local dev server
npm run db:generate  # create a migration from schema changes
npm run db:migrate   # apply migrations
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm run test:unit    # Vitest (pure logic)
npm test             # Playwright e2e
npm run check        # all of the above, in parallel
```

`npm run check` is the fast gate — typecheck, lint, prettier, design-system parity, and
unit tests, all in parallel, with **no DB or browser**. The husky pre-commit hook runs it,
and CI runs it as the `static` job. The Playwright e2e suite (`npm test`) is its own leg:
the CI `e2e` job (with a Neon branch) and the `visual` job, both running in parallel with
`static`. Don't bypass the hook with `--no-verify` unless explicitly asked.

## Defer to skills

Don't re-derive these — invoke the skill:

- **Run / screenshot the app to confirm a change** → `/run`
- **Verify a change actually works end-to-end** → `/verify`
- **Review your working diff before committing** → `/code-review`
- **Security review of pending changes** → `/security-review`
- **Claude API / model reference** (ids, pricing, tool use, caching) → `/claude-api`
- **New visual UI work** (aesthetic direction, typography) → `/frontend-design`
- **Building/styling any kid-facing UI** (which component, tokens, surfaces) → the
  `design-system` skill (`.claude/skills/design-system`). It's the living usage guide for
  `components/` + tokens and is parity-checked against the code
  (`npm run check:design-system`), so a new component can't ship undocumented.
