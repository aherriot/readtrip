// Split lesson text into display chunks. The lesson prompt separates each small
// idea with a blank line (docs/03); the reading UI renders one LessonChunk per
// block. Shared by the streaming reader (where the trailing block grows as text
// arrives) and kept pure so it's unit-testable without a browser.
export function toLessonChunks(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0);
}
