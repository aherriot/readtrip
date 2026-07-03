// Deterministic offline topic-map suggestions — served when no Anthropic key is
// configured (local dev / CI e2e), mirroring cannedQuiz's role for the quiz step
// so the map-growing loop stays exercisable without the API. Kept in its own
// module (no client/db imports) so it's cheaply unit-testable.
import { slugify } from "./slug";

export interface CannedTopic {
  title: string;
  topicSlug: string;
  kind: "neighbor" | "different";
}

// Evergreen, wholesome, easy-to-illustrate topics — the same pool regardless of
// seed, since there's no live model to actually reason about neighbours here.
// All offered as "different": without a model this can't judge what's a true
// neighbour of the seed topic, so it only plays the breadth role.
const TITLES = [
  "Dinosaurs",
  "Outer Space",
  "Volcanoes",
  "Sharks",
  "The Human Body",
  "Wild Weather",
  "Ancient Egypt",
  "Bugs",
];

/**
 * Canned starter suggestions, filtered against anything the child already
 * knows about (explored, suggested, or dismissed) so the offline path still
 * respects "don't repeat topics" like the real model does.
 */
export function cannedTopicSuggestions(
  excludeSlugs: Iterable<string>,
  limit = 4
): CannedTopic[] {
  const skip = new Set(excludeSlugs);
  return TITLES.map((title) => ({
    title,
    topicSlug: slugify(title),
    kind: "different" as const,
  }))
    .filter((t) => !skip.has(t.topicSlug))
    .slice(0, limit);
}
