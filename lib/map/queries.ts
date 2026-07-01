// World-map persistence (docs/05, docs/06). A child's map is a set of MapNodes:
// topics they've `explored` plus `suggested` neighbours the topic_map task
// proposed. Mastery isn't a fourth status here — it's authoritative on
// TopicProgress and layered in at read time — so writes stay simple (a node only
// ever moves suggested → explored, never back). Sequential read-modify-write, per
// the Neon HTTP driver (no interactive transactions); per-child concurrency is
// effectively single-threaded.
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { mapNodes, topicProgress } from "@/lib/db/schema";
import type { MapNodeView } from "./nodeState";

/**
 * The child's full map: every stored node with its mastery flag folded in from
 * TopicProgress. Ordering for display is the caller's concern (`orderNodes`).
 */
export async function getChildMap(childId: string): Promise<MapNodeView[]> {
  const nodes = await db
    .select({
      topicSlug: mapNodes.topicSlug,
      title: mapNodes.title,
      status: mapNodes.status,
    })
    .from(mapNodes)
    .where(eq(mapNodes.childId, childId));
  if (nodes.length === 0) return [];

  // Fold in mastery: a topic is mastered iff its TopicProgress row says so.
  const progress = await db
    .select({
      topicSlug: topicProgress.topicSlug,
      mastered: topicProgress.mastered,
    })
    .from(topicProgress)
    .where(eq(topicProgress.childId, childId));
  const masteredSlugs = new Set(
    progress.filter((p) => p.mastered).map((p) => p.topicSlug)
  );

  return nodes.map((n) => ({
    topicSlug: n.topicSlug,
    title: n.title,
    // `status` is a free-text column; only these two are ever written here.
    status: n.status === "explored" ? "explored" : "suggested",
    mastered: masteredSlugs.has(n.topicSlug),
  }));
}

/**
 * Mark a topic as explored on the map — upserting the node and, if it was only a
 * suggestion before, promoting it to `explored`. Idempotent on repeat visits.
 */
export async function recordExploredTopic(
  childId: string,
  topic: { topicSlug: string; title: string }
): Promise<void> {
  await db
    .insert(mapNodes)
    .values({
      childId,
      topicSlug: topic.topicSlug,
      title: topic.title,
      status: "explored",
      neighbors: [],
    })
    .onConflictDoUpdate({
      target: [mapNodes.childId, mapNodes.topicSlug],
      set: { status: "explored", title: topic.title },
    });
}

/**
 * Persist the topic_map suggestions for a just-explored topic: record each new
 * neighbour as a `suggested` node (never clobbering one the child already
 * explored) and store the edges on the current node. Suggestions already
 * explored are dropped so the map doesn't re-suggest covered ground.
 */
export async function saveSuggestedNeighbors(
  childId: string,
  currentSlug: string,
  suggestions: readonly { title: string; topicSlug: string }[]
): Promise<void> {
  // Don't re-suggest anything the child has already got on their map.
  const existing = await db
    .select({ topicSlug: mapNodes.topicSlug })
    .from(mapNodes)
    .where(
      and(
        eq(mapNodes.childId, childId),
        inArray(mapNodes.topicSlug, [
          currentSlug,
          ...suggestions.map((s) => s.topicSlug),
        ])
      )
    );
  const known = new Set(existing.map((e) => e.topicSlug));
  const fresh = suggestions.filter((s) => !known.has(s.topicSlug));

  if (fresh.length > 0) {
    await db
      .insert(mapNodes)
      .values(
        fresh.map((s) => ({
          childId,
          topicSlug: s.topicSlug,
          title: s.title,
          status: "suggested",
          neighbors: [],
        }))
      )
      // Two suggestions can't collide (deduped above), but guard the unique
      // (childId, topicSlug) against a racing explore of the same slug.
      .onConflictDoNothing();
  }

  // Record the graph edges on the node the child just finished.
  await db
    .update(mapNodes)
    .set({ neighbors: suggestions.map((s) => s.topicSlug) })
    .where(
      and(eq(mapNodes.childId, childId), eq(mapNodes.topicSlug, currentSlug))
    );
}
