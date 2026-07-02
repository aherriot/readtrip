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

    // Headless UI's Field wires aria-describedby → the error Description in a
    // post-mount effect; wait for it (retrying matcher) rather than reading once.
    await expect(field).toHaveAttribute("aria-describedby", /.+/);
    const describedBy = await field.getAttribute("aria-describedby");
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

test.describe("Desktop affordances — cursors", () => {
  // Touch-first, but mouse users still expect the right cursor on each control.
  // Tailwind v4 drops the default button pointer, so this guards the restore in
  // globals.css (+ Button's not-disabled gating) against silent regression.
  const onNight = (page: import("@playwright/test").Page) =>
    page.getByTestId("button-night");
  const cursorOf = (locator: import("@playwright/test").Locator) =>
    locator.evaluate((el) => getComputedStyle(el).cursor);

  test("an enabled button shows the pointer (hand) cursor", async ({
    page,
  }) => {
    const btn = onNight(page).getByRole("button", { name: "Start exploring" });
    expect(await cursorOf(btn)).toBe("pointer");
  });

  test("an icon-only button shows the pointer cursor", async ({ page }) => {
    const btn = onNight(page).getByRole("button", { name: "Search topics" });
    expect(await cursorOf(btn)).toBe("pointer");
  });

  test("a disabled button shows the not-allowed cursor", async ({ page }) => {
    const btn = onNight(page).getByRole("button", { name: "Can't click me" });
    expect(await cursorOf(btn)).toBe("not-allowed");
  });

  test("the Modal close button shows the pointer cursor", async ({ page }) => {
    await page
      .getByTestId("modal-night")
      .getByRole("button", { name: "Open dialog" })
      .click();
    const close = page.getByRole("button", { name: "Close" });
    await expect(close).toBeVisible();
    expect(await cursorOf(close)).toBe("pointer");
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

test.describe("Quiz — accessibility contract", () => {
  const region = (page: import("@playwright/test").Page) =>
    page.getByTestId("quiz-paper");

  test("choices are real buttons meeting the kid target floor", async ({
    page,
  }) => {
    const choice = region(page).getByRole("button", {
      name: "A quiet, unpicked choice",
    });
    await expect(choice).toHaveJSProperty("tagName", "BUTTON");
    const box = await choice.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(56);
  });

  test("feedback pairs color with an icon + word, not color alone", async ({
    page,
  }) => {
    // The resolved states carry a visible status word, so meaning survives
    // without color (a11y floor: never color-only).
    await expect(region(page).getByText("Yes!")).toBeVisible();
    await expect(region(page).getByText("Try again")).toBeVisible();
  });

  test("a correct tap reveals the explanation and advance action", async ({
    page,
  }) => {
    await region(page)
      .getByRole("button", { name: "It reflects the Sun's light" })
      .click();
    await expect(region(page).getByText(/catches sunlight/i)).toBeVisible();
    await expect(
      region(page).getByRole("button", { name: /next question/i })
    ).toBeVisible();
  });

  test("shows a visible focus ring when a choice is focused", async ({
    page,
  }) => {
    const choice = region(page).getByRole("button", {
      name: "A quiet, unpicked choice",
    });
    await choice.focus();
    await expect(choice).toBeFocused();
    const outlineWidth = await choice.evaluate(
      (el) => getComputedStyle(el).outlineWidth
    );
    expect(parseFloat(outlineWidth)).toBeGreaterThan(0);
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

test.describe("WorldMap / TopicNode — accessibility contract", () => {
  const region = (page: import("@playwright/test").Page) =>
    page.getByTestId("worldmap-demo");

  test("a node is a real button meeting the kid target floor", async ({
    page,
  }) => {
    const node = region(page).getByRole("button", {
      name: "Volcanoes Mastered",
    });
    await expect(node).toHaveJSProperty("tagName", "BUTTON");
    const box = await node.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(56);
  });

  test("a locked node is disabled", async ({ page }) => {
    await expect(
      region(page).getByRole("button", { name: "Volcanoes Locked" })
    ).toBeDisabled();
  });

  test("each state carries a word, not color alone", async ({ page }) => {
    // The status word is part of the node's accessible name, so state survives
    // without color (a11y floor: never color-only).
    for (const word of ["Locked", "Tap to explore", "Explored", "Mastered"]) {
      await expect(
        region(page).getByText(word, { exact: true }).first()
      ).toBeVisible();
    }
  });

  test("the map is a real list — the screen-reader-friendly equivalent", async ({
    page,
  }) => {
    const list = region(page).getByRole("list");
    await expect(list).toBeVisible();
    // Four of the six sample nodes are active (explored/suggested) and shown
    // up front — two rows on the mobile layout — in DOM order (not purely
    // spatial); the rest are behind "Show more" / the mastered disclosure.
    await expect(list.getByRole("listitem")).toHaveCount(4);
  });

  test("mastered nodes sit behind a real, focusable disclosure", async ({
    page,
  }) => {
    const summary = region(page).getByText(/1 topic mastered/i);
    const node = region(page).getByRole("button", {
      name: "Dinosaurs Mastered",
    });
    await expect(node).toBeHidden();
    await summary.click();
    await expect(node).toBeVisible();
  });

  test("more active topics than two rows sit behind a 'show more' toggle", async ({
    page,
  }) => {
    const toggle = region(page).getByRole("button", {
      name: /show 1 more topic/i,
    });
    const node = region(page).getByRole("button", {
      name: "Wild Weather Tap to explore",
    });
    await expect(node).toBeHidden();
    await toggle.click();
    await expect(node).toBeVisible();
    await region(page)
      .getByRole("button", { name: /show fewer topics/i })
      .click();
    await expect(node).toBeHidden();
  });

  test("a node shows a visible focus ring when focused", async ({ page }) => {
    const node = region(page).getByRole("button", {
      name: "Outer Space Tap to explore",
    });
    await node.focus();
    await expect(node).toBeFocused();
    const outlineWidth = await node.evaluate(
      (el) => getComputedStyle(el).outlineWidth
    );
    expect(parseFloat(outlineWidth)).toBeGreaterThan(0);
  });
});

test.describe("Rewards — accessibility contract", () => {
  const region = (page: import("@playwright/test").Page) =>
    page.getByTestId("rewards-demo");

  test("XPBar exposes a named progressbar with a real value", async ({
    page,
  }) => {
    // 70 XP → Level 2, half-way; the bar is a labelled progressbar, and the
    // count-up fill settles at 50 (deterministic, motion aside).
    const bar = region(page).getByRole("progressbar", {
      name: /Level 2:.*XP to the next level/,
    });
    await expect(bar).toHaveAttribute("aria-valuenow", "50");
  });

  test("ExpeditionStamp is a single labelled image, not color alone", async ({
    page,
  }) => {
    // The stamp carries the topic as its accessible name AND real "Master" text,
    // so mastery never reads by color/glow alone (a11y floor).
    await expect(
      region(page).getByRole("img", { name: "Volcanoes Master badge" })
    ).toBeVisible();
    await expect(
      region(page).getByText("Master", { exact: true })
    ).toBeVisible();
  });

  test("RewardBurst announces the XP gain politely", async ({ page }) => {
    const burst = region(page).getByText("+20 XP");
    await expect(burst).toBeVisible();
    await expect(
      region(page).locator('[aria-live="polite"]', { hasText: "+20 XP" })
    ).toBeVisible();
  });

  test("LevelUpCelebration opens a focus-trapped dialog and restores focus", async ({
    page,
  }) => {
    const trigger = region(page).getByRole("button", { name: "Show level-up" });
    await trigger.click();

    const dialog = page.getByRole("dialog", { name: "Level 3!" });
    await expect(dialog).toBeVisible();
    // Dismiss returns focus to the trigger (Modal contract).
    await dialog.getByRole("button", { name: "Keep exploring" }).click();
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });
});
