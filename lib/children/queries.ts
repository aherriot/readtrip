import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { children } from "@/lib/db/schema";
import {
  adaptReadingLevel,
  appendScore,
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
  await db
    .update(children)
    .set({
      displayName: input.displayName,
      avatarConfig: { color: input.avatarColor },
    })
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

export interface QuizAdaptation {
  /** The child's reading level after this quiz (may be unchanged). */
  readingLevel: number;
  /** True only when the level stepped up — the one change worth celebrating. */
  leveledUp: boolean;
}

/**
 * Record a completed quiz's score into the child's rolling history and adapt
 * their reading level from it (docs/04, the Steer step). Scoped by parentId so
 * a parent can only steer their own children; returns `null` if the child no
 * longer resolves. The level moves at most one step and only on a consistent
 * trend, so it never yo-yos on a single quiz.
 */
export async function applyQuizAdaptation(
  parentId: string,
  childId: string,
  score: { level: number; pct: number }
): Promise<QuizAdaptation | null> {
  const row = await db.query.children.findFirst({
    where: and(eq(children.id, childId), eq(children.parentId, parentId)),
  });
  if (!row) return null;

  const history = Array.isArray(row.recentQuizScores)
    ? (row.recentQuizScores as QuizScoreRecord[])
    : [];
  const updated = appendScore(history, {
    level: score.level,
    pct: score.pct,
    at: new Date().toISOString(),
  });

  // Adapt from the level the child is on now — the quiz's own level is what the
  // rolling window keys on, so a stale profile can't drift the calculation.
  const { readingLevel, direction } = adaptReadingLevel(
    row.readingLevel,
    updated
  );

  await db
    .update(children)
    .set({ recentQuizScores: updated, readingLevel })
    .where(and(eq(children.id, childId), eq(children.parentId, parentId)));

  return { readingLevel, leveledUp: direction === "up" };
}

export async function deleteChild(
  parentId: string,
  childId: string
): Promise<void> {
  await db
    .delete(children)
    .where(and(eq(children.id, childId), eq(children.parentId, parentId)));
}
