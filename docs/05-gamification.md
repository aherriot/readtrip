# 05 — Gamification

Fun is the retention engine. ReadTrip's reward system combines **points + levels**, an
**explorable world map of knowledge**, and **badges for mastering topics** — with the
topics themselves driven by the child's own interests.

## 1. Points + levels (XP)

- **Read XP** — awarded for finishing a lesson. Small, guaranteed reward for engaging.
- **Quiz XP** — awarded per correct answer. The *bigger* reward: understanding beats
  consumption (a core principle, [`01-product-spec.md`](01-product-spec.md)).
- **Level** — derived from cumulative XP. Leveling up triggers a celebration and unlocks
  new map regions and/or avatar customizations.

Keep the curve gentle early (fast first level-ups hook new users) and stretch it later.

## 2. The world map of knowledge

The signature mechanic. Instead of a flat search box, the child explores a **map of
connected topics** — wander from "volcanoes" to "earthquakes" to "tectonic plates" to
"continents."

- Nodes the child has explored are **lit up / colored**; mastered nodes get a badge icon.
- Unexplored neighbors appear as **dimmed nodes** inviting a tap.
- New regions of the map unlock as the child levels up, creating a sense of a growing
  world to discover.

### Dynamic, interest-driven topics
The map is **generated and personalized** by the LLM (`topic_map` task,
[`03-llm-integration.md`](03-llm-integration.md)). Given the child's explored topics and
interests, it proposes engaging, age-appropriate neighboring topics. So a dinosaur-loving
kid's map grows toward fossils, extinction, and deep time; a space-loving kid's grows
toward planets, rockets, and stars. The world literally shapes itself around what the
child loves.

> Topic-map generation must pass the same **safety guardrails** as everything else —
> suggested topics are LLM output and could drift; filter before display.

## 3. Badges for mastering topics

A badge is awarded when the child demonstrates **mastery** of a topic — not just visiting
it, but consistently answering its quizzes well (e.g. high pass rate across 2+ visits, or
passing a slightly harder "mastery" quiz).

- Badges are **dynamic**, tied to whatever topics the child actually explores — there's
  no fixed badge list, because there's no fixed topic list.
- Badges live on the map node and in a collectible "trophy room," giving a tangible sense
  of progress and a reason to revisit topics.

## 4. Streaks & daily goals (recommended fast follow)

A "come back tomorrow" streak and a small daily goal ("explore 1 new topic") are strong,
low-cost retention drivers. Not required for MVP, but cheap to add and high-impact — flag
for the roadmap.

## Anti-patterns to avoid

- **Don't reward speed-clicking.** Read XP should require actually spending time on the
  content; quiz XP guards against blind guessing (e.g. no XP for random multiple-choice
  spam).
- **Don't punish.** No XP loss, no "you failed." Struggling quietly lowers difficulty
  (handled in [`04-reading-levels.md`](04-reading-levels.md)); it never costs rewards.
- **Don't gate learning behind grinding.** Currency/unlocks are cosmetic (avatar, map
  themes) — never paywall or grind-wall the actual content.

## Data

XP, level, badges, and the per-child map state are persisted — see
[`06-data-model.md`](06-data-model.md).
