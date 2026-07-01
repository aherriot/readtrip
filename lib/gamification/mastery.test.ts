import { describe, expect, it } from "vitest";
import { isMastered, MASTERY_MIN_VISITS, MASTERY_PCT } from "./mastery";

describe("isMastered", () => {
  it("requires the minimum number of visits", () => {
    expect(isMastered(MASTERY_MIN_VISITS - 1, 100)).toBe(false);
    expect(isMastered(MASTERY_MIN_VISITS, 100)).toBe(true);
  });

  it("requires a high enough best score", () => {
    expect(isMastered(3, MASTERY_PCT - 1)).toBe(false);
    expect(isMastered(3, MASTERY_PCT)).toBe(true);
  });

  it("needs both a revisit and a strong score", () => {
    expect(isMastered(1, 100)).toBe(false);
    expect(isMastered(5, 50)).toBe(false);
    expect(isMastered(2, 80)).toBe(true);
  });
});
