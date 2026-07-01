// Stateless calibration step function. The client holds the running list of
// answers and re-submits it each round; the server grades every answer against
// the (server-only) answer key, re-derives the adaptive path, and returns either
// the next passage to show or the final starting level. Keeping it stateless
// means no per-session storage, and the starting level is always computed here
// from the real answer key — never trusted from the client.
import {
  CALIBRATION_MAX_ROUNDS,
  finalCalibrationLevel,
  nextCalibrationLevel,
  type CalibrationAnswer,
} from "./engine";
import {
  CALIBRATION_PASSAGES,
  toPassageView,
  type CalibrationPassageView,
} from "./passages";
import type { ReadingLevel } from "../llm/prompts/readingLevel";

/** One answered round, as submitted by the client. */
export interface SubmittedAnswer {
  passageId: string;
  selectedIndex: number;
}

export type CalibrationStep =
  | {
      done: false;
      passage: CalibrationPassageView;
      /** 1-based index of the passage now being shown. */
      round: number;
      /** Upper bound on rounds, for a progress readout. */
      totalRounds: number;
    }
  | { done: true; readingLevel: ReadingLevel };

/** Thrown when the submitted answers don't match the adaptive path. */
export class CalibrationError extends Error {}

/**
 * Grade the submitted answers and return the next step. Validates that each
 * submitted answer corresponds to the passage the engine would actually have
 * shown at that point — a client can't submit answers for arbitrary passages to
 * steer the outcome.
 */
export function stepCalibration(submitted: SubmittedAnswer[]): CalibrationStep {
  const graded: CalibrationAnswer[] = [];

  for (const answer of submitted) {
    const level = nextCalibrationLevel(graded);
    if (level === null) {
      throw new CalibrationError("Received more answers than rounds.");
    }
    const passage = CALIBRATION_PASSAGES[level];
    if (answer.passageId !== passage.id) {
      throw new CalibrationError(
        `Answer for "${answer.passageId}" is out of sequence.`
      );
    }
    graded.push({
      level,
      correct: answer.selectedIndex === passage.answerIndex,
    });
  }

  const next = nextCalibrationLevel(graded);
  if (next === null) {
    return { done: true, readingLevel: finalCalibrationLevel(graded) };
  }

  return {
    done: false,
    passage: toPassageView(CALIBRATION_PASSAGES[next]),
    round: graded.length + 1,
    totalRounds: CALIBRATION_MAX_ROUNDS,
  };
}
