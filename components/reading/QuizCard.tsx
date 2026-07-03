"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import type { Quiz } from "@/lib/llm";
import { QuizChoice, type QuizChoiceState } from "./QuizChoice";

type QuizQuestion = Quiz["questions"][number];

export interface QuizCardProps {
  question: QuizQuestion;
  /** 1-based position, for the "Question N of M" caption. */
  questionNumber: number;
  totalQuestions: number;
  /** True for the final question, so the advance button reads "Finish". */
  isLast: boolean;
  /** Fired exactly once, on the child's *first* tap — the score signal. */
  onFirstAnswer?: (choiceIndex: number) => void;
  /** Advance to the next question (or finish). Only reachable once solved. */
  onAdvance: () => void;
}

/**
 * One quiz question with its choices and feedback (docs/10). Low-stakes and
 * "unfailable": a wrong tap marks that choice **Try again** and lets the child
 * keep going; the correct tap reveals a cheerful explanation and the advance
 * button. The *first* tap is reported to the parent for scoring, so retries stay
 * pressure-free without hiding how the child actually did.
 *
 * Usage guidance: .claude/skills/design-system/references/quiz-card.md
 */
export function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  isLast,
  onFirstAnswer,
  onAdvance,
}: QuizCardProps) {
  const [triedWrong, setTriedWrong] = useState<Set<number>>(new Set());
  const [solved, setSolved] = useState(false);
  const [answered, setAnswered] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const advanceRef = useRef<HTMLButtonElement>(null);

  // This card remounts fresh per question (see QuizRunner's `key={index}`), so
  // scroll back to the prompt each time — otherwise the viewport stays where
  // the previous question's advance button was, below the new question.
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // The advance button only appears once solved, and can land below the fold
  // on longer questions — bring it into view rather than making the child hunt.
  useEffect(() => {
    if (solved) {
      advanceRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [solved]);

  function choose(index: number) {
    if (solved || triedWrong.has(index)) return;

    if (!answered) {
      setAnswered(true);
      onFirstAnswer?.(index);
    }

    if (index === question.correctIndex) {
      setSolved(true);
    } else {
      setTriedWrong((prev) => new Set(prev).add(index));
    }
  }

  function stateFor(index: number): QuizChoiceState {
    if (solved && index === question.correctIndex) return "correct";
    if (triedWrong.has(index)) return "retry";
    return "default";
  }

  return (
    <Card elevated padding="lg" className="flex w-full flex-col gap-5">
      <div ref={topRef} />
      <Text size="sm" tone="soft">
        Question {questionNumber} of {totalQuestions}
      </Text>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-1 font-display text-xl text-surface-ink">
          {question.prompt}
        </legend>
        <div className="flex flex-col gap-3">
          {question.choices.map((choice, index) => (
            <QuizChoice
              key={index}
              state={stateFor(index)}
              disabled={solved || triedWrong.has(index)}
              onSelect={() => choose(index)}
            >
              {choice}
            </QuizChoice>
          ))}
        </div>
      </fieldset>

      {/* Explanation + advance appear together once the child gets it right. */}
      <div aria-live="polite" className="flex flex-col gap-4">
        {solved && (
          <>
            <Button
              ref={advanceRef}
              className="scroll-mb-8"
              onClick={onAdvance}
            >
              {isLast ? "Finish" : "Next question"}
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}
