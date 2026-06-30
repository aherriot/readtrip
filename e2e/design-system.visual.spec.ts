import { test, expect } from "@playwright/test";

/*
 * Visual-regression snapshot of the component gallery.
 *
 * OPT-IN: skipped unless VISUAL=1, because screenshot baselines are OS/font
 * specific — generate and run them in ONE environment (your machine, or CI's
 * Linux/Chromium) or they'll flake. Not part of the default `npm test` / CI.
 *
 *   npm run test:visual:update   # generate/refresh baselines (do this first)
 *   npm run test:visual          # compare against baselines
 *
 * For ad-hoc visual checks, just open /dev/components in `npm run dev`.
 */
test.describe("design system — visual", () => {
  test.skip(
    !process.env.VISUAL,
    "opt-in: set VISUAL=1 (see npm run test:visual)"
  );

  test("component gallery matches snapshot", async ({ page }) => {
    await page.goto("/dev/components");
    // Wait for web fonts so glyphs don't shift the baseline. (Resolve to a
    // serializable value — the FontFaceSet itself can't cross the bridge.)
    await page.evaluate(() => document.fonts.ready.then(() => true));
    await expect(page.getByTestId("gallery")).toHaveScreenshot("gallery.png", {
      // Small tolerance so a runner-image bump (minor anti-aliasing drift)
      // doesn't false-fail. Real regressions move far more (the yellow-fill
      // demo moved 11% of pixels); if drift ever exceeds this, regenerate the
      // baseline (see references/testing.md) rather than loosening further.
      maxDiffPixelRatio: 0.02,
    });
  });
});
