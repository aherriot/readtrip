// Curated "jump right in" suggestions for the Explore screen. Evergreen, popular,
// and easy to make wholesome + accurate (docs/03 calls these out as the topics
// the lesson prompt handles best). Each carries its own normalized slug, so
// tapping one skips straight to a known concept without an LLM round-trip — the
// same shortcut a world-map node uses (docs/09). Free-form input still goes
// through /api/explore (safety_precheck → normalize_topic).
import { slugify } from "../llm/slug";

export interface SuggestedTopic {
  /** Kid-facing display title. */
  title: string;
  /** Normalized concept key — matches what normalize_topic would produce. */
  topicSlug: string;
  /** Decorative emoji for the chip (aria-hidden — the title carries meaning). */
  emoji: string;
}

// Titles are the source of truth; slugs are derived with the same `slugify`
// normalize_topic falls back to, so a suggestion and a typed-in equivalent
// dedupe to one topic for progress / badges / the map.
const TOPICS: ReadonlyArray<Omit<SuggestedTopic, "topicSlug">> = [
  { title: "Dinosaurs", emoji: "🦕" },
  { title: "Outer Space", emoji: "🚀" },
  { title: "Volcanoes", emoji: "🌋" },
  { title: "Sharks", emoji: "🦈" },
  { title: "The Human Body", emoji: "🫀" },
  { title: "Wild Weather", emoji: "⛈️" },
  { title: "Ancient Egypt", emoji: "🏺" },
  { title: "Bugs", emoji: "🐛" },
];

export const SUGGESTED_TOPICS: readonly SuggestedTopic[] = TOPICS.map(
  (topic) => ({ ...topic, topicSlug: slugify(topic.title) })
);
