# 09 — Implementation Plan

A sequenced, milestone-by-milestone build order. Where [`08-roadmap.md`](08-roadmap.md)
is the phase-level narrative, this is the concrete engineering checklist. Stack is locked:
**Next.js (App Router) + TypeScript on Vercel, Neon (serverless Postgres) + Prisma,
Auth.js (NextAuth), Anthropic SDK**, with the design system in [`10`](10-design-system.md).

Each milestone has a **Definition of Done (DoD)** so you know when to move on.

---

## M0 — Foundations & deploy pipeline

Goal: an empty-but-real app that deploys to Vercel and talks to Neon.

- [ ] `create-next-app` (App Router, TypeScript, Tailwind).
- [ ] Create a **Neon** project; grab the **pooled** and **direct** connection strings.
- [ ] Add Prisma; configure `datasource` with `url` (pooled) + `directUrl` (direct).
- [ ] `lib/db.ts` — singleton Prisma client (serverless-safe).
- [ ] `package.json` build: `prisma generate && prisma migrate deploy && next build`.
- [ ] Connect repo to **Vercel**; add `DATABASE_URL`, `DIRECT_URL`, `ANTHROPIC_API_KEY`,
      and Auth.js secrets as env vars (preview + production).
- [ ] First migration with a trivial model; confirm a deployed page can read/write Neon.

**DoD:** pushing to `main` deploys to Vercel; a deployed route round-trips to Neon.

---

## M1 — Design system foundation

Goal: tokens + core components exist before any feature pages, so every page is consistent
from day one. Build this **before** feature UI.

- [ ] `styles/tokens.css` — color/type/spacing/radius tokens; `data-surface` switching
      ([`10`](10-design-system.md)).
- [ ] Map tokens into `tailwind.config.ts`.
- [ ] Load **Fredoka** + **Lexend** via `next/font`.
- [ ] Build primitives in `components/ui/`: `Button`, `Card`/`Panel`, `Heading`/`Text`,
      `Icon`, `Modal`, `ProgressBar`.
- [ ] Bake in the accessibility floor: visible focus rings, 56–64px kid targets, keyboard
      operability, `prefers-reduced-motion` support.
- [ ] (Recommended) Stand up **Storybook**; add stories for each primitive.

**DoD:** primitives render on both surfaces, pass keyboard + contrast checks, and are the
only way pages get styled (no ad-hoc CSS).

---

## M2 — Auth & profiles

Goal: a parent can sign in and manage child profiles.

- [ ] Add Auth.js models to Prisma (`User`, `Account`, `Session`, `VerificationToken`) +
      app models (`Child`, etc.) from [`06`](06-data-model.md); migrate.
- [ ] `lib/auth/` — Auth.js config with the Prisma adapter; pick a provider (email magic
      link and/or one OAuth provider).
- [ ] `app/api/auth/[...nextauth]/route.ts`.
- [ ] `app/(auth)/sign-in` — parent sign-in (built from design-system components).
- [ ] `app/(parent)/profiles` — create / pick / edit **child profiles** (the parent owns
      them; children are not auth users).
- [ ] Route protection: child routes require an authed parent + a selected child.

**DoD:** a parent signs in, creates a child profile, and lands in the (empty) child app.

---

## M3 — LLM service layer

Goal: the server-side LLM plumbing, independent of UI, so feature pages just call it.

- [ ] `lib/llm/client.ts` — Anthropic client singleton.
- [ ] `lib/llm/router.ts` — model routing per task (Haiku/Sonnet/Opus) from
      [`03`](03-llm-integration.md).
- [ ] `lib/llm/cache.ts` — stable cached system prefix + volatile suffix helpers.
- [ ] `lib/llm/prompts/` — versioned lesson, quiz, and topic-map prompts (reading level as
      a parameter).
- [ ] `lib/safety/` — input precheck + output check (used by every generation path).
- [ ] `LlmCallLog` writes on every call (model, tokens, cache hits, latency, cost).

**DoD:** a script can generate a level-appropriate lesson + a schema-valid quiz, with the
call logged and the system prefix caching (verify `cache_read_input_tokens > 0` on repeat).

---

## M4 — The core loop (LLM-only MVP)

Goal: the playable Explore → Read → Quiz → Reward → Steer loop. This is the MVP.

- [ ] **Calibration mini-game** + `/api/calibrate` → sets starting reading level
      ([`04`](04-reading-levels.md)). Pre-generate/cache passages per level.
- [ ] **Lesson** — `/api/lesson` (streamed) + `components/reading/ReadingView` +
      `LessonChunk` on the field-journal surface.
- [ ] **Quiz** — `/api/quiz` (structured output) + `QuizChoice`/`QuizCard` with
      icon+text+color feedback.
- [ ] **Steer** — post-quiz topic choices; difficulty adjusts from rolling quiz scores.
- [ ] **Progress** — `/api/progress`: award XP, level-ups, mastery → badges.
- [ ] **World map** — `WorldMap` + `TopicNode` (the signature element) with dynamic,
      interest-driven suggestions ([`05`](05-gamification.md)); list-view fallback for SRs.
- [ ] **Rewards** — `XPBar`, `ExpeditionStamp`, `RewardBurst`/`LevelUpCelebration`
      (reduced-motion safe).
- [ ] **Safety** wired into lesson, quiz, **and** topic-map suggestions.

**DoD:** a child completes full loops end-to-end; difficulty adapts; XP/levels/badges and
the map update and persist; everything is keyboard-navigable and on-theme.

---

## M5 — Grounding + evals (the standout)

Goal: reduce hallucination with grounding and **measure** it.

- [ ] **Simple English Wikipedia** grounding for lessons (RAG-lite via Wikimedia REST
      summary API): cite sources, handle "not covered" ([`07`](07-evals-and-safety.md)).
- [ ] **Eval harness** in `lib/evals/`: versioned dataset (topics × reading levels);
      scorers for reading-level match, factual accuracy (Opus judge), quiz quality, safety.
- [ ] **Measure grounding lift**: run accuracy evals with vs. without grounding; record the
      delta (the headline portfolio result).

**DoD:** `npm run eval` produces scores; the grounding before/after delta is documented.

---

## M6 — Observability & polish

Goal: prove it runs, then make it shine.

- [ ] **Dashboard** off `LlmCallLog`: cost per loop, cache hit rate, p50/p95 latency,
      model mix, safety-flag rate.
- [ ] **Streaks & daily goals**; richer avatar/world unlocks.
- [ ] Motion polish (level-ups, discovery, badge stamps), re-checked against reduced-motion.
- [ ] Final accessibility audit: contrast, focus order, keyboard-only run, screen-reader
      pass of the map list-view.

**DoD:** the dashboard shows real cost/latency/cache numbers; the accessibility audit
passes; the app is demo-ready.

---

## Build-order rationale

- **Design system (M1) before features (M4)** so consistency is structural, not retrofit.
- **LLM service layer (M3) before the loop (M4)** so UI just consumes a clean interface and
  routing/caching/logging exist from the first generated lesson.
- **Grounding + evals (M5) after a working loop** so the measured before/after is
  compelling and the eval harness tests a real product.

## Suggested dependencies

`@anthropic-ai/sdk`, `next-auth` + `@auth/prisma-adapter`, `prisma` / `@prisma/client`,
`zod` (quiz schemas + structured output), `tailwindcss`. Optional: `@storybook/nextjs`,
a charting lib for the observability dashboard.
