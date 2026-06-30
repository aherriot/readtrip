# 07 — Evals, Safety & Observability

This is the doc that turns ReadTrip from "a cute app" into "evidence I can productionize
LLMs." Evals give you measurable results; safety is non-negotiable for a kids' product;
observability proves you can run it.

## Content safety guardrails (kids product — table stakes)

Two layers, both server-side:

### Input guardrails (before generation)

Every child-entered topic / answer passes a check:

- **Moderation / age-appropriateness** — reject or redirect topics that aren't suitable
  for children. A cheap `safety_precheck` call on Haiku
  ([`03-llm-integration.md`](03-llm-integration.md)) classifies the topic; obvious cases
  can be caught by a rules layer first.
- **Redirect, don't scold** — if a topic is off-limits, gently steer ("Let's explore
  something else cool!") rather than showing an error.

### Output guardrails (before content reaches the child)

- The lesson/quiz **system prompt** instructs strict age-appropriateness even when a
  topic edges toward something sensitive (war, death, anatomy) — explain at a kid level
  or decline gracefully.
- A lightweight **output check** scans generated text before display.
- **Topic-map suggestions are also LLM output** — filter them through the same
  age-appropriateness check before rendering, or the map could suggest something off.

> Log every safety decision (`LlmCallLog.safetyFlag`) so you can audit and tune.

## Hallucination control

Kids will believe what ReadTrip tells them, so factual accuracy matters more than usual.

- **MVP (LLM knowledge only):** rely on the model's parametric knowledge. For ReadTrip's
  evergreen, popular topics (dinosaurs, space, the body), this is genuinely reliable. The
  prompt instructs: "if unsure of a specific fact (a date, a number), keep it general and
  say so" rather than inventing.
- **Phase 2 (grounding — the standout feature):** for specific facts and citations,
  ground lessons in **Simple English Wikipedia** (a real wiki written for children and
  learners, available via the Wikimedia REST summary API). Fetch the topic summary, pass
  it as context, instruct the model to ground its explanation in it and cite it, and to
  say so if the topic isn't covered. This is **RAG-lite** — no vector DB needed.
- **Measure the improvement.** Run the same eval set with and without grounding and
  report the delta. "Grounding in Simple English Wikipedia cut factual errors by X%" is
  the single best line for your portfolio.

## Evals — the differentiator

Build a small, versioned eval harness (`lib/evals/`) with a fixed dataset of topics ×
reading levels. Run it on every prompt/model change.

| Eval                         | What it measures                                                                | How to score                                                    |
| ---------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **Reading-level match**      | Does L2 content actually read at a ~2nd-grade level?                            | Automated readability metric (e.g. Flesch-Kincaid) + LLM judge  |
| **Factual accuracy**         | Is the content correct?                                                         | LLM judge (Opus 4.8) against the grounding source / known facts |
| **Quiz quality**             | Are questions answerable from the lesson, unambiguous, with one correct answer? | LLM judge + schema/structural checks                            |
| **Safety**                   | Does sensitive-topic input produce safe output?                                 | Curated red-team topic set; assert safe handling                |
| **Grounding lift** (phase 2) | Accuracy with vs. without Simple Wikipedia                                      | Run the accuracy eval both ways; report the delta               |

Notes:

- The **judge model must be at least as capable** as the model it judges — use Opus 4.8
  as the judge for Sonnet-generated content.
- Keep the dataset and prompts versioned so results are comparable over time and you can
  A/B prompt versions.
- Combine LLM-judge scores with rule-based checks (schema validity, readability numbers)
  — don't rely on the judge alone.

## Observability

Log **every** LLM call to `LlmCallLog` ([`06-data-model.md`](06-data-model.md)):
model, task, token counts (incl. cache read/create), latency, computed cost, safety flag.

From that, a simple dashboard shows:

- **Cost per loop** and per child per day (proves the routing/caching is working).
- **Cache hit rate** (`cacheReadTokens / total input`) — should be high on popular topics.
- **p50/p95 latency** per task and per model.
- **Model mix** — how often each model is used; how often escalation fires.
- **Safety flag rate** — trend of redirected/blocked content.

This is the "I can run this in production, not just build a demo" evidence.

## Suggested headline results to produce

When the project is done, aim to be able to say:

- "Generated content matched its target reading level ~90% of the time (measured)."
- "Grounding in Simple English Wikipedia reduced factual errors by ~X%."
- "Model routing + prompt caching brought average cost per loop to ~$Y."
- "Safety guardrails handled 100% of a red-team topic set appropriately."
