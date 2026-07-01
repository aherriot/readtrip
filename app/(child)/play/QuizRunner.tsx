"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { QuizCard } from "@/components/reading/QuizCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Input } from "@/components/ui/Input";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Text } from "@/components/ui/Text";
import type { Quiz } from "@/lib/llm";
import { scoreQuiz, type QuizScore } from "@/lib/reading/quiz";
import type { LessonTopic, SteerHandlers } from "./LessonReader";

type Phase =
  | { name: "loading" }
  | { name: "error" }
  | { name: "playing"; quiz: Quiz; index: number }
  | { name: "done"; score: QuizScore; loopId: string | null };

// Whether the child's reading level nudged up after this quiz — the only change
// we announce (a step *down* stays quiet, docs/04). `null` until Steer replies.
type Adaptation = { leveledUp: boolean } | null;

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
  onGoDeeper,
}: { topic: LessonTopic; lessonText: string } & SteerHandlers) {
  const [phase, setPhase] = useState<Phase>({ name: "loading" });
  const [adaptation, setAdaptation] = useState<Adaptation>(null);
  // First tapped choice per question — the score signal (retries don't count).
  const firstChoices = useRef<(number | null)[]>([]);
  // The persisted loop this quiz belongs to (null if the DB write failed). Steer
  // keys off it to record the score and to link a "go deeper" follow-up.
  const loopId = useRef<string | null>(null);

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
              parentLoopId: topic.parentLoopId,
            }),
          });
          if (!res.ok) throw new Error(`quiz failed: ${res.status}`);
          const data = (await res.json()) as {
            quiz: Quiz;
            loopId: string | null;
          };
          if (!activeRef.current) return;
          loopId.current = data.loopId;
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
    return (
      <SteerResult
        topic={topic}
        score={phase.score}
        adaptation={adaptation}
        loopId={phase.loopId}
        onExplore={onExplore}
        onGoDeeper={onGoDeeper}
      />
    );
  }

  const { quiz, index } = phase;
  const question = quiz.questions[index];
  const isLast = index === quiz.questions.length - 1;

  function finish(quiz: Quiz) {
    const score = scoreQuiz(firstChoices.current, quiz);
    setPhase({ name: "done", score, loopId: loopId.current });
    // Steer: record the score and adapt the reading level (docs/04). Best-effort
    // — a failure here shouldn't block the child from steering onward. Only
    // possible once the loop was persisted; otherwise there's nothing to score.
    if (loopId.current) {
      void (async () => {
        try {
          const res = await fetch("/api/steer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              loopId: loopId.current,
              firstChoices: firstChoices.current,
            }),
          });
          if (!res.ok) return;
          const data = (await res.json()) as { leveledUp: boolean };
          setAdaptation({ leveledUp: data.leveledUp });
        } catch (err) {
          console.error("[steer] failed:", err);
        }
      })();
    }
  }

  function advance() {
    if (isLast) {
      finish(quiz);
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

// The post-quiz Steer screen (docs/01 §6): celebrate the result, then let the
// child choose where to go — deeper on this topic, or somewhere new.
function SteerResult({
  topic,
  score,
  adaptation,
  loopId,
  onExplore,
  onGoDeeper,
}: {
  topic: LessonTopic;
  score: QuizScore;
  adaptation: Adaptation;
  loopId: string | null;
} & SteerHandlers) {
  const [deepening, setDeepening] = useState(false);
  const [followUp, setFollowUp] = useState("");

  function submitFollowUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = followUp.trim();
    onGoDeeper(trimmed || `Tell me more about ${topic.title}`, {
      loopId,
      title: topic.title,
    });
  }

  return (
    <ResultShell>
      <span className="text-5xl" aria-hidden="true">
        🌟
      </span>
      <Heading level={2}>{resultMessage(score)}</Heading>
      <Text tone="soft" measure aria-live="polite">
        You got {score.correct} of {score.total} on the first try.
      </Text>
      {adaptation?.leveledUp && (
        <Text size="sm" aria-live="polite" className="font-semibold">
          ⬆️ You&apos;re reading like a pro — leveling up!
        </Text>
      )}

      {deepening ? (
        <form
          onSubmit={submitFollowUp}
          className="flex w-full flex-col gap-3 text-left"
        >
          <Input
            label={`What else do you want to know about ${topic.title}?`}
            name="followUp"
            value={followUp}
            onChange={(event) => setFollowUp(event.target.value)}
            placeholder="Ask a follow-up, or leave it blank to keep exploring it"
            autoComplete="off"
            maxLength={200}
          />
          <div className="flex flex-wrap justify-center gap-3">
            <Button type="submit">Go deeper</Button>
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => setDeepening(false)}
            >
              Back
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={() => setDeepening(true)}>
            Go deeper on {topic.title}
          </Button>
          <Button variant="secondary" size="md" onClick={onExplore}>
            Explore something new
          </Button>
        </div>
      )}
    </ResultShell>
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
