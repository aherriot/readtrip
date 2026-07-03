import { test, expect } from "@playwright/test";

/*
 * Visual-regression snapshots of the design system, one per component.
 *
 * Each component gets its OWN snapshot (taken from its `section-<name>` block in
 * the gallery) rather than a single full-page image. That keeps a diff scoped to
 * the component that actually changed, and lets stateful components be captured
 * in the state that matters — e.g. the Modal is opened so the dialog itself is in
 * the baseline, not just its trigger button.
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

  // Small tolerance so a runner-image bump (minor anti-aliasing drift) doesn't
  // false-fail. Real regressions move far more; if drift ever exceeds this,
  // regenerate the baseline rather than loosening further.
  const SNAPSHOT = { maxDiffPixelRatio: 0.02 } as const;

  // One snapshot per component, keyed off the gallery's `section-<name>` blocks.
  const COMPONENTS = [
    "button",
    "badge",
    "card",
    "heading",
    "icon",
    "progressbar",
    "spinner",
    "input",
    "select",
    "modal",
  ];

  test.beforeEach(async ({ page }) => {
    // Deterministic snapshots: skip entrance/press animations (the global
    // reduced-motion floor turns them into instant final-state renders).
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/dev/components");
    // Wait for web fonts so glyphs don't shift the baseline. (Resolve to a
    // serializable value — the FontFaceSet itself can't cross the bridge.)
    await page.evaluate(() => document.fonts.ready.then(() => true));
  });

  for (const name of COMPONENTS) {
    test(`${name} — both surfaces`, async ({ page }) => {
      await expect(page.getByTestId(`section-${name}`)).toHaveScreenshot(
        `${name}.png`,
        SNAPSHOT
      );
    });
  }

  // The Modal section above only shows its triggers; capture the opened dialog
  // (it portals to <body>) so the surface, layout, and close button are in the
  // baseline. Snapshot the opaque *panel*, not the full-viewport Dialog root —
  // the root's translucent backdrop would bleed the page behind it into the
  // image, making the baseline depend on scroll position / gallery layout.
  test("modal — open dialog", async ({ page }) => {
    await page
      .getByTestId("modal-night")
      .getByRole("button", { name: "Open dialog" })
      .click();
    await expect(
      page.getByRole("dialog", { name: "Ready to explore?" })
    ).toBeVisible();
    const panel = page.getByTestId("modal-panel");
    await expect(panel).toHaveScreenshot("modal-open.png", SNAPSHOT);
  });
});
