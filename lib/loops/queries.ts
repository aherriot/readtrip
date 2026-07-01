// Loop persistence (docs/06, docs/09 M4). A `Loop` is one Explore → Read → Quiz
// pass. It's written here — at the quiz step — because both `lessonText` and
// `quizJson` are NOT NULL, so the row can only be created once the quiz exists
// (the lesson step deliberately deferred persistence; see the M4 plan).
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { learningSessions, loops } from "@/lib/db/schema";
import type { Quiz } from "@/lib/llm";

/**
 * Return the child's most-recent learning session, creating one if none exists.
 * Session lifecycle is intentionally minimal for the MVP — one rolling session
 * per child is enough; grouping loops into discrete sittings can come later.
 */
export async function getOrCreateOpenSession(childId: string): Promise<string> {
  const existing = await db
    .select({ id: learningSessions.id })
    .from(learningSessions)
    .where(eq(learningSessions.childId, childId))
    .orderBy(desc(learningSessions.startedAt))
    .limit(1);
  if (existing[0]) return existing[0].id;

  const [created] = await db
    .insert(learningSessions)
    .values({ childId })
    .returning({ id: learningSessions.id });
  return created.id;
}

export interface RecordLoopInput {
  childId: string;
  topicSlug: string;
  intent: "topic" | "question";
  rawQuery: string | null;
  readingLevel: number;
  lessonText: string;
  quizJson: Quiz;
  /** Set when this loop is a "go deeper" follow-up drilling into another loop. */
  parentLoopId?: string | null;
}

/**
 * Persist a completed lesson + quiz as a `Loop`, ensuring the child has a
 * session first. `quizPct` is written later by the Steer step (once the child
 * finishes the quiz); `xpAwarded` stays at its column default until Progress.
 */
export async function recordLoop(input: RecordLoopInput): Promise<string> {
  const sessionId = await getOrCreateOpenSession(input.childId);
  const [loop] = await db
    .insert(loops)
    .values({
      sessionId,
      parentLoopId: input.parentLoopId ?? null,
      topicSlug: input.topicSlug,
      intent: input.intent,
      rawQuery: input.rawQuery,
      readingLevel: input.readingLevel,
      lessonText: input.lessonText,
      quizJson: input.quizJson,
    })
    .returning({ id: loops.id });
  return loop.id;
}

export interface LoopForScoring {
  id: string;
  /** The reading level the quiz was generated at — the adaptation signal. */
  readingLevel: number;
  /** The stored quiz, re-graded server-side so the score can't be spoofed. */
  quiz: Quiz;
}

/**
 * Fetch the fields needed to score a loop, verifying it belongs to `childId`
 * (loop → session → child). Returns `null` when the loop doesn't exist or isn't
 * this child's, so callers can 404 rather than trust a client-supplied id.
 */
export async function getLoopForChild(
  loopId: string,
  childId: string
): Promise<LoopForScoring | null> {
  const [row] = await db
    .select({
      id: loops.id,
      readingLevel: loops.readingLevel,
      quizJson: loops.quizJson,
    })
    .from(loops)
    .innerJoin(learningSessions, eq(loops.sessionId, learningSessions.id))
    .where(and(eq(loops.id, loopId), eq(learningSessions.childId, childId)))
    .limit(1);
  if (!row) return null;
  return {
    id: row.id,
    readingLevel: row.readingLevel,
    quiz: row.quizJson as Quiz,
  };
}

/** Record the child's first-try quiz score on the loop (the Steer step). */
export async function setLoopQuizPct(
  loopId: string,
  pct: number
): Promise<void> {
  await db.update(loops).set({ quizPct: pct }).where(eq(loops.id, loopId));
}
