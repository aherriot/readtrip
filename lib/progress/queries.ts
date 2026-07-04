// Progress persistence (docs/05, docs/09 M4). After a loop, this awards XP,
// recomputes the child's level, updates per-topic progress, and mints a mastery
// badge the first time a topic is mastered. The Neon HTTP driver is
// connectionless (no interactive transactions), so — like the rest of the app —
// this is a sequence of read-modify-write queries; concurrency per child is
// effectively single-threaded (one kid, one device), so races aren't a concern.
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { badges, children, topicProgress } from "@/lib/db/schema";
import { isMastered } from "@/lib/gamification/mastery";
import { levelForXp, xpForLoop } from "@/lib/gamification/xp";
import { setLoopXpAwarded } from "@/lib/loops/queries";

export interface AwardProgressInput {
  childId: string;
  /** The child's current xp/level, already fetched by the caller (avoids a duplicate lookup). */
  childXp: number;
  childLevel: number;
  loopId: string;
  /** Already-granted XP for this loop; > 0 short-circuits (award once only). */
  loopXpAwarded: number;
  topicSlug: string;
  /** Kid-friendly display title for the topic/badge. */
  title: string;
  /** First-try correct answers and the loop's score, from server-side grading. */
  correct: number;
  pct: number;
}

export interface AwardProgressResult {
  /** XP granted for this loop (0 if it had already been awarded). */
  xpAwarded: number;
  /** The child's cumulative XP and level after this loop. */
  xp: number;
  level: number;
  /** True only when the level advanced — the celebrate-worthy moment. */
  leveledUp: boolean;
  /** True when this loop is what tipped the topic into mastery. */
  newlyMastered: boolean;
  /** The badge title, set only when one was newly earned. */
  badgeTitle: string | null;
}

/**
 * Award XP + progress for a completed loop, idempotently. The caller must have
 * already resolved and ownership-checked the child (e.g. via getChild) and pass
 * its current xp/level in, so this never re-fetches it. Re-running for an
 * already-awarded loop is a no-op that reports the child's current standing (so
 * a client retry can't double-count).
 */
export async function awardLoopProgress(
  input: AwardProgressInput
): Promise<AwardProgressResult> {
  // Idempotency: a loop pays out exactly once. Report the current standing so
  // the UI still has something to show on a retry.
  if (input.loopXpAwarded > 0) {
    return {
      xpAwarded: input.loopXpAwarded,
      xp: input.childXp,
      level: input.childLevel,
      leveledUp: false,
      newlyMastered: false,
      badgeTitle: null,
    };
  }

  // XP + level.
  const xpAwarded = xpForLoop(input.correct);
  const xp = input.childXp + xpAwarded;
  const level = levelForXp(xp);
  const leveledUp = level > input.childLevel;
  await db
    .update(children)
    .set({ xp, level })
    .where(eq(children.id, input.childId));

  // Per-topic progress: bump the visit count, keep the best score, refresh the
  // title, and evaluate mastery. Read-then-write so we can detect the exact loop
  // that crosses into mastery (for the one-time badge).
  const existing = await db.query.topicProgress.findFirst({
    where: and(
      eq(topicProgress.childId, input.childId),
      eq(topicProgress.topicSlug, input.topicSlug)
    ),
  });
  const visits = (existing?.visits ?? 0) + 1;
  const bestQuizPct = Math.max(existing?.bestQuizPct ?? 0, input.pct);
  const wasMastered = existing?.mastered ?? false;
  const mastered = wasMastered || isMastered(visits, bestQuizPct);
  const newlyMastered = mastered && !wasMastered;

  if (existing) {
    await db
      .update(topicProgress)
      .set({
        visits,
        bestQuizPct,
        mastered,
        title: input.title,
        lastVisited: new Date(),
      })
      .where(eq(topicProgress.id, existing.id));
  } else {
    await db.insert(topicProgress).values({
      childId: input.childId,
      topicSlug: input.topicSlug,
      title: input.title,
      visits,
      bestQuizPct,
      mastered,
    });
  }

  // Mint the mastery badge exactly once. onConflictDoNothing guards the unique
  // (childId, topicSlug) so a concurrent/duplicate award can't create two.
  let badgeTitle: string | null = null;
  if (newlyMastered) {
    await db
      .insert(badges)
      .values({
        childId: input.childId,
        topicSlug: input.topicSlug,
        title: input.title,
      })
      .onConflictDoNothing();
    badgeTitle = input.title;
  }

  await setLoopXpAwarded(input.loopId, xpAwarded);

  return { xpAwarded, xp, level, leveledUp, newlyMastered, badgeTitle };
}
