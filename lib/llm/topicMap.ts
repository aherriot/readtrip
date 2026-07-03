// Topic-map suggestions. LLM output, so it passes through the same
// age-appropriateness guardrails as lessons/quizzes (docs/07) via the system
// prompt, and is filtered against already-explored/dismissed slugs. Each
// suggestion is validated independently (see below) and malformed items are
// dropped rather than failing; a response with no valid items at all returns
// an empty list so the map degrades gracefully rather than crashing.
import { callModel } from "./client";
import {
  TOPIC_MAP_SYSTEM,
  type TopicMapRequest,
  topicMapUserPrompt,
} from "./prompts/topicMap";
import { pickEffort, pickModel } from "./router";
import {
  type TopicSuggestion,
  TopicSuggestionSchema,
  extractJson,
} from "./schemas";

export interface TopicMapOptions extends TopicMapRequest {
  childId?: string | null;
}

export async function suggestTopics(
  opts: TopicMapOptions
): Promise<TopicSuggestion[]> {
  const model = pickModel("topic_map");
  const { text } = await callModel({
    task: "topic_map",
    model,
    system: TOPIC_MAP_SYSTEM,
    user: topicMapUserPrompt(opts),
    maxTokens: 500,
    effort: pickEffort("topic_map"),
    childId: opts.childId ?? null,
  });

  const raw = extractJson(text);
  const rawSuggestions =
    typeof raw === "object" &&
    raw !== null &&
    Array.isArray((raw as { suggestions?: unknown }).suggestions)
      ? (raw as { suggestions: unknown[] }).suggestions
      : [];

  // Validate item-by-item rather than the whole array at once: with up to 8
  // suggestions per response, one malformed item (a `kind` typo, a bad slug)
  // shouldn't sink an otherwise-good batch and leave the map with nothing.
  const suggestions: TopicSuggestion[] = [];
  for (const item of rawSuggestions) {
    const parsed = TopicSuggestionSchema.safeParse(item);
    if (parsed.success) {
      suggestions.push(parsed.data);
    } else {
      console.error("[topic_map] dropping malformed suggestion:", item);
    }
  }

  // Defensive: never surface a topic the child already explored or dismissed,
  // even though the prompt already asks the model to avoid both.
  const avoid = new Set([
    ...(opts.exploredSlugs ?? []),
    ...(opts.dismissedSlugs ?? []),
  ]);
  return suggestions.filter((s) => !avoid.has(s.topicSlug));
}
