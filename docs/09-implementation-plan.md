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

- [x] Add Auth.js tables to the Drizzle schema (`User`, `Account`, `Session`,
      `VerificationToken`) + app tables (`Child`, etc.) from [`06`](06-data-model.md); migrate.
      (Full data model landed in one migration; `Account`/`Session`/`VerificationToken`
      follow the `@auth/drizzle-adapter` canonical shape.)
- [x] `lib/auth/` — Auth.js (v5) config with the Drizzle adapter. Provider: **email magic
      link** (Resend) — dev logs the link to the server console; prod sends via Resend
      (`AUTH_RESEND_KEY` required, else sign-in throws rather than faking success).
      A **dev-only Credentials** provider (gated to non-prod) enables local demo + e2e.
      Edge-safe split config (`config.ts`) drives middleware; full config (`index.ts`) adds
      the adapter + providers. JWT session strategy (required by Credentials + edge auth).
- [x] `app/api/auth/[...nextauth]/route.ts`.
- [x] `app/(auth)/sign-in` — parent sign-in (magic link + dev form) from design-system
      components; `+ /sign-in/check-email` verify-request page.
- [x] `app/(parent)/profiles` — create / pick / edit / delete **child profiles** (the
      parent owns them; children are not auth users). Selecting a child sets an httpOnly
      cookie and enters the child app.
- [x] Route protection: `middleware.ts` requires an authed parent for `/profiles` + `/play`,
      and a selected-child cookie for `/play`.

**DoD:** a parent signs in, creates a child profile, and lands in the (empty) child app.
✅ Met — verified end-to-end in `e2e/auth.spec.ts` (route-protection + full happy path);
`npm run check`, the Playwright e2e suite, and `next build` are green. (`app/(child)/play`
is the empty child landing.)

---

## M3 — LLM service layer

Goal: the server-side LLM plumbing, independent of UI, so feature pages just call it.

- [x] `lib/llm/client.ts` — Anthropic client singleton. Its `callModel` wrapper is the one
      path every generation goes through: it attaches adaptive thinking + `effort` only on
      models that support them (Haiku 4.5 would 400 on `effort`), reads token usage off the
      response, and writes the `LlmCallLog` row.
- [x] `lib/llm/router.ts` — model routing per task (Haiku/Sonnet/Opus) from
      [`03`](03-llm-integration.md), plus `pickEffort`. IDs + capabilities + pricing live in
      `lib/llm/models.ts`.
- [x] `lib/llm/cache.ts` — `cachedSystem` marks the stable system prefix `cache_control`;
      the volatile topic/reading-level goes in the user message, after the breakpoint.
- [x] `lib/llm/prompts/` — versioned lesson, quiz, topic-map, and normalize prompts (each
      with a `*_PROMPT_VERSION`); reading level is a parameter injected into the volatile
      user message (`readingLevel.ts`) so the cached system prefix stays byte-stable.
- [x] `lib/llm/normalize.ts` — `normalize_topic` (Haiku): free-form input (topic noun
      **or** question like "Why is the sky blue?") → `{ title, topicSlug, intent }`, so
      question phrasings dedupe to a stable concept ([`03`](03-llm-integration.md),
      [`06`](06-data-model.md)). Pure `slug.ts` fallback keeps progression working on a
      malformed model response.
- [x] `lib/safety/` — input precheck (pure rules layer → Haiku classifier) + output check,
      used by every generation path; blocks redirect gently rather than scolding.
- [x] `LlmCallLog` writes on every call (model, tokens, cache read/create, latency, cost).
      Quiz validity is enforced with a Zod schema (Sonnet 4.6 isn't in the structured-output
      model set), with a one-shot Opus retry on invalid output.

**DoD:** a script can generate a level-appropriate lesson + a schema-valid quiz, with the
call logged and the system prefix caching (verify `cache_read_input_tokens > 0` on repeat).
✅ Met — `npm run llm:verify -- "why is the sky blue?" 2` runs the full
safety → normalize → lesson → quiz pipeline against the live API, prints the schema-valid
quiz and the logged `LlmCallLog` rows, and confirms `cache_read_input_tokens > 0` on the
repeat lesson call. `npm run check` (typecheck/lint/prettier/design-system + 51 unit tests)
is green.

---

## M4 — The core loop (LLM-only MVP)

Goal: the playable Explore → Read → Quiz → Reward → Steer loop. This is the MVP.

- [x] **Calibration mini-game** + `/api/calibrate` → sets starting reading level
      ([`04`](04-reading-levels.md)). Pre-generate/cache passages per level.
      (Hand-authored passages cached per level in `lib/calibration/passages.ts` — no
      LLM call at calibration time; a pure binary-search engine (`engine.ts`) shows 2–3
      passages and lands on a starting level; the stateless `/api/calibrate` grades
      answers server-side against the hidden key and persists `Child.readingLevel` +
      `calibratedAt`. First entry to `/play` routes new children through
      `/play/calibrate`.)
- [x] **Explore** — free-form entry (type/say a topic noun **or** a question like "Why is
      the sky blue?"); `/api/explore` runs `safety_precheck` → `normalize_topic` →
      `{ title, topicSlug, intent }`, persisting `rawQuery` + `intent` on the `Loop`.
      Tapping a map node skips straight to a known slug.
      (The `/play` home is now the Explore screen: a free-form `Input` plus curated
      `SUGGESTED_TOPICS` chips — each a known concept that resolves client-side without a
      model call, the same shortcut a map node uses. `/api/explore` runs the
      safety → normalize pipeline and returns `{ title, topicSlug, intent }` (or a gentle
      redirect on a blocked topic). Persisting the resolved topic onto a `Loop` is deferred
      to the lesson step, which owns the NOT-NULL `lessonText` — the world map isn't built
      yet, so the map-node shortcut reuses the same curated-slug path.)
- [x] **Lesson** — `/api/lesson` (streamed) + `components/reading/ReadingView` +
      `LessonChunk` on the field-journal surface.
      (Resolving a topic opens `LessonReader`, which streams `/api/lesson` over
      SSE and renders each blank-line chunk as a `LessonChunk` inside a paper
      `ReadingView`. The route reads the child's reading level server-side (never
      trusted from the client) and re-runs `safety_precheck` as defense in depth
      — a curated suggestion skips `/api/explore`, and the body is client-supplied.
      The service layer gains `streamLesson`/`streamModel` (real token streaming,
      still logging usage). When no Anthropic key is configured — or
      `READTRIP_OFFLINE_LLM=1`, which e2e sets — generation falls back to a
      deterministic canned lesson and safety runs rules-only, so the loop is
      exercisable end-to-end without the API. Persisting the resolved topic +
      lesson onto a `Loop` is deferred to the quiz step: `Loop` requires both
      `lessonText` AND `quizJson` NOT NULL, so it's written once, valid, when the
      quiz exists.)
- [x] **Quiz** — `/api/quiz` (structured output) + `QuizChoice`/`QuizCard` with
      icon+text+color feedback.
      (After the lesson, "Start the quiz" opens `QuizRunner`, which POSTs the
      lesson text to `/api/quiz`. The route reads the child's reading level
      server-side, calls `generateQuiz` (Zod-validated, Sonnet→Opus retry; a
      deterministic canned quiz when `READTRIP_OFFLINE_LLM`/no key, as e2e uses),
      and — because this is the first step where `lessonText` AND `quizJson` both
      exist — finally persists the `Loop` via `lib/loops/queries.ts` (a DB failure
      warns but still returns the quiz). `QuizCard` is unfailable: a wrong tap says
      "↻ Try again" and lets the child retry; the correct tap reveals the
      explanation. Grading is client-side (`scoreQuiz`) off the first tap per
      question. `Loop.quizPct`, XP/levels/badges, and Steer follow-ups are deferred
      to the next items.)
- [x] **Steer** — post-quiz topic choices; difficulty adjusts from rolling quiz scores. A
      **"go deeper" follow-up** spawns a new `Loop` with `parentLoopId` set, passing the
      parent topic as context to `normalize_topic` + lesson (threaded loops, not chat).
      (Finishing the quiz opens a Steer result screen offering "Go deeper on {topic}" —
      a follow-up question threaded through `/api/explore` + `/api/lesson` (`parentContext`)
      and persisted with `parentLoopId` at the quiz step — or "Explore something new".
      `/api/steer` re-grades the child's first-try answers against the stored `quizJson`
      (so the signal can't be spoofed), writes `Loop.quizPct`, and adapts `Child.readingLevel`
      from a rolling window of same-level scores (`lib/reading/adapt.ts`, docs/04): a
      consistent ~85%+ steps up, ~50%- steps down, at most one level and never yo-yoing. A
      step _up_ shows a quiet "leveling up!" note; a step down stays silent. XP/levels/badges
      remain the separate Progress item; related-branch suggestions land with the World map.)
- [x] **Progress** — `/api/progress`: award XP, level-ups, mastery → badges.
      (On quiz finish the client calls `/api/progress` alongside `/api/steer`; it re-grades
      the child's first-try answers against the stored `quizJson` (XP can't be spoofed), then
      awards XP — a read reward plus a per-correct-answer bonus (`lib/gamification/xp.ts`) —
      recomputes `Child.level` from cumulative XP on a gentle-early curve, upserts
      `TopicProgress` (visits, best score, mastery), and mints a one-per-topic mastery `Badge`
      the first time a topic clears `MASTERY_PCT` across `MASTERY_MIN_VISITS` visits
      (`lib/gamification/mastery.ts`). The award is idempotent per loop via `Loop.xpAwarded`,
      so a client retry can't double-count. The Steer result screen surfaces XP earned, any
      level-up, and a new badge as plain text; the animated `XPBar`/`RewardBurst`/
      `LevelUpCelebration` and the world map remain their own M4 items.)
- [x] **World map** — `WorldMap` + `TopicNode` (the signature element) with dynamic,
      interest-driven suggestions ([`05`](05-gamification.md)); list-view fallback for SRs.
      (The `/play` home is now the child's personalized map. `components/game/TopicNode`
      is the signature node — a real `<button>` with locked/suggested/explored/mastered
      states, each an icon + word + color (never color-only), clearing the kid target
      floor; `components/game/WorldMap` renders the nodes as an ordered `<ul>`
      (explored first) that doubles as the screen-reader list view. `MapNode` rows persist
      per child (`lib/map/queries.ts`): the explored node is written at quiz time (so it's
      deterministic) and mastery is folded in from `TopicProgress` at read time. After a
      loop, `/api/map` refreshes interest-driven neighbours via the `topic_map` task
      (`lib/map/suggest.ts`, with a curated offline fallback so the map still grows without
      the API); a new explorer's map is seeded with curated starters. Alongside the map (which
      grows narrow and deep around interests) a separate "Something completely different"
      section (`freshStarters`) always offers a few unrelated evergreen starters not on the
      map — breadth as a counterweight to a filter bubble. Node/ordering/starter logic is
      unit-tested; the component a11y contract + a map-flow e2e cover the rest. Deeper
      topic-map safety wiring remains the separate Safety item.)
- [x] **Rewards** — `XPBar`, `ExpeditionStamp`, `RewardBurst`/`LevelUpCelebration`
      (reduced-motion safe).
      (The Steer result screen now pays out with the real reward components instead of
      plain text: `RewardBurst` pops the "+N XP" gain, `XPBar` fills toward the next level
      (a pure `levelProgress` over cumulative XP, unit-tested), `ExpeditionStamp` presses in
      a mastery badge, and a `leveledUp` result opens the focus-trapped `LevelUpCelebration`
      overlay (built on `Modal`). All motion is `motion-safe:` with `both`-fill keyframes, so
      the global reduced-motion floor leaves each on its final frame — a still, correct state
      with no JS opt-out. Reward keyframes live in `app/globals.css`; every component ships a
      gallery entry, an e2e a11y contract, and a design-system reference.)
- [x] **Safety** wired into lesson, quiz, **and** topic-map suggestions.
      (Input safety already gated Explore + the lesson topic; this closes the output side —
      the generated content, not just the request. The streamed **lesson** is output-scanned
      as it streams (`app/api/lesson`): an unsafe fragment is withheld before it's ever sent
      and the whole lesson is swapped for a gentle redirect. The **quiz** is scanned across
      every prompt/choice/explanation before it's shown or the `Loop` persisted
      (`checkQuizOutput`); a blocked quiz returns a redirect instead of an error, and no loop
      or map node is written for content we won't show. **Topic-map suggestions** — LLM output
      too (docs/07) — are run through `filterSafeTopics` in `lib/map/suggest.ts` before any
      node is saved. New pure helpers (`quizScanText`, `filterSafeTopics`) live in
      `lib/safety/rules.ts` and are unit-tested; the guardrails run rules-only offline so the
      loop stays exercisable in CI/e2e. Child-facing safety is now documented up front in the
      README.)

**DoD:** a child completes full loops end-to-end; difficulty adapts; XP/levels/badges and
the map update and persist; everything is keyboard-navigable and on-theme.
✅ Met — the Explore → Read → Quiz → Reward → Steer loop runs end-to-end (offline in
CI/e2e, live with a key); difficulty adapts from rolling quiz scores; XP/levels/badges and
the world map persist; rewards animate reduced-motion-safe; and every generation path is
guarded on input **and** output. `npm run check` and the Playwright e2e suites are green.

---

## M5 — Grounding + evals (the standout)

Goal: reduce hallucination with grounding and **measure** it.

- [ ] **Simple English Wikipedia** grounding for lessons (RAG-lite via Wikimedia REST
      summary API): cite sources, handle "not covered" ([`07`](07-evals-and-safety.md)).
- [ ] **Eval harness** in `lib/evals/`: versioned dataset (topics × reading levels);
      scorers for reading-level match, factual accuracy (Opus judge), quiz quality, safety.
- [ ] **Measure grounding lift**: run accuracy evals with vs. without grounding; record the
      delta to quantify the improvement.

**DoD:** `npm run eval` produces scores; the grounding before/after delta is documented.

---

## M6 — Observability & polish

Goal: prove it runs, then make it shine.

- [x] **Dashboard** off `LlmCallLog`: cost per loop, cache hit rate, p50/p95 latency,
      model mix, safety-flag rate.
      (Parent-only `/dashboard` (gated by `middleware.ts` like `/profiles`). Aggregation is
      a pure, unit-tested `computeMetrics` in `lib/observability/metrics.ts` — blended cost
      per completed loop, cache-hit rate over input-side tokens, nearest-rank p50/p95
      latency, per-model call/cost mix, and the safety-flag rate — fed by a parent-scoped
      `getDashboardMetrics` query (`lib/observability/queries.ts`) that only counts a
      parent's own children's calls + loops. The page composes design-system primitives
      (stat cards + a labelled model-mix bar, never color-only) with an empty state before
      any activity; a header link reaches it from Profiles. Route protection + the empty
      path are covered by `e2e/dashboard.spec.ts`.)
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
