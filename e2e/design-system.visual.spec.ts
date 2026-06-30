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
    // Wait for web fonts so glyphs don't shift the baseline.
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByTestId("gallery")).toHaveScreenshot("gallery.png", {
      maxDiffPixelRatio: 0.01,
    });
  });
});
