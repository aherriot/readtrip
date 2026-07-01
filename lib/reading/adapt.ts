// Ongoing reading-level adaptation (docs/04). Calibration sets the starting
// level; quiz results move it over time. Kept deliberately stable so a single
// off day doesn't yo-yo the child's level: only scores taken AT the current
// level count, and it takes a full window of them to move one step.
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
const WINDOW = 3;
const STEP_UP_AT = 85;
const STEP_DOWN_AT = 50;

/** Cap the rolling history so the jsonb column can't grow without bound. */
export const HISTORY_CAP = 10;

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
 * the last `WINDOW` scores taken at `currentLevel` count; with fewer than that
 * we hold. Aced consistently (avg ≥ 85%) steps up one; struggling consistently
 * (avg ≤ 50%) steps down one; both clamp to the 1–5 range.
 */
export function adaptReadingLevel(
  currentLevel: number,
  history: readonly QuizScoreRecord[]
): Adaptation {
  const recent = history.filter((s) => s.level === currentLevel).slice(-WINDOW);
  if (recent.length < WINDOW) {
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
