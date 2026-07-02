// Shared LLM rate-limit guard for the child-facing generation routes (explore,
// lesson, quiz, map). All four draw on one per-child budget so total Anthropic
// spend per child is bounded regardless of which endpoints get hit.
//
// A full loop makes ~4 model calls (normalize → lesson → quiz → map suggestions)
// and takes a child at least a minute (read a ~200-word lesson, answer a quiz),
// so ~20 requests/minute is several loops of headroom for even an eager kid while
// still stopping a scripted flood cold.
import { rateLimit } from "./index";

export const LLM_RATE_LIMIT = { limit: 20, windowSeconds: 60 } as const;

/**
 * Enforce the per-child LLM budget. Returns a ready-to-send `429` Response when
 * the child is over budget, or `null` to proceed. Call after the child's
 * ownership is verified, keyed by the verified `childId`.
 */
export async function checkLlmRateLimit(
  childId: string
): Promise<Response | null> {
  const result = await rateLimit({ key: `llm:${childId}`, ...LLM_RATE_LIMIT });
  if (result.ok) return null;

  return Response.json(
    { error: "rate-limited", retryAfterSeconds: result.retryAfterSeconds },
    {
      status: 429,
      headers: { "Retry-After": String(result.retryAfterSeconds) },
    }
  );
}
