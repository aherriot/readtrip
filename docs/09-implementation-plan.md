# 09 — Implementation Plan

A sequenced, milestone-by-milestone build order. Where [`08-roadmap.md`](08-roadmap.md)
is the phase-level narrative, this is the concrete engineering checklist. Stack is locked:
**Next.js (App Router) + TypeScript on Vercel, Neon (serverless Postgres) + Drizzle ORM,
Auth.js (NextAuth), Anthropic SDK**, with the design system in [`10`](10-design-system.md).

Each milestone has a **Definition of Done (DoD)** so you know when to move on.

---

## M0 — Foundations & deploy pipeline

Goal: an empty-but-real app that deploys to Vercel and talks to Neon.

- [x] `create-next-app` (App Router, TypeScript, Tailwind).
- [x] Create a **Neon** project; grab the **pooled** and **direct** connection strings.
- [x] Add Drizzle ORM + `drizzle-kit`; `drizzle.config.ts` uses `DIRECT_URL` for migrations,
      the app uses pooled `DATABASE_URL`.
- [x] `lib/db/` — schema + singleton Drizzle client over Neon's HTTP driver (serverless-safe).
- [x] `package.json` build: `drizzle-kit migrate && next build`.
- [x] Connect repo to **Vercel**; add `DATABASE_URL`, `DIRECT_URL`, `ANTHROPIC_API_KEY`,
      and Auth.js secrets as env vars (preview + production).
- [x] First migration with a trivial model; confirm a deployed page can read/write Neon.

Also landed early (not strictly required until later milestones): CI on GitHub Actions
with ephemeral Neon branches, Playwright e2e tests, ESLint, and a typecheck/lint/test
pre-commit hook.

**DoD:** pushing to `main` deploys to Vercel; a deployed route round-trips to Neon.
✅ Met — `https://readtripapp.vercel.app/api/health` returns `{ ok: true, db: "connected" }`.

---

## M1 — Design system foundation

Goal: tokens + core components exist before any feature pages, so every page is consistent
from day one. Build this **before** feature UI. Every component is **mobile-first** and
designed for **touch / no-mouse** use, and ships with **unit, visual, and e2e tests** — no
primitive is "done" until all three are green.

- [x] `styles/tokens.css` — color/type/spacing/radius tokens; `data-surface` switching
      ([`10`](10-design-system.md)).
- [x] Map tokens into the Tailwind v4 `@theme inline { … }` block in `app/globals.css`
      (CSS-first — there is no `tailwind.config.ts`).
- [x] Load **Fredoka** + **Lexend** via `next/font`.
- [x] Build primitives in `components/ui/`: `Button`, `Card`/`Panel`, `Heading`/`Text`,
      `Icon`, `Modal`, `ProgressBar`.
- [x] **Mobile-first, no-mouse by default:** design at the small viewport first and scale up;
      assume **touch and keyboard** are the primary inputs (a mouse may never be present).
      Targets are 56–64px for kid-facing controls; nothing relies on hover, right-click, or
      precise pointing; all interactions work via tap and keyboard.
- [x] Bake in the accessibility floor: visible focus rings, 56–64px kid targets, full
      keyboard operability, `prefers-reduced-motion` support.
- [x] **Test every primitive — unit + visual + e2e** (split by what the test needs, per
      AGENTS.md):
  - **Unit** (Vitest, node): pure logic only — value clamping, variant/scale resolution,
    validation. No jsdom component rendering (it can't compute layout/styles).
  - **Visual** (Playwright snapshots): the gallery on **both surfaces**, capturing each
    component's states; baselines are regenerated when the gallery changes.
  - **e2e / contract** (Playwright, real browser): the DOM + a11y contract — ARIA roles and
    labels, keyboard activation (`Enter`/`Space`/`Escape`), focus rings, focus trap/restore,
    touch tap, tab order, and the 56–64px target floor.
- [ ] (Recommended) Stand up **Storybook**; add stories for each primitive (doubles as the
      source for visual snapshots).

**DoD:** primitives render on both surfaces and at mobile + desktop viewports; are fully
operable by **touch and keyboard with no mouse**; pass **unit, visual, and e2e** tests plus
keyboard + contrast checks in CI; and are the only way pages get styled (no ad-hoc CSS).
✅ Met — all 8 primitives ship with unit + visual + e2e coverage; `npm run check` and the
Playwright e2e/visual suites are green. (Storybook remains optional and is not set up.)

---

## M2 — Auth & profiles

Goal: a parent can sign in and manage child profiles.

- [ ] Add Auth.js tables to the Drizzle schema (`User`, `Account`, `Session`,
      `VerificationToken`) + app tables (`Child`, etc.) from [`06`](06-data-model.md); migrate.
- [ ] `lib/auth/` — Auth.js config with the Drizzle adapter; pick a provider (email magic
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

`@anthropic-ai/sdk`, `next-auth` + `@auth/drizzle-adapter`, `drizzle-orm` +
`@neondatabase/serverless` + `drizzle-kit`,
`zod` (quiz schemas + structured output), `tailwindcss`. Optional: `@storybook/nextjs`,
a charting lib for the observability dashboard.
