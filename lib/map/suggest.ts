// Dynamic, interest-driven map suggestions (docs/05). After a child explores a
// topic, the topic_map task proposes nearby topics to grow their map toward what
// they love. Suggestions are LLM output, so they inherit the topic_map prompt's
// age-appropriateness guardrails (docs/07) and are filtered against topics the
// child already has. When no Anthropic key is configured (local dev / CI e2e) we
// fall back to curated starter topics so the map still grows without the API.
import { SUGGESTED_TOPICS } from "@/lib/explore/topics";
import { suggestTopics } from "@/lib/llm";
import { isLlmOffline } from "@/lib/llm/client";
import { filterSafeTopics } from "@/lib/safety";
import { getChildMap, saveSuggestedNeighbors } from "./queries";

/** Cap how many neighbours we surface per topic so the map stays scannable. */
const MAX_SUGGESTIONS = 4;

/**
 * Generate and persist neighbour suggestions for a just-explored topic. Reads
 * the child's map to avoid re-suggesting covered ground, asks the model (or the
 * offline fallback), and saves the result as `suggested` nodes + graph edges.
 * Best-effort: callers should not block the child on this.
 */
export async function refreshSuggestions(input: {
  childId: string;
  topicSlug: string;
  title: string;
}): Promise<void> {
  const map = await getChildMap(input.childId);
  const exploredSlugs = map
    .filter((n) => n.status === "explored")
    .map((n) => n.topicSlug);

  const suggestions = isLlmOffline()
    ? offlineSuggestions(input.topicSlug, exploredSlugs)
    : await suggestTopics({
        currentTitle: input.title,
        exploredSlugs,
        childId: input.childId,
      });

  // Safety backstop before anything is saved/shown: topic-map suggestions are
  // LLM output too (docs/07), so filter them through the same output rules as
  // lessons and quizzes. The topic_map prompt is the primary guardrail; this
  // drops any suggestion that drifts age-inappropriate. (Offline suggestions are
  // curated + safe, so this is a no-op there.)
  const safe = filterSafeTopics(suggestions);

  if (safe.length === 0) return;
  await saveSuggestedNeighbors(
    input.childId,
    input.topicSlug,
    safe.slice(0, MAX_SUGGESTIONS)
  );
}

// Offline stand-in for the topic_map model: curated starter topics minus the one
// just explored and anything already explored. Deterministic, so the map grows
// predictably in dev and e2e.
function offlineSuggestions(
  currentSlug: string,
  exploredSlugs: string[]
): { title: string; topicSlug: string }[] {
  const skip = new Set([currentSlug, ...exploredSlugs]);
  return SUGGESTED_TOPICS.filter((t) => !skip.has(t.topicSlug))
    .slice(0, MAX_SUGGESTIONS)
    .map((t) => ({ title: t.title, topicSlug: t.topicSlug }));
}
