import { describe, expect, it } from "vitest";
import { computeMetrics, percentile, type CallRow } from "./metrics";

// A call row with sensible zero defaults; override only what a case cares about.
function row(overrides: Partial<CallRow> = {}): CallRow {
  return {
    model: "claude-haiku-4-5",
    inputTokens: 0,
    cacheReadTokens: 0,
    cacheCreateTokens: 0,
    latencyMs: 0,
    costUsd: 0,
    safetyFlag: null,
    ...overrides,
  };
}

describe("percentile", () => {
  it("returns null for an empty sample", () => {
    expect(percentile([], 0.5)).toBeNull();
  });

  it("returns the only value for a single-element sample", () => {
    expect(percentile([42], 0.5)).toBe(42);
    expect(percentile([42], 0.95)).toBe(42);
  });

  it("computes the nearest-rank median", () => {
    // 5 values: rank = ceil(0.5*5)=3 → 3rd smallest = 30.
    expect(percentile([50, 10, 30, 20, 40], 0.5)).toBe(30);
  });

  it("computes p95 as an observed value (nearest-rank)", () => {
    const values = Array.from({ length: 100 }, (_, i) => i + 1); // 1..100
    // rank = ceil(0.95*100)=95 → 95th smallest = 95.
    expect(percentile(values, 0.95)).toBe(95);
  });

  it("does not mutate its input", () => {
    const values = [3, 1, 2];
    percentile(values, 0.5);
    expect(values).toEqual([3, 1, 2]);
  });

  it("clamps p=0 to the smallest observed value", () => {
    expect(percentile([5, 9, 1], 0)).toBe(1);
  });
});

describe("computeMetrics", () => {
  it("returns an all-empty shape for no rows and no loops", () => {
    const m = computeMetrics([], 0);
    expect(m).toEqual({
      totalCalls: 0,
      totalLoops: 0,
      totalCostUsd: 0,
      costPerLoopUsd: null,
      cacheHitRate: null,
      p50LatencyMs: null,
      p95LatencyMs: null,
      modelMix: [],
      safetyFlagRate: null,
    });
  });

  it("blends total cost across all calls into cost-per-loop", () => {
    const rows = [
      row({ costUsd: 0.02 }),
      row({ costUsd: 0.03 }),
      row({ costUsd: 0.05 }),
    ];
    const m = computeMetrics(rows, 2);
    expect(m.totalCostUsd).toBeCloseTo(0.1, 10);
    expect(m.costPerLoopUsd).toBeCloseTo(0.05, 10); // 0.10 / 2 loops
  });

  it("cost-per-loop is null when there are calls but no completed loops", () => {
    const m = computeMetrics([row({ costUsd: 0.5 })], 0);
    expect(m.costPerLoopUsd).toBeNull();
  });

  it("computes cache hit rate over input-side tokens only", () => {
    const rows = [
      // 100 fresh input, 300 cache reads, 100 cache writes → 500 input tokens.
      row({ inputTokens: 100, cacheReadTokens: 300, cacheCreateTokens: 100 }),
    ];
    const m = computeMetrics(rows, 1);
    expect(m.cacheHitRate).toBeCloseTo(300 / 500, 10);
  });

  it("cache hit rate ignores output tokens (not part of the row)", () => {
    // No input-side tokens at all → undefined ratio → null, not 0/0=NaN.
    const m = computeMetrics([row({ latencyMs: 10 })], 1);
    expect(m.cacheHitRate).toBeNull();
  });

  it("computes p50/p95 latency across calls", () => {
    const rows = Array.from({ length: 20 }, (_, i) =>
      row({ latencyMs: (i + 1) * 100 })
    ); // 100..2000
    const m = computeMetrics(rows, 1);
    expect(m.p50LatencyMs).toBe(1000); // ceil(0.5*20)=10 → 10th = 1000
    expect(m.p95LatencyMs).toBe(1900); // ceil(0.95*20)=19 → 19th = 1900
  });

  it("groups the model mix and sorts by call count", () => {
    const rows = [
      row({ model: "claude-haiku-4-5", costUsd: 0.001 }),
      row({ model: "claude-haiku-4-5", costUsd: 0.001 }),
      row({ model: "claude-haiku-4-5", costUsd: 0.001 }),
      row({ model: "claude-opus-4-8", costUsd: 0.5 }),
    ];
    const m = computeMetrics(rows, 1);
    expect(m.modelMix).toHaveLength(2);
    expect(m.modelMix[0]).toMatchObject({
      model: "claude-haiku-4-5",
      calls: 3,
    });
    expect(m.modelMix[0].share).toBeCloseTo(3 / 4, 10);
    expect(m.modelMix[1]).toMatchObject({
      model: "claude-opus-4-8",
      calls: 1,
    });
    expect(m.modelMix[1].costUsd).toBeCloseTo(0.5, 10);
  });

  it("computes the safety-flag rate as flagged / total calls", () => {
    const rows = [
      row({ safetyFlag: "blocked_topic" }),
      row({ safetyFlag: null }),
      row({ safetyFlag: null }),
      row({ safetyFlag: null }),
    ];
    const m = computeMetrics(rows, 1);
    expect(m.safetyFlagRate).toBeCloseTo(0.25, 10);
  });

  it("counts totals independently of loops", () => {
    const m = computeMetrics([row(), row(), row()], 7);
    expect(m.totalCalls).toBe(3);
    expect(m.totalLoops).toBe(7);
  });
});
