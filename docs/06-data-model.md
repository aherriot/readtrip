# 06 — Data Model

An abstract view of the entities and how they relate. The shape matters more than
exact column types — the real implementation lives in `lib/db/schema.ts` (Drizzle ORM)
and is the source of truth. Every table has a `cuid`-like string `id` and a `createdAt`
unless noted.

## At a glance

```
User (parent / auth account)
├── Account              (Auth.js OAuth links)
├── Session              (Auth.js login sessions)
└── Child                (sub-profile — NOT an auth user)
    ├── TopicProgress    (per-topic visits, best score, mastery)
    ├── Badge            (dynamic, one per explored topic)
    ├── MapNode          (the personalized world-map graph)
    └── LearningSession
        └── Loop         (one explore→read→quiz→steer cycle)
            └── Loop     (optional "go deeper" follow-up, via parentLoopId)

VerificationToken        (Auth.js, standalone)
LlmCallLog               (observability, one row per LLM call)
```

## Auth.js (NextAuth) tables

These follow the `@auth/drizzle-adapter` contract. A **`User` is a parent account** —
the only kind of auth user. Children are sub-profiles, not auth users.

**User** — the parent / auth account.

| Field           | Type      | Notes       |
| --------------- | --------- | ----------- |
| `id`            | string    | primary key |
| `email`         | string?   | unique      |
| `emailVerified` | datetime? |             |
| `name`          | string?   |             |
| `image`         | string?   |             |

**Account** — OAuth provider links for a user. Composite-unique on
`(provider, providerAccountId)`; `userId` → `User` (cascade delete). Holds the standard
adapter token columns (`access_token`, `refresh_token`, `expires_at`, `scope`, …).

**Session** — Auth.js login sessions. `sessionToken` (unique), `expires`, and
`userId` → `User` (cascade delete).

**VerificationToken** — email magic-link tokens. `identifier` + `token` (unique),
`expires`; composite primary key on `(identifier, token)`.

## App tables

**Child** — a child sub-profile owned by a parent. `parentId` → `User`.

| Field              | Type   | Notes                                                 |
| ------------------ | ------ | ----------------------------------------------------- |
| `parentId`         | string | → `User.id` (the parent account)                      |
| `displayName`      | string |                                                       |
| `avatarConfig`     | json   | cosmetic items unlocked / equipped                    |
| `readingLevel`     | int    | default `3`; `1..5`, see [`04`](04-reading-levels.md) |
| `xp`               | int    | default `0`                                           |
| `level`            | int    | default `1`                                           |
| `recentQuizScores` | json   | rolling history, e.g. `[{ level, pct, at }]`          |

**TopicProgress** — per-child, per-topic progress. Unique on `(childId, topicSlug)`.

| Field         | Type     | Notes                |
| ------------- | -------- | -------------------- |
| `childId`     | string   | → `Child.id`         |
| `topicSlug`   | string   | normalized topic key |
| `title`       | string   |                      |
| `visits`      | int      | default `0`          |
| `bestQuizPct` | float    | default `0`          |
| `mastered`    | bool     | default `false`      |
| `lastVisited` | datetime |                      |

**Badge** — dynamic badges, one per explored topic. Unique on `(childId, topicSlug)`.

| Field       | Type     | Notes        |
| ----------- | -------- | ------------ |
| `childId`   | string   | → `Child.id` |
| `topicSlug` | string   |              |
| `title`     | string   |              |
| `earnedAt`  | datetime |              |

**MapNode** — a node in the child's personalized world map. Unique on
`(childId, topicSlug)`.

| Field       | Type   | Notes                                           |
| ----------- | ------ | ----------------------------------------------- |
| `childId`   | string | → `Child.id`                                    |
| `topicSlug` | string |                                                 |
| `title`     | string |                                                 |
| `status`    | string | `"suggested"` \| `"explored"` \| `"mastered"`   |
| `neighbors` | json   | adjacent topic slugs (personalized graph edges) |

**LearningSession** — a play session for a child (named to avoid clashing with Auth.js's
`Session`). Fields: `childId` → `Child`, `startedAt`. Has many `Loop`s.

**Loop** — one explore→read→quiz→steer cycle within a session. A `Loop` may point at a
`parentLoopId` (self-reference) when the child drills into a previous loop with a
follow-up question, forming a "go deeper" chain without a separate chat model.

| Field          | Type    | Notes                                                      |
| -------------- | ------- | ---------------------------------------------------------- |
| `sessionId`    | string  | → `LearningSession.id`                                     |
| `parentLoopId` | string? | → `Loop.id`; set when this is a "go deeper" follow-up      |
| `rawQuery`     | string? | the child's original phrasing, e.g. "Why is the sky blue?" |
| `intent`       | string  | `"topic"` \| `"question"`, from `normalize_topic`          |
| `topicSlug`    | string  | normalized from `rawQuery` (see below)                     |
| `readingLevel` | int     |                                                            |
| `lessonText`   | text    |                                                            |
| `quizJson`     | json    |                                                            |
| `quizPct`      | float?  |                                                            |
| `xpAwarded`    | int     | default `0`                                                |

**LlmCallLog** — observability, one row per LLM call (see
[`07`](07-evals-and-safety.md)). `childId` is optional (→ `Child`, set null on delete).

| Field               | Type    | Notes                                |
| ------------------- | ------- | ------------------------------------ |
| `childId`           | string? | → `Child.id`                         |
| `task`              | string  | `"lesson"` \| `"quiz_generate"` \| … |
| `model`             | string  |                                      |
| `inputTokens`       | int     |                                      |
| `outputTokens`      | int     |                                      |
| `cacheReadTokens`   | int     | default `0`                          |
| `cacheCreateTokens` | int     | default `0`                          |
| `latencyMs`         | int     |                                      |
| `costUsd`           | float   | token counts × per-MTok price        |
| `safetyFlag`        | string? | null if clean                        |

## Notes

- **`User` is the parent / auth account.** Auth.js (NextAuth) owns `User`, `Account`,
  `Session`, and `VerificationToken` via the `@auth/drizzle-adapter`. **Children are not
  auth users** — they're `Child` rows under a `User`, selected after the parent signs in.
  This keeps auth simple (few users, low/no cost) and all child data in our own Postgres.
- **`topicSlug`** is a normalized key (lowercased, deduped) so "Sharks", "sharks", and
  "shark" collapse to one topic for progress/badges. Normalize on the server.
- **Free-form input is supported, including questions.** The child can type a topic noun
  _or_ a question ("Why is the sky blue?"). A server-side `normalize_topic` step (see
  [`03`](03-llm-integration.md)) resolves the raw input into `{ title, topicSlug }` so
  question phrasings dedupe to a stable concept. The raw phrasing is kept on
  `Loop.rawQuery`; only the normalized `topicSlug` drives progression, badges, and the map.
- **`recentQuizScores`** drives the difficulty adaptation in
  [`04-reading-levels.md`](04-reading-levels.md). A small rolling window (last ~5) is
  enough.
- **`MapNode.neighbors`** stores the personalized topic graph so the world map persists
  and grows across sessions.
- **Follow-ups are threaded loops, not chat.** When a child asks a follow-up ("but why
  does blue scatter more?"), it becomes a new `Loop` in the same `LearningSession` with
  `parentLoopId` set to the loop it drills into. This captures "go deeper" lineage while
  reusing the read→quiz→steer flow; each follow-up still runs `safety_precheck` →
  `normalize_topic`, so the safety surface is unchanged. `intent` distinguishes a
  question-shaped loop from a topic-shaped one for analytics and prompt shaping.
- **`LlmCallLog`** is the backbone of the observability dashboard — never skip logging a
  call. `costUsd` is computed from token counts × the model's per-MTok price.
