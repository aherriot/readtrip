import { describe, expect, it } from "vitest";
import { CALIBRATION_PASSAGES } from "./passages";
import {
  CalibrationError,
  stepCalibration,
  type SubmittedAnswer,
} from "./flow";
import type { ReadingLevel } from "../llm/prompts/readingLevel";

// Build the submitted answer for a level, choosing the right or wrong option.
function answer(level: ReadingLevel, correct: boolean): SubmittedAnswer {
  const passage = CALIBRATION_PASSAGES[level];
  const selectedIndex = correct
    ? passage.answerIndex
    : (passage.answerIndex + 1) % passage.options.length;
  return { passageId: passage.id, selectedIndex };
}

describe("stepCalibration", () => {
  it("opens on the L3 passage with no answers, keeping the answer key hidden", () => {
    const step = stepCalibration([]);
    expect(step.done).toBe(false);
    if (step.done) throw new Error("unreachable");
    expect(step.passage.id).toBe("passage-l3");
    expect(step.round).toBe(1);
    expect(step.passage).not.toHaveProperty("answerIndex");
  });

  it("advances to L4 after a correct L3 answer", () => {
    const step = stepCalibration([answer(3, true)]);
    expect(step.done).toBe(false);
    if (step.done) throw new Error("unreachable");
    expect(step.passage.id).toBe("passage-l4");
    expect(step.round).toBe(2);
  });

  it("grades against the real key: strong reader lands on L5", () => {
    const step = stepCalibration([
      answer(3, true),
      answer(4, true),
      answer(5, true),
    ]);
    expect(step).toEqual({ done: true, readingLevel: 5 });
  });

  it("a struggling reader lands on L1", () => {
    const step = stepCalibration([
      answer(3, false),
      answer(2, false),
      answer(1, false),
    ]);
    expect(step).toEqual({ done: true, readingLevel: 1 });
  });

  it("a wrong index is graded as incorrect, steering the path down", () => {
    const step = stepCalibration([answer(3, false)]);
    expect(step.done).toBe(false);
    if (step.done) throw new Error("unreachable");
    expect(step.passage.id).toBe("passage-l2");
  });

  it("rejects an answer for a passage the engine did not show", () => {
    // After a correct L3 the engine expects L4; submitting L2 is out of sequence.
    expect(() => stepCalibration([answer(3, true), answer(2, true)])).toThrow(
      CalibrationError
    );
  });

  it("rejects a first answer that isn't the L3 passage", () => {
    expect(() => stepCalibration([answer(4, true)])).toThrow(CalibrationError);
  });

  it("rejects more answers than there are rounds", () => {
    expect(() =>
      stepCalibration([
        answer(3, true),
        answer(4, true),
        answer(5, true),
        answer(5, true),
      ])
    ).toThrow(CalibrationError);
  });
});
