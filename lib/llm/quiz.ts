// Quiz generation with structured (schema-valid) output. The model is prompted
// to emit JSON; we validate against QuizSchema and retry once on the more
// capable Opus model if the first (Sonnet) attempt is malformed — the same
// escalation lever routing uses for low-quality output.
import { callModel } from "./client";
import { type ReadingLevel } from "./prompts/readingLevel";
import { QUIZ_SYSTEM, quizUserPrompt } from "./prompts/quiz";
import { pickEffort, pickModel, type RouteOpts } from "./router";
import { type Quiz, QuizSchema, extractJson } from "./schemas";

export interface QuizOptions {
  lessonText: string;
  readingLevel: ReadingLevel;
  childId?: string | null;
}

export interface QuizResult {
  quiz: Quiz;
  model: string;
}

async function attempt(
  opts: QuizOptions,
  route: RouteOpts
): Promise<Quiz | null> {
  const model = pickModel("quiz_generate", route);
  const { text } = await callModel({
    task: "quiz_generate",
    model,
    system: QUIZ_SYSTEM,
    user: quizUserPrompt({
      lessonText: opts.lessonText,
      readingLevel: opts.readingLevel,
    }),
    maxTokens: 1200,
    effort: pickEffort("quiz_generate", route),
    childId: opts.childId ?? null,
  });
  const parsed = QuizSchema.safeParse(extractJson(text));
  return parsed.success ? parsed.data : null;
}

/**
 * Generate a schema-valid quiz from a lesson. Tries Sonnet, then escalates to
 * Opus once if the output doesn't validate. Throws if both attempts fail so the
 * caller can surface a retry rather than show the child a broken quiz.
 */
export async function generateQuiz(opts: QuizOptions): Promise<QuizResult> {
  const first = await attempt(opts, {});
  if (first) return { quiz: first, model: pickModel("quiz_generate") };

  const second = await attempt(opts, { hard: true });
  if (second)
    return { quiz: second, model: pickModel("quiz_generate", { hard: true }) };

  throw new Error("quiz generation failed schema validation after retry");
}
