// ReadTrip data model. Source of truth for the schema; the illustrative version
// lives in docs/06-data-model.md. Auth.js (NextAuth) owns User/Account/Session/
// VerificationToken via @auth/drizzle-adapter — those four follow the adapter's
// canonical column shape. Everything else is app-owned.
import { relations } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

// Shared id column: cuid-like random string, matching the M0 Ping convention.
const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID());

const createdAt = () =>
  timestamp("createdAt", { precision: 3 }).defaultNow().notNull();

// Trivial table from M0 — kept so /api/health can prove a DB round-trip.
export const ping = pgTable("Ping", {
  id: id(),
  createdAt: createdAt(),
});

// --- Auth.js (NextAuth) adapter tables ---
// A `User` is a PARENT account — the only kind of auth user. Children are
// sub-profiles, not auth users (see `children` below).
export const users = pgTable("User", {
  id: id(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { precision: 3, mode: "date" }),
  image: text("image"),
  createdAt: createdAt(),
});

export const accounts = pgTable(
  "Account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ]
);

export const sessions = pgTable("Session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { precision: 3, mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "VerificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { precision: 3, mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
);

// --- App tables ---
export const children = pgTable("Child", {
  id: id(),
  parentId: text("parentId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  displayName: text("displayName").notNull(),
  avatarConfig: jsonb("avatarConfig").notNull(), // cosmetic items unlocked / equipped

  // Progression
  readingLevel: integer("readingLevel").default(3).notNull(), // 1..5, see docs/04
  xp: integer("xp").default(0).notNull(),
  level: integer("level").default(1).notNull(),

  // Adaptation: rolling quiz history used to move readingLevel
  recentQuizScores: jsonb("recentQuizScores").notNull(), // e.g. [{ level, pct, at }]

  // Set when the child finishes the calibration mini-game (docs/04). Null means
  // "not calibrated yet" — the child app routes them into calibration first.
  calibratedAt: timestamp("calibratedAt", { precision: 3, mode: "date" }),

  createdAt: createdAt(),
});

export const topicProgress = pgTable(
  "TopicProgress",
  {
    id: id(),
    childId: text("childId")
      .notNull()
      .references(() => children.id, { onDelete: "cascade" }),
    topicSlug: text("topicSlug").notNull(),
    title: text("title").notNull(),
    visits: integer("visits").default(0).notNull(),
    bestQuizPct: doublePrecision("bestQuizPct").default(0).notNull(),
    mastered: boolean("mastered").default(false).notNull(),
    lastVisited: timestamp("lastVisited", { precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (t) => [unique().on(t.childId, t.topicSlug)]
);

export const badges = pgTable(
  "Badge",
  {
    id: id(),
    childId: text("childId")
      .notNull()
      .references(() => children.id, { onDelete: "cascade" }),
    topicSlug: text("topicSlug").notNull(),
    title: text("title").notNull(),
    earnedAt: timestamp("earnedAt", { precision: 3 }).defaultNow().notNull(),
  },
  (t) => [unique().on(t.childId, t.topicSlug)]
);

export const mapNodes = pgTable(
  "MapNode",
  {
    id: id(),
    childId: text("childId")
      .notNull()
      .references(() => children.id, { onDelete: "cascade" }),
    topicSlug: text("topicSlug").notNull(),
    title: text("title").notNull(),
    status: text("status").notNull(), // "suggested" | "explored" | "mastered"
    neighbors: jsonb("neighbors").notNull(), // adjacent topic slugs (graph edges)
  },
  (t) => [unique().on(t.childId, t.topicSlug)]
);

export const learningSessions = pgTable("LearningSession", {
  id: id(),
  childId: text("childId")
    .notNull()
    .references(() => children.id, { onDelete: "cascade" }),
  startedAt: timestamp("startedAt", { precision: 3 }).defaultNow().notNull(),
});

export const loops = pgTable("Loop", {
  id: id(),
  sessionId: text("sessionId")
    .notNull()
    .references(() => learningSessions.id, { onDelete: "cascade" }),
  // Set when this loop is a "go deeper" follow-up drilling into another loop.
  parentLoopId: text("parentLoopId").references((): AnyPgColumn => loops.id, {
    onDelete: "set null",
  }),
  rawQuery: text("rawQuery"), // the child's original phrasing, pre-normalization
  intent: text("intent").notNull(), // "topic" | "question"
  topicSlug: text("topicSlug").notNull(),
  readingLevel: integer("readingLevel").notNull(),
  lessonText: text("lessonText").notNull(),
  quizJson: jsonb("quizJson").notNull(),
  quizPct: doublePrecision("quizPct"),
  xpAwarded: integer("xpAwarded").default(0).notNull(),
  createdAt: createdAt(),
});

export const llmCallLogs = pgTable("LlmCallLog", {
  id: id(),
  childId: text("childId").references(() => children.id, {
    onDelete: "set null",
  }),
  task: text("task").notNull(), // "lesson" | "quiz_generate" | ...
  model: text("model").notNull(),
  inputTokens: integer("inputTokens").notNull(),
  outputTokens: integer("outputTokens").notNull(),
  cacheReadTokens: integer("cacheReadTokens").default(0).notNull(),
  cacheCreateTokens: integer("cacheCreateTokens").default(0).notNull(),
  latencyMs: integer("latencyMs").notNull(),
  costUsd: doublePrecision("costUsd").notNull(),
  safetyFlag: text("safetyFlag"), // null if clean
  createdAt: createdAt(),
});

// --- Relations (Drizzle relational query API) ---
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  children: many(children),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const childrenRelations = relations(children, ({ one, many }) => ({
  parent: one(users, { fields: [children.parentId], references: [users.id] }),
  topics: many(topicProgress),
  badges: many(badges),
  mapNodes: many(mapNodes),
  sessions: many(learningSessions),
}));

export const learningSessionsRelations = relations(
  learningSessions,
  ({ one, many }) => ({
    child: one(children, {
      fields: [learningSessions.childId],
      references: [children.id],
    }),
    loops: many(loops),
  })
);

export const loopsRelations = relations(loops, ({ one }) => ({
  session: one(learningSessions, {
    fields: [loops.sessionId],
    references: [learningSessions.id],
  }),
  parent: one(loops, {
    fields: [loops.parentLoopId],
    references: [loops.id],
    relationName: "loopFollowUps",
  }),
}));
