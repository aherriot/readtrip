"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Input } from "@/components/ui/Input";
import { Text } from "@/components/ui/Text";
import { SUGGESTED_TOPICS, type SuggestedTopic } from "@/lib/explore/topics";
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

export function ExploreEntry() {
  const [phase, setPhase] = useState<Phase>({ name: "idle" });
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  // Bumps each time a new expedition starts so the reader remounts cleanly —
  // even a "go deeper" follow-up that resolves back to the same slug.
  const [expedition, setExpedition] = useState(0);

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

  // A curated suggestion is a known concept, so it skips the safety + normalize
  // round-trip and resolves straight away (like tapping a world-map node).
  function chooseSuggestion(topic: SuggestedTopic) {
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

  function reset() {
    setPhase({ name: "idle" });
    setQuery("");
    setError(null);
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

  return (
    <div className="flex w-full flex-col gap-8">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
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

      <div className="flex flex-col gap-3">
        <Text size="sm" tone="soft">
          Or jump into one of these:
        </Text>
        <div
          className="flex flex-wrap gap-3"
          role="group"
          aria-label="Suggested topics"
        >
          {SUGGESTED_TOPICS.map((topic) => (
            <Button
              key={topic.topicSlug}
              variant="secondary"
              size="md"
              disabled={busy}
              onClick={() => chooseSuggestion(topic)}
              leadingIcon={<span aria-hidden="true">{topic.emoji}</span>}
            >
              {topic.title}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
