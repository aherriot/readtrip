// Loop persistence (docs/06, docs/09 M4). A `Loop` is one Explore → Read → Quiz
// pass. It's written here — at the quiz step — because both `lessonText` and
// `quizJson` are NOT NULL, so the row can only be created once the quiz exists
// (the lesson step deliberately deferred persistence; see the M4 plan).
import { desc, eq } from "drizzle-orm";
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
}

/**
 * Persist a completed lesson + quiz as a `Loop`, ensuring the child has a
 * session first. `quizPct`/`xpAwarded` are left at their column defaults — those
 * are written by the later Progress/Steer step, not here.
 */
export async function recordLoop(input: RecordLoopInput): Promise<string> {
  const sessionId = await getOrCreateOpenSession(input.childId);
  const [loop] = await db
    .insert(loops)
    .values({
      sessionId,
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
