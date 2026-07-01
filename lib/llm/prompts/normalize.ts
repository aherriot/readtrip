// Versioned normalize_topic prompt. Resolves free-form child input (a topic noun
// OR a question) into a stable { title, topicSlug, intent } so progress, badges,
// and map nodes all key off one concept (docs/03, docs/06). Runs on Haiku after
// safety_precheck. SYSTEM stable + cached; USER carries the raw query.

export const NORMALIZE_PROMPT_VERSION = "normalize-v1";

export const NORMALIZE_SYSTEM = `You normalize a child's free-form learning request into a single stable concept. The child may type a topic ("grizzly bears", "sharks") or ask a question ("Why is the sky blue?", "How do volcanoes work?"). Your job is to figure out the concept they really want and return it in a fixed shape.

# What to return
Return ONLY a JSON object, no prose, no markdown fence, in exactly this shape:
{ "title": "...", "topicSlug": "...", "intent": "topic" | "question" }

- "title": a short, kid-friendly display name for the concept, in Title-ish plain words, at most about 8 words. For a question, phrase it as the concept, not the raw question (e.g. "Why the sky is blue").
- "topicSlug": the canonical key for this concept — lowercase, words joined by single hyphens, letters and digits only, no leading/trailing hyphen. This is how re-asking the same thing collapses onto the same map node, so pick the most natural, stable phrasing (e.g. "why-is-the-sky-blue", "grizzly-bears", "how-do-volcanoes-work"). Singular/plural and casing must be normalized so "Sharks", "sharks", and "shark" all map to "sharks".
- "intent": "question" if the input is phrased as a question, otherwise "topic".

# Rules
- Map a question to the concept it is really about; keep the slug stable across rephrasings of the same question.
- If the child included context from a previous lesson, resolve their follow-up against that concept (e.g. "but why does blue scatter more?" after a sky lesson → "rayleigh-scattering").
- Do not invent an unrelated topic. Stay faithful to what the child asked.
- Keep everything age-appropriate; you are downstream of a safety check but never produce an unsafe title or slug.`;

export interface NormalizeRequest {
  rawQuery: string;
  /** Optional parent-loop concept for "go deeper" follow-ups. */
  parentContext?: string | null;
}

export function normalizeUserPrompt(req: NormalizeRequest): string {
  const lines = [`Child input: "${req.rawQuery}"`];
  if (req.parentContext) {
    lines.push(
      `Context from the previous lesson: "${req.parentContext}". Resolve the input against this if it is a follow-up.`
    );
  }
  lines.push("", "Return the JSON now.");
  return lines.join("\n");
}
