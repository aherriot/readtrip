# 02 — Architecture

## Stack

- **Next.js (App Router) + TypeScript** — full-stack in one codebase; easy deploy to
  Vercel; great fit for a playful, animated frontend.
- **Claude API** via the official `@anthropic-ai/sdk` — all content, quiz, and topic
  generation. See [`03-llm-integration.md`](03-llm-integration.md).
- **Database** — **Neon** (serverless Postgres) via Drizzle ORM. Stores child profiles,
  progress, XP, badges, and the knowledge map. Neon's built-in PgBouncer pooler suits
  Vercel's serverless functions; use the **pooled** URL for the app and a **direct** URL
  for migrations (`DIRECT_URL` in `drizzle.config.ts`). See [`06-data-model.md`](06-data-model.md).
- **Auth** — **Auth.js (NextAuth)** with the Drizzle adapter. Only **parents** are auth
  users; child profiles are sub-records under a parent (Netflix-profile model), selected
  after the parent signs in. All user/child data lives in our own Postgres.
- **Design system** — a shared, accessible, kid-friendly component library. See
  [`10-design-system.md`](10-design-system.md).
- **Observability** — structured logging of every LLM call (model, tokens, latency,
  cost, cache hits) + an eval harness. See [`07-evals-and-safety.md`](07-evals-and-safety.md).

> All LLM calls run **server-side** (Next.js Route Handlers / Server Actions). The
> Anthropic API key never reaches the browser. The client streams responses from our
> own endpoints, not from Anthropic directly.

## High-level shape

```
┌─────────────────────────────────────────────┐
│ Browser (Next.js client)                     │
│  - Explore UI, world map, reader, quiz        │
│  - Avatar / XP / badges                        │
│  - Streams content from our API routes         │
└───────────────┬─────────────────────────────┘
                │  fetch / SSE
┌───────────────▼─────────────────────────────┐
│ Next.js server (Route Handlers)              │
│  /api/calibrate     reading-level estimate    │
│  /api/explore       topic + map branches      │
│  /api/lesson        explanation (streamed)    │
│  /api/quiz          questions + grading        │
│  /api/progress      XP, levels, badges         │
│                                               │
│  lib/llm/router     picks model per task       │
│  lib/llm/cache      prompt-cache placement     │
│  lib/safety         input + output guardrails  │
│  lib/evals          offline eval harness       │
└───────┬───────────────────────┬──────────────┘
        │                       │
┌───────▼────────┐     ┌────────▼─────────┐
│ Claude API     │     │ Postgres (Drizzle)│
│ (Haiku/Sonnet/ │     │ profiles, progress│
│  Opus routing) │     │ map, badges, logs │
└────────────────┘     └──────────────────┘
```

## Request lifecycle — a single "explore a topic" turn

1. Child taps a topic. Client calls `POST /api/lesson` with `{ childId, topic }`.
2. Server loads the child's **reading level** and recent history.
3. `lib/safety` validates the topic (age-appropriate? on-policy?).
4. `lib/llm/router` selects the model for "generate lesson" (see routing doc).
5. Server builds the prompt with a **stable cached prefix** (system + format rules) and
   a volatile suffix (topic + level). See caching in [`03`](03-llm-integration.md).
6. Server **streams** the explanation back to the client via SSE.
7. In the same turn (or a fast follow), `POST /api/quiz` generates questions for the
   content just shown.
8. Child answers; `lib/safety` + grading run; `POST /api/progress` awards XP, checks for
   level-up / badge, and updates the difficulty estimate.
9. Every LLM call is logged (model, tokens, cost, latency, cache hit) for observability.

## Suggested directory layout

```
app/
  (auth)/sign-in/page.tsx         # parent auth (Auth.js)
  (parent)/profiles/page.tsx      # pick / manage child profiles
  (child)/explore/page.tsx        # main loop UI
  (child)/map/page.tsx            # knowledge world map
  api/auth/[...nextauth]/route.ts # Auth.js handler
  api/calibrate/route.ts
  api/explore/route.ts
  api/lesson/route.ts             # streamed
  api/quiz/route.ts
  api/progress/route.ts
components/
  ui/                             # design-system primitives (Button, Card, ...)
  game/                           # TopicNode, XPBar, ExpeditionStamp, RewardBurst
  reading/                        # ReadingView, LessonChunk, QuizChoice
lib/
  auth/                           # Auth.js config + Drizzle adapter
  db/                             # Drizzle schema + singleton client (serverless-safe)
  llm/
    client.ts                     # Anthropic client singleton
    router.ts                     # model selection per task
    cache.ts                      # cache_control prefix helpers
    prompts/                      # versioned prompt templates
  safety/                         # input + output guardrails
  evals/                          # offline eval harness + datasets
  progress/                       # XP, levels, badges, difficulty
styles/
  tokens.css                      # design tokens as CSS variables
drizzle.config.ts
drizzle/                          # generated SQL migrations
```

## Why server-side streaming

- **Security** — key stays on the server; we control rate limits and guardrails.
- **Caching** — prompt caching only helps if *we* control the prefix bytes across
  requests; doing it server-side lets us keep a stable, deterministic prefix.
- **Safety** — output guardrails can inspect the stream before/while it reaches a child.

## Environments & databases

We isolate environments with **Neon branches** (copy-on-write clones), not separate
projects. One Neon project, three logical environments:

| Environment | Neon branch | Lifetime | Connection strings come from |
|---|---|---|---|
| **Production** | `production` (root branch) | permanent | Vercel env vars (Production scope) |
| **Local dev** | `development` | permanent | `.env.local` (gitignored) |
| **CI tests** | `ci-<run-id>` | created + deleted per CI run | GitHub Actions (Neon branch action) |
| **PR previews** | auto per Vercel deploy | per preview deploy | Neon–Vercel integration (Preview scope) |

Why branches: prod, dev, and CI must not share data (CI migrates and truncates
aggressively; a shared branch would clobber your local work). Branches give that
isolation instantly and cheaply, and CI branches are fully ephemeral.

**The app stays environment-agnostic.** `lib/db/` and `drizzle.config.ts` only read
`DATABASE_URL` (pooled) and `DIRECT_URL` (direct) from the environment — there is no
`if (env === ...)` logic in code. Each environment just supplies different values:

- **Local** — `.env.local`. Next.js loads it automatically; `drizzle.config.ts` also
  loads it explicitly (drizzle-kit doesn't read `.env.local` on its own) so
  `npm run db:migrate` works locally.
- **CI** — `.github/workflows/test.yml` creates an ephemeral Neon branch, runs
  `npm run db:migrate` against its `DIRECT_URL`, runs the Playwright suite against its
  pooled `DATABASE_URL`, then deletes the branch. Requires repo secret `NEON_API_KEY`
  and repo variable `NEON_PROJECT_ID`.
- **Prod** — Vercel env vars point at the `production` branch; the `build` script runs
  `drizzle-kit migrate` on deploy.

## Testing

End-to-end tests run on **Playwright** (`e2e/`, config in `playwright.config.ts`).
Playwright boots the app via its `webServer` block. `e2e/home.spec.ts` is a static
smoke test; `e2e/health.spec.ts` drives the full stack (route → Drizzle → Neon) and so
needs a migrated DB — locally that means a populated `.env.local`, in CI the ephemeral
branch. Run with `npm test` (or `npm run test:e2e:ui` for the interactive runner).
