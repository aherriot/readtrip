# 06 — Data Model

Illustrative Prisma-style schema. The shape matters more than exact types.

```prisma
// --- Auth.js (NextAuth) Prisma adapter models ---
// A `User` is a PARENT account — the only kind of auth user. Children are
// sub-profiles, not auth users (see Child below).
model User {
  id            String    @id @default(cuid())
  email         String?   @unique
  emailVerified DateTime?
  name          String?
  image         String?
  accounts      Account[]
  sessions      Session[]
  children      Child[]
  createdAt     DateTime  @default(now())
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Child {
  id            String   @id @default(cuid())
  parentId      String   // → User.id (the parent account)
  parent        User     @relation(fields: [parentId], references: [id])
  displayName   String
  avatarConfig  Json     // cosmetic items unlocked / equipped

  // Progression
  readingLevel  Int      @default(3)   // 1..5, see 04-reading-levels.md
  xp            Int      @default(0)
  level         Int      @default(1)

  // Adaptation: rolling quiz history used to move readingLevel
  recentQuizScores Json  // e.g. [{ level, pct, at }]

  topics        TopicProgress[]
  badges        Badge[]
  mapNodes      MapNode[]
  sessions      LearningSession[]
  createdAt     DateTime @default(now())
}

model TopicProgress {
  id           String   @id @default(cuid())
  childId      String
  child        Child    @relation(fields: [childId], references: [id])
  topicSlug    String   // normalized topic key
  title        String
  visits       Int      @default(0)
  bestQuizPct  Float    @default(0)
  mastered     Boolean  @default(false)
  lastVisited  DateTime @default(now())

  @@unique([childId, topicSlug])
}

model Badge {
  id         String   @id @default(cuid())
  childId    String
  child      Child    @relation(fields: [childId], references: [id])
  topicSlug  String   // badges are dynamic, tied to explored topics
  title      String
  earnedAt   DateTime @default(now())

  @@unique([childId, topicSlug])
}

model MapNode {
  id          String   @id @default(cuid())
  childId     String
  child       Child    @relation(fields: [childId], references: [id])
  topicSlug   String
  title       String
  status      String   // "suggested" | "explored" | "mastered"
  neighbors   Json     // adjacent topic slugs (the personalized graph edges)

  @@unique([childId, topicSlug])
}

// Learning session (renamed from "Session" to avoid clashing with Auth.js's Session)
model LearningSession {
  id          String   @id @default(cuid())
  childId     String
  child       Child    @relation(fields: [childId], references: [id])
  startedAt   DateTime @default(now())
  loops       Loop[]   // each explore→read→quiz→steer cycle
}

model Loop {
  id            String          @id @default(cuid())
  sessionId     String
  session       LearningSession @relation(fields: [sessionId], references: [id])
  topicSlug     String
  readingLevel  Int
  lessonText    String   @db.Text
  quizJson      Json
  quizPct       Float?
  xpAwarded     Int      @default(0)
  createdAt     DateTime @default(now())
}

// Observability: one row per LLM call (see 07-evals-and-safety.md)
model LlmCallLog {
  id                 String   @id @default(cuid())
  childId            String?
  task               String   // "lesson" | "quiz_generate" | ...
  model              String
  inputTokens        Int
  outputTokens       Int
  cacheReadTokens    Int      @default(0)
  cacheCreateTokens  Int      @default(0)
  latencyMs          Int
  costUsd            Float
  safetyFlag         String?  // null if clean
  createdAt          DateTime @default(now())
}
```

## Notes

- **`User` is the parent / auth account.** Auth.js (NextAuth) owns `User`, `Account`,
  `Session`, and `VerificationToken` via its Prisma adapter. **Children are not auth
  users** — they're `Child` rows under a `User`, selected after the parent signs in. This
  keeps auth simple (few users, low/no cost) and all child data in our own Postgres.
- **`topicSlug`** is a normalized key (lowercased, deduped) so "Sharks", "sharks", and
  "shark" collapse to one topic for progress/badges. Normalize on the server.
- **`recentQuizScores`** drives the difficulty adaptation in
  [`04-reading-levels.md`](04-reading-levels.md). A small rolling window (last ~5) is
  enough.
- **`MapNode.neighbors`** stores the personalized topic graph so the world map persists
  and grows across sessions.
- **`LlmCallLog`** is the backbone of the observability dashboard — never skip logging a
  call. `costUsd` is computed from token counts × the model's per-MTok price.
