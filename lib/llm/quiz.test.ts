import { describe, expect, it } from "vitest";
import { cannedQuiz } from "./cannedQuiz";
import { QuizSchema } from "./schemas";

describe("cannedQuiz (offline fallback)", () => {
  it("produces a schema-valid quiz", () => {
    const result = QuizSchema.safeParse(cannedQuiz("dinosaurs"));
    expect(result.success).toBe(true);
  });

  it("weaves the topic title into the questions", () => {
    const quiz = cannedQuiz("volcanoes");
    expect(quiz.questions[0].choices).toContain("volcanoes");
    expect(quiz.questions[0].explanation).toMatch(/volcanoes/);
  });

  it("stays valid with a missing or blank title", () => {
    for (const title of [undefined, null, "   "]) {
      const quiz = cannedQuiz(title);
      expect(QuizSchema.safeParse(quiz).success).toBe(true);
      // Every question still has exactly one in-range correct choice.
      for (const q of quiz.questions) {
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(q.choices.length);
      }
    }
  });
});
