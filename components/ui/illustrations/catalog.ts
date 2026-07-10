/**
 * The illustration CATALOG — pure metadata, no illustration modules imported.
 * Kept separate from `registry.ts` (which holds the `next/dynamic` component
 * per name) so anything that only needs to reason about *which* illustrations
 * exist — the `/dev/illustrations` gallery, or a future topic → illustration
 * resolver — never pulls illustration SVG chunks into its own bundle just to
 * read a label or a tag.
 *
 * Two levels of matching, coarsest last: `tag` is the specific subject (what
 * a topic like "Ancient Egypt" maps to directly); `category` is the broad
 * fallback bucket used when no illustration exists for a specific tag yet.
 *
 * Entries are kept alphabetical by key — there's no other ordering to
 * preserve (tag/category groupings live in the data, not the key order), so
 * alphabetical is the only order that stays stable as the set grows.
 */
// Single source of truth for the category enum — read by the zod schema that
// validates the topic_map LLM's `illustrationCategory` field and by the
// prompt that tells it the allowed values (lib/llm/prompts/topicMap.ts), so
// adding a category here is the only place that needs to change.
export const ILLUSTRATION_CATEGORIES = [
  "history",
  "science",
  "biology",
  "geography",
  "space",
  "engineering",
  "transportation",
  "arts-culture",
  "mythology",
] as const;
export type IllustrationCategory = (typeof ILLUSTRATION_CATEGORIES)[number];

export interface IllustrationMeta {
  /** Human-readable name — used as the default a11y label and in the gallery. */
  label: string;
  /** The specific subject a topic slug should match against, e.g. "pyramids". */
  tag: string;
  /** Broad fallback bucket when no illustration matches a topic's specific tag. */
  category: IllustrationCategory;
}

export const ILLUSTRATION_CATALOG = {
  airplane: {
    label: "Airplane",
    tag: "airplanes",
    category: "transportation",
  },
  astronaut: { label: "Astronaut", tag: "astronauts", category: "space" },
  aurora: { label: "Aurora borealis", tag: "auroras", category: "science" },
  "ballet-dancer": {
    label: "Ballet dancer",
    tag: "dance",
    category: "arts-culture",
  },
  beehive: { label: "Beehive", tag: "bees", category: "biology" },
  bicycle: {
    label: "Bicycle",
    tag: "bicycles",
    category: "transportation",
  },
  "black-hole": {
    label: "Black hole",
    tag: "black-holes",
    category: "space",
  },
  bridge: { label: "Bridge", tag: "bridges", category: "engineering" },
  butterfly: { label: "Butterfly", tag: "butterflies", category: "biology" },
  canyon: { label: "Canyon", tag: "canyons", category: "geography" },
  car: { label: "Car", tag: "cars", category: "transportation" },
  castle: { label: "Castle", tag: "castles", category: "history" },
  cave: { label: "Cave", tag: "caves", category: "geography" },
  "chemistry-lab": {
    label: "Chemistry lab",
    tag: "chemistry",
    category: "science",
  },
  colosseum: {
    label: "Colosseum",
    tag: "ancient-rome",
    category: "history",
  },
  comet: { label: "Comet", tag: "comets", category: "space" },
  compass: { label: "Compass", tag: "compasses", category: "geography" },
  "coral-reef": {
    label: "Coral reef",
    tag: "coral-reefs",
    category: "biology",
  },
  crane: { label: "Crane", tag: "cranes", category: "engineering" },
  desert: { label: "Desert", tag: "deserts", category: "geography" },
  dinosaur: { label: "Dinosaur", tag: "dinosaurs", category: "biology" },
  "dna-strand": { label: "DNA strand", tag: "dna", category: "biology" },
  dragon: { label: "Dragon", tag: "dragons", category: "mythology" },
  "field-journal": {
    label: "Field journal",
    tag: "journals",
    category: "history",
  },
  "gears-machine": {
    label: "Gears machine",
    tag: "gears",
    category: "engineering",
  },
  glacier: { label: "Glacier", tag: "glaciers", category: "geography" },
  "greek-temple": {
    label: "Greek temple",
    tag: "ancient-greece",
    category: "history",
  },
  griffin: { label: "Griffin", tag: "griffins", category: "mythology" },
  "hot-air-balloon": {
    label: "Hot air balloon",
    tag: "hot-air-balloons",
    category: "transportation",
  },
  "human-body": {
    label: "Human body",
    tag: "human-body",
    category: "biology",
  },
  knight: { label: "Knight", tag: "knights", category: "history" },
  "magnifying-glass": {
    label: "Magnifying glass",
    tag: "magnifying-glasses",
    category: "science",
  },
  mermaid: { label: "Mermaid", tag: "mermaids", category: "mythology" },
  microscope: { label: "Microscope", tag: "microscopes", category: "science" },
  "mountain-range": {
    label: "Mountain range",
    tag: "mountains",
    category: "geography",
  },
  octopus: { label: "Octopus", tag: "octopuses", category: "biology" },
  "paint-palette": {
    label: "Paint palette",
    tag: "painting",
    category: "arts-culture",
  },
  phoenix: { label: "Phoenix", tag: "phoenixes", category: "mythology" },
  pyramid: { label: "Ancient pyramid", tag: "pyramids", category: "history" },
  rainforest: {
    label: "Rainforest",
    tag: "rainforests",
    category: "geography",
  },
  "robot-arm": {
    label: "Robot arm",
    tag: "robotics",
    category: "engineering",
  },
  "rocket-launch": {
    label: "Rocket launch",
    tag: "space-travel",
    category: "space",
  },
  sailboat: {
    label: "Sailboat",
    tag: "sailboats",
    category: "transportation",
  },
  satellite: { label: "Satellite", tag: "satellites", category: "space" },
  shark: { label: "Shark", tag: "sharks", category: "biology" },
  "solar-system": {
    label: "Solar system",
    tag: "solar-system",
    category: "space",
  },
  "steam-train": {
    label: "Steam train",
    tag: "trains",
    category: "transportation",
  },
  storm: { label: "Storm", tag: "weather", category: "science" },
  "story-book": {
    label: "Story book",
    tag: "storytelling",
    category: "arts-culture",
  },
  submarine: {
    label: "Submarine",
    tag: "submarines",
    category: "transportation",
  },
  telescope: { label: "Telescope", tag: "astronomy", category: "space" },
  "theater-masks": {
    label: "Theater masks",
    tag: "theater",
    category: "arts-culture",
  },
  unicorn: { label: "Unicorn", tag: "unicorns", category: "mythology" },
  "viking-ship": { label: "Viking ship", tag: "vikings", category: "history" },
  violin: { label: "Violin", tag: "violins", category: "arts-culture" },
  volcano: { label: "Volcano", tag: "volcanoes", category: "science" },
  waterfall: {
    label: "Waterfall",
    tag: "waterfalls",
    category: "geography",
  },
  windmill: {
    label: "Windmill",
    tag: "windmills",
    category: "engineering",
  },
} as const satisfies Record<string, IllustrationMeta>;

export type IllustrationName = keyof typeof ILLUSTRATION_CATALOG;

export const ILLUSTRATION_NAMES = Object.keys(
  ILLUSTRATION_CATALOG
) as IllustrationName[];

// The specific-subject vocabulary a topic can match against (see
// lib/illustrations/resolve.ts). Derived from the catalog, not hand-kept in
// sync — a tag can (and often will) map to more than one illustration, so
// this list is shorter than ILLUSTRATION_NAMES. Also the closed enum the
// topic_map LLM's `illustrationTag` field is validated against — regenerate
// automatically as illustrations are added, no prompt/schema edit needed for
// tags that already exist; a genuinely new tag still needs the prompt's
// example list touched (lib/llm/prompts/topicMap.ts) so the model knows to
// reach for it.
export const ILLUSTRATION_TAGS = Array.from(
  new Set(Object.values(ILLUSTRATION_CATALOG).map((meta) => meta.tag))
) as [string, ...string[]];
