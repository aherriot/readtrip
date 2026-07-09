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
 */
export type IllustrationCategory =
  "history" | "science" | "biology" | "geography" | "space";

export interface IllustrationMeta {
  /** Human-readable name — used as the default a11y label and in the gallery. */
  label: string;
  /** The specific subject a topic slug should match against, e.g. "pyramids". */
  tag: string;
  /** Broad fallback bucket when no illustration matches a topic's specific tag. */
  category: IllustrationCategory;
}

export const ILLUSTRATION_CATALOG = {
  pyramid: { label: "Ancient pyramid", tag: "pyramids", category: "history" },
  castle: { label: "Castle", tag: "castles", category: "history" },
  volcano: { label: "Volcano", tag: "volcanoes", category: "science" },
  microscope: { label: "Microscope", tag: "microscopes", category: "science" },
  dinosaur: { label: "Dinosaur", tag: "dinosaurs", category: "biology" },
  "human-body": {
    label: "Human body",
    tag: "human-body",
    category: "biology",
  },
  "mountain-range": {
    label: "Mountain range",
    tag: "mountains",
    category: "geography",
  },
  rainforest: {
    label: "Rainforest",
    tag: "rainforests",
    category: "geography",
  },
  "rocket-launch": {
    label: "Rocket launch",
    tag: "space-travel",
    category: "space",
  },
  telescope: { label: "Telescope", tag: "astronomy", category: "space" },
} as const satisfies Record<string, IllustrationMeta>;

export type IllustrationName = keyof typeof ILLUSTRATION_CATALOG;

export const ILLUSTRATION_NAMES = Object.keys(
  ILLUSTRATION_CATALOG
) as IllustrationName[];
