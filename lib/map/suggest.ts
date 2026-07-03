// Dynamic, interest-driven map suggestions (docs/05). After a child explores a
// topic, the topic_map task proposes nearby topics to grow their map toward what
// they love. Suggestions are LLM output, so they inherit the topic_map prompt's
// age-appropriateness guardrails (docs/07) and are filtered against topics the
// child already has. When no Anthropic key is configured (local dev / CI e2e) we
// fall back to curated starter topics so the map still grows without the API.
import { freshStarters, SUGGESTED_TOPICS } from "@/lib/explore/topics";
import { suggestTopics } from "@/lib/llm";
import { isLlmOffline } from "@/lib/llm/client";
import { filterSafeTopics } from "@/lib/safety";
import {
  getChildMap,
  getDismissedTopicSlugs,
  saveSuggestedNeighbors,
} from "./queries";

/** Cap how many neighbours we surface per topic so the map stays scannable. */
const MAX_SUGGESTIONS = 4;

/** Cap how many curated "something different" starters we top up per event. */
const MAX_DIVERSE_SUGGESTIONS = 4;

/**
 * Generate and persist neighbour suggestions for a just-explored topic. Reads
 * the child's map to avoid re-suggesting covered ground, asks the model (or the
 * offline fallback) for "deep" neighbours, tops up a few curated "diverse"
 * starters for breadth, and saves the result as `suggested` nodes + graph
 * edges. `saveSuggestedNeighbors` enforces the per-kind cap (docs/05), evicting
 * the oldest unengaged suggestions in a bucket before it grows past 8 deep / 4
 * diverse. Best-effort: callers should not block the child on this.
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
  const knownSlugs = map.map((n) => n.topicSlug);

  const deep = await deepSuggestions({
    childId: input.childId,
    seedSlug: input.topicSlug,
    seedTitle: input.title,
    exploredSlugs,
  });
  const diverse = freshStarters(
    [input.topicSlug, ...knownSlugs],
    MAX_DIVERSE_SUGGESTIONS
  );

  const combined = [
    ...deep.map((s) => ({ ...s, kind: "deep" as const })),
    ...diverse.map((s) => ({ ...s, kind: "diverse" as const })),
  ];

  if (combined.length === 0) return;
  await saveSuggestedNeighbors(input.childId, input.topicSlug, combined);
}

/**
 * Guarantee the child's map always has something explorable, now that the
 * "something new" chip row is gone and the map is the sole map-side source of
 * suggestions. A no-op once any `suggested` node exists; otherwise backfills
 * from whatever pool applies — deep neighbours of the last thing they
 * explored, curated starters they haven't seen, or (the rare case of a child
 * who dismissed every curated starter without ever exploring one) the curated
 * set again, since nothing else is left to grow from. Called on every map
 * read, so a freshly-emptied map (new explorer, or one dismissed down to
 * nothing) never renders with zero tiles to tap.
 */
export async function ensureSuggestions(childId: string): Promise<void> {
  const map = await getChildMap(childId);
  if (map.some((n) => n.status === "suggested")) return;

  const dismissedSlugs = await getDismissedTopicSlugs(childId);
  const exploredSlugs = map
    .filter((n) => n.status === "explored")
    .map((n) => n.topicSlug);
  const knownSlugs = [...map.map((n) => n.topicSlug), ...dismissedSlugs];

  const lastExplored = map.findLast((n) => n.status === "explored");
  const deep = lastExplored
    ? await deepSuggestions({
        childId,
        seedSlug: lastExplored.topicSlug,
        seedTitle: lastExplored.title,
        exploredSlugs,
      })
    : [];

  let diverse = freshStarters(knownSlugs, MAX_DIVERSE_SUGGESTIONS);
  if (deep.length === 0 && diverse.length === 0) {
    diverse = SUGGESTED_TOPICS.slice(0, MAX_DIVERSE_SUGGESTIONS);
  }

  const combined = [
    ...deep.map((s) => ({ ...s, kind: "deep" as const })),
    ...diverse.map((s) => ({ ...s, kind: "diverse" as const })),
  ];
  if (combined.length === 0) return;
  // No single "current" topic these are neighbours of — the diverse-only case
  // writes no edges, and the deep case's edges belong on `lastExplored`, not
  // this placeholder, so an unmatched slug is intentional.
  await saveSuggestedNeighbors(childId, "__ensure-suggestions__", combined);
}

/** LLM (or offline-fallback) neighbour suggestions, safety-filtered. Shared by
 * both the post-explore refresh and the never-empty backfill above. */
async function deepSuggestions(input: {
  childId: string;
  seedSlug: string;
  seedTitle: string;
  exploredSlugs: string[];
}): Promise<{ title: string; topicSlug: string }[]> {
  const deep = isLlmOffline()
    ? offlineSuggestions(input.seedSlug, input.exploredSlugs)
    : await suggestTopics({
        currentTitle: input.seedTitle,
        exploredSlugs: input.exploredSlugs,
        childId: input.childId,
      });

  // Safety backstop before anything is saved/shown: topic-map suggestions are
  // LLM output too (docs/07), so filter them through the same output rules as
  // lessons and quizzes. The topic_map prompt is the primary guardrail; this
  // drops any suggestion that drifts age-inappropriate. (Offline + curated
  // suggestions are already safe, so this is a no-op for them.)
  return filterSafeTopics(deep).slice(0, MAX_SUGGESTIONS);
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
