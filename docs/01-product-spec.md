# 01 — Product Spec

## Vision

A child is naturally curious. Curio turns "why is the sky blue?" into a guided,
rewarding learning session: a clear explanation at exactly the right reading level, a
quick check that they understood it, points and a badge for their effort, and an
invitation to explore the next interesting thing. The child is always in the driver's
seat.

## Design principles

1. **Fun first.** If it isn't delightful, a kid won't come back. Gamification, warmth,
   and momentum are features, not decoration.
2. **Right-sized content.** A 6-year-old and an 11-year-old asking about volcanoes get
   genuinely different explanations — same curiosity, different words.
3. **Understanding over consumption.** Reading is rewarded, but *demonstrated
   understanding* (quiz performance) is rewarded more.
4. **Child agency.** The child chooses topics and steers depth. Curio suggests; it
   never rails them down a fixed track.
5. **Safe by construction.** Every input and output passes through guardrails. Parents
   and teachers should trust it by default.

## The core loop in detail

### 1. Calibrate (first session, then continuous)
A short mini-game presents 2–3 escalating reading passages, each with a one-tap
comprehension question. The result sets a starting **reading level** (see
[`04-reading-levels.md`](04-reading-levels.md)). It's framed as a game ("let's find
your reading superpower!"), never as a test.

### 2. Explore
The child either:
- types/says a topic ("sharks", "black holes", "ancient Egypt"), or
- taps a node on their **knowledge world map** — a dynamically generated, kid-interest
  graph of related topics they can wander.

Topic suggestions are **dynamic and personalized** to what the child has shown
interest in. See [`05-gamification.md`](05-gamification.md).

### 3. Read
The LLM generates a kid-friendly explanation:
- calibrated to the child's current reading level,
- broken into short, visual chunks,
- ending naturally into the quiz.

### 4. Quiz
2–4 questions (multiple choice for younger, short answer for older) check
comprehension of *what was just read*. Questions are generated alongside the content so
they're always on-topic.

### 5. Reward
- **XP** for finishing the reading.
- **Bonus XP** for correct answers (the bigger reward — understanding > consumption).
- **Level-ups** unlock new map regions / avatar items.
- **Badges** for mastering a topic (consistent high quiz performance across visits).

### 6. Steer
After the quiz, the child picks where to go: deeper on this topic, a related branch, or
somewhere new. Quiz performance feeds the **difficulty adjustment**: struggled → ease
the next reading level; aced it → nudge it up.

## Out of scope (for now)

- Voice/read-aloud (strong future add for ages 5–7 — see roadmap).
- Multiplayer / social features.
- Parent/teacher dashboards (a fast follow once the core loop is solid).

## Success metrics

| Metric | Why it matters |
|---|---|
| Loop completion rate (read → quiz → steer) | Is the core experience working? |
| Return / streak rate | Is the gamification driving retention? |
| Quiz pass rate trending toward ~70–80% | Is difficulty well-calibrated (not too easy/hard)? |
| Reading-level appropriateness (eval) | Is content actually age-right? |
| Factual accuracy (eval) | Is the content trustworthy for kids? |
