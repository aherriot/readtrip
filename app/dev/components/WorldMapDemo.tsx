"use client";

import { TopicNode } from "@/components/game/TopicNode";
import { WorldMap } from "@/components/game/WorldMap";
import type { MapNodeView, TopicNodeState } from "@/lib/map/nodeState";

// Renders the map on the field-journal surface (the whole app's one surface).
// Handlers are no-ops — this is a gallery. `suggested` gets two entries
// (deep/diverse) since the kind changes the node's header strip.
const NODE_VARIANTS: { state: TopicNodeState; kind?: "deep" | "diverse" }[] = [
  { state: "locked" },
  { state: "suggested", kind: "deep" },
  { state: "suggested", kind: "diverse" },
  { state: "explored" },
  { state: "mastered" },
];

const SAMPLE_NODES: MapNodeView[] = (
  [
    {
      topicSlug: "dinosaurs",
      title: "Dinosaurs",
      status: "explored",
      mastered: true,
      kind: "deep",
    },
    {
      topicSlug: "volcanoes",
      title: "Volcanoes",
      status: "explored",
      mastered: false,
      kind: "deep",
    },
    {
      topicSlug: "outer-space",
      title: "Outer Space",
      status: "suggested",
      mastered: false,
      kind: "deep",
    },
    {
      topicSlug: "sharks",
      title: "Sharks",
      status: "suggested",
      mastered: false,
      kind: "deep",
    },
    {
      topicSlug: "the-human-body",
      title: "The Human Body",
      status: "suggested",
      mastered: false,
      kind: "diverse",
    },
    {
      topicSlug: "wild-weather",
      title: "Wild Weather",
      status: "suggested",
      mastered: false,
      kind: "diverse",
    },
    {
      topicSlug: "ancient-egypt",
      title: "Ancient Egypt",
      status: "suggested",
      mastered: false,
      kind: "diverse",
    },
    {
      topicSlug: "the-solar-system",
      title: "The Solar System",
      status: "suggested",
      mastered: false,
      kind: "deep",
    },
  ] satisfies Omit<MapNodeView, "illustrationTag" | "illustrationCategory">[]
).map((n) => ({ ...n, illustrationTag: null, illustrationCategory: null }));

export function WorldMapDemo() {
  return (
    <div
      data-testid="worldmap-demo"
      className="flex flex-col gap-8 rounded-lg bg-surface p-6 text-surface-ink"
    >
      <div className="flex flex-col gap-3">
        <p className="font-display text-xs tracking-wide text-surface-ink-soft uppercase">
          TopicNode — every state (icon + word + color)
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {NODE_VARIANTS.map(({ state, kind }) => (
            <TopicNode
              key={`${state}-${kind ?? ""}`}
              title="Volcanoes"
              state={state}
              kind={kind}
              // Show the hand-inked dismiss ("cross it out") control where it
              // renders — only suggested/explored nodes are dismissible.
              onDismiss={() => {}}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="font-display text-xs tracking-wide text-surface-ink-soft uppercase">
          WorldMap — randomized, with a &ldquo;new&rdquo; + &ldquo;dive&rdquo;
          tile up front
        </p>
        <WorldMap nodes={SAMPLE_NODES} onSelect={() => {}} />
      </div>
    </div>
  );
}
