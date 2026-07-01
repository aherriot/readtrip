// Model catalog, capabilities, and pricing for ReadTrip's LLM layer.
//
// We deliberately route *down* to Sonnet/Haiku for cost on this high-volume,
// kid-facing workload and *up* to Opus only where it pays off — a stated product
// goal (docs/03-llm-integration.md), not a silent downgrade. Use the exact ID
// strings below; do not append date suffixes.

export const MODELS = {
  haiku: "claude-haiku-4-5",
  sonnet: "claude-sonnet-4-6",
  opus: "claude-opus-4-8",
} as const;

export type ModelId = (typeof MODELS)[keyof typeof MODELS];

// Per-MTok prices (USD), current as of 2026-06 (docs/03). Re-check before launch.
interface Price {
  input: number;
  output: number;
}

const PRICING: Record<ModelId, Price> = {
  [MODELS.haiku]: { input: 1.0, output: 5.0 },
  [MODELS.sonnet]: { input: 3.0, output: 15.0 },
  [MODELS.opus]: { input: 5.0, output: 25.0 },
};

// Adaptive thinking + the `effort` parameter are supported on the 4.6+ content
// engines but NOT on Haiku 4.5 (effort 400s there, and Haiku's low-stakes
// classification calls don't need thinking). Gate on these to avoid 400s.
const THINKING_MODELS = new Set<string>([MODELS.sonnet, MODELS.opus]);
const EFFORT_MODELS = new Set<string>([MODELS.sonnet, MODELS.opus]);

export function modelSupportsThinking(model: string): boolean {
  return THINKING_MODELS.has(model);
}

export function modelSupportsEffort(model: string): boolean {
  return EFFORT_MODELS.has(model);
}

// Prompt-cache economics: reads cost ~0.1× input price; the first write costs
// ~1.25× (5-minute TTL). See docs/03 + the prompt-caching design notes.
const CACHE_READ_MULTIPLIER = 0.1;
const CACHE_WRITE_MULTIPLIER = 1.25;

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheCreateTokens: number;
}

/**
 * Compute the USD cost of a single call from its token usage. `inputTokens` is
 * the uncached remainder; cache reads/writes are priced off the input rate with
 * their respective multipliers. Pure so it's unit-tested in models.test.ts.
 */
export function computeCostUsd(model: string, usage: TokenUsage): number {
  const price = PRICING[model as ModelId];
  if (!price) {
    // Unknown model — cost is unknowable, but never let this crash logging.
    return 0;
  }
  const inputCost =
    usage.inputTokens * price.input +
    usage.cacheReadTokens * price.input * CACHE_READ_MULTIPLIER +
    usage.cacheCreateTokens * price.input * CACHE_WRITE_MULTIPLIER;
  const outputCost = usage.outputTokens * price.output;
  return (inputCost + outputCost) / 1_000_000;
}
