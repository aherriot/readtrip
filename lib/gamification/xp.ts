// XP + levels (docs/05). Understanding beats consumption, so a lesson earns a
// small guaranteed reward and each correct quiz answer earns more. Levels are
// derived from cumulative XP on a gentle-early, steeper-later curve so new
// explorers level up fast (the hook) and veterans have room to grow. Pure and
// unit-tested; the DB orchestration that applies these lives in lib/progress.

/** Guaranteed reward for finishing a lesson — engaging at all should feel good. */
export const READ_XP = 10;
/** Bonus per first-try-correct answer — the bigger reward (docs/05). */
export const QUIZ_XP_PER_CORRECT = 5;

/**
 * XP earned for one completed loop: the read reward plus a bonus per correct
 * answer. `correct` is first-try correctness, so blind guessing / retries don't
 * pay (docs/05 anti-patterns).
 */
export function xpForLoop(correct: number): number {
  return READ_XP + QUIZ_XP_PER_CORRECT * Math.max(0, Math.floor(correct));
}

/**
 * Cumulative XP required to *reach* a given level. Level 1 is the start (0 XP);
 * each level costs 20 more than the last (L1→L2 = 40, L2→L3 = 60, …), which
 * keeps early level-ups quick and stretches later ones.
 */
export function xpToReach(level: number): number {
  if (level <= 1) return 0;
  return (level - 1) * (10 * level + 20);
}

/** The level a cumulative XP total corresponds to (always ≥ 1). */
export function levelForXp(xp: number): number {
  let level = 1;
  while (xp >= xpToReach(level + 1)) level += 1;
  return level;
}
