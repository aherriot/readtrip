// Zod schemas for structured LLM output + a tolerant JSON extractor.
//
// We validate model output with Zod rather than the API's `output_config.format`
// because our default content engine (Sonnet 4.6) isn't in the structured-output
// model set. Prompt the model to emit JSON, extract it, and validate here — the
// schema is the source of truth for "schema-valid" regardless of the model.
import { z } from "zod";

// --- normalize_topic ---
export const NormalizeSchema = z.object({
  // Kid-friendly display title for the map/badge, e.g. "Why the sky is blue".
  title: z.string().min(1).max(80),
  // Normalized, deduped concept key, e.g. "why-is-the-sky-blue".
  topicSlug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be a lowercase kebab slug"),
  intent: z.enum(["topic", "question"]),
});
export type NormalizedTopic = z.infer<typeof NormalizeSchema>;

// --- quiz_generate ---
export const QuizSchema = z.object({
  questions: z
    .array(
      z
        .object({
          prompt: z.string().min(1),
          choices: z.array(z.string().min(1)).min(2).max(4),
          correctIndex: z.number().int().min(0),
          explanation: z.string().min(1),
        })
        // correctIndex must point at a real choice.
        .refine((q) => q.correctIndex < q.choices.length, {
          message: "correctIndex out of range",
          path: ["correctIndex"],
        })
    )
    .min(2)
    .max(4),
});
export type Quiz = z.infer<typeof QuizSchema>;

// --- topic_map suggestions ---
export const TopicSuggestionsSchema = z.object({
  suggestions: z
    .array(
      z.object({
        title: z.string().min(1).max(80),
        topicSlug: z
          .string()
          .min(1)
          .max(80)
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      })
    )
    .min(1)
    .max(6),
});
export type TopicSuggestions = z.infer<typeof TopicSuggestionsSchema>;

/**
 * Extract the first JSON object from a model response and parse it. Tolerates a
 * leading/trailing prose or a ```json fence by slicing from the first `{` to the
 * last `}`. Returns `null` on any failure so callers can retry rather than throw.
 */
export function extractJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}
