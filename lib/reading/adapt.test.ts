import { describe, expect, it } from "vitest";
import {
  adaptReadingLevel,
  appendScore,
  HISTORY_CAP,
  type QuizScoreRecord,
} from "./adapt";

// Build a history of `pct`s all taken at `level` (the common case).
function scores(level: number, pcts: number[]): QuizScoreRecord[] {
  return pcts.map((pct) => ({ level, pct, at: "2026-07-01T00:00:00.000Z" }));
}

describe("adaptReadingLevel", () => {
  it("holds until a full window of same-level scores exists", () => {
    expect(adaptReadingLevel(3, scores(3, [100, 100])).direction).toBeNull();
    expect(adaptReadingLevel(3, [])).toEqual({
      readingLevel: 3,
      direction: null,
    });
  });

  it("steps up one level when acing consistently (avg ≥ 85%)", () => {
    expect(adaptReadingLevel(3, scores(3, [90, 80, 100]))).toEqual({
      readingLevel: 4,
      direction: "up",
    });
  });

  it("steps down one level when struggling consistently (avg ≤ 50%)", () => {
    expect(adaptReadingLevel(3, scores(3, [40, 60, 50]))).toEqual({
      readingLevel: 2,
      direction: "down",
    });
  });

  it("holds in the sweet spot (~70–80%)", () => {
    expect(adaptReadingLevel(3, scores(3, [70, 80, 75])).direction).toBeNull();
  });

  it("only counts scores taken at the current level", () => {
    // Two aced quizzes at L2 shouldn't move an L3 child, and there's only one
    // L3 score, so it holds.
    const history = [...scores(2, [100, 100]), ...scores(3, [100])];
    expect(adaptReadingLevel(3, history).direction).toBeNull();
  });

  it("averages only the most recent window at the level", () => {
    // Older struggling scores drop out of the 3-wide window once newer aces
    // arrive, so the level steps up.
    expect(adaptReadingLevel(3, scores(3, [0, 0, 90, 90, 90]))).toEqual({
      readingLevel: 4,
      direction: "up",
    });
  });

  it("requires the full custom window before moving when one is given", () => {
    // With a wider re-suggest window, three aces aren't enough to step up —
    // it holds until the window is full of same-level scores.
    expect(
      adaptReadingLevel(3, scores(3, [90, 90, 90]), 6).direction
    ).toBeNull();
    expect(
      adaptReadingLevel(3, scores(3, [90, 90, 90, 90, 90, 90]), 6)
    ).toEqual({
      readingLevel: 4,
      direction: "up",
    });
  });

  it("never steps above the max or below the min level", () => {
    expect(adaptReadingLevel(5, scores(5, [100, 100, 100]))).toEqual({
      readingLevel: 5,
      direction: null,
    });
    expect(adaptReadingLevel(1, scores(1, [0, 0, 0]))).toEqual({
      readingLevel: 1,
      direction: null,
    });
  });
});

describe("appendScore", () => {
  it("appends to the end of the history", () => {
    const record: QuizScoreRecord = {
      level: 3,
      pct: 80,
      at: "2026-07-01T00:00:00.000Z",
    };
    expect(appendScore([], record)).toEqual([record]);
  });

  it("keeps only the most recent HISTORY_CAP entries", () => {
    const history = scores(
      3,
      Array.from({ length: HISTORY_CAP }, (_, i) => i)
    );
    const next: QuizScoreRecord = {
      level: 3,
      pct: 99,
      at: "2026-07-01T00:00:00.000Z",
    };
    const result = appendScore(history, next);
    expect(result).toHaveLength(HISTORY_CAP);
    expect(result[result.length - 1]).toEqual(next);
    // The oldest (pct 0) fell off the front.
    expect(result[0].pct).toBe(1);
  });
});
