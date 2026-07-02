"use client";

import { TopicNode } from "@/components/game/TopicNode";
import { WorldMap } from "@/components/game/WorldMap";
import type { MapNodeView, TopicNodeState } from "@/lib/map/nodeState";

// The map lives on the night/play surface; render the demo there so the glow +
// aqua/gold accents read as intended. Handlers are no-ops — this is a gallery.
const STATES: TopicNodeState[] = [
  "locked",
  "suggested",
  "explored",
  "mastered",
];

const SAMPLE_NODES: MapNodeView[] = [
  {
    topicSlug: "dinosaurs",
    title: "Dinosaurs",
    status: "explored",
    mastered: true,
  },
  {
    topicSlug: "volcanoes",
    title: "Volcanoes",
    status: "explored",
    mastered: false,
  },
  {
    topicSlug: "outer-space",
    title: "Outer Space",
    status: "suggested",
    mastered: false,
  },
  {
    topicSlug: "sharks",
    title: "Sharks",
    status: "suggested",
    mastered: false,
  },
  {
    topicSlug: "the-human-body",
    title: "The Human Body",
    status: "suggested",
    mastered: false,
  },
  {
    topicSlug: "wild-weather",
    title: "Wild Weather",
    status: "suggested",
    mastered: false,
  },
];

export function WorldMapDemo() {
  return (
    <div
      data-surface="night"
      data-testid="worldmap-demo"
      className="flex flex-col gap-8 rounded-lg bg-surface p-6 text-surface-ink"
    >
      <div className="flex flex-col gap-3">
        <p className="font-display text-xs tracking-wide text-surface-ink-soft uppercase">
          TopicNode — every state (icon + word + color)
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATES.map((state) => (
            <TopicNode key={state} title="Volcanoes" state={state} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="font-display text-xs tracking-wide text-surface-ink-soft uppercase">
          WorldMap — explored first, then suggested
        </p>
        <WorldMap nodes={SAMPLE_NODES} onSelect={() => {}} />
      </div>
    </div>
  );
}
