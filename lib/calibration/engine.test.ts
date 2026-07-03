import { describe, expect, it } from "vitest";
import {
  CALIBRATION_MAX_ROUNDS,
  CALIBRATION_START_LEVEL,
  finalCalibrationLevel,
  nextCalibrationLevel,
  type CalibrationAnswer,
} from "./engine";

// Run the full mini-game against a fixed "true" reading level: a child answers
// correctly exactly when the passage is at or below their real level. Returns
// the sequence of levels shown and the level the engine lands on.
function simulate(trueLevel: number) {
  const answers: CalibrationAnswer[] = [];
  const shown: number[] = [];
  let level = nextCalibrationLevel(answers);
  while (level !== null) {
    shown.push(level);
    answers.push({ level, correct: level <= trueLevel });
    level = nextCalibrationLevel(answers);
  }
  return { shown, final: finalCalibrationLevel(answers) };
}

describe("nextCalibrationLevel", () => {
  it("opens on the default starting level", () => {
    expect(nextCalibrationLevel([])).toBe(CALIBRATION_START_LEVEL);
  });

  it("steps up one level after a correct answer", () => {
    expect(nextCalibrationLevel([{ level: 3, correct: true }])).toBe(4);
  });

  it("steps down one level after a wrong answer", () => {
    expect(nextCalibrationLevel([{ level: 3, correct: false }])).toBe(2);
  });

  it("caps the step at one level (no overshoot)", () => {
    // Two correct answers move 3 → 4 → 5, one at a time.
    expect(
      nextCalibrationLevel([
        { level: 3, correct: true },
        { level: 4, correct: true },
      ])
    ).toBe(5);
  });

  it("ends when a step would leave the scale (ceiling)", () => {
    expect(
      nextCalibrationLevel([
        { level: 5, correct: true },
        { level: 6, correct: true },
        { level: 7, correct: true },
      ])
    ).toBeNull();
  });

  it("ends rather than re-showing a level already tested", () => {
    // 3 pass → 4 fail would step back to 3, which we've already measured.
    expect(
      nextCalibrationLevel([
        { level: 3, correct: true },
        { level: 4, correct: false },
      ])
    ).toBeNull();
  });

  it("never shows more than the max number of rounds", () => {
    for (let trueLevel = 1; trueLevel <= 7; trueLevel++) {
      expect(simulate(trueLevel).shown.length).toBeLessThanOrEqual(
        CALIBRATION_MAX_ROUNDS
      );
    }
  });
});

describe("finalCalibrationLevel", () => {
  it("lands on L3 when L3 passes but L4 fails (the doc's tree)", () => {
    expect(
      finalCalibrationLevel([
        { level: 3, correct: true },
        { level: 4, correct: false },
      ])
    ).toBe(3);
  });

  it("lands on L2 when L3 fails but L2 passes", () => {
    expect(
      finalCalibrationLevel([
        { level: 3, correct: false },
        { level: 2, correct: true },
      ])
    ).toBe(2);
  });

  it("lands on L1 when nothing is read correctly", () => {
    expect(
      finalCalibrationLevel([
        { level: 3, correct: false },
        { level: 2, correct: false },
        { level: 1, correct: false },
      ])
    ).toBe(1);
  });

  it("recovers the child's true level across the whole scale", () => {
    for (let trueLevel = 1; trueLevel <= 7; trueLevel++) {
      expect(simulate(trueLevel).final).toBe(trueLevel);
    }
  });
});
