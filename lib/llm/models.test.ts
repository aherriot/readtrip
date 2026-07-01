import { describe, expect, it } from "vitest";
import {
  MODELS,
  computeCostUsd,
  modelSupportsEffort,
  modelSupportsThinking,
} from "./models";

describe("model capabilities", () => {
  it("enables thinking + effort on the content engines only", () => {
    for (const model of [MODELS.sonnet, MODELS.opus]) {
      expect(modelSupportsThinking(model)).toBe(true);
      expect(modelSupportsEffort(model)).toBe(true);
    }
  });

  it("disables thinking + effort on Haiku (it 400s on effort)", () => {
    expect(modelSupportsThinking(MODELS.haiku)).toBe(false);
    expect(modelSupportsEffort(MODELS.haiku)).toBe(false);
  });
});

describe("computeCostUsd", () => {
  it("prices plain input + output off the per-MTok rate", () => {
    // Sonnet: $3/MTok in, $15/MTok out.
    const cost = computeCostUsd(MODELS.sonnet, {
      inputTokens: 1_000_000,
      outputTokens: 1_000_000,
      cacheReadTokens: 0,
      cacheCreateTokens: 0,
    });
    expect(cost).toBeCloseTo(18, 6);
  });

  it("prices cache reads at ~0.1x and writes at ~1.25x input", () => {
    // Haiku: $1/MTok in. 1M cache-read = $0.10, 1M cache-write = $1.25.
    const cost = computeCostUsd(MODELS.haiku, {
      inputTokens: 0,
      outputTokens: 0,
      cacheReadTokens: 1_000_000,
      cacheCreateTokens: 1_000_000,
    });
    expect(cost).toBeCloseTo(1.35, 6);
  });

  it("returns 0 for an unknown model rather than crashing logging", () => {
    expect(
      computeCostUsd("some-future-model", {
        inputTokens: 1000,
        outputTokens: 1000,
        cacheReadTokens: 0,
        cacheCreateTokens: 0,
      })
    ).toBe(0);
  });
});
