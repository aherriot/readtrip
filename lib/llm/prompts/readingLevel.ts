// Reading-level guidance, injected into the *user* message (volatile) so the
// stable system prefix stays byte-identical and caches across every level.
// Levels are 1..7 (docs/04-reading-levels.md), roughly toddler → early teen.

export type ReadingLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** Bounds of the reading-level scale (docs/04). */
export const MIN_READING_LEVEL = 1;
export const MAX_READING_LEVEL = 7;

interface LevelSpec {
  label: string;
  sentences: string;
  vocabulary: string;
  /** Guidance for how mature/abstract a *topic suggestion* can be at this level. */
  topics: string;
}

const LEVELS: Record<ReadingLevel, LevelSpec> = {
  1: {
    label: "Level 1 (toddler / age 3–4)",
    sentences:
      "Extremely short sentences, 3–5 words. A single idea, no connecting words at all.",
    vocabulary:
      "Only the most basic words a toddler already knows (colors, animals, family, everyday objects). Never introduce a word that needs explaining.",
    topics:
      "Only the most concrete, sensory things a toddler already sees and touches: animals, colors, shapes, family, weather, familiar objects. Nothing abstract.",
  },
  2: {
    label: "Level 2 (about kindergarten / age 5)",
    sentences:
      "Very short sentences, 5–8 words. One idea per sentence. Lots of white space between ideas.",
    vocabulary:
      "Only the most common everyday words. Explain any new word in the same breath, with a familiar comparison.",
    topics:
      "Simple, concrete, wonder-filled topics (animals, space, weather, how everyday things work). Nothing abstract or multi-step.",
  },
  3: {
    label: "Level 3 (about 1st–2nd grade / age 6–7)",
    sentences: "Short sentences, 6–10 words. Mostly one idea per sentence.",
    vocabulary:
      "Simple, concrete words a young child knows. Introduce at most one new word and define it plainly.",
    topics:
      "Concrete, picturable topics with a little more range (nature, machines, history's friendlier corners like castles or explorers).",
  },
  4: {
    label: "Level 4 (about 3rd–4th grade / age 8–9)",
    sentences:
      "Medium sentences, 8–14 words. You may join two related ideas with 'and' or 'because'.",
    vocabulary:
      "Everyday words plus a couple of topic words, each explained the first time it appears.",
    topics:
      "Broader, still-concrete topics, including light cause-and-effect (basic science, world cultures, simple history) alongside the perennial favorites.",
  },
  5: {
    label: "Level 5 (about 5th grade / age 10)",
    sentences: "Fuller sentences, 10–18 words, with some variety in structure.",
    vocabulary:
      "Richer vocabulary is fine; still define specialized terms with a quick, concrete example.",
    topics:
      "Topics can introduce real complexity — how systems work, notable historical events, the basics of how societies are organized — while staying upbeat and concrete.",
  },
  6: {
    label: "Level 6 (about 6th grade / age 11–12)",
    sentences:
      "Varied sentence length, up to ~20 words, with clear connectors between ideas.",
    vocabulary:
      "You can use precise, subject-specific terms, but always make their meaning clear from context.",
    topics:
      "Topics can be more nuanced and multi-layered: science with some abstraction, world history and cultures, how big systems (governments, ecosystems, economies) fit together.",
  },
  7: {
    label: "Level 7 (about 7th–8th grade / age 13–14)",
    sentences:
      "Varied and more complex sentences, up to ~25 words, including subordinate clauses and clear transitions between ideas.",
    vocabulary:
      "Precise, subject-specific, and some abstract or academic vocabulary is welcome; define only the truly technical terms.",
    topics:
      "Topics can be genuinely nuanced or abstract for a young teen — the harder chapters of history handled thoughtfully, ethics and big questions, current science debates, how society and government work — always wholesome and never graphic, violent, or frightening.",
  },
};

export function isReadingLevel(value: number): value is ReadingLevel {
  return (
    Number.isInteger(value) &&
    value >= MIN_READING_LEVEL &&
    value <= MAX_READING_LEVEL
  );
}

/** Clamp any int into the valid 1..7 range (defends against bad stored data). */
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

/** Short human-readable label for a level, e.g. for UI or lightweight prompts. */
export function readingLevelLabel(level: ReadingLevel): string {
  return LEVELS[level].label;
}

/** Guidance on how mature/abstract a topic suggestion should be at this level. */
export function readingLevelTopicGuidance(level: ReadingLevel): string {
  const spec = LEVELS[level];
  return `Target reading level: ${spec.label}. Topic complexity: ${spec.topics}`;
}

/** Display copy for a level in a picker (Profiles edit form): the age band and
 * a short plain-English description of the reading stage, so a parent can
 * choose confidently without knowing the internal 1..7 scale. */
export interface ReadingLevelOption {
  level: ReadingLevel;
  /** e.g. "Age 5" or "Ages 11–12". */
  ageBand: string;
  /** e.g. "Kindergarten — very short sentences, common words". */
  description: string;
}

export const READING_LEVEL_OPTIONS: ReadingLevelOption[] = [
  {
    level: 1,
    ageBand: "Ages 3–4",
    description: "Toddler — a few words at a time",
  },
  {
    level: 2,
    ageBand: "Age 5",
    description: "Kindergarten — very short, simple sentences",
  },
  {
    level: 3,
    ageBand: "Ages 6–7",
    description: "1st–2nd grade — short sentences, simple words",
  },
  {
    level: 4,
    ageBand: "Ages 8–9",
    description: "3rd–4th grade — a bit more detail and vocabulary",
  },
  {
    level: 5,
    ageBand: "Age 10",
    description: "5th grade — fuller sentences, richer words",
  },
  {
    level: 6,
    ageBand: "Ages 11–12",
    description: "6th grade — varied sentences, precise terms",
  },
  {
    level: 7,
    ageBand: "Ages 13–14",
    description: "7th–8th grade — complex sentences, nuanced topics",
  },
];
