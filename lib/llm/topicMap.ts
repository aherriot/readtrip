// Topic-map suggestions. LLM output, so it passes through the same
// age-appropriateness guardrails as lessons/quizzes (docs/07) via the system
// prompt, and is filtered against already-explored slugs. Returns validated
// suggestions; on malformed output returns an empty list so the map degrades
// gracefully rather than crashing.
import { callModel } from "./client";
import {
  TOPIC_MAP_SYSTEM,
  type TopicMapRequest,
  topicMapUserPrompt,
} from "./prompts/topicMap";
import { pickEffort, pickModel } from "./router";
import {
  type TopicSuggestions,
  TopicSuggestionsSchema,
  extractJson,
} from "./schemas";

export interface TopicMapOptions extends TopicMapRequest {
  childId?: string | null;
}

export async function suggestTopics(
  opts: TopicMapOptions
): Promise<TopicSuggestions["suggestions"]> {
  const model = pickModel("topic_map");
  const { text } = await callModel({
    task: "topic_map",
    model,
    system: TOPIC_MAP_SYSTEM,
    user: topicMapUserPrompt(opts),
    maxTokens: 400,
    effort: pickEffort("topic_map"),
    childId: opts.childId ?? null,
  });

  const parsed = TopicSuggestionsSchema.safeParse(extractJson(text));
  if (!parsed.success) return [];

  // Defensive: never surface a topic the child already explored.
  const explored = new Set(opts.exploredSlugs ?? []);
  return parsed.data.suggestions.filter((s) => !explored.has(s.topicSlug));
}
