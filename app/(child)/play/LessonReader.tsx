"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { LessonChunk } from "@/components/reading/LessonChunk";
import { ReadingView } from "@/components/reading/ReadingView";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Icon } from "@/components/ui/Icon";
import type { IllustrationCategory } from "@/components/ui/illustrations/catalog";
import { Illustration } from "@/components/ui/illustrations/Illustration";
import { preloadIllustration } from "@/components/ui/illustrations/registry";
import { Spinner } from "@/components/ui/Spinner";
import { Text } from "@/components/ui/Text";
import { pickRandomIllustrations } from "@/lib/illustrations/pick";
import { resolveIllustration } from "@/lib/illustrations/resolve";
import { toLessonChunks } from "@/lib/reading/chunks";
import { useStainSeed } from "@/components/layout/paper/StainSeed";
import { QuizRunner } from "./QuizRunner";

// The resolved topic the reader generates a lesson for (from ExploreEntry).
export interface LessonTopic {
  title: string;
  topicSlug: string;
  intent: "topic" | "question";
  rawQuery: string;
  /** Set on a "go deeper" follow-up: the loop being drilled into. */
  parentLoopId?: string | null;
  /** The parent loop's topic title, threaded into the follow-up's prompts. */
  parentContext?: string | null;
  /** The parent loop's lesson text, so a follow-up covers new ground. */
  previousLesson?: string | null;
  /**
   * Illustration matching (lib/illustrations/resolve.ts) — set when this
   * topic came from a map node the topic_map LLM tagged. Absent/null for a
   * free-form /api/explore topic (normalize_topic doesn't emit these yet),
   * in which case the reader falls back to a random pair.
   */
  illustrationTag?: string | null;
  illustrationCategory?: IllustrationCategory | null;
}

/** How the child steers on from a finished quiz (docs/01 §6). */
export interface SteerHandlers {
  /** Start a brand-new expedition — back to the Explore screen. */
  onExplore: () => void;
  /** Drill into the current topic with a follow-up (spawns a threaded loop). */
  onGoDeeper: (
    followUp: string,
    parent: { loopId: string | null; title: string; lessonText: string }
  ) => void;
}

type Status = "loading" | "streaming" | "done" | "blocked" | "error";

type LessonStream = {
  ignore: boolean;
  controller: AbortController;
  pendingTeardown: ReturnType<typeof setTimeout> | null;
};

// Deferred, cancelable teardown — see LessonReader's fetch effect for why a
// stream can't just be aborted synchronously on every cleanup.
function scheduleTeardown(state: LessonStream): void {
  state.pendingTeardown = setTimeout(() => {
    state.ignore = true;
    state.pendingTeardown = null;
    state.controller.abort();
  }, 0);
}

export function LessonReader({
  topic,
  onExplore,
  onGoDeeper,
  onLoopExplored,
}: {
  topic: LessonTopic;
  /** Fired once the quiz is finished, to grow the map for this topic. */
  onLoopExplored: (topic: { topicSlug: string; title: string }) => void;
} & SteerHandlers) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<Status>("loading");
  const [redirect, setRedirect] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  // Picked once per topic (not per streamed chunk) so the pair stays put
  // while the lesson text streams in around them. When the topic came from a
  // map node the topic_map LLM tagged, resolve real matches (two different
  // seeds off the same tag/category, so the pair isn't the same illustration
  // twice); a free-form /api/explore topic has neither field yet, so falls
  // back to a random pair.
  const [storyFirst, storySecond] = useMemo(() => {
    if (topic.illustrationTag || topic.illustrationCategory) {
      return [
        resolveIllustration({
          tag: topic.illustrationTag,
          category: topic.illustrationCategory,
          seed: topic.topicSlug,
        }),
        resolveIllustration({
          tag: topic.illustrationTag,
          category: topic.illustrationCategory,
          seed: `${topic.topicSlug}:2`,
        }),
      ];
    }
    return pickRandomIllustrations(2);
  }, [topic.topicSlug, topic.illustrationTag, topic.illustrationCategory]);

  // Warm both illustrations' chunks as soon as we know which two the lesson
  // will use — long before either one's paragraph anchor streams in — so
  // `<Illustration>` below finds the chunk already resolved instead of
  // rendering blank while a `next/dynamic` import fetches mid-stream.
  useEffect(() => {
    preloadIllustration(storyFirst);
    preloadIllustration(storySecond);
  }, [storyFirst, storySecond]);

  // Own the paper's stain seed while a lesson is open: the story and its quiz
  // each get their own pattern, keyed to the topic so it's stable per topic.
  useStainSeed(`${showQuiz ? "quiz" : "story"}:${topic.topicSlug}`);

  // Pinned paragraph offsets — see usage below for why refs, not derived values.
  const firstAnchorRef = useRef<number | null>(null);
  const secondAnchorRef = useRef<number | null>(null);

  // Identifies the stream started below, so a re-invocation of the fetch
  // effect can tell whether it's for the SAME lesson (reuse the running
  // stream) or a genuinely new one (tear down and restart). Content-based,
  // not `topic`'s object reference — see the effect for why reference alone
  // isn't a safe signal here.
  const topicKey = JSON.stringify([
    topic.topicSlug,
    topic.title,
    topic.intent,
    topic.rawQuery,
    topic.parentLoopId ?? null,
    topic.parentContext ?? null,
    topic.previousLesson ?? null,
  ]);
  const streamRef = useRef<(LessonStream & { topicKey: string }) | null>(null);

  useEffect(() => {
    // React re-invokes this effect more than once for the SAME topic: once,
    // predictably, under React StrictMode's dev-only mount→cleanup→mount
    // double-invoke; and again, less predictably, whenever a `next/dynamic`
    // Illustration below finishes loading and its Suspense boundary
    // resolves for the first time (confirmed empirically — disabling the
    // illustrations removes the extra invocations entirely). `topic`'s
    // reference and this component's DOM node both stay provably identical
    // across these re-invocations, so this isn't a remount; it's React
    // replaying effects.
    //
    // Naively aborting-and-restarting on every invocation throws the
    // in-progress stream away and starts a fresh one from scratch each
    // time — the lesson text visibly snaps backward to a short, fresh
    // chunk and the reader flashes blank for a moment as the new stream
    // catches back up. Since React always runs the PREVIOUS effect's
    // cleanup before the next invocation, the cleanup below defers its
    // teardown by a tick; if the very next invocation is for the same
    // topic, it cancels that pending teardown and reuses the still-running
    // stream instead of starting a new one. A genuine topic change (a new
    // lesson) tears down the old stream immediately, same as before.
    const existing = streamRef.current;
    if (existing && existing.topicKey === topicKey) {
      if (existing.pendingTeardown !== null) {
        clearTimeout(existing.pendingTeardown);
        existing.pendingTeardown = null;
      }
      return () => scheduleTeardown(existing);
    }
    if (existing) {
      if (existing.pendingTeardown !== null)
        clearTimeout(existing.pendingTeardown);
      existing.ignore = true;
      existing.controller.abort();
    }

    const controller = new AbortController();
    const state = {
      topicKey,
      controller,
      ignore: false,
      pendingTeardown: null as ReturnType<typeof setTimeout> | null,
    };
    streamRef.current = state;

    async function run() {
      try {
        const res = await fetch("/api/lesson", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: topic.title,
            topicSlug: topic.topicSlug,
            intent: topic.intent,
            rawQuery: topic.rawQuery,
            parentContext: topic.parentContext,
            previousLesson: topic.previousLesson,
          }),
          signal: controller.signal,
        });
        if (!res.ok || !res.body)
          throw new Error(`lesson failed: ${res.status}`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let acc = "";

        for (;;) {
          const { value, done } = await reader.read();
          if (state.ignore) return;
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // SSE frames are separated by a blank line; each carries one `data:` JSON.
          const frames = buffer.split("\n\n");
          buffer = frames.pop() ?? "";
          for (const frame of frames) {
            const line = frame.split("\n").find((l) => l.startsWith("data:"));
            if (!line) continue;
            const event = JSON.parse(line.slice(5).trim()) as
              | { type: "chunk"; text: string }
              | { type: "blocked"; redirect: string }
              | { type: "done" }
              | { type: "error" };

            if (event.type === "chunk") {
              acc += event.text;
              if (state.ignore) return;
              setText(acc);
              setStatus("streaming");
            } else if (event.type === "blocked") {
              if (state.ignore) return;
              setRedirect(event.redirect);
              setStatus("blocked");
              return;
            } else if (event.type === "done") {
              if (state.ignore) return;
              setStatus("done");
              return;
            } else {
              if (state.ignore) return;
              setStatus("error");
              return;
            }
          }
        }
        // Stream ended without an explicit done/error frame.
        if (!state.ignore)
          setStatus((s) => (s === "streaming" ? "done" : "error"));
      } catch (err) {
        if (state.ignore || controller.signal.aborted) return;
        console.error(err);
        setStatus("error");
      }
    }

    void run();
    return () => scheduleTeardown(state);
  }, [topic, topicKey]);

  if (status === "blocked") {
    return (
      <Card
        elevated
        padding="lg"
        className="flex w-full flex-col items-center gap-4 text-center"
      >
        <Icon name="rainbow" decorative size="xl" />
        <Heading level={2}>Let&apos;s find something else</Heading>
        <Text tone="soft" measure aria-live="polite">
          {redirect}
        </Text>
        <Button onClick={onExplore}>Try another idea</Button>
      </Card>
    );
  }

  // Once the child chooses to start, the quiz owns the screen (it POSTs the
  // lesson text to /api/quiz, which is also where the Loop is finally persisted).
  if (showQuiz) {
    return (
      <QuizRunner
        topic={topic}
        lessonText={text}
        onExplore={onExplore}
        onGoDeeper={onGoDeeper}
        onLoopExplored={onLoopExplored}
      />
    );
  }

  if (status === "error") {
    return (
      <Card
        elevated
        padding="lg"
        className="flex w-full flex-col items-center gap-4 text-center"
      >
        <Icon name="compass" decorative size="xl" />
        <Heading level={2}>That trip got lost</Heading>
        <Text tone="soft" measure aria-live="polite">
          Something went wrong charting your lesson. Let&apos;s try again!
        </Text>
        <Button onClick={onExplore}>Explore something else</Button>
      </Card>
    );
  }

  const chunks = toLessonChunks(text);

  // Fixed paragraph offsets, not fractions of the (still-growing) total: once
  // paragraph 2 or 4 has streamed in, "right after paragraph 2/4" never
  // changes no matter how many more paragraphs follow, so the illustration
  // never has to hop to a new spot in the chunks.map below. A fraction-based
  // position (e.g. "1/3 of the way down") keeps sliding forward as the total
  // grows, which moves the <Illustration> to a different tree position each
  // time — React unmounts the old instance and mounts a fresh one (each is a
  // next/dynamic import with no `loading` fallback), flashing blank until it
  // resolves. Short lessons that never reach paragraph 2 (or 4) only settle
  // once streaming finishes, tacking the illustration on at the end.
  if (firstAnchorRef.current === null) {
    if (chunks.length > 2) {
      firstAnchorRef.current = 1; // right after the 2nd paragraph
    } else if (status === "done" && chunks.length > 0) {
      firstAnchorRef.current = chunks.length - 1;
    }
  }
  if (secondAnchorRef.current === null) {
    if (chunks.length > 4) {
      secondAnchorRef.current = 3; // right after the 4th paragraph
    } else if (status === "done" && chunks.length > 0) {
      secondAnchorRef.current = chunks.length - 1;
    }
  }
  const firstIllustrationAt = firstAnchorRef.current ?? -1;
  const secondIllustrationAt = secondAnchorRef.current ?? -1;

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <ReadingView
        aria-label={`Lesson about ${topic.title}`}
        aria-busy={status !== "done"}
      >
        <Heading level={1}>{topic.title}</Heading>
        {chunks.length === 0 ? (
          <div className="flex items-center gap-3" aria-live="polite">
            <Spinner className="text-surface-ink-soft" />
            <Text tone="soft">Charting your lesson…</Text>
          </div>
        ) : (
          // No flex `gap` here — the ruled rhythm comes from .rt-journal's
          // per-paragraph margins (a whole ruled row), so text stays on the
          // lines. A stray gap would push every paragraph off the grid. Each
          // illustration sits in a 224px (7 ruled rows) box for the same
          // reason — a bare 208px xl illustration isn't a whole multiple of
          // the ruled-row height, which would knock every line after it off
          // the grid.
          <div aria-live="polite">
            {chunks.map((chunk, i) => (
              <Fragment key={i}>
                <LessonChunk>{chunk}</LessonChunk>
                {i === firstIllustrationAt && (
                  <div className="flex h-[224px] items-center justify-center">
                    <Illustration name={storyFirst} size="xl" decorative />
                  </div>
                )}
                {i === secondIllustrationAt && (
                  <div className="flex h-[224px] items-center justify-center">
                    <Illustration name={storySecond} size="xl" decorative />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        )}
      </ReadingView>

      {status === "done" && (
        <div className="flex flex-col items-center gap-3">
          <Text size="sm" tone="soft">
            Nice reading! Ready to earn some rewards?
          </Text>
          <Button onClick={() => setShowQuiz(true)}>Start the quiz</Button>
          <Button variant="ghost" size="md" onClick={onExplore}>
            Explore something else
          </Button>
        </div>
      )}
    </div>
  );
}
