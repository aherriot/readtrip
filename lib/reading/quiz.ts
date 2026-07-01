// Pure client-side quiz grading (docs/09 M4). The quiz is low-stakes — a child
// retries a question until they get it right — but the *score* we surface (and
// later persist) reflects first-try correctness, which is what a difficulty
// signal should measure. Kept pure so it's unit-testable without a DOM.
import type { Quiz } from "@/lib/llm";

export interface QuizScore {
  /** Questions answered correctly on the first attempt. */
  correct: number;
  total: number;
  /** `correct / total` as a whole-number percent (0 when there are no questions). */
  pct: number;
}

/**
 * Grade a quiz from the child's *first* choice per question. `firstChoices[i]` is
 * the index the child first tapped for question `i` (or `null`/`undefined` if the
 * question was never reached — counted wrong). Out-of-range indices count wrong.
 */
export function scoreQuiz(
  firstChoices: ReadonlyArray<number | null | undefined>,
  quiz: Quiz
): QuizScore {
  const total = quiz.questions.length;
  const correct = quiz.questions.reduce((sum, question, i) => {
    return firstChoices[i] === question.correctIndex ? sum + 1 : sum;
  }, 0);
  const pct = total === 0 ? 0 : Math.round((correct / total) * 100);
  return { correct, total, pct };
}
