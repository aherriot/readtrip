import { describe, expect, it } from "vitest";
import {
  levelForXp,
  levelProgress,
  QUIZ_XP_PER_CORRECT,
  READ_XP,
  xpForLoop,
  xpToReach,
} from "./xp";

describe("xpForLoop", () => {
  it("awards the read reward even with zero correct answers", () => {
    expect(xpForLoop(0)).toBe(READ_XP);
  });

  it("adds the per-correct bonus on top of the read reward", () => {
    expect(xpForLoop(2)).toBe(READ_XP + 2 * QUIZ_XP_PER_CORRECT);
  });

  it("never goes negative or counts fractional answers", () => {
    expect(xpForLoop(-3)).toBe(READ_XP);
    expect(xpForLoop(1.9)).toBe(READ_XP + QUIZ_XP_PER_CORRECT);
  });
});

describe("xpToReach", () => {
  it("starts at level 1 = 0 XP and grows by a widening step", () => {
    expect(xpToReach(1)).toBe(0);
    expect(xpToReach(0)).toBe(0);
    expect(xpToReach(2)).toBe(40);
    expect(xpToReach(3)).toBe(100);
    expect(xpToReach(4)).toBe(180);
  });

  it("gets steeper each level (later level-ups cost more)", () => {
    const step2 = xpToReach(3) - xpToReach(2);
    const step3 = xpToReach(4) - xpToReach(3);
    expect(step3).toBeGreaterThan(step2);
  });
});

describe("levelForXp", () => {
  it("is level 1 below the first threshold", () => {
    expect(levelForXp(0)).toBe(1);
    expect(levelForXp(39)).toBe(1);
  });

  it("advances exactly at each threshold", () => {
    expect(levelForXp(40)).toBe(2);
    expect(levelForXp(99)).toBe(2);
    expect(levelForXp(100)).toBe(3);
    expect(levelForXp(180)).toBe(4);
  });
});

describe("levelProgress", () => {
  it("reports the start of a level as an empty bar", () => {
    // 40 XP is exactly the level-2 threshold → 0 of the 60 XP that level spans.
    expect(levelProgress(40)).toEqual({
      level: 2,
      xpIntoLevel: 0,
      xpForLevel: 60,
      pct: 0,
    });
  });

  it("reports partial progress through the current level", () => {
    // 70 XP is 30 into level 2 (40→100 spans 60) → half-way.
    expect(levelProgress(70)).toEqual({
      level: 2,
      xpIntoLevel: 30,
      xpForLevel: 60,
      pct: 50,
    });
  });

  it("treats level 1 as spanning up to the first threshold", () => {
    expect(levelProgress(0)).toEqual({
      level: 1,
      xpIntoLevel: 0,
      xpForLevel: 40,
      pct: 0,
    });
    expect(levelProgress(20)).toMatchObject({ level: 1, pct: 50 });
  });

  it("clamps negative XP to the start of level 1", () => {
    expect(levelProgress(-10)).toMatchObject({ level: 1, xpIntoLevel: 0 });
  });
});
