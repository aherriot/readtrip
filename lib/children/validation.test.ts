import { describe, expect, it } from "vitest";
import {
  AVATAR_COLORS,
  DEFAULT_AVATAR_COLOR,
  MAX_NAME_LENGTH,
  avatarColorFromConfig,
  validateChildInput,
} from "./validation";

describe("validateChildInput", () => {
  it("accepts a valid name + palette color and trims whitespace", () => {
    const result = validateChildInput({
      displayName: "  Ada  ",
      avatarColor: "aqua",
    });
    expect(result).toEqual({
      ok: true,
      value: { displayName: "Ada", avatarColor: "aqua" },
    });
  });

  it("accepts every color in the palette", () => {
    for (const color of AVATAR_COLORS) {
      const result = validateChildInput({
        displayName: "Kai",
        avatarColor: color,
      });
      expect(result.ok).toBe(true);
    }
  });

  it("rejects an empty or whitespace-only name", () => {
    for (const displayName of ["", "   ", undefined, 42]) {
      const result = validateChildInput({ displayName, avatarColor: "sun" });
      expect(result.ok).toBe(false);
    }
  });

  it("rejects a name over the length cap", () => {
    const result = validateChildInput({
      displayName: "x".repeat(MAX_NAME_LENGTH + 1),
      avatarColor: "sun",
    });
    expect(result).toEqual({
      ok: false,
      error: `Keep the name under ${MAX_NAME_LENGTH} characters.`,
    });
  });

  it("accepts a name exactly at the length cap", () => {
    const result = validateChildInput({
      displayName: "x".repeat(MAX_NAME_LENGTH),
      avatarColor: "sun",
    });
    expect(result.ok).toBe(true);
  });

  it("rejects a color outside the palette", () => {
    for (const avatarColor of ["puce", "", "AQUA", undefined]) {
      const result = validateChildInput({ displayName: "Mara", avatarColor });
      expect(result.ok).toBe(false);
    }
  });

  it("omits reading level when the field is absent or blank", () => {
    for (const readingLevel of [undefined, ""]) {
      const result = validateChildInput({
        displayName: "Ada",
        avatarColor: "aqua",
        readingLevel,
      });
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.value.readingLevel).toBeUndefined();
    }
  });

  it("accepts and coerces an in-range reading level from a string", () => {
    const result = validateChildInput({
      displayName: "Ada",
      avatarColor: "aqua",
      readingLevel: "4",
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.readingLevel).toBe(4);
  });

  it("rejects an out-of-range or non-integer reading level", () => {
    for (const readingLevel of ["0", "8", "-1", "2.5", "abc"]) {
      const result = validateChildInput({
        displayName: "Ada",
        avatarColor: "aqua",
        readingLevel,
      });
      expect(result.ok).toBe(false);
    }
  });
});

describe("avatarColorFromConfig", () => {
  it("returns the stored color when it's a valid palette color", () => {
    for (const color of AVATAR_COLORS) {
      expect(avatarColorFromConfig({ color })).toBe(color);
    }
  });

  it("falls back to the default for missing, malformed, or legacy configs", () => {
    const malformed = [
      null,
      undefined,
      {},
      { color: null },
      { color: "puce" }, // not in palette
      { color: "AQUA" }, // wrong case
      { color: 123 },
      "aqua", // not an object
      ["aqua"],
    ];
    for (const config of malformed) {
      expect(avatarColorFromConfig(config)).toBe(DEFAULT_AVATAR_COLOR);
    }
  });
});
