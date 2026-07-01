import { describe, expect, it } from "vitest";
import { toLessonChunks } from "./chunks";

describe("toLessonChunks", () => {
  it("splits on blank lines into trimmed blocks", () => {
    const text = "First idea.\n\nSecond idea.\n\nThird idea.";
    expect(toLessonChunks(text)).toEqual([
      "First idea.",
      "Second idea.",
      "Third idea.",
    ]);
  });

  it("collapses runs of blank lines and drops empty blocks", () => {
    const text = "\n\nOne.\n\n\n\nTwo.\n\n";
    expect(toLessonChunks(text)).toEqual(["One.", "Two."]);
  });

  it("keeps a single unterminated block (mid-stream) intact", () => {
    expect(toLessonChunks("Still typing this last idea")).toEqual([
      "Still typing this last idea",
    ]);
  });

  it("returns no chunks for empty or whitespace-only text", () => {
    expect(toLessonChunks("")).toEqual([]);
    expect(toLessonChunks("   \n\n  ")).toEqual([]);
  });

  it("preserves single newlines within a block", () => {
    expect(toLessonChunks("Line one\nline two\n\nNext block")).toEqual([
      "Line one\nline two",
      "Next block",
    ]);
  });
});
