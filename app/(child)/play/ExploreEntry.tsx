"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { WorldMap } from "@/components/game/WorldMap";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Input } from "@/components/ui/Input";
import { Text } from "@/components/ui/Text";
import { freshStarters } from "@/lib/explore/topics";
import type { MapNodeView } from "@/lib/map/nodeState";
import { switchProfileAction } from "@/app/(parent)/profiles/actions";
import { LessonReader, type LessonTopic } from "./LessonReader";

// What /api/explore resolves free-form input into (mirrors NormalizedTopic +
// the original phrasing). Defined locally so this client island doesn't pull the
// server schema module into the browser bundle.
type ResolvedTopic = LessonTopic;

type Phase =
  | { name: "idle" }
  | { name: "resolving" }
  | { name: "reading"; topic: ResolvedTopic }
  | { name: "blocked"; redirect: string };

export function ExploreEntry({
  initialNodes,
  dismissedSlugs,
  childName,
}: {
  initialNodes: MapNodeView[];
  /** Permanently dismissed topics — excluded from every pool, not just the map. */
  dismissedSlugs: string[];
  childName: string;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>({ name: "idle" });
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  // Bumps each time a new expedition starts so the reader remounts cleanly —
  // even a "go deeper" follow-up that resolves back to the same slug.
  const [expedition, setExpedition] = useState(0);
  // Topics currently being dismissed — lets the tapped tile show pending state
  // immediately without a local mirror of the whole node list.
  const [dismissing, setDismissing] = useState<Set<string>>(new Set());

  const busy = phase.name === "resolving";

  // For a "go deeper" follow-up, `parent` carries the loop to link back to and
  // its topic, threaded through so the follow-up resolves against that concept.
  async function explore(
    rawQuery: string,
    parent?: { loopId: string | null; title: string }
  ) {
    const trimmed = rawQuery.trim();
    if (!trimmed || busy) return;
    setPhase({ name: "resolving" });
    setError(null);
    try {
      const res = await fetch("/api/explore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawQuery: trimmed,
          parentContext: parent?.title ?? null,
        }),
      });
      if (!res.ok) throw new Error(`explore failed: ${res.status}`);
      const data = (await res.json()) as
        { ok: true; topic: ResolvedTopic } | { ok: false; redirect: string };
      if (data.ok) {
        startReading({
          ...data.topic,
          parentLoopId: parent?.loopId ?? null,
          parentContext: parent?.title ?? null,
        });
      } else {
        setPhase({ name: "blocked", redirect: data.redirect });
      }
    } catch {
      setPhase({ name: "idle" });
      setError("Something went wrong. Let's try that again!");
    }
  }

  function startReading(topic: ResolvedTopic) {
    setExpedition((n) => n + 1);
    setPhase({ name: "reading", topic });
  }

  // Steer → "go deeper": spawn a threaded follow-up loop from the finished one.
  function goDeeper(
    followUp: string,
    parent: { loopId: string | null; title: string }
  ) {
    void explore(followUp, parent);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void explore(query);
  }

  // A map node or curated chip is a known concept, so tapping it skips the
  // safety + normalize round-trip and resolves straight away.
  function startTopic(topic: { title: string; topicSlug: string }) {
    if (busy) return;
    startReading({
      title: topic.title,
      topicSlug: topic.topicSlug,
      intent: "topic",
      rawQuery: topic.title,
      parentLoopId: null,
      parentContext: null,
    });
  }

  // Permanently remove a tile from the map. Awaited (not fire-and-forget) since
  // the child is watching this specific tile disappear — a refresh only happens
  // once the write has actually landed.
  async function dismissTopic(node: MapNodeView) {
    if (dismissing.has(node.topicSlug)) return;
    setDismissing((prev) => new Set(prev).add(node.topicSlug));
    try {
      await fetch("/api/map/dismiss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicSlug: node.topicSlug,
          title: node.title,
        }),
      });
      router.refresh();
    } catch (err) {
      console.error("[map] failed to dismiss topic:", err);
    } finally {
      setDismissing((prev) => {
        const next = new Set(prev);
        next.delete(node.topicSlug);
        return next;
      });
    }
  }

  function reset() {
    setPhase({ name: "idle" });
    setQuery("");
    setError(null);
    // Re-fetch the server-rendered map so a topic just explored shows as lit and
    // any new suggested neighbours appear.
    router.refresh();
  }

  if (phase.name === "reading") {
    return (
      <LessonReader
        key={expedition}
        topic={phase.topic}
        onExplore={reset}
        onGoDeeper={goDeeper}
      />
    );
  }

  if (phase.name === "blocked") {
    return (
      <Card
        elevated
        padding="lg"
        className="flex w-full flex-col items-center gap-4 text-center"
      >
        <span className="text-5xl" aria-hidden="true">
          🌈
        </span>
        <Heading level={2}>Let&apos;s find something else</Heading>
        <Text tone="soft" measure aria-live="polite">
          {phase.redirect}
        </Text>
        <Button onClick={reset}>Try another idea</Button>
      </Card>
    );
  }

  // Curated starters the child doesn't already have on their map — a breadth
  // counterweight to the map's narrow-and-deep growth. If the map is all bugs,
  // this still offers weather, space, dinosaurs… (docs/05: interest-driven, but
  // never a filter bubble). Empty for a brand-new explorer whose seeded map
  // already *is* the starters.
  const differentTopics = freshStarters([
    ...initialNodes.map((n) => n.topicSlug),
    ...dismissedSlugs,
  ]);

  return (
    <div className="flex w-full flex-col gap-8">
      <WorldMap
        nodes={initialNodes}
        onSelect={startTopic}
        onDismiss={dismissTopic}
      />

      {differentTopics.length > 0 && (
        <div className="flex flex-col gap-3">
          <Heading level={2}>Something new</Heading>
          <Text tone="soft" size="sm">
            Fresh ideas, nothing like your map so far — tap one to wander
            somewhere new.
          </Text>
          <div
            className="flex flex-wrap gap-3"
            role="group"
            aria-label="Something new"
          >
            {differentTopics.map((topic) => (
              <Button
                key={topic.topicSlug}
                variant="secondary"
                size="md"
                disabled={busy}
                onClick={() => startTopic(topic)}
                leadingIcon={<span aria-hidden="true">{topic.emoji}</span>}
              >
                {topic.title}
              </Button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Text size="sm" tone="soft">
          Or type your own idea:
        </Text>
        <Input
          label="What do you want to explore?"
          name="rawQuery"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try “Why is the sky blue?” or “volcanoes”"
          autoComplete="off"
          maxLength={200}
          disabled={busy}
        />
        <Button type="submit" disabled={busy || query.trim().length === 0}>
          {busy ? "Charting…" : "Explore"}
        </Button>
        {error && (
          <Text role="alert" size="sm" className="text-surface-danger">
            {error}
          </Text>
        )}
      </form>

      <form action={switchProfileAction} className="self-center">
        <Button type="submit" variant="ghost" size="md">
          Not {childName}? Switch explorer
        </Button>
      </form>
    </div>
  );
}
