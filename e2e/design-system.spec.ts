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

  test("a loading button is inert and marked busy", async ({ page }) => {
    const btn = onNight(page).getByRole("button", { name: "Charting…" });
    await expect(btn).toBeDisabled();
    await expect(btn).toHaveAttribute("aria-busy", "true");
  });
});

test.describe("Spinner — accessibility contract", () => {
  const onNight = (page: import("@playwright/test").Page) =>
    page.getByTestId("spinner-night");

  test("a standing-alone spinner is a live status region naming the wait", async ({
    page,
  }) => {
    // role="status" is a live region (its content is announced, not its name),
    // carrying sr-only text so a screen reader hears *what* is loading.
    const status = onNight(page).getByRole("status");
    await expect(status).toHaveCount(1);
    await expect(status).toContainText("Loading your lesson");
  });

  test("a decorative spinner exposes no status role", async ({ page }) => {
    // The size/tint variants are aria-hidden — no accessible status to announce.
    await expect(onNight(page).getByRole("status")).toHaveCount(1);
  });
});

test.describe("Badge — contract", () => {
  const onNight = (page: import("@playwright/test").Page) =>
    page.getByTestId("badge-night");

  test("pairs a status word with its color, not color alone", async ({
    page,
  }) => {
    // The word is the meaning — a screen reader reads it; color isn't the only
    // signal. (axe covers contrast globally; this asserts the word is present.)
    await expect(onNight(page).getByText("Yes!")).toBeVisible();
  });

  test("a tag badge that mirrors an existing label is hidden from assistive tech", async ({
    page,
  }) => {
    // The map-node style badge duplicates a status word announced elsewhere
    // (a node's sr-only label), so the caller marks it aria-hidden. The word
    // sits in an inner span, so the aria-hidden is on its Badge container.
    await expect(
      onNight(page).getByText("Exploring").locator("xpath=..")
    ).toHaveAttribute("aria-hidden", "true");
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
    // The resolved states carry a status word, so meaning survives without
    // color (a11y floor: never color-only). Assert via the choice's accessible
    // name — that's what a screen reader announces, and it ignores the invisible
    // width-reserving placeholder badge.
    await expect(
      region(page).getByRole("button", { name: /Yes!/i })
    ).toBeVisible();
    await expect(
      region(page).getByRole("button", { name: /Try again/i })
    ).toBeVisible();
  });

  test("a correct tap reveals the advance action", async ({ page }) => {
    await region(page)
      .getByRole("button", { name: "It reflects the Sun's light" })
      .click();
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
    // locked/mastered still show their status word as visible body text.
    for (const word of ["Locked", "Mastered"]) {
      await expect(
        region(page).getByText(word, { exact: true }).first()
      ).toBeVisible();
    }
    // suggested/explored trade the body-text word for a visible corner badge
    // (icon + short word) plus an sr-only span carrying the full status word
    // — so the accessible name is unchanged even though "Tap to explore" no
    // longer appears as visible text.
    for (const word of ["Dive", "New", "Exploring"]) {
      await expect(
        region(page).getByText(word, { exact: true }).first()
      ).toBeVisible();
    }
    await expect(
      region(page)
        .getByRole("button", { name: "Volcanoes Tap to explore" })
        .first()
    ).toBeAttached();
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
