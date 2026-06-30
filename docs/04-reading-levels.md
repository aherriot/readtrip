# 04 — Reading Levels (calibration + adaptation)

ReadTrip targets a wide age range (~5–12) with one adaptive product. The reading level is
the dial that makes that possible. It's set by a **calibration mini-game** and then
**continuously refined** from quiz performance.

## The reading-level scale

Use a small, ordered set of internal levels rather than ages (a 7-year-old may read like
a 9-year-old). Five tiers cover the range:

| Level | Rough band | Style guidance fed to the LLM |
|---|---|---|
| L1 | Early reader (~5–6) | Very short sentences, common words, lots of concrete imagery, one idea at a time |
| L2 | Emerging (~6–7) | Short sentences, simple connectives, gentle new vocabulary with context |
| L3 | Developing (~8–9) | Multi-sentence ideas, some domain words defined inline, simple cause/effect |
| L4 | Fluent (~9–11) | Paragraphs, richer vocabulary, comparisons and analogies |
| L5 | Advanced (~11–13) | Nuance, multiple linked ideas, light abstraction, precise terms |

The level is a parameter in every lesson/quiz prompt. The *content* adapts; the topic
doesn't dumb down — a volcano is a volcano at every level.

## Calibration mini-game (first session)

Framed as "find your reading superpower," never as a test.

1. Show a short passage at a guessed starting level (default L2–L3).
2. Ask **one** one-tap comprehension question about it.
3. Adjust up or down and show a second (and optionally third) passage.
4. Land on a starting level after 2–3 passages.

It's a lightweight **binary-search**: correct + quick → step up; wrong or slow → step
down. 2–3 rounds is enough for a confident *starting* point; the rest is handled by
ongoing adaptation.

```
start at L3
  pass → try L4
    pass → start at L4 (cap step at 1 to avoid overshoot)
    fail → start at L3
  fail → try L2
    pass → start at L2
    fail → start at L1
```

Passages can be pre-generated and cached per level (they don't change per child), so
calibration is cheap and instant. Scoring a free-text answer, if used, runs on Haiku.

## Ongoing adaptation

Calibration sets the start; quiz results move the level over time. Keep it stable
(don't yo-yo on a single bad quiz):

- Track a rolling pass rate over the last N quizzes at the current level.
- **Aced consistently** (e.g. ≥ ~85% over 3 quizzes) → step up one level.
- **Struggling consistently** (e.g. ≤ ~50% over 3 quizzes) → step down one level.
- Otherwise hold. The sweet spot is ~70–80% pass rate — challenging but winnable.

Store the level and a short rolling history on the child profile
([`06-data-model.md`](06-data-model.md)). Never announce a "level down" to the child —
just adjust quietly. Level *ups* can be celebrated.

## Why this is a good portfolio detail

- It's a real **calibration + online-adaptation** problem, not a prompt trick.
- It produces a clean **eval**: does generated content actually match its target level?
  (Score with an automated readability metric and/or an LLM judge — see
  [`07-evals-and-safety.md`](07-evals-and-safety.md).) "Generated L2 content scored at a
  2nd-grade reading level 90% of the time" is an interview-ready result.
