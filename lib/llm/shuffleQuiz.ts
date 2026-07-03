// Pure quiz-choice shuffling, split out from quiz.ts so it stays testable at
// the unit layer without dragging in client.ts's db-backed logging chain.
import { type Quiz } from "./schemas";

// The model (and the canned offline quiz) tends to place the correct choice
// first, so shuffle each question's choices with Fisher-Yates and remap
// correctIndex accordingly before the quiz is ever shown or persisted.
export function shuffleQuiz(quiz: Quiz): Quiz {
  return {
    questions: quiz.questions.map((q) => {
      const order = q.choices.map((_, i) => i);
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      return {
        ...q,
        choices: order.map((i) => q.choices[i]),
        correctIndex: order.indexOf(q.correctIndex),
      };
    }),
  };
}
