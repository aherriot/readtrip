// Pure aggregation for the parent-facing observability dashboard (docs/09 M6).
// Feed it the raw LlmCallLog rows for a parent's children plus the number of
// completed loops, and it computes the headline numbers: cost per loop, cache
// hit rate, p50/p95 latency, model mix, and the safety-flag rate. Kept pure (no
// DB, no I/O) so it's unit-tested exhaustively in metrics.test.ts; the query
// layer (queries.ts) does the fetching and hands rows here.

/** One LlmCallLog row, narrowed to the fields the metrics need. */
export interface CallRow {
  model: string;
  inputTokens: number;
  cacheReadTokens: number;
  cacheCreateTokens: number;
  latencyMs: number;
  costUsd: number;
  /** Null when the call was clean; a reason string when a safety layer flagged it. */
  safetyFlag: string | null;
}

/** Per-model slice of the call mix, sorted by call count (most-used first). */
export interface ModelMixEntry {
  model: string;
  calls: number;
  /** Share of total calls, 0..1. */
  share: number;
  costUsd: number;
}

export interface DashboardMetrics {
  /** Total LLM calls logged for this parent's children. */
  totalCalls: number;
  /** Completed loops (Explore → Read → Quiz) for this parent's children. */
  totalLoops: number;
  /** Sum of every call's cost, in USD. */
  totalCostUsd: number;
  /**
   * Total cost divided by completed loops. A loop fans out to several calls
   * (safety, normalize, lesson, quiz, map…), so this is the true blended cost of
   * one full learning loop. Null when there are no loops yet (avoid /0).
   */
  costPerLoopUsd: number | null;
  /**
   * Share of *input* tokens served from the prompt cache, 0..1: cache reads over
   * all input tokens (uncached input + cache reads + cache writes). Null when no
   * input tokens have been seen. This is the payoff of the cached system prefix
   * (docs/03) — higher is cheaper.
   */
  cacheHitRate: number | null;
  /** Median call latency in ms. Null when there are no calls. */
  p50LatencyMs: number | null;
  /** 95th-percentile call latency in ms. Null when there are no calls. */
  p95LatencyMs: number | null;
  /** Per-model breakdown, most-used first. */
  modelMix: ModelMixEntry[];
  /** Share of calls a safety layer flagged, 0..1. Null when there are no calls. */
  safetyFlagRate: number | null;
}

/**
 * The nearest-rank percentile of a numeric sample. `p` is a fraction in [0, 1]
 * (0.5 = median, 0.95 = p95). Returns null for an empty sample. Nearest-rank
 * (not interpolated) keeps the result an actual observed latency, which reads
 * more honestly on a small demo dataset than a synthetic in-between value. The
 * input need not be sorted — it's sorted internally.
 */
export function percentile(values: number[], p: number): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  // Nearest-rank: rank = ceil(p * N), clamped to [1, N], then 0-indexed.
  const rank = Math.ceil(p * sorted.length);
  const index = Math.min(Math.max(rank, 1), sorted.length) - 1;
  return sorted[index];
}

/**
 * Compute every dashboard metric from the raw call rows + the parent's loop
 * count. Empty input yields an all-zero/null shape the UI renders as "no data
 * yet" rather than crashing.
 */
export function computeMetrics(
  rows: CallRow[],
  totalLoops: number
): DashboardMetrics {
  const totalCalls = rows.length;

  const totalCostUsd = rows.reduce((sum, r) => sum + r.costUsd, 0);

  // Cache hit rate over input-side tokens only (output tokens are never cached).
  let cacheReads = 0;
  let totalInput = 0;
  for (const r of rows) {
    cacheReads += r.cacheReadTokens;
    totalInput += r.inputTokens + r.cacheReadTokens + r.cacheCreateTokens;
  }

  const latencies = rows.map((r) => r.latencyMs);

  // Model mix, grouped and sorted by call count (ties broken by cost).
  const byModel = new Map<string, { calls: number; costUsd: number }>();
  for (const r of rows) {
    const entry = byModel.get(r.model) ?? { calls: 0, costUsd: 0 };
    entry.calls += 1;
    entry.costUsd += r.costUsd;
    byModel.set(r.model, entry);
  }
  const modelMix: ModelMixEntry[] = [...byModel.entries()]
    .map(([model, { calls, costUsd }]) => ({
      model,
      calls,
      share: totalCalls > 0 ? calls / totalCalls : 0,
      costUsd,
    }))
    .sort((a, b) => b.calls - a.calls || b.costUsd - a.costUsd);

  const flagged = rows.reduce((n, r) => n + (r.safetyFlag ? 1 : 0), 0);

  return {
    totalCalls,
    totalLoops,
    totalCostUsd,
    costPerLoopUsd: totalLoops > 0 ? totalCostUsd / totalLoops : null,
    cacheHitRate: totalInput > 0 ? cacheReads / totalInput : null,
    p50LatencyMs: percentile(latencies, 0.5),
    p95LatencyMs: percentile(latencies, 0.95),
    modelMix,
    safetyFlagRate: totalCalls > 0 ? flagged / totalCalls : null,
  };
}
