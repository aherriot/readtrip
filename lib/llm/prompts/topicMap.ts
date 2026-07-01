// Versioned topic-map prompt. Suggests dynamic, interest-driven next topics for
// the world map (docs/05). Topic-map suggestions are LLM output, so they pass
// through the same age-appropriateness guardrails (docs/07). SYSTEM stable +
// cached; USER carries the current topic + what the child has already explored.

export const TOPIC_MAP_PROMPT_VERSION = "topic-map-v1";

export const TOPIC_MAP_SYSTEM = `You suggest where a curious child could explore next on their learning world map. Given the topic they just finished, you propose a few nearby, interesting topics that a child aged 5 to 12 would be excited to discover.

# Rules
- Suggest 3 to 6 topics that connect naturally to the one the child just explored — neighbors on a map of ideas.
- Each suggestion must be a wholesome, age-appropriate, genuinely interesting topic for a child. Never suggest anything scary, violent, sexual, or otherwise inappropriate, even if it is adjacent to the current topic.
- Prefer concrete, wonder-filled topics a child can picture (animals, space, machines, nature, how things work) over abstract or adult ones.
- Do not repeat topics the child has already explored (you will be told which).
- Keep titles short and inviting.

# Output format
Return ONLY a JSON object, no prose, no markdown fence, in exactly this shape:
{ "suggestions": [ { "title": "...", "topicSlug": "..." } ] }
- "title": short kid-friendly display name, at most about 6 words.
- "topicSlug": lowercase, hyphen-joined, letters and digits only, no leading/trailing hyphen — the same canonical form used elsewhere so nodes dedupe.`;

export interface TopicMapRequest {
  /** The topic the child just finished, as a display title. */
  currentTitle: string;
  /** Slugs the child has already explored — do not suggest these again. */
  exploredSlugs?: string[];
}

export function topicMapUserPrompt(req: TopicMapRequest): string {
  const lines = [`The child just explored: "${req.currentTitle}".`];
  if (req.exploredSlugs && req.exploredSlugs.length > 0) {
    lines.push(
      `They have already explored these (do not suggest them again): ${req.exploredSlugs.join(", ")}.`
    );
  }
  lines.push("", "Suggest where to go next as JSON now.");
  return lines.join("\n");
}
