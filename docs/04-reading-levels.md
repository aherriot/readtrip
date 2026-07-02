# 04 — Reading Levels (calibration + adaptation)

ReadTrip targets a wide age range (~5–12) with one adaptive product. The reading level is
the dial that makes that possible. It's set by a **calibration mini-game** and then
**continuously refined** from quiz performance.

## The reading-level scale

Use a small, ordered set of internal levels rather than ages (a 7-year-old may read like
a 9-year-old). Five tiers cover the range:

| Level | Rough band          | Style guidance fed to the LLM                                                    |
| ----- | ------------------- | -------------------------------------------------------------------------------- |
| L1    | Early reader (~5–6) | Very short sentences, common words, lots of concrete imagery, one idea at a time |
| L2    | Emerging (~6–7)     | Short sentences, simple connectives, gentle new vocabulary with context          |
| L3    | Developing (~8–9)   | Multi-sentence ideas, some domain words defined inline, simple cause/effect      |
| L4    | Fluent (~9–11)      | Paragraphs, richer vocabulary, comparisons and analogies                         |
| L5    | Advanced (~11–13)   | Nuance, multiple linked ideas, light abstraction, precise terms                  |

The level is a parameter in every lesson/quiz prompt. The _content_ adapts; the topic
doesn't dumb down — a volcano is a volcano at every level.

## Calibration mini-game (first session)

Framed as "find your reading superpower," never as a test.

1. Show a short passage at a guessed starting level (default L2–L3).
2. Ask **one** one-tap comprehension question about it.
3. Adjust up or down and show a second (and optionally third) passage.
4. Land on a starting level after 2–3 passages.

It's a lightweight **binary-search**: correct + quick → step up; wrong or slow → step
down. 2–3 rounds is enough for a confident _starting_ point; the rest is handled by
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

Calibration sets the start; quiz results then **suggest** where the level should go — but
they never change it on their own. The reading level is a parenting decision, so a
consistent trend only raises a _pending suggestion_ the parent approves on the Profiles
page. This keeps the level from shifting under the child after a handful of quizzes, and
gives the grown-up the final say. Keep the suggestion stable too (don't yo-yo on a single
bad quiz):

- Track a rolling pass rate over the last N quizzes at the current level.
- **Aced consistently** (e.g. ≥ ~85% over 3 quizzes) → suggest stepping up one level.
- **Struggling consistently** (e.g. ≤ ~50% over 3 quizzes) → suggest stepping down one level.
- Otherwise hold. The sweet spot is ~70–80% pass rate — challenging but winnable.

On the Profiles page the parent sees the suggestion and taps **accept** (which moves the
level) or **not yet**. "Not yet" dismisses the suggestion _and_ snoozes it: re-suggesting at
that level then takes a much longer sustained trend (a wider window than the normal one), so
a dismissal isn't undone by the next couple of quizzes. A parent can also **set the reading
level manually** on the child's edit form at any time. Nothing about a level change is ever surfaced to the child — an "up"
is only framed as a win to the _parent_, and a "down" stays quiet.

Store the level, the pending suggestion, and a short rolling history on the child profile
([`06-data-model.md`](06-data-model.md)).

## Why this is a good portfolio detail

- It's a real **calibration + online-adaptation** problem, not a prompt trick.
- It produces a clean **eval**: does generated content actually match its target level?
  (Score with an automated readability metric and/or an LLM judge — see
  [`07-evals-and-safety.md`](07-evals-and-safety.md).) "Generated L2 content scored at a
  2nd-grade reading level 90% of the time" is an interview-ready result.
