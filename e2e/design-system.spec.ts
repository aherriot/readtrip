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

test.describe("Button — accessibility contract", () => {
  const onNight = (page: import("@playwright/test").Page) =>
    page.getByTestId("button-night");

  test("renders a real <button> defaulting to type=button", async ({
    page,
  }) => {
    const btn = onNight(page).getByRole("button", { name: "Start exploring" });
    await expect(btn).toHaveJSProperty("tagName", "BUTTON");
    await expect(btn).toHaveAttribute("type", "button");
  });

  test("kid size meets the 56–64px target floor", async ({ page }) => {
    const box = await onNight(page)
      .getByRole("button", { name: "Start exploring" })
      .boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(56);
  });

  test("link variant renders a real <a> with href", async ({ page }) => {
    const link = onNight(page).getByRole("link", {
      name: "Check system health",
    });
    await expect(link).toHaveJSProperty("tagName", "A");
    await expect(link).toHaveAttribute("href", "/api/health");
  });

  test("icon-only button still has an accessible name", async ({ page }) => {
    await expect(
      onNight(page).getByRole("button", { name: "Search topics" })
    ).toBeVisible();
  });

  test("disabled button is not operable", async ({ page }) => {
    await expect(
      onNight(page).getByRole("button", { name: "Can't click me" })
    ).toBeDisabled();
  });

  test("shows a visible focus ring when focused (keyboard, no mouse)", async ({
    page,
  }) => {
    const btn = onNight(page).getByRole("button", { name: "Start exploring" });
    await btn.focus();
    await expect(btn).toBeFocused();
    const outlineWidth = await btn.evaluate(
      (el) => getComputedStyle(el).outlineWidth
    );
    expect(parseFloat(outlineWidth)).toBeGreaterThan(0);
  });
});

test.describe("Card — contract", () => {
  test("renders a surface-aware container with its content", async ({
    page,
  }) => {
    const card = page.getByTestId("card-night");
    await expect(card.getByText("Volcanoes")).toBeVisible();
    // Reads the panel token, not a hardcoded color.
    const bg = await card
      .getByText("Volcanoes")
      .evaluate((el) => getComputedStyle(el.closest("div")!).backgroundColor);
    expect(bg).not.toBe("rgba(0, 0, 0, 0)");
  });
});

test.describe("Heading / Text — contract", () => {
  const onNight = (page: import("@playwright/test").Page) =>
    page.getByTestId("heading-night");

  test("Heading renders the semantic level it's given", async ({ page }) => {
    await expect(
      onNight(page).getByRole("heading", { level: 1, name: "Page title" })
    ).toBeVisible();
    await expect(
      onNight(page).getByRole("heading", { level: 3, name: "Subsection" })
    ).toBeVisible();
  });

  test("Text renders body copy", async ({ page }) => {
    await expect(onNight(page).getByText("Lead text introduces")).toBeVisible();
  });
});

test.describe("Icon — accessibility contract", () => {
  const onNight = (page: import("@playwright/test").Page) =>
    page.getByTestId("icon-night");

  test("labelled icon is exposed as an image with a name", async ({ page }) => {
    await expect(
      onNight(page).getByRole("img", { name: "Favorite" }).first()
    ).toBeVisible();
  });

  test("decorative icon is hidden from assistive tech", async ({ page }) => {
    // Three labelled (sizes) + zero from the decorative example.
    await expect(
      onNight(page).getByRole("img", { name: "Favorite" })
    ).toHaveCount(3);
  });
});

test.describe("ProgressBar — accessibility contract", () => {
  const onNight = (page: import("@playwright/test").Page) =>
    page.getByTestId("progressbar-night");

  test("exposes the progressbar role with aria values", async ({ page }) => {
    const bar = onNight(page).getByRole("progressbar", {
      name: "Reading-level calibration",
    });
    await expect(bar).toHaveAttribute("aria-valuenow", "45");
    await expect(bar).toHaveAttribute("aria-valuemin", "0");
    await expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  test("clamps an out-of-100 value to a percentage", async ({ page }) => {
    // 7 / 12 → 58%.
    const bar = onNight(page).getByRole("progressbar", {
      name: "XP to next level",
    });
    await expect(bar).toHaveAttribute("aria-valuenow", "58");
  });
});

test.describe("Modal — accessibility contract", () => {
  // Drive it on the night surface; touch + keyboard only, no mouse assumed.
  const region = (page: import("@playwright/test").Page) =>
    page.getByTestId("modal-night");

  test("opens as a focus-trapped dialog and moves focus inside", async ({
    page,
  }) => {
    await region(page).getByRole("button", { name: "Open dialog" }).click();
    const dialog = page.getByRole("dialog", { name: "Ready to explore?" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    // Focus has moved into the dialog.
    const focusInside = await dialog.evaluate((el) =>
      el.contains(document.activeElement)
    );
    expect(focusInside).toBe(true);
  });

  test("traps Tab within the dialog", async ({ page }) => {
    await region(page).getByRole("button", { name: "Open dialog" }).click();
    const dialog = page.getByRole("dialog", { name: "Ready to explore?" });
    await expect(dialog).toBeVisible();
    // Cycle through several tabs; focus must never escape the dialog.
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press("Tab");
      const inside = await dialog.evaluate((el) =>
        el.contains(document.activeElement)
      );
      expect(inside).toBe(true);
    }
  });

  test("Escape closes and returns focus to the trigger", async ({ page }) => {
    const trigger = region(page).getByRole("button", { name: "Open dialog" });
    await trigger.click();
    await expect(
      page.getByRole("dialog", { name: "Ready to explore?" })
    ).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("dialog", { name: "Ready to explore?" })
    ).toBeHidden();
    await expect(trigger).toBeFocused();
  });
});
