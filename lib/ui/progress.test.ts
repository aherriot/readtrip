import { describe, it, expect } from "vitest";
import { toPercent } from "./progress";

describe("toPercent", () => {
  it("maps a value within range to its percentage", () => {
    expect(toPercent(25, 100)).toBe(25);
    expect(toPercent(3, 12)).toBe(25);
  });

  it("defaults max to 100", () => {
    expect(toPercent(40)).toBe(40);
  });

  it("clamps to 0 at or below the floor", () => {
    expect(toPercent(0, 100)).toBe(0);
    expect(toPercent(-10, 100)).toBe(0);
  });

  it("clamps to 100 at or above max (never overshoots the track)", () => {
    expect(toPercent(100, 100)).toBe(100);
    expect(toPercent(150, 100)).toBe(100);
  });

  it("treats a non-positive max as 'nothing measurable yet' → 0", () => {
    expect(toPercent(5, 0)).toBe(0);
    expect(toPercent(5, -1)).toBe(0);
  });

  it("guards against non-finite inputs", () => {
    expect(toPercent(Number.NaN, 100)).toBe(0);
    expect(toPercent(50, Number.POSITIVE_INFINITY)).toBe(0);
  });
});
