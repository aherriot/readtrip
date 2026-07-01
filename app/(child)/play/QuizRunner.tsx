"use client";

import { useEffect, useRef, useState } from "react";
import { QuizCard } from "@/components/reading/QuizCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Text } from "@/components/ui/Text";
import type { Quiz } from "@/lib/llm";
import { scoreQuiz, type QuizScore } from "@/lib/reading/quiz";
import type { LessonTopic } from "./LessonReader";

type Phase =
  | { name: "loading" }
  | { name: "error" }
  | { name: "playing"; quiz: Quiz; index: number }
  | { name: "done"; score: QuizScore };

// Warm, level-agnostic praise keyed off how the child did — never a "you failed".
function resultMessage(score: QuizScore): string {
  if (score.total === 0) return "Great exploring!";
  if (score.correct === score.total) return "Perfect run — you nailed it!";
  if (score.correct >= score.total / 2) return "Nice work, explorer!";
  return "Great effort — every trip makes you sharper!";
}

export function QuizRunner({
  topic,
  lessonText,
  onExplore,
}: {
  topic: LessonTopic;
  lessonText: string;
  onExplore: () => void;
}) {
  const [phase, setPhase] = useState<Phase>({ name: "loading" });
  // First tapped choice per question — the score signal (retries don't count).
  const firstChoices = useRef<(number | null)[]>([]);

  // Fetch the quiz exactly once. `fetchedRef` guards against React StrictMode's
  // double-invoke (which would otherwise POST twice and persist two Loops);
  // `activeRef`, reset at the top of every effect run, gates the late setState so
  // a real unmount is ignored but the StrictMode remount still renders.
  const fetchedRef = useRef(false);
  const activeRef = useRef(true);
  useEffect(() => {
    activeRef.current = true;
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      void (async () => {
        try {
          const res = await fetch("/api/quiz", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: topic.title,
              topicSlug: topic.topicSlug,
              intent: topic.intent,
              rawQuery: topic.rawQuery,
              lessonText,
            }),
          });
          if (!res.ok) throw new Error(`quiz failed: ${res.status}`);
          const data = (await res.json()) as { quiz: Quiz };
          if (!activeRef.current) return;
          firstChoices.current = new Array(data.quiz.questions.length).fill(
            null
          );
          setPhase({ name: "playing", quiz: data.quiz, index: 0 });
        } catch (err) {
          console.error(err);
          if (activeRef.current) setPhase({ name: "error" });
        }
      })();
    }
    return () => {
      activeRef.current = false;
    };
  }, [topic, lessonText]);

  if (phase.name === "loading") {
    return (
      <ResultShell>
        <span className="text-5xl" aria-hidden="true">
          🧩
        </span>
        <Heading level={2}>Building your quiz…</Heading>
        <Text tone="soft" aria-live="polite">
          Cooking up a few questions about {topic.title}.
        </Text>
      </ResultShell>
    );
  }

  if (phase.name === "error") {
    return (
      <ResultShell>
        <span className="text-5xl" aria-hidden="true">
          🧭
        </span>
        <Heading level={2}>That quiz got lost</Heading>
        <Text tone="soft" measure aria-live="polite">
          Something went wrong making your quiz. Your reading still counts!
        </Text>
        <Button onClick={onExplore}>Explore something else</Button>
      </ResultShell>
    );
  }

  if (phase.name === "done") {
    const { score } = phase;
    return (
      <ResultShell>
        <span className="text-5xl" aria-hidden="true">
          🌟
        </span>
        <Heading level={2}>{resultMessage(score)}</Heading>
        <Text tone="soft" measure aria-live="polite">
          You got {score.correct} of {score.total} on the first try.
        </Text>
        <Button onClick={onExplore}>Explore something else</Button>
      </ResultShell>
    );
  }

  const { quiz, index } = phase;
  const question = quiz.questions[index];
  const isLast = index === quiz.questions.length - 1;

  function advance() {
    if (isLast) {
      setPhase({ name: "done", score: scoreQuiz(firstChoices.current, quiz) });
    } else {
      setPhase({ name: "playing", quiz, index: index + 1 });
    }
  }

  return (
    <div
      data-surface="paper"
      className="mx-auto flex w-full max-w-2xl flex-col gap-6"
    >
      <Heading level={2}>Quiz: {topic.title}</Heading>
      <ProgressBar
        label="Quiz progress"
        value={index}
        max={quiz.questions.length}
      />
      <QuizCard
        key={index}
        question={question}
        questionNumber={index + 1}
        totalQuestions={quiz.questions.length}
        isLast={isLast}
        onFirstAnswer={(choiceIndex) => {
          firstChoices.current[index] = choiceIndex;
        }}
        onAdvance={advance}
      />
    </div>
  );
}

// The non-question states (loading / error / result) share a centered paper card.
function ResultShell({ children }: { children: React.ReactNode }) {
  return (
    <div data-surface="paper" className="mx-auto w-full max-w-2xl">
      <Card
        elevated
        padding="lg"
        className="flex w-full flex-col items-center gap-4 text-center"
      >
        {children}
      </Card>
    </div>
  );
}
