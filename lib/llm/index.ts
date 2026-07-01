// Public surface of the LLM service layer. Feature pages (M4) import from here
// and never touch the Anthropic SDK directly — routing, caching, and logging all
// live behind these calls.
export {
  generateLesson,
  type LessonOptions,
  type LessonResult,
} from "./lesson";
export { generateQuiz, type QuizOptions, type QuizResult } from "./quiz";
export { normalizeTopic, slugify, type NormalizeOptions } from "./normalize";
export { suggestTopics, type TopicMapOptions } from "./topicMap";
export { pickModel, pickEffort, type Task, type RouteOpts } from "./router";
export { MODELS, computeCostUsd, type ModelId } from "./models";
export {
  isReadingLevel,
  clampReadingLevel,
  type ReadingLevel,
} from "./prompts/readingLevel";
export {
  QuizSchema,
  NormalizeSchema,
  TopicSuggestionsSchema,
  type Quiz,
  type NormalizedTopic,
  type TopicSuggestions,
} from "./schemas";
