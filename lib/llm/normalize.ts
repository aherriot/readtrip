// normalize_topic — resolve free-form child input (a topic noun OR a question)
// into a stable { title, topicSlug, intent }. Keyed on by progress, badges, and
// map nodes so question phrasings dedupe to one concept (docs/03, docs/06).
// Runs on Haiku, after safety_precheck.
import { callModel } from "./client";
import {
  NORMALIZE_SYSTEM,
  type NormalizeRequest,
  normalizeUserPrompt,
} from "./prompts/normalize";
import { pickModel } from "./router";
import { NormalizeSchema, type NormalizedTopic, extractJson } from "./schemas";
import { slugify } from "./slug";

export { slugify };

const QUESTION_START =
  /\?|^(why|how|what|who|when|where|is|are|do|does|can)\b/i;

export interface NormalizeOptions extends NormalizeRequest {
  childId?: string | null;
}

/**
 * Normalize a raw query. On a malformed model response we fall back to a
 * slugified title (or the raw query) and a heuristic intent so the pipeline
 * always gets a usable concept rather than throwing.
 */
export async function normalizeTopic(
  opts: NormalizeOptions
): Promise<NormalizedTopic> {
  const model = pickModel("normalize_topic");
  const { text } = await callModel({
    task: "normalize_topic",
    model,
    system: NORMALIZE_SYSTEM,
    user: normalizeUserPrompt(opts),
    maxTokens: 300,
    childId: opts.childId ?? null,
  });

  const parsed = NormalizeSchema.safeParse(extractJson(text));
  if (parsed.success) return parsed.data;

  // Fallback: derive a concept from the raw query so progression never breaks.
  const trimmed = opts.rawQuery.trim();
  return {
    title: trimmed.slice(0, 80) || "Something new",
    topicSlug: slugify(opts.rawQuery) || "unknown-topic",
    intent: QUESTION_START.test(trimmed) ? "question" : "topic",
  };
}
