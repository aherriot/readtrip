// Calibration passages — one hand-authored passage per reading level (docs/04).
// These are "pre-generated and cached": they don't change per child, so the
// mini-game is instant and cheap (no LLM call at calibration time). Each passage
// is written to sit at its level's sentence-length / vocabulary band (see
// prompts/readingLevel.ts) and carries a single one-tap comprehension question
// whose answer is unambiguous from the text alone.
//
// The `answerIndex` is server-only. The client is handed a `CalibrationPassageView`
// with the key stripped, so the mini-game can't be trivially cheated and the
// starting level stays server-authoritative (graded in ./flow.ts).
import type { ReadingLevel } from "../llm/prompts/readingLevel";

export interface CalibrationPassage {
  /** Stable id sent back with the child's answer to grade it server-side. */
  id: string;
  level: ReadingLevel;
  /** Decorative flavor for the passage card (aria-hidden). */
  emoji: string;
  title: string;
  text: string;
  question: string;
  /** One-tap choices. Exactly one is correct (see `answerIndex`). */
  options: string[];
  /** Index into `options` of the correct answer. Never sent to the client. */
  answerIndex: number;
}

/** A passage as the client sees it — the answer key removed. */
export type CalibrationPassageView = Omit<CalibrationPassage, "answerIndex">;

export const CALIBRATION_PASSAGES: Record<ReadingLevel, CalibrationPassage> = {
  1: {
    id: "passage-l1",
    level: 1,
    emoji: "☀️",
    title: "The Sun",
    text: "The sun is very big. It is a giant ball of fire. The sun gives us light. It also keeps us warm.",
    question: "What does the sun give us?",
    options: ["Light", "Rain", "Snow"],
    answerIndex: 0,
  },
  2: {
    id: "passage-l2",
    level: 2,
    emoji: "🐝",
    title: "Busy Bees",
    text: "Bees are busy little insects. They live together in a hive. Bees fly to many flowers. They gather sweet nectar. Then they turn it into honey.",
    question: "What do bees make?",
    options: ["Bread", "Honey", "Milk"],
    answerIndex: 1,
  },
  3: {
    id: "passage-l3",
    level: 3,
    emoji: "🌋",
    title: "Volcanoes",
    text: "Volcanoes are mountains that can erupt. When they do, hot melted rock pours out. This rock is called lava. Lava glows bright orange because it is so hot. When it cools, it becomes hard rock again.",
    question: "Why does lava glow bright orange?",
    options: [
      "Because someone paints it",
      "Because it is very hot",
      "Because the moon shines on it",
    ],
    answerIndex: 1,
  },
  4: {
    id: "passage-l4",
    level: 4,
    emoji: "🐙",
    title: "Clever Octopuses",
    text: "Octopuses are among the cleverest creatures in the ocean. They have eight bendy arms lined with tiny suckers that grip almost anything. To hide from hungry predators, an octopus can change the color of its skin in a single second. Some can even squeeze their soft bodies through a gap no wider than a coin.",
    question: "How does an octopus hide from predators?",
    options: [
      "It changes the color of its skin",
      "It grows a hard shell",
      "It swims up to the surface",
    ],
    answerIndex: 0,
  },
  5: {
    id: "passage-l5",
    level: 5,
    emoji: "🏔️",
    title: "Rivers of Ice",
    text: "Glaciers are colossal rivers of ice that form over centuries as fallen snow is pressed into dense, solid ice. Although they look completely still, glaciers actually creep downhill with astonishing slowness, scraping against the rock beneath them. Over thousands of years, this relentless grinding can gouge out entire valleys and reshape whole mountain ranges.",
    question: "How do glaciers shape valleys?",
    options: [
      "By freezing rivers overnight",
      "By grinding against the rock as they slowly move",
      "By melting during summer storms",
    ],
    answerIndex: 1,
  },
};

/** Strip the answer key so a passage can be safely sent to the browser. */
export function toPassageView(
  passage: CalibrationPassage
): CalibrationPassageView {
  return {
    id: passage.id,
    level: passage.level,
    emoji: passage.emoji,
    title: passage.title,
    text: passage.text,
    question: passage.question,
    options: passage.options,
  };
}
