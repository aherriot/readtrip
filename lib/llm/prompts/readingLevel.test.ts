import { describe, expect, it } from "vitest";
import {
  clampReadingLevel,
  isReadingLevel,
  readingLevelGuidance,
  type ReadingLevel,
} from "./readingLevel";

describe("isReadingLevel", () => {
  it("accepts 1..5 and rejects everything else", () => {
    for (const n of [1, 2, 3, 4, 5]) expect(isReadingLevel(n)).toBe(true);
    for (const n of [0, 6, -1, 2.5, NaN]) expect(isReadingLevel(n)).toBe(false);
  });
});

describe("clampReadingLevel", () => {
  it("clamps out-of-range values into 1..5", () => {
    expect(clampReadingLevel(0)).toBe(1);
    expect(clampReadingLevel(-3)).toBe(1);
    expect(clampReadingLevel(9)).toBe(5);
  });

  it("rounds fractional levels", () => {
    expect(clampReadingLevel(2.4)).toBe(2);
    expect(clampReadingLevel(3.6)).toBe(4);
  });
});

describe("readingLevelGuidance", () => {
  it("produces distinct, non-empty guidance per level", () => {
    const seen = new Set<string>();
    for (let level = 1 as ReadingLevel; level <= 5; level++) {
      const g = readingLevelGuidance(level as ReadingLevel);
      expect(g).toContain("Target reading level");
      expect(g).toContain("Sentences:");
      expect(g).toContain("Vocabulary:");
      seen.add(g);
    }
    expect(seen.size).toBe(5);
  });
});
