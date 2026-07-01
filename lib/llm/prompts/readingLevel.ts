// Reading-level guidance, injected into the *user* message (volatile) so the
// stable system prefix stays byte-identical and caches across every level.
// Levels are 1..5 (docs/04-reading-levels.md), roughly kindergarten → tween.

export type ReadingLevel = 1 | 2 | 3 | 4 | 5;

/** Bounds of the reading-level scale (docs/04). */
export const MIN_READING_LEVEL = 1;
export const MAX_READING_LEVEL = 5;

interface LevelSpec {
  label: string;
  sentences: string;
  vocabulary: string;
}

const LEVELS: Record<ReadingLevel, LevelSpec> = {
  1: {
    label: "Level 1 (about kindergarten / age 5)",
    sentences:
      "Very short sentences, 5–8 words. One idea per sentence. Lots of white space between ideas.",
    vocabulary:
      "Only the most common everyday words. Explain any new word in the same breath, with a familiar comparison.",
  },
  2: {
    label: "Level 2 (about 1st–2nd grade / age 6–7)",
    sentences: "Short sentences, 6–10 words. Mostly one idea per sentence.",
    vocabulary:
      "Simple, concrete words a young child knows. Introduce at most one new word and define it plainly.",
  },
  3: {
    label: "Level 3 (about 3rd–4th grade / age 8–9)",
    sentences:
      "Medium sentences, 8–14 words. You may join two related ideas with 'and' or 'because'.",
    vocabulary:
      "Everyday words plus a couple of topic words, each explained the first time it appears.",
  },
  4: {
    label: "Level 4 (about 5th grade / age 10)",
    sentences: "Fuller sentences, 10–18 words, with some variety in structure.",
    vocabulary:
      "Richer vocabulary is fine; still define specialized terms with a quick, concrete example.",
  },
  5: {
    label: "Level 5 (about 6th grade / age 11–12)",
    sentences:
      "Varied sentence length, up to ~20 words, with clear connectors between ideas.",
    vocabulary:
      "You can use precise, subject-specific terms, but always make their meaning clear from context.",
  },
};

export function isReadingLevel(value: number): value is ReadingLevel {
  return (
    Number.isInteger(value) &&
    value >= MIN_READING_LEVEL &&
    value <= MAX_READING_LEVEL
  );
}

/** Clamp any int into the valid 1..5 range (defends against bad stored data). */
export function clampReadingLevel(value: number): ReadingLevel {
  const rounded = Math.round(value);
  if (rounded < MIN_READING_LEVEL) return MIN_READING_LEVEL;
  if (rounded > MAX_READING_LEVEL) return MAX_READING_LEVEL;
  return rounded as ReadingLevel;
}

/** Concrete, level-specific guidance block for a prompt. Pure — unit tested. */
export function readingLevelGuidance(level: ReadingLevel): string {
  const spec = LEVELS[level];
  return [
    `Target reading level: ${spec.label}.`,
    `Sentences: ${spec.sentences}`,
    `Vocabulary: ${spec.vocabulary}`,
  ].join("\n");
}
