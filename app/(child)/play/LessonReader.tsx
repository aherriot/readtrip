"use client";

import { useEffect, useState } from "react";
import { LessonChunk } from "@/components/reading/LessonChunk";
import { ReadingView } from "@/components/reading/ReadingView";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { toLessonChunks } from "@/lib/reading/chunks";

// The resolved topic the reader generates a lesson for (from ExploreEntry).
export interface LessonTopic {
  title: string;
  topicSlug: string;
  intent: "topic" | "question";
  rawQuery: string;
}

type Status = "loading" | "streaming" | "done" | "blocked" | "error";

export function LessonReader({
  topic,
  onExplore,
}: {
  topic: LessonTopic;
  onExplore: () => void;
}) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<Status>("loading");
  const [redirect, setRedirect] = useState("");

  useEffect(() => {
    // Each run owns its request; cleanup aborts it. Under React StrictMode (dev)
    // the effect fires twice — the first request is aborted by its cleanup and
    // its abort error is swallowed below, and the second runs to completion.
    const controller = new AbortController();

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
              setText(acc);
              setStatus("streaming");
            } else if (event.type === "blocked") {
              setRedirect(event.redirect);
              setStatus("blocked");
              return;
            } else if (event.type === "done") {
              setStatus("done");
              return;
            } else {
              setStatus("error");
              return;
            }
          }
        }
        // Stream ended without an explicit done/error frame.
        setStatus((s) => (s === "streaming" ? "done" : "error"));
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error(err);
        setStatus("error");
      }
    }

    void run();
    return () => controller.abort();
  }, [topic]);

  if (status === "blocked") {
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
          {redirect}
        </Text>
        <Button onClick={onExplore}>Try another idea</Button>
      </Card>
    );
  }

  if (status === "error") {
    return (
      <Card
        elevated
        padding="lg"
        className="flex w-full flex-col items-center gap-4 text-center"
      >
        <span className="text-5xl" aria-hidden="true">
          🧭
        </span>
        <Heading level={2}>That trip got lost</Heading>
        <Text tone="soft" measure aria-live="polite">
          Something went wrong charting your lesson. Let&apos;s try again!
        </Text>
        <Button onClick={onExplore}>Explore something else</Button>
      </Card>
    );
  }

  const chunks = toLessonChunks(text);

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <ReadingView
        aria-label={`Lesson about ${topic.title}`}
        aria-busy={status !== "done"}
      >
        <Heading level={1}>{topic.title}</Heading>
        {chunks.length === 0 ? (
          <Text tone="soft" aria-live="polite">
            Charting your lesson…
          </Text>
        ) : (
          <div aria-live="polite" className="flex flex-col gap-6">
            {chunks.map((chunk, i) => (
              <LessonChunk key={i}>{chunk}</LessonChunk>
            ))}
          </div>
        )}
      </ReadingView>

      {status === "done" && (
        <div className="flex flex-col items-center gap-2">
          <Text size="sm" tone="soft">
            Nice reading! A quiz to earn rewards is coming next.
          </Text>
          <Button variant="secondary" onClick={onExplore}>
            Explore something else
          </Button>
        </div>
      )}
    </div>
  );
}
