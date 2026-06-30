import { test } from "@playwright/test";

/*
 * Warm up dev-compiled routes before the real specs run.
 *
 * Playwright's `webServer` only waits for `/` to be ready, so the first hit to
 * any other route triggers Next's on-demand compile. Under `npm run check`
 * (where tests run in parallel with tsc/eslint/prettier) six workers hitting an
 * uncompiled /dev/components at once thrash the cold dev server and time out.
 *
 * This setup project is a dependency of the chromium project, so it runs first,
 * on one worker — compiling the gallery once. The real tests then hit a warm
 * route and stay fast and deterministic.
 */
test("warm up dev-compiled routes", async ({ page }) => {
  await page.goto("/dev/components");
  await page
    .getByTestId("gallery")
    .waitFor({ state: "visible", timeout: 60_000 });
});
