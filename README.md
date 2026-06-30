# ReadTrip — a curiosity engine for kids

ReadTrip is a web app that lets a child dive into any topic they're curious about. It
serves **engaging, age-appropriate explanations**, checks understanding with
**quizzes**, lets the child **steer where to explore next**, and wraps the whole
loop in **gamification** (points, levels, a world map of knowledge, and badges for
mastering topics).

It is built as a portfolio project to demonstrate the skills needed to
**productionize LLMs for real customers**: adaptive content generation, reading-level
calibration, evals, cost/latency control via model routing, prompt caching, and
content-safety guardrails — all the unglamorous parts that separate "I called an API"
from "I shipped an LLM product."

## The core loop

```
Calibrate → Explore → Read → Quiz → Reward → Steer → (back to Explore)
   ↑ once         ↑ adaptive difficulty           ↑ child picks next topic
```

1. **Calibrate** — a short, fun mini-game estimates the child's reading level (one time, then continuously refined).
2. **Explore** — the child names a topic, or picks from a dynamically generated map of branches.
3. **Read** — the LLM produces a kid-friendly explanation at the child's level.
4. **Quiz** — 2–4 questions check comprehension.
5. **Reward** — points + XP for reading and correct answers; badges for topic mastery.
6. **Steer** — the child chooses where to go next; difficulty adapts from quiz results.

## Audience

Wide and adaptive: **ages ~5–12**. The same product spans early readers and tweens by
adapting reading level rather than shipping separate apps. See
[`docs/04-reading-levels.md`](docs/04-reading-levels.md).

## Stack

Next.js (App Router) + TypeScript, with the Claude API for all generation. See
[`docs/02-architecture.md`](docs/02-architecture.md).

## Documentation

| Doc                                                                | What's in it                                                |
| ------------------------------------------------------------------ | ----------------------------------------------------------- |
| [`docs/01-product-spec.md`](docs/01-product-spec.md)               | Vision, principles, the core loop in detail                 |
| [`docs/02-architecture.md`](docs/02-architecture.md)               | Next.js structure, data flow, request lifecycle             |
| [`docs/03-llm-integration.md`](docs/03-llm-integration.md)         | Models, pricing, **model routing**, prompt caching, prompts |
| [`docs/04-reading-levels.md`](docs/04-reading-levels.md)           | Calibration mini-game + ongoing adaptation                  |
| [`docs/05-gamification.md`](docs/05-gamification.md)               | Points, levels, the knowledge world map, badges             |
| [`docs/06-data-model.md`](docs/06-data-model.md)                   | Database schema                                             |
| [`docs/07-evals-and-safety.md`](docs/07-evals-and-safety.md)       | Evals, guardrails, observability — the differentiators      |
| [`docs/08-roadmap.md`](docs/08-roadmap.md)                         | Phased build plan (MVP → grounding → polish)                |
| [`docs/09-implementation-plan.md`](docs/09-implementation-plan.md) | Milestone-by-milestone engineering checklist (M0–M6)        |
| [`docs/10-design-system.md`](docs/10-design-system.md)             | Kid-friendly, accessible design system + component library  |

## Why this is a strong portfolio piece

- **Adaptive difficulty** is a real systems problem (calibration + online adjustment), not a prompt trick.
- **Content safety for children** is a concrete, demonstrable production concern.
- **Model routing + prompt caching** show you can control cost and latency, not just call an API.
- **Evals** (reading-level accuracy, quiz quality, factual grounding) give you measurable, interview-ready results.
