// Versioned topic-map prompt. Suggests dynamic, interest-driven next topics for
// the world map (docs/05). Topic-map suggestions are LLM output, so they pass
// through the same age-appropriateness guardrails (docs/07). SYSTEM stable +
// cached; USER carries the current topic, the child's reading level, and what
// the child has already explored.
import { readingLevelTopicGuidance, type ReadingLevel } from "./readingLevel";

export const TOPIC_MAP_PROMPT_VERSION = "topic-map-v3";

export const TOPIC_MAP_SYSTEM = `You suggest where a curious child could explore next on their learning world map. Given the topic they just finished, you propose both nearby topics that build on it AND a couple of unrelated, different topics for breadth, so the map doesn't narrow entirely onto one interest. Sometimes there is no current topic (a brand-new explorer, or one who has turned down every topic offered so far) — in that case propose a diverse set of starter topics instead, all as "different".

# Rules
- Suggest 3 to 8 topics total for a child aged 4 to 14: most should be "neighbor" topics that connect naturally to the current topic (a map of ideas), plus 1-3 "different" topics that are deliberately unrelated, for variety. Without a current topic, make all of them "different" starter topics.
- Each suggestion must be a wholesome, age-appropriate, genuinely interesting topic for a child. Never suggest anything scary, violent, sexual, or otherwise inappropriate, even if it is adjacent to the current topic.
- Calibrate topic complexity and maturity to the child's reading level, given below: a younger/lower level should get concrete, sensory, easy-to-picture topics (animals, colors, space, how everyday things work), while a higher level can get more nuanced, abstract, or mature topics (bigger science ideas, history, how societies work, gentle ethics) — always still wholesome and age-appropriate.
- Do not repeat topics the child has already explored (you will be told which).
- The child may also have turned down (dismissed) topics offered before without exploring them. Do not suggest those again, and steer away from similar ones too — they were not appealing, so try a genuinely different angle.
- Keep titles short and inviting.

# Output format
Return ONLY a JSON object, no prose, no markdown fence, in exactly this shape:
{ "suggestions": [ { "title": "...", "topicSlug": "...", "kind": "neighbor" } ] }
- "title": short kid-friendly display name, at most about 6 words.
- "topicSlug": lowercase, hyphen-joined, letters and digits only, no leading/trailing hyphen — the same canonical form used elsewhere so nodes dedupe.
- "kind": either "neighbor" (connects to the current topic) or "different" (deliberate breadth).`;

export interface TopicMapRequest {
  /** The topic the child just finished, as a display title. Omitted when there is no
   * seed topic to grow from (new explorer, or every prior suggestion was dismissed). */
  currentTitle?: string;
  /** The child's reading level — calibrates how complex/mature suggested topics can be. */
  readingLevel: ReadingLevel;
  /** Slugs the child has already explored — do not suggest these again. */
  exploredSlugs?: string[];
  /** Slugs the child was offered but dismissed without exploring — avoid these and
   * similar ones, since they clearly didn't land. */
  dismissedSlugs?: string[];
}

// A long-running child's explored/dismissed history can grow to hundreds of
// slugs. Sending the whole thing bloats the prompt for no real benefit — the
// most recent history is what's actually predictive of "already covered" —
// and a runaway-long avoid-list only raises the odds the model's own reply
// gets tangled up in it. Keep the most recent entries only.
const MAX_AVOID_SLUGS = 40;

function recentSlugs(slugs: string[]): string[] {
  return slugs.slice(-MAX_AVOID_SLUGS);
}

export function topicMapUserPrompt(req: TopicMapRequest): string {
  const lines = req.currentTitle
    ? [`The child just explored: "${req.currentTitle}".`]
    : [
        "The child has no current topic to grow from — suggest a diverse set of starter topics instead.",
      ];
  lines.push(readingLevelTopicGuidance(req.readingLevel));
  if (req.exploredSlugs && req.exploredSlugs.length > 0) {
    lines.push(
      `They have already explored these (do not suggest them again): ${recentSlugs(req.exploredSlugs).join(", ")}.`
    );
  }
  if (req.dismissedSlugs && req.dismissedSlugs.length > 0) {
    lines.push(
      `They were offered these before and dismissed them without exploring (avoid these and similar topics): ${recentSlugs(req.dismissedSlugs).join(", ")}.`
    );
  }
  lines.push("", "Suggest where to go next as JSON now.");
  return lines.join("\n");
}
