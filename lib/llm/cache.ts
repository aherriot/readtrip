// Prompt-caching helpers. Caching is a *prefix match*: keep stable content first
// (role + safety rules + format spec) and volatile content last (topic + reading
// level + history). We mark the stable system prefix with `cache_control` so
// repeated popular topics read the cache at ~0.1× input price.
//
// The invariant to honor (or the cache silently misses): the system text must be
// byte-identical every request. No timestamps, UUIDs, or per-request IDs — those
// live in the user message, after the breakpoint. Also note the minimum cacheable
// prefix is model-dependent (~2048 tokens on Sonnet 4.6, ~4096 on Haiku 4.5); a
// short system prompt simply won't cache. Verify with `cache_read_input_tokens`.
import type Anthropic from "@anthropic-ai/sdk";

/**
 * Wrap a stable system prompt as a single cached text block. Everything up to
 * this breakpoint (there are no tools) is cached together.
 */
export function cachedSystem(text: string): Anthropic.TextBlockParam[] {
  return [
    {
      type: "text",
      text,
      cache_control: { type: "ephemeral" },
    },
  ];
}
