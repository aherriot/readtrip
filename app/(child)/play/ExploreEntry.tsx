"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { XPBar } from "@/components/game/XPBar";
import { WorldMap } from "@/components/game/WorldMap";
import { ReadingView } from "@/components/reading/ReadingView";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Heading } from "@/components/ui/Heading";
import { Icon } from "@/components/ui/Icon";
import { Illustration } from "@/components/ui/illustrations/Illustration";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { Text } from "@/components/ui/Text";
import type { MapNodeView } from "@/lib/map/nodeState";
import { switchProfileAction } from "@/app/(parent)/profiles/actions";
import {
  randomSeedSuffix,
  useStainSeed,
} from "@/components/layout/paper/StainSeed";
import { pickRandomIllustrations } from "@/lib/illustrations/pick";
import { LessonReader, type LessonTopic } from "./LessonReader";
import { MapTilesSkeleton } from "./PlaySkeleton";

// What /api/explore resolves free-form input into (mirrors NormalizedTopic +
// the original phrasing). Defined locally so this client island doesn't pull the
// server schema module into the browser bundle.
type ResolvedTopic = LessonTopic;

type Phase =
  | { name: "idle" }
  // `fromReading` marks a "go deeper" follow-up: the child left a lesson behind,
  // so we hold a loading view instead of flashing the world map underneath.
  | { name: "resolving"; fromReading: boolean }
  | { name: "reading"; topic: ResolvedTopic }
  | { name: "blocked"; redirect: string };

export function ExploreEntry({
  initialNodes,
  needsSuggestions,
  childName,
  xp,
}: {
  initialNodes: MapNodeView[];
  /**
   * The server-rendered map had nothing "suggested" to tap. Rather than block
   * first paint on the LLM-backed backfill (docs/05), we render immediately and
   * kick it off here, after paint — then refresh to pick up the new tiles.
   */
  needsSuggestions: boolean;
  childName: string;
  xp: number;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>({ name: "idle" });
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  // While the deferred suggestion backfill is in flight, show a "charting" beat
  // in the map region instead of an empty map.
  const [charting, setCharting] = useState(false);
  // One backfill attempt per mount — guards against React's dev double-invoke
  // and a refresh that re-runs the effect before the map has repopulated.
  const backfillAttempted = useRef(false);
  // The in-flight map-growth request for the loop the child just finished (its
  // response resolves only once the new neighbour suggestions are persisted).
  // Started at quiz-finish so its LLM work overlaps the Steer screen; awaited by
  // reset() so returning to the map reveals the grown set instead of a partial,
  // stale-looking one.
  const mapGrowth = useRef<Promise<unknown> | null>(null);
  // Bumps each time a new expedition starts so the reader remounts cleanly —
  // even a "go deeper" follow-up that resolves back to the same slug.
  const [expedition, setExpedition] = useState(0);
  // Topics currently being dismissed — lets the tapped tile show pending state
  // immediately without a local mirror of the whole node list.
  const [dismissing, setDismissing] = useState<Set<string>>(new Set());

  const busy = phase.name === "resolving";
  // Picked once per mount, not per render — otherwise every state update in
  // this component (map growth, dismiss, streaming) would reshuffle the
  // illustrations. Scoped to the "idle" (map) view only, so they don't
  // compete with the reading view's own inline illustrations.
  const [mapBelowShowMore, mapBelowExplore] = useMemo(
    () => pickRandomIllustrations(2),
    []
  );

  // A per-mount nonce so the map's stains don't redraw identically on every
  // reload or every return trip to /play — only `expedition` bumping within a
  // session should feel that stable-until-you-move-on.
  const [mountNonce] = useState(() => randomSeedSuffix());

  // Re-stain the paper as the expedition moves between views. While a lesson is
  // open, LessonReader owns the seed (story vs quiz), so we bow out with `null`;
  // otherwise the map's seed (bumped per expedition, and per mount) is in force.
  useStainSeed(
    phase.name === "reading" ? null : `map:${mountNonce}:${expedition}`
  );

  // Lift the "charting" cover whenever a server refresh delivers a fresh map:
  // the new tiles — or an unchanged empty map, if generation produced none —
  // arrive in the same commit, so the cover drops without a flash and never
  // sticks (the bug where tiles only appeared on a manual refresh). Skip the
  // mount pass so the first render doesn't clear a cover a backfill is about to
  // raise.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setCharting(false);
  }, [initialNodes]);

  // Run a map-writing request behind the charting cover, then refresh to pull
  // the result; the effect above lifts the cover once the fresh map lands.
  // Best-effort: a failed request just refreshes to whatever did persist. Shared
  // by the empty-map backfill and the after-a-loop growth.
  const chartMapUpdate = useCallback(
    (work: Promise<unknown>) => {
      setCharting(true);
      void work
        .catch((err) => console.error("[map] update failed:", err))
        .finally(() => router.refresh());
    },
    [router]
  );

  // Deferred map backfill: when the server rendered a map with nothing to tap,
  // generate suggestions off the render path (a possible Anthropic round-trip)
  // rather than blocking first paint on the model. One attempt per empty-map
  // episode — the guard resets once suggestions exist, so dismissing the last
  // tile mid-session re-triggers it (the backfill used to run on every server
  // render).
  useEffect(() => {
    if (!needsSuggestions) {
      backfillAttempted.current = false;
      return;
    }
    if (backfillAttempted.current) return;
    backfillAttempted.current = true;
    chartMapUpdate(fetch("/api/map/ensure", { method: "POST" }));
  }, [needsSuggestions, chartMapUpdate]);

  // For a "go deeper" follow-up, `parent` carries the loop to link back to and
  // its topic, threaded through so the follow-up resolves against that concept.
  async function explore(
    rawQuery: string,
    parent?: { loopId: string | null; title: string; lessonText: string }
  ) {
    const trimmed = rawQuery.trim();
    if (!trimmed || busy) return;
    setPhase({ name: "resolving", fromReading: parent !== undefined });
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
          previousLesson: parent?.lessonText ?? null,
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
    parent: { loopId: string | null; title: string; lessonText: string }
  ) {
    void explore(followUp, parent);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void explore(query);
  }

  // A map node or curated chip is a known concept, so tapping it skips the
  // safety + normalize round-trip and resolves straight away.
  function startTopic(topic: {
    title: string;
    topicSlug: string;
    illustrationTag?: string | null;
    illustrationCategory?: LessonTopic["illustrationCategory"];
  }) {
    if (busy) return;
    startReading({
      title: topic.title,
      topicSlug: topic.topicSlug,
      intent: "topic",
      rawQuery: topic.title,
      parentLoopId: null,
      parentContext: null,
      previousLesson: null,
      illustrationTag: topic.illustrationTag ?? null,
      illustrationCategory: topic.illustrationCategory ?? null,
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

  // The just-finished loop's map growth (docs/05): light up the explored node
  // and generate fresh neighbour suggestions. Fired from the quiz's finish so
  // the LLM neighbour generation overlaps the Steer screen; the promise is held
  // so reset() can await it before revealing the map. Not fire-and-forget any
  // more — that let the child return to a half-written map (explored tile lit,
  // new neighbours not yet persisted) that only filled in on a later refresh.
  function recordLoopExplored(topic: { topicSlug: string; title: string }) {
    mapGrowth.current = fetch("/api/map", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topicSlug: topic.topicSlug,
        title: topic.title,
      }),
    }).catch((err) => console.error("[map] failed:", err));
  }

  function reset() {
    setPhase({ name: "idle" });
    setQuery("");
    setError(null);

    const growth = mapGrowth.current;
    mapGrowth.current = null;
    // Only a finished loop changes the map — its explored tile plus grown
    // neighbours. Cover the map with the charting beat while those land, then
    // reveal the grown set once. With no loop (the child left a lesson before
    // the quiz) nothing changed, so show the map as-is — no refresh, which would
    // only reshuffle the tiles for no reason.
    if (growth) {
      chartMapUpdate(growth);
    }
  }

  if (phase.name === "reading") {
    return (
      <LessonReader
        key={expedition}
        topic={phase.topic}
        onExplore={reset}
        onGoDeeper={goDeeper}
        onLoopExplored={recordLoopExplored}
      />
    );
  }

  // A "go deeper" follow-up unmounts the finished lesson while the next one
  // resolves. Show a loading view so the world map doesn't flash in the gap
  // before the new lesson takes over.
  if (phase.name === "resolving" && phase.fromReading) {
    return (
      <ReadingView aria-busy="true">
        <div className="flex items-center gap-3" aria-live="polite">
          <Spinner className="text-surface-ink-soft" />
          <Text tone="soft">Charting your next stop…</Text>
        </div>
      </ReadingView>
    );
  }

  if (phase.name === "blocked") {
    return (
      <Card
        elevated
        padding="lg"
        className="flex w-full flex-col items-center gap-4 text-center"
      >
        <Icon name="rainbow" decorative size="xl" />
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
      <XPBar xp={xp} />

      {/* Cover the map with placeholder tiles while it's being generated —
          empty-map backfill or after-a-loop growth — then mount the real map
          ONCE with the finished data. Showing the stale map first would let it
          cascade in, then re-cascade/reshuffle when the grown set lands (the map
          order is randomized per node set). */}
      {charting ? (
        <div
          className="flex flex-col gap-3"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="flex items-center justify-center gap-2">
            <Spinner className="text-surface-ink-soft" />
            <Text tone="soft">Charting your map…</Text>
          </div>
          <MapTilesSkeleton />
        </div>
      ) : (
        <WorldMap
          nodes={initialNodes}
          onSelect={startTopic}
          onDismiss={dismissTopic}
          afterShowMore={
            <Illustration name={mapBelowShowMore} size="xl" decorative />
          }
        />
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input
          label="Enter your own idea"
          name="rawQuery"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try “Why is the sky blue?” or “volcanoes”"
          autoComplete="off"
          maxLength={200}
          disabled={busy}
        />
        <Button
          type="submit"
          loading={busy}
          disabled={query.trim().length === 0}
        >
          {busy ? "Charting…" : "Explore"}
        </Button>
        {error && (
          <Text role="alert" size="sm" className="text-surface-danger">
            {error}
          </Text>
        )}
      </form>

      <Illustration
        name={mapBelowExplore}
        size="xl"
        decorative
        className="self-center"
      />

      <form action={switchProfileAction} className="self-center">
        <SubmitButton variant="ghost" size="md">
          Not {childName}? Switch explorer
        </SubmitButton>
      </form>
    </div>
  );
}
