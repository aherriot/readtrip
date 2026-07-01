// Topic mastery (docs/05). A badge is earned for *mastering* a topic — not just
// visiting it, but revisiting and consistently scoring well — so mastery is
// keyed on the child's best quiz score across repeat visits. Pure + unit-tested;
// the badge award lives in lib/progress. Once earned, mastery is never revoked
// (docs/05: "don't punish").

/** Best first-try quiz score (%) a topic needs before it counts as mastered. */
export const MASTERY_PCT = 80;
/** Minimum visits before mastery can be earned, so one lucky quiz isn't enough. */
export const MASTERY_MIN_VISITS = 2;

/**
 * Whether a topic is mastered given how many times it's been visited and the
 * best first-try quiz score achieved on it.
 */
export function isMastered(visits: number, bestQuizPct: number): boolean {
  return visits >= MASTERY_MIN_VISITS && bestQuizPct >= MASTERY_PCT;
}
