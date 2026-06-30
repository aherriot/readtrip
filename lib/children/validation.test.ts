import { describe, expect, it } from "vitest";
import {
  AVATAR_COLORS,
  MAX_NAME_LENGTH,
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
});
