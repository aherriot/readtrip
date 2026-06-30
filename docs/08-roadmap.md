# 08 — Roadmap

Build in phases. Ship the core loop first; layer the production-engineering story on top.
The "start simple, then add grounding and measure it" arc is itself the narrative that
makes this a strong portfolio piece.

## Phase 0 — Skeleton (½–1 day)

- Next.js + TypeScript app, Postgres + Drizzle ORM, Anthropic SDK wired up server-side.
- Env/secrets handling; Anthropic key server-only.
- One end-to-end "hello": `/api/lesson` returns a streamed kid-friendly explanation.

## Phase 1 — Core loop, LLM-only (the MVP)

- **Calibration mini-game** → sets starting reading level
  ([`04`](04-reading-levels.md)).
- **Explore → Read → Quiz → Steer** loop with streamed lessons and structured-output
  quizzes ([`03`](03-llm-integration.md)).
- **Gamification v1:** XP for reading + correct answers, levels, a basic world map with
  dynamic topic suggestions, badges for topic mastery ([`05`](05-gamification.md)).
- **Difficulty adaptation** from rolling quiz scores.
- **Safety guardrails v1:** input precheck + output check + map-suggestion filter
  ([`07`](07-evals-and-safety.md)).
- **Model routing + prompt caching** in place from the start (Haiku/Sonnet/Opus).
- **Observability:** log every LLM call; a minimal cost/latency/cache dashboard.

At the end of Phase 1 you have a fully working, fun, safe product. This is shippable and
demoable on its own.

## Phase 2 — Grounding (the standout)

- Add **Simple English Wikipedia** grounding for lessons (RAG-lite via the Wikimedia
  REST summary API): cite sources, handle "not covered," reduce hallucination.
- Build the **eval harness** with a versioned dataset and an Opus-4.8 LLM judge.
- **Measure the lift:** run accuracy evals with and without grounding; record the delta.
  This produces the headline portfolio result.

## Phase 3 — Polish & retention

- **Streaks & daily goals** ([`05`](05-gamification.md)).
- Richer **avatar/world unlocks** spending XP.
- Animations and sound for level-ups, correct answers, badge unlocks (fun first).
- **Read-aloud / TTS** for early readers (ages 5–7) — opens the product to pre-readers.
- Performance: pre-warm caches for the top topics; tune effort levels.

## Phase 4 — Trust surfaces (fast follow)

- **Parent/teacher dashboard:** what the child explored, progress, time spent.
- Per-child content controls and topic allow/deny lists.
- Export of the knowledge map as a keepsake / progress report.

## Sequencing rationale

- **LLM-only first** because ReadTrip's topics are evergreen and popular, where parametric
  knowledge is reliable — grounding is a targeted upgrade, not a prerequisite.
- **Routing + caching + observability from day one** because retrofitting them is painful
  and they're cheap to include early — and they're the production-skills evidence.
- **Grounding + evals as Phase 2** because the measured before/after is the interview
  centerpiece, and it's far more compelling once the core loop already works.
