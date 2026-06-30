import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Runs against the component gallery (app/dev/components) — the same surface you
// review manually. Each built component should be exercised here; the parity
// check (scripts/check-design-system-skill.mjs) requires it.
const GALLERY = "/dev/components";

test.beforeEach(async ({ page }) => {
  await page.goto(GALLERY);
  // Route is pre-compiled by the setup project; confirm it's rendered before
  // asserting so a test never races a cold compile.
  await expect(page.getByTestId("gallery")).toBeVisible();
});

test.describe("design system — accessibility", () => {
  test("gallery has no axe violations (both surfaces rendered)", async ({
    page,
  }) => {
    const results = await new AxeBuilder({ page })
      .include('[data-testid="gallery"]')
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});

test.describe("Input — accessibility contract", () => {
  // Scope to one surface so accessible names are unambiguous (each variant is
  // rendered once per surface).
  const onNight = (page: import("@playwright/test").Page) =>
    page.getByTestId("input-night");

  test("label is programmatically associated", async ({ page }) => {
    const field = onNight(page).getByLabel("Display name");
    await expect(field).toBeVisible();
    await expect(field).toHaveJSProperty("tagName", "INPUT");
  });

  test("error sets aria-invalid and is announced via aria-describedby", async ({
    page,
  }) => {
    const field = onNight(page).getByLabel("Email");
    await expect(field).toHaveAttribute("aria-invalid", "true");

    const describedBy = await field.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    const message = page.locator(`#${describedBy}`);
    await expect(message).toContainText("doesn't look like an email");
  });

  test("kid size meets the 56–64px target floor", async ({ page }) => {
    const box = await onNight(page).getByLabel("Display name").boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(56);
  });

  test("hidden label is still exposed to assistive tech", async ({ page }) => {
    // hideLabel hides it visually (sr-only) but the accessible name remains,
    // so role+name still resolves.
    await expect(
      onNight(page).getByRole("searchbox", { name: "Filter" })
    ).toBeAttached();
  });

  test("shows a visible focus ring when tabbed to", async ({ page }) => {
    const field = onNight(page).getByLabel("Display name");
    await field.focus();
    await expect(field).toBeFocused();
    const outlineWidth = await field.evaluate(
      (el) => getComputedStyle(el).outlineWidth
    );
    expect(parseFloat(outlineWidth)).toBeGreaterThan(0);
  });
});
