import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { children } from "@/lib/db/schema";
import {
  adaptReadingLevel,
  appendScore,
  RESUGGEST_WINDOW,
  type QuizScoreRecord,
} from "@/lib/reading/adapt";
import type { AvatarColor, ChildInput } from "./validation";
import { avatarColorFromConfig } from "./validation";

// View model handed to the UI — the raw row's jsonb avatarConfig flattened to a
// known color.
export interface ChildProfile {
  id: string;
  displayName: string;
  avatarColor: AvatarColor;
  readingLevel: number;
  /**
   * The level ongoing adaptation is pointing at, pending parent approval on the
   * Profiles page (docs/04). Null when there's no pending suggestion. It never
   * changes `readingLevel` on its own — the parent accepts or dismisses it.
   */
  suggestedReadingLevel: number | null;
  level: number;
  xp: number;
  /** Null until the child finishes the calibration mini-game (docs/04). */
  calibratedAt: Date | null;
}

type ChildRow = typeof children.$inferSelect;

function toProfile(row: ChildRow): ChildProfile {
  return {
    id: row.id,
    displayName: row.displayName,
    avatarColor: avatarColorFromConfig(row.avatarConfig),
    readingLevel: row.readingLevel,
    suggestedReadingLevel: row.suggestedReadingLevel,
    level: row.level,
    xp: row.xp,
    calibratedAt: row.calibratedAt,
  };
}

export async function listChildren(parentId: string): Promise<ChildProfile[]> {
  const rows = await db
    .select()
    .from(children)
    .where(eq(children.parentId, parentId))
    .orderBy(asc(children.createdAt));
  return rows.map(toProfile);
}

/** Fetch one child, scoped to its parent so a parent can't read another's. */
export async function getChild(
  parentId: string,
  childId: string
): Promise<ChildProfile | null> {
  const row = await db.query.children.findFirst({
    where: and(eq(children.id, childId), eq(children.parentId, parentId)),
  });
  return row ? toProfile(row) : null;
}

export async function createChild(
  parentId: string,
  input: ChildInput
): Promise<ChildProfile> {
  const [row] = await db
    .insert(children)
    .values({
      parentId,
      displayName: input.displayName,
      avatarConfig: { color: input.avatarColor },
      recentQuizScores: [],
    })
    .returning();
  return toProfile(row);
}

/** Update is scoped by parentId so a parent can only edit their own children. */
export async function updateChild(
  parentId: string,
  childId: string,
  input: ChildInput
): Promise<void> {
  const set: Partial<typeof children.$inferInsert> = {
    displayName: input.displayName,
    avatarConfig: { color: input.avatarColor },
  };
  // A manually chosen reading level is the parent taking direct control, so it
  // clears any pending suggestion and the snooze — they've made the call.
  if (input.readingLevel !== undefined) {
    set.readingLevel = input.readingLevel;
    set.suggestedReadingLevel = null;
    set.readingSuggestionSnoozedLevel = null;
  }
  await db
    .update(children)
    .set(set)
    .where(and(eq(children.id, childId), eq(children.parentId, parentId)));
}

/**
 * Persist the outcome of the calibration mini-game: the starting reading level
 * plus the timestamp that marks the child as calibrated. Scoped by parentId so a
 * parent can only calibrate their own children.
 */
export async function completeCalibration(
  parentId: string,
  childId: string,
  readingLevel: number
): Promise<void> {
  await db
    .update(children)
    .set({ readingLevel, calibratedAt: new Date() })
    .where(and(eq(children.id, childId), eq(children.parentId, parentId)));
}

/**
 * Record a completed quiz's score into the child's rolling history and refresh
 * the *suggested* reading level from it (docs/04, the Steer step). The actual
 * `readingLevel` is never touched here — a consistent trend only sets a pending
 * suggestion the parent approves on the Profiles page, so the level never yo-yos
 * or changes under the child. Scoped by parentId; a no-op if the child no longer
 * resolves.
 *
 * A fresh up/down trend overwrites the pending suggestion; a neutral quiz leaves
 * whatever was already pending in place (so a suggestion the parent hasn't seen
 * yet doesn't flicker away).
 */
export async function recordQuizAndSuggest(
  parentId: string,
  childId: string,
  score: { level: number; pct: number }
): Promise<void> {
  const row = await db.query.children.findFirst({
    where: and(eq(children.id, childId), eq(children.parentId, parentId)),
  });
  if (!row) return;

  const history = Array.isArray(row.recentQuizScores)
    ? (row.recentQuizScores as QuizScoreRecord[])
    : [];
  const updated = appendScore(history, {
    level: score.level,
    pct: score.pct,
    at: new Date().toISOString(),
  });

  // Suggest from the level the child is on now — the quiz's own level is what the
  // rolling window keys on, so a stale profile can't drift the calculation. If
  // the parent recently dismissed a suggestion at this level, require the much
  // longer RESUGGEST_WINDOW trend before raising it again (docs/04).
  const snoozed = row.readingSuggestionSnoozedLevel === row.readingLevel;
  const { readingLevel, direction } = adaptReadingLevel(
    row.readingLevel,
    updated,
    snoozed ? RESUGGEST_WINDOW : undefined
  );

  const set: Partial<typeof children.$inferInsert> = {
    recentQuizScores: updated,
  };
  // A fresh trend raises the suggestion and lifts the snooze; a neutral quiz
  // leaves both as they were.
  if (direction !== null) {
    set.suggestedReadingLevel = readingLevel;
    set.readingSuggestionSnoozedLevel = null;
  }

  await db
    .update(children)
    .set(set)
    .where(and(eq(children.id, childId), eq(children.parentId, parentId)));
}

/**
 * Approve a pending reading-level suggestion: move `readingLevel` to it and
 * clear the suggestion. No-op (returns null) if the child doesn't resolve or has
 * no pending suggestion. Scoped by parentId.
 */
export async function acceptReadingSuggestion(
  parentId: string,
  childId: string
): Promise<ChildProfile | null> {
  const row = await db.query.children.findFirst({
    where: and(eq(children.id, childId), eq(children.parentId, parentId)),
  });
  if (!row || row.suggestedReadingLevel === null) return null;

  const [updated] = await db
    .update(children)
    .set({
      readingLevel: row.suggestedReadingLevel,
      suggestedReadingLevel: null,
      readingSuggestionSnoozedLevel: null,
    })
    .where(and(eq(children.id, childId), eq(children.parentId, parentId)))
    .returning();
  return updated ? toProfile(updated) : null;
}

/**
 * Dismiss a pending suggestion ("not yet"). Clears it, drops the quiz history at
 * the current level, and snoozes re-suggestion at that level: the trend has to
 * rebuild over the much longer RESUGGEST_WINDOW before it prompts again, so a
 * dismissal isn't undone by the next couple of quizzes. Scoped by parentId.
 */
export async function dismissReadingSuggestion(
  parentId: string,
  childId: string
): Promise<void> {
  const row = await db.query.children.findFirst({
    where: and(eq(children.id, childId), eq(children.parentId, parentId)),
  });
  if (!row) return;

  const history = Array.isArray(row.recentQuizScores)
    ? (row.recentQuizScores as QuizScoreRecord[])
    : [];
  const kept = history.filter((s) => s.level !== row.readingLevel);

  await db
    .update(children)
    .set({
      suggestedReadingLevel: null,
      recentQuizScores: kept,
      readingSuggestionSnoozedLevel: row.readingLevel,
    })
    .where(and(eq(children.id, childId), eq(children.parentId, parentId)));
}

export async function deleteChild(
  parentId: string,
  childId: string
): Promise<void> {
  await db
    .delete(children)
    .where(and(eq(children.id, childId), eq(children.parentId, parentId)));
}
