// Ongoing reading-level adaptation (docs/04). Calibration sets the starting
// level; quiz results then *suggest* a move — the parent approves it on the
// Profiles page, so the level never changes silently under the child. Kept
// deliberately stable so a single off day doesn't churn the suggestion: only
// scores taken AT the current level count, and it takes a full window of them
// to point one step up or down.
import {
  MAX_READING_LEVEL,
  MIN_READING_LEVEL,
} from "../llm/prompts/readingLevel";

/** One quiz outcome in the rolling history stored on `Child.recentQuizScores`. */
export interface QuizScoreRecord {
  /** The reading level the quiz was taken at. */
  level: number;
  /** First-try score as a whole-number percent (0–100). */
  pct: number;
  /** ISO timestamp — for the parent dashboard / debugging, not the math. */
  at: string;
}

export interface Adaptation {
  /** The child's next reading level (unchanged, or one step up/down). */
  readingLevel: number;
  /** Which way it moved, if at all — `up` is celebrate-worthy, `down` stays quiet. */
  direction: "up" | "down" | null;
}

// How many recent same-level quizzes to average, and the thresholds that move
// the level. The sweet spot is a ~70–80% pass rate (docs/04) — challenging but
// winnable — so we only step up when they're clearly acing it and down when
// they're clearly struggling.
export const WINDOW = 3;
// After a parent dismisses a suggestion ("not yet"), the same suggestion only
// returns once a much longer trend has built up — so we don't re-prompt after a
// handful of quizzes. Used in place of WINDOW while a level is snoozed (docs/04).
export const RESUGGEST_WINDOW = 20;
const STEP_UP_AT = 85;
const STEP_DOWN_AT = 50;

// Cap the rolling history so the jsonb column can't grow without bound. It must
// stay above RESUGGEST_WINDOW (with headroom for interleaved other-level scores),
// or a snoozed level could never accumulate a full window and would never
// re-suggest.
export const HISTORY_CAP = 30;

/**
 * Append a fresh score to the rolling history, keeping only the most recent
 * `HISTORY_CAP` entries.
 */
export function appendScore(
  history: readonly QuizScoreRecord[],
  record: QuizScoreRecord
): QuizScoreRecord[] {
  return [...history, record].slice(-HISTORY_CAP);
}

/**
 * Decide the child's next reading level from their recent quiz history. Only
 * the last `window` scores taken at `currentLevel` count; with fewer than that
 * we hold. Aced consistently (avg ≥ 85%) steps up one; struggling consistently
 * (avg ≤ 50%) steps down one; both clamp to the 1–5 range.
 *
 * `window` defaults to WINDOW; callers pass the longer RESUGGEST_WINDOW to
 * require a sustained trend before re-suggesting a dismissed level (docs/04).
 */
export function adaptReadingLevel(
  currentLevel: number,
  history: readonly QuizScoreRecord[],
  window: number = WINDOW
): Adaptation {
  const recent = history.filter((s) => s.level === currentLevel).slice(-window);
  if (recent.length < window) {
    return { readingLevel: currentLevel, direction: null };
  }

  const avg = recent.reduce((sum, s) => sum + s.pct, 0) / recent.length;
  if (avg >= STEP_UP_AT && currentLevel < MAX_READING_LEVEL) {
    return { readingLevel: currentLevel + 1, direction: "up" };
  }
  if (avg <= STEP_DOWN_AT && currentLevel > MIN_READING_LEVEL) {
    return { readingLevel: currentLevel - 1, direction: "down" };
  }
  return { readingLevel: currentLevel, direction: null };
}
