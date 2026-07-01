"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Text } from "@/components/ui/Text";
import type { CalibrationStep, SubmittedAnswer } from "@/lib/calibration/flow";
import type { CalibrationPassageView } from "@/lib/calibration/passages";

type Phase =
  | { name: "intro" }
  | { name: "playing"; passage: CalibrationPassageView }
  | { name: "done" };

export function CalibrationGame({
  childName,
  firstPassage,
  totalRounds,
}: {
  childName: string;
  firstPassage: CalibrationPassageView;
  totalRounds: number;
}) {
  const [phase, setPhase] = useState<Phase>({ name: "intro" });
  const [answers, setAnswers] = useState<SubmittedAnswer[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitAnswer(passageId: string, selectedIndex: number) {
    if (submitting) return;
    const nextAnswers = [...answers, { passageId, selectedIndex }];
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/calibrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: nextAnswers }),
      });
      if (!res.ok) throw new Error(`calibrate failed: ${res.status}`);
      const step = (await res.json()) as CalibrationStep;
      setAnswers(nextAnswers);
      if (step.done) {
        setPhase({ name: "done" });
      } else {
        setPhase({ name: "playing", passage: step.passage });
      }
    } catch {
      // Roll back so the child can simply tap again.
      setError("Something went wrong. Let's try that one again!");
    } finally {
      setSubmitting(false);
    }
  }

  if (phase.name === "intro") {
    return (
      <Shell>
        <Card
          elevated
          padding="lg"
          className="flex flex-col items-center gap-5 text-center"
        >
          <span className="text-6xl" aria-hidden="true">
            🦸
          </span>
          <Heading level={1}>Find your reading superpower</Heading>
          <Text tone="soft" measure>
            Hi, {childName}! Read a few short stories and answer one quick
            question about each. There are no wrong answers — this just helps me
            find stories that are perfect for you.
          </Text>
          <Button
            size="kid"
            onClick={() => setPhase({ name: "playing", passage: firstPassage })}
          >
            Let&apos;s go!
          </Button>
        </Card>
      </Shell>
    );
  }

  if (phase.name === "done") {
    return (
      <Shell>
        <Card
          elevated
          padding="lg"
          className="flex flex-col items-center gap-5 text-center"
        >
          <span className="text-6xl" aria-hidden="true">
            🌟
          </span>
          <Heading level={1}>You did it, {childName}!</Heading>
          <Text tone="soft" measure aria-live="polite">
            Your reading superpower is all set. Now let&apos;s go explore
            something amazing.
          </Text>
          <Button href="/play" size="kid">
            Start exploring
          </Button>
        </Card>
      </Shell>
    );
  }

  const { passage } = phase;
  return (
    <Shell>
      <div className="flex w-full flex-col gap-6">
        <ProgressBar
          label="Reading-level calibration"
          value={answers.length}
          max={totalRounds}
        />

        {/* Reading is a field-journal (paper) task — legibility first. */}
        <div data-surface="paper">
          <Card elevated padding="lg" className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden="true">
                {passage.emoji}
              </span>
              <Heading level={2}>{passage.title}</Heading>
            </div>
            <Text size="lg" measure>
              {passage.text}
            </Text>
          </Card>
        </div>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-2 w-full text-center font-display text-xl text-surface-ink">
            {passage.question}
          </legend>
          <div className="flex flex-col gap-3">
            {passage.options.map((option, index) => (
              <Button
                key={option}
                variant="secondary"
                size="kid"
                fullWidth
                disabled={submitting}
                onClick={() => submitAnswer(passage.id, index)}
              >
                {option}
              </Button>
            ))}
          </div>
        </fieldset>

        {error && (
          <Text
            role="alert"
            size="sm"
            className="text-center text-surface-danger"
          >
            {error}
          </Text>
        )}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-8 p-6">
      {children}
    </main>
  );
}
