import { describe, it, expect } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("joins string classes with a single space", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it('drops non-string values so `cond && "class"` reads cleanly', () => {
    // The falsey branch of a `cond && "class"` expression can be any falsey
    // value, including 0/0n when the condition is a ReactNode (e.g. an icon).
    expect(cn("base", false && "off", null, undefined, 0, 0n, "on")).toBe(
      "base on"
    );
  });

  it("returns an empty string when nothing survives", () => {
    expect(cn(false, null, undefined)).toBe("");
  });
});
