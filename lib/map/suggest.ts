// Dynamic, interest-driven map suggestions (docs/05). After a child explores a
// topic, the topic_map task proposes both nearby ("neighbor") topics and a
// couple of unrelated ("different") ones for breadth, so the map doesn't
// narrow entirely onto one interest. Suggestions are LLM output, so they
// inherit the topic_map prompt's age-appropriateness guardrails (docs/07) and
// are filtered against topics the child already has or dismissed. When no
// Anthropic key is configured (local dev / CI e2e) we fall back to a
// deterministic canned pool so the map still grows without the API.
import type { IllustrationCategory } from "@/components/ui/illustrations/catalog";
import { cannedTopicSuggestions } from "@/lib/llm/cannedTopics";
import { suggestTopics } from "@/lib/llm";
import { isLlmOffline } from "@/lib/llm/client";
import type { ReadingLevel } from "@/lib/llm/prompts/readingLevel";
import { filterSafeTopics } from "@/lib/safety";
import type { MapNodeView } from "./nodeState";
import {
  getChildMap,
  getDismissedTopicSlugs,
  saveSuggestedNeighbors,
  type SuggestionKind,
} from "./queries";

/** Cap how many suggestions we ask for/keep per call, split by kind so one
 * batch can't flood a bucket past what `saveSuggestedNeighbors`'s per-kind cap
 * (queries.ts SUGGESTION_CAPS) intends — that cap only evicts *existing* rows
 * to make room, it doesn't trim an oversized incoming batch itself. */
const MAX_NEIGHBOR_SUGGESTIONS = 8;
const MAX_DIFFERENT_SUGGESTIONS = 4;

/**
 * Generate and persist suggestions for a just-explored topic. Reads the
 * child's map to avoid re-suggesting covered ground, asks the model (or the
 * offline fallback) for a mix of "neighbor" and "different" topics, and saves
 * the result as `suggested` nodes + graph edges. `saveSuggestedNeighbors`
 * enforces the per-kind cap (docs/05), evicting the oldest unengaged
 * suggestions in a bucket before it grows past 8 deep / 4 diverse. Best-effort:
 * callers should not block the child on this.
 */
export async function refreshSuggestions(input: {
  childId: string;
  topicSlug: string;
  title: string;
  readingLevel: ReadingLevel;
}): Promise<void> {
  const [map, dismissedSlugs] = await Promise.all([
    getChildMap(input.childId),
    getDismissedTopicSlugs(input.childId),
  ]);
  const exploredSlugs = map
    .filter((n) => n.status === "explored")
    .map((n) => n.topicSlug);

  const suggestions = await modelSuggestions({
    childId: input.childId,
    readingLevel: input.readingLevel,
    seed: { slug: input.topicSlug, title: input.title },
    exploredSlugs,
    dismissedSlugs,
  });

  if (suggestions.length === 0) return;
  await saveSuggestedNeighbors(input.childId, input.topicSlug, suggestions);
}

/**
 * Guarantee the child's map always has something explorable, now that the
 * "something new" chip row is gone and the map is the sole source of
 * suggestions. A no-op once any `suggested` node exists; otherwise asks the
 * model to grow from whatever the child last explored, or — for a brand-new
 * explorer, or one who has dismissed every suggestion without exploring any —
 * asks it for a fresh batch of starter topics instead, told what's already
 * been explored and dismissed so it doesn't repeat itself. Invoked from the
 * `/api/map/ensure` endpoint, which /play calls from the client after paint
 * when it renders a map with no suggested tiles — so this possible model
 * round-trip stays off the render path and a freshly-emptied map still ends up
 * with something to tap.
 *
 * Returns the resulting map: the already-fetched one when nothing changed (the
 * common case / no-op), or a fresh read after a backfill wrote new nodes.
 */
export async function ensureSuggestions(
  childId: string,
  readingLevel: ReadingLevel
): Promise<MapNodeView[]> {
  const map = await getChildMap(childId);
  if (map.some((n) => n.status === "suggested")) return map;

  const dismissedSlugs = await getDismissedTopicSlugs(childId);
  const exploredSlugs = map
    .filter((n) => n.status === "explored")
    .map((n) => n.topicSlug);
  const lastExplored = map.findLast((n) => n.status === "explored");

  const suggestions = await modelSuggestions({
    childId,
    readingLevel,
    seed: lastExplored
      ? { slug: lastExplored.topicSlug, title: lastExplored.title }
      : null,
    exploredSlugs,
    dismissedSlugs,
  });

  if (suggestions.length === 0) return map;
  // No single "current" topic these are neighbours of — the starter-mode case
  // writes no edges, and the seeded case's edges belong on `lastExplored`, not
  // this placeholder, so an unmatched slug is intentional.
  await saveSuggestedNeighbors(childId, "__ensure-suggestions__", suggestions);
  return getChildMap(childId);
}

/** LLM (or offline-fallback) suggestions, safety-filtered and mapped onto the
 * `deep`/`diverse` pools the map/DB layer expects. Shared by both the
 * post-explore refresh and the never-empty backfill above. `seed` is the topic
 * to grow neighbours from; pass `null` for starter-mode (no topic to grow
 * from), which asks for breadth topics instead. */
async function modelSuggestions(input: {
  childId: string;
  readingLevel: ReadingLevel;
  seed: { slug: string; title: string } | null;
  exploredSlugs: string[];
  dismissedSlugs: string[];
}): Promise<
  {
    title: string;
    topicSlug: string;
    kind: SuggestionKind;
    illustrationTag: string | null;
    illustrationCategory: IllustrationCategory | null;
  }[]
> {
  const avoidSlugs = [...input.exploredSlugs, ...input.dismissedSlugs];
  const suggestions = isLlmOffline()
    ? cannedTopicSuggestions(
        input.seed ? [input.seed.slug, ...avoidSlugs] : avoidSlugs,
        MAX_NEIGHBOR_SUGGESTIONS
      )
    : await suggestTopics({
        currentTitle: input.seed?.title,
        readingLevel: input.readingLevel,
        exploredSlugs: input.exploredSlugs,
        dismissedSlugs: input.dismissedSlugs,
        childId: input.childId,
      });

  // Safety backstop before anything is saved/shown: topic-map suggestions are
  // LLM output too (docs/07), so filter them through the same output rules as
  // lessons and quizzes. The topic_map prompt is the primary guardrail; this
  // drops any suggestion that drifts age-inappropriate. (Canned offline
  // suggestions are already safe, so this is a no-op for them.)
  const safe = filterSafeTopics(suggestions);
  const neighbor = safe
    .filter((s) => s.kind === "neighbor")
    .slice(0, MAX_NEIGHBOR_SUGGESTIONS);
  const different = safe
    .filter((s) => s.kind === "different")
    .slice(0, MAX_DIFFERENT_SUGGESTIONS);

  return [...neighbor, ...different].map((s) => ({
    title: s.title,
    topicSlug: s.topicSlug,
    kind: s.kind === "neighbor" ? "deep" : "diverse",
    illustrationTag: s.illustrationTag,
    illustrationCategory: s.illustrationCategory,
  }));
}
