import { describe, expect, it } from "vitest";
import { slugify } from "./slug";

describe("slugify", () => {
  it("lowercases and hyphenates words", () => {
    expect(slugify("Grizzly Bears")).toBe("grizzly-bears");
    expect(slugify("Why is the sky blue?")).toBe("why-is-the-sky-blue");
  });

  it("collapses punctuation and repeated separators", () => {
    expect(slugify("How do volcanoes work??!")).toBe("how-do-volcanoes-work");
    expect(slugify("  spaced   out  ")).toBe("spaced-out");
  });

  it("decomposes accents to their base letters", () => {
    expect(slugify("café")).toBe("cafe");
    expect(slugify("piñata party")).toBe("pinata-party");
  });

  it("never leaves a leading or trailing hyphen", () => {
    expect(slugify("!!!sharks!!!")).toBe("sharks");
    expect(slugify("---")).toBe("");
  });

  it("caps length without leaving a trailing hyphen", () => {
    const slug = slugify("a ".repeat(100));
    expect(slug.length).toBeLessThanOrEqual(80);
    expect(slug.endsWith("-")).toBe(false);
  });
});
