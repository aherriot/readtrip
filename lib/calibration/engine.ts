// The calibration mini-game's adaptive logic (docs/04). A lightweight
// binary-search over the 1..7 reading-level scale:
//
//   start at L4
//     correct → step up one level (cap the step at 1 to avoid overshoot)
//     wrong   → step down one level
//
// It shows 3–4 passages and lands on a *starting* level; ongoing quiz-based
// adaptation refines it from there. Pure and unit-tested — no I/O, no DB. The
// passages + grading live in ./passages and ./flow; this only reasons over the
// sequence of graded answers.
import {
  clampReadingLevel,
  type ReadingLevel,
} from "../llm/prompts/readingLevel";

/** Guessed starting level before we know anything (docs/04 default — the
 * midpoint of the 1..7 scale). */
export const CALIBRATION_START_LEVEL: ReadingLevel = 4;

/** Never show more than this many passages. With a 7-level scale and a
 * midpoint start, reaching either extreme takes 3 steps, so this leaves one
 * spare round rather than cutting off exactly at the edge. */
export const CALIBRATION_MAX_ROUNDS = 4;

export interface CalibrationAnswer {
  level: ReadingLevel;
  correct: boolean;
}

/**
 * The next level to show given the answers so far, or `null` when the game is
 * over. Steps ±1 from the last passage, and stops early once there's nothing new
 * to learn: we've hit the floor/ceiling, re-reached a level we already tested
 * (the answer would just oscillate), or run out of rounds.
 */
export function nextCalibrationLevel(
  answers: CalibrationAnswer[]
): ReadingLevel | null {
  if (answers.length === 0) return CALIBRATION_START_LEVEL;
  if (answers.length >= CALIBRATION_MAX_ROUNDS) return null;

  const last = answers[answers.length - 1];
  const proposed = clampReadingLevel(last.level + (last.correct ? 1 : -1));

  // Already at the top and still passing (or bottom and still failing): the
  // scale can't tell us more.
  if (proposed === last.level) return null;
  // We've already measured this level — stepping back to it wouldn't add signal.
  if (answers.some((a) => a.level === proposed)) return null;

  return proposed;
}

/**
 * The starting reading level implied by the answers: the hardest passage the
 * child read correctly, or L1 if they read none correctly. This mirrors the
 * doc's tree — e.g. L3 pass then L4 fail lands on L3.
 */
export function finalCalibrationLevel(
  answers: CalibrationAnswer[]
): ReadingLevel {
  const passedLevels = answers.filter((a) => a.correct).map((a) => a.level);
  return passedLevels.length ? clampReadingLevel(Math.max(...passedLevels)) : 1;
}
