# 03 — LLM Integration (models, pricing, routing, caching)

All generation runs on the **Claude API** via `@anthropic-ai/sdk`, server-side. This is
the heart of the "productionize LLMs" story: the right model for each task, prompt
caching for popular topics, and measurable cost control.

> Pricing and model IDs below were current as of **2026-06** (verified against the
> Anthropic model catalog). Re-check the catalog before launch — IDs and prices change.

## Models we use

| Model | Model ID | Context | Input $/MTok | Output $/MTok | Role in Curio |
|---|---|---|---|---|---|
| Claude Haiku 4.5 | `claude-haiku-4-5` | 200K | $1.00 | $5.00 | Fast/cheap path: calibration scoring, simple quizzes, classification, safety pre-checks |
| Claude Sonnet 4.6 | `claude-sonnet-4-6` | 1M | $3.00 | $15.00 | **Default content engine**: lesson generation, quiz generation, topic-map branches |
| Claude Opus 4.8 | `claude-opus-4-8` | 1M | $5.00 | $25.00 | Escalation path: hard/niche topics, low-confidence retries, the LLM-judge in evals |

> Use the **exact** ID strings above — do not append date suffixes. The default model in
> the Anthropic SDK guidance is Opus 4.8; we deliberately route *down* to Sonnet/Haiku
> for cost on this high-volume, kid-facing workload, and *up* to Opus only where it pays
> off. That cost/quality routing is a stated product goal, not a silent downgrade.

## Model routing

Routing is the single biggest cost lever. Each task type has a default model and an
escalation rule.

```ts
// lib/llm/router.ts  (illustrative)
type Task =
  | "calibrate_score"
  | "lesson"
  | "quiz_generate"
  | "quiz_grade_freeform"
  | "topic_map"
  | "safety_precheck"
  | "eval_judge";

export function pickModel(task: Task, opts?: { hard?: boolean }) {
  switch (task) {
    case "safety_precheck":
    case "calibrate_score":
    case "quiz_grade_freeform":
      return "claude-haiku-4-5";       // cheap, fast, low-stakes-per-call
    case "lesson":
    case "quiz_generate":
    case "topic_map":
      return opts?.hard ? "claude-opus-4-8" : "claude-sonnet-4-6";
    case "eval_judge":
      return "claude-opus-4-8";        // judge should be >= the model being judged
  }
}
```

**Escalation signals** (route a `lesson`/`quiz` from Sonnet → Opus):
- The topic is niche/technical or the child asked a precise factual question.
- A grounded lesson (see [`07`](07-evals-and-safety.md)) had low retrieval coverage.
- A self-check/eval flagged the Sonnet output as low quality, so we retry on Opus.

**Why Haiku for grading and calibration:** these are high-frequency, individually
low-stakes classification calls. Haiku is fast (good UX) and ~3–5× cheaper than Sonnet.

## Thinking / effort

On Claude 4.6+ models, thinking is **adaptive** — set `thinking: { type: "adaptive" }`
(never `budget_tokens`, which 400s on these models). Use `output_config.effort`:

- `low` / `medium` for lesson + quiz generation (latency matters for kids; the task is
  well-scoped).
- `high` only for the eval judge and hard-topic escalations.

```ts
const res = await client.messages.create({
  model,
  max_tokens: 2000,
  thinking: { type: "adaptive" },
  output_config: { effort: "low" },
  system,            // stable, cached — see below
  messages,
});
```

## Prompt caching — the cost multiplier for popular topics

Kids hammer the same topics (dinosaurs, space, sharks). Prompt caching turns that
repetition into savings: **cache reads cost ~0.1×** input price; the first write costs
~1.25× (5-minute TTL).

**The invariant:** caching is a *prefix match*. Keep stable content first, volatile
content last.

```
[ system: role + safety rules + format spec ]  ← STABLE, mark cache_control here
[ messages: topic + reading level + history ]  ← VOLATILE, after the breakpoint
```

```ts
const res = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 2000,
  system: [{
    type: "text",
    text: STABLE_SYSTEM_PROMPT,        // identical bytes every request
    cache_control: { type: "ephemeral" },
  }],
  messages: [{ role: "user", content: `Topic: ${topic}\nReadingLevel: ${level}` }],
});
```

Rules to honor (or the cache silently misses):
- **No timestamps, UUIDs, or per-request IDs in the system prompt.** They invalidate the
  prefix every call.
- **Minimum cacheable prefix is model-dependent:** ~2048 tokens on Sonnet 4.6, ~4096 on
  Haiku 4.5. A short system prompt below that threshold simply won't cache.
- **Verify** with `response.usage.cache_read_input_tokens` — if it's 0 across repeated
  requests, something is invalidating the prefix.

**Optional pre-warming:** at the start of a high-traffic window, fire a `max_tokens: 0`
request to write the cache for the shared system prefix so the first real lesson is fast.

## Structured output for quizzes

Quizzes must be machine-parseable. Use structured outputs (`output_config.format` with a
JSON schema, or `messages.parse()` with a Zod schema) — **not** assistant prefills,
which 400 on current models.

```ts
const QuizSchema = z.object({
  questions: z.array(z.object({
    prompt: z.string(),
    choices: z.array(z.string()).min(2).max(4),
    correctIndex: z.number().int(),
    explanation: z.string(),
  })).min(2).max(4),
});

const res = await client.messages.parse({
  model: pickModel("quiz_generate"),
  max_tokens: 1500,
  output_config: { format: zodOutputFormat(QuizSchema) },
  messages: [{ role: "user", content: quizUserPrompt(lessonText, level) }],
});
const quiz = res.parsed_output;   // typed, validated
```

## Streaming

Lessons stream to the child (`client.messages.stream(...)` → relay over SSE) so text
appears immediately rather than after a multi-second pause. Use `.finalMessage()` server-
side to capture the full text + usage for logging and to feed quiz generation.

## Prompt files

Keep prompts versioned in `lib/llm/prompts/` so changes are reviewable and so the eval
harness can A/B prompt versions. Each lesson/quiz prompt takes the child's reading level
as a parameter and instructs:
- target reading level (with concrete guidance, e.g. sentence length, vocabulary),
- short chunks, concrete examples, a warm encouraging voice,
- no scary/inappropriate content even if the topic edges toward it,
- "if you're not sure of a specific fact, keep it general and say so" (hallucination guard).

## Cost sketch (illustrative)

A typical lesson turn ≈ ~1.5K input + ~0.8K output tokens on Sonnet 4.6:
- Uncached: ~$0.0045 + ~$0.012 ≈ **~$0.017 / lesson**.
- With the system prefix cached (read at 0.1×) and popular-topic reuse, the input cost
  drops substantially. Quiz grading on Haiku is fractions of a cent.

These are back-of-envelope; the **observability dashboard** ([`07`](07-evals-and-safety.md))
reports real per-loop cost from logged `usage`.
