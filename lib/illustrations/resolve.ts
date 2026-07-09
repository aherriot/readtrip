import {
  ILLUSTRATION_CATALOG,
  type IllustrationCategory,
  type IllustrationName,
} from "@/components/ui/illustrations/catalog";

// No illustration is truly "generic", but these three are drawn as
// deliberately topic-agnostic exploration/discovery motifs — a compass, a
// magnifying glass, a field journal — so they read reasonably regardless of
// what the unresolved topic actually was. A pool (not one hardcoded name) so
// the last-resort fallback doesn't always show the same picture.
const GENERIC_FALLBACK_POOL: readonly IllustrationName[] = [
  "compass",
  "magnifying-glass",
  "field-journal",
];

function buildIndex<K extends string>(
  key: "tag" | "category"
): Record<K, IllustrationName[]> {
  const index = {} as Record<K, IllustrationName[]>;
  for (const [name, meta] of Object.entries(ILLUSTRATION_CATALOG) as [
    IllustrationName,
    (typeof ILLUSTRATION_CATALOG)[IllustrationName],
  ][]) {
    const k = meta[key] as K;
    (index[k] ??= []).push(name);
  }
  return index;
}

// Built once at module load, not per call — the catalog is static.
const BY_TAG = buildIndex<string>("tag");
const BY_CATEGORY = buildIndex<IllustrationCategory>("category");

function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** Stable pick among ties — the same `seed` always lands on the same item, so
 * a topic doesn't reshuffle its illustration on every render. */
function pickStable<T>(items: readonly T[], seed: string): T {
  return items[hashString(seed) % items.length];
}

export interface ResolveIllustrationInput {
  /** The topic's specific illustration tag, e.g. `"pyramids"` — from the
   * topic_map LLM's `illustrationTag` field, or `null`/absent if unknown. */
  tag?: string | null;
  /** The topic's broad category fallback, e.g. `"history"`. */
  category?: IllustrationCategory | null;
  /** Stabilizes the pick when a tag/category matches more than one
   * illustration — pass the topic's slug so the same topic always resolves
   * to the same art. */
  seed: string;
}

/**
 * Resolve a topic to an illustration name: specific tag first (if it has
 * art), then the coarser category, then the generic fallback pool. See the
 * illustration-llm-tag-matching design — this fallback chain exists because
 * tags/categories can be stale (an old topic predating a tag, or a tag that
 * never got art) and must never fail to resolve to *something*.
 */
export function resolveIllustration({
  tag,
  category,
  seed,
}: ResolveIllustrationInput): IllustrationName {
  if (tag && BY_TAG[tag]?.length) {
    return pickStable(BY_TAG[tag], seed);
  }
  if (category && BY_CATEGORY[category]?.length) {
    return pickStable(BY_CATEGORY[category], seed);
  }
  return pickStable(GENERIC_FALLBACK_POOL, seed);
}
