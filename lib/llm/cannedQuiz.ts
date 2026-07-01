// Deterministic offline quiz — served when no Anthropic key is configured (local
// dev / CI e2e), mirroring streamLesson's canned lesson so the core loop stays
// exercisable without the API. Kept in its own module (no client/db imports) so
// it's cheaply unit-testable for schema validity.
import type { Quiz } from "./schemas";

/**
 * A level-agnostic, schema-valid quiz built from the resolved topic. It can't
 * test the (also-canned) lesson's content, so it checks the spirit of the loop —
 * that the child explored the topic and stayed curious — with one clearly
 * correct choice per question.
 */
export function cannedQuiz(topicTitle?: string | null): Quiz {
  const topic = (topicTitle ?? "").trim() || "this topic";
  return {
    questions: [
      {
        prompt: "What did you just read about?",
        choices: [topic, "Nothing at all"],
        correctIndex: 0,
        explanation: `That's right — your lesson was all about ${topic}!`,
      },
      {
        prompt: "How does a good explorer learn something new?",
        choices: ["By reading and asking questions", "By never being curious"],
        correctIndex: 0,
        explanation:
          "Yes! Reading and asking questions is how explorers discover new things.",
      },
    ],
  };
}
