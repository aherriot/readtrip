"use client";

import { QuizCard } from "@/components/reading/QuizCard";
import { QuizChoice } from "@/components/reading/QuizChoice";
import { Text } from "@/components/ui/Text";

// A fixed sample so the gallery (and its axe run) exercise a real, interactive
// QuizCard — tapping the correct choice reveals the explanation + advance button.
const SAMPLE_QUESTION = {
  prompt: "Where does the Moon get its light?",
  choices: ["It makes its own light", "It reflects the Sun's light"],
  correctIndex: 1,
  explanation: "Right! The Moon has no light of its own — it catches sunlight.",
};

/**
 * Interactive demo island for the quiz reading components. Rendered on the paper
 * (field-journal) surface, since that's where quizzes live. Shows every
 * QuizChoice state plus a live QuizCard.
 */
export function QuizDemo() {
  return (
    <div
      data-surface="paper"
      data-testid="quiz-paper"
      className="flex flex-col gap-8"
    >
      <div className="flex flex-col gap-3">
        <Text size="sm" tone="soft">
          QuizChoice — states (icon + text + color, never color alone)
        </Text>
        <QuizChoice state="default">A quiet, unpicked choice</QuizChoice>
        <QuizChoice state="selected">A choice being considered</QuizChoice>
        <QuizChoice state="correct" disabled>
          The correct answer
        </QuizChoice>
        <QuizChoice state="retry" disabled>
          A gentle try-again choice
        </QuizChoice>
      </div>

      <div className="flex flex-col gap-3">
        <Text size="sm" tone="soft">
          QuizCard — a live question
        </Text>
        <QuizCard
          question={SAMPLE_QUESTION}
          questionNumber={1}
          totalQuestions={2}
          isLast={false}
          onAdvance={() => {}}
          autoScroll={false}
        />
      </div>
    </div>
  );
}
