// Rules layer for content safety — the cheap first pass that catches obvious
// cases before we spend a model call (docs/07). This is intentionally narrow: it
// flags clearly-unsafe input, and the LLM classifier (safety/index.ts) handles
// nuance. We keep the redirect gentle — steer, don't scold.
//
// This is a defensive child-safety filter for a kids' product. It errs toward
// letting borderline-but-wholesome topics through to the LLM check rather than
// hard-blocking (a child asking about "war" or "sharks" is fine — the generation
// prompt handles those gently).

export type SafetyCategory =
  "sexual" | "self_harm" | "graphic_violence" | "drugs" | "hate" | "weapons";

// Word-boundary patterns for clearly age-inappropriate input. Deliberately
// conservative to avoid false positives on legitimate kid curiosity.
const RULES: { category: SafetyCategory; pattern: RegExp }[] = [
  {
    category: "sexual",
    pattern:
      /\b(porn|pornography|sex|sexual|nude|nudes|naked|genital|genitals)\b/i,
  },
  {
    category: "self_harm",
    pattern:
      /\b(suicide|self[-\s]?harm|kill (my|your|him|her)self|cutting myself)\b/i,
  },
  {
    category: "graphic_violence",
    pattern: /\b(gore|gory|behead|beheading|dismember|torture|mutilat\w*)\b/i,
  },
  {
    category: "drugs",
    pattern:
      /\b(cocaine|heroin|meth|methamphetamine|marijuana|weed|get high)\b/i,
  },
  {
    category: "hate",
    pattern: /\b(nazi|nazis|racist joke|hate speech)\b/i,
  },
  {
    category: "weapons",
    pattern:
      /\b(make a bomb|build a bomb|homemade (gun|bomb)|how to (shoot|stab))\b/i,
  },
];

/** Gentle, kid-facing redirect shown instead of an error when input is blocked. */
export const REDIRECT_MESSAGE = "Let's explore something else cool!";

export interface RuleVerdict {
  blocked: boolean;
  category?: SafetyCategory;
}

/** Pure rules check on child-entered input. Unit tested in rules.test.ts. */
export function rulePrecheck(input: string): RuleVerdict {
  for (const { category, pattern } of RULES) {
    if (pattern.test(input)) return { blocked: true, category };
  }
  return { blocked: false };
}

/** Pure rules scan of generated output before it reaches the child. Same
 *  patterns — a lightweight backstop in case a lesson/quiz drifts unsafe. */
export function ruleOutputScan(text: string): RuleVerdict {
  return rulePrecheck(text);
}

/**
 * Flatten a generated quiz to the text a child would actually see — every
 * prompt, choice, and explanation — so the output scan covers all of it, not
 * just one field. Structural (not tied to the Zod `Quiz` type) so it stays pure
 * and unit-testable without pulling in the LLM layer.
 */
export function quizScanText(quiz: {
  questions: { prompt: string; choices: string[]; explanation: string }[];
}): string {
  return quiz.questions
    .flatMap((q) => [q.prompt, ...q.choices, q.explanation])
    .join("\n");
}

/**
 * Filter LLM-suggested map topics through the output scan, dropping any whose
 * label trips a rule. Topic-map suggestions are model output too (docs/07), so
 * they get the same backstop as lessons/quizzes before they're ever saved or
 * shown — the `topic_map` prompt is the primary guardrail; this is the cheap,
 * synchronous last line. Scans title *and* slug so neither can smuggle a term
 * past the other.
 */
export function filterSafeTopics<
  T extends { title: string; topicSlug: string },
>(topics: T[]): T[] {
  return topics.filter(
    (t) => !ruleOutputScan(`${t.title} ${t.topicSlug}`).blocked
  );
}
