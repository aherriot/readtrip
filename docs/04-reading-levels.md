# 04 — Reading Levels (calibration + adaptation)

ReadTrip targets a wide age range (~3–14) with one adaptive product. The reading level is
the dial that makes that possible. It's set by a **calibration mini-game** and then
**continuously refined** from quiz performance.

## The reading-level scale

Use a small, ordered set of internal levels rather than ages (a 7-year-old may read like
a 9-year-old). Seven tiers cover the range:

| Level | Rough band          | Style guidance fed to the LLM                                                    |
| ----- | ------------------- | -------------------------------------------------------------------------------- |
| L1    | Toddler (~3–4)      | A handful of words per sentence, only the most basic everyday vocabulary         |
| L2    | Early reader (~5)   | Very short sentences, common words, lots of concrete imagery, one idea at a time |
| L3    | Emerging (~6–7)     | Short sentences, simple connectives, gentle new vocabulary with context          |
| L4    | Developing (~8–9)   | Multi-sentence ideas, some domain words defined inline, simple cause/effect      |
| L5    | Fluent (~10)        | Paragraphs, richer vocabulary, comparisons and analogies                         |
| L6    | Advanced (~11–12)   | Nuance, multiple linked ideas, light abstraction, precise terms                  |
| L7    | Early teen (~13–14) | Complex sentences, abstract/academic vocabulary, more nuanced or mature topics   |

The level is a parameter in every lesson/quiz prompt, **and** in the topic-map suggestion
prompt — higher levels are offered more complex or mature (but still wholesome) topics, not
just harder wording of the same ones. The _content_ adapts; a topic itself doesn't dumb
down at the low end — a volcano is a volcano at every level.

## Calibration mini-game (first session)

Framed as "find your reading superpower," never as a test.

1. Show a short passage at a guessed starting level (default L4, the midpoint).
2. Ask **one** one-tap comprehension question about it.
3. Adjust up or down and show up to three more passages.
4. Land on a starting level after 3–4 passages.

It's a lightweight **binary-search**: correct + quick → step up; wrong or slow → step
down. 3–4 rounds is enough for a confident _starting_ point; the rest is handled by
ongoing adaptation.

```
start at L4
  pass → try L5
    pass → try L6
      pass → start at L6 (cap step at 1 to avoid overshoot)
      fail → start at L5
    fail → start at L4
  fail → try L3
    pass → start at L3
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

## Measurable results

Reading-level adaptation is a real **calibration + online-adaptation** problem that can be
measured precisely. Score generated content with an automated readability metric and/or an
LLM judge (see [`07-evals-and-safety.md`](07-evals-and-safety.md)): "Generated L2 content
scores at a 2nd-grade reading level 90% of the time" is a concrete, verifiable claim about
product quality.
