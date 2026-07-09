// Deterministic offline topic-map suggestions — served when no Anthropic key is
// configured (local dev / CI e2e), mirroring cannedQuiz's role for the quiz step
// so the map-growing loop stays exercisable without the API. Kept in its own
// module (no client/db imports) so it's cheaply unit-testable.
import type { IllustrationCategory } from "@/components/ui/illustrations/catalog";
import { slugify } from "./slug";

export interface CannedTopic {
  title: string;
  topicSlug: string;
  kind: "neighbor" | "different";
  illustrationTag: string;
  illustrationCategory: IllustrationCategory;
}

// Evergreen, wholesome, easy-to-illustrate topics — the same pool regardless of
// seed, since there's no live model to actually reason about neighbours here.
// All offered as "different": without a model this can't judge what's a true
// neighbour of the seed topic, so it only plays the breadth role.
//
// `illustrationTag` doesn't have to already exist in the catalog (some don't
// yet — sharks, weather, bugs) — the resolver falls back to `illustrationCategory`
// when a tag has no matching art, same as the real model's output would.
const TOPICS: {
  title: string;
  illustrationTag: string;
  illustrationCategory: IllustrationCategory;
}[] = [
  {
    title: "Dinosaurs",
    illustrationTag: "dinosaurs",
    illustrationCategory: "biology",
  },
  {
    title: "Outer Space",
    illustrationTag: "astronomy",
    illustrationCategory: "space",
  },
  {
    title: "Volcanoes",
    illustrationTag: "volcanoes",
    illustrationCategory: "science",
  },
  {
    title: "Sharks",
    illustrationTag: "sharks",
    illustrationCategory: "biology",
  },
  {
    title: "The Human Body",
    illustrationTag: "human-body",
    illustrationCategory: "biology",
  },
  {
    title: "Wild Weather",
    illustrationTag: "weather",
    illustrationCategory: "science",
  },
  {
    title: "Ancient Egypt",
    illustrationTag: "pyramids",
    illustrationCategory: "history",
  },
  { title: "Bugs", illustrationTag: "bugs", illustrationCategory: "biology" },
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
  return TOPICS.map((t) => ({
    title: t.title,
    topicSlug: slugify(t.title),
    kind: "different" as const,
    illustrationTag: t.illustrationTag,
    illustrationCategory: t.illustrationCategory,
  }))
    .filter((t) => !skip.has(t.topicSlug))
    .slice(0, limit);
}
