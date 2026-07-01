// Pure slug helper, split out from normalize.ts so it (and its unit test) carry
// no dependency on the LLM client / DB singletons.

/**
 * Turn any text into a canonical kebab slug: decompose accents and drop the
 * combining marks (so "piñata" → "pinata", not "pin-ata"), keep letters/digits,
 * and collapse everything else into single hyphens. Used as the fallback when
 * the model doesn't return a usable slug. Unit tested in slug.test.ts.
 */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/\p{M}/gu, "") // drop the combining marks NFKD left behind
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}
