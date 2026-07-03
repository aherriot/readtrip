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

  // The interactive demos (Modal, WorldMap, Rewards, Quiz) are separate client
  // components — their onClick handlers only attach once React hydrates. The
  // gallery testid above is present in the server-rendered HTML, so it proves
  // nothing about hydration; a test whose first action is a click can race the
  // handler attaching and silently no-op. Force a real click through here (same
  // retry-until-it-works idiom as the Explore island hydration wait in
  // e2e/helpers.ts), then reset it, so every test starts fully hydrated.
  const trigger = page
    .getByTestId("modal-night")
    .getByRole("button", { name: "Open dialog" });
  const dialog = page.getByRole("dialog", { name: "Ready to explore?" });
  await expect(async () => {
    await trigger.click();
    await expect(dialog).toBeVisible({ timeout: 1000 });
  }).toPass();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
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

  test("label is associated, sized for kid targets, and error state is announced", async ({
    page,
  }) => {
    const field = onNight(page).getByLabel("Display name");
    await expect(field).toBeVisible();
    await expect(field).toHaveJSProperty("tagName", "INPUT");

    const box = await field.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(56);

    // hideLabel hides it visually (sr-only) but the accessible name remains,
    // so role+name still resolves.
    await expect(
      onNight(page).getByRole("searchbox", { name: "Filter" })
    ).toBeAttached();

    const errorField = onNight(page).getByLabel("Email");
    await expect(errorField).toHaveAttribute("aria-invalid", "true");

    // Headless UI's Field wires aria-describedby → the error Description in a
    // post-mount effect; wait for it (retrying matcher) rather than reading once.
    await expect(errorField).toHaveAttribute("aria-describedby", /.+/);
    const describedBy = await errorField.getAttribute("aria-describedby");
    const message = page.locator(`#${describedBy}`);
    await expect(message).toContainText("doesn't look like an email");
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

test.describe("Select — accessibility contract", () => {
  const onNight = (page: import("@playwright/test").Page) =>
    page.getByTestId("select-night");

  test("label is associated, sized for kid targets, and error state is announced", async ({
    page,
  }) => {
    const field = onNight(page).getByLabel("Reading level");
    await expect(field).toBeVisible();
    await expect(field).toHaveJSProperty("tagName", "SELECT");

    const box = await field.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(56);

    // hideLabel hides it visually (sr-only) but the accessible name remains.
    await expect(
      onNight(page).getByRole("combobox", { name: "Sort by" })
    ).toBeAttached();

    const errorField = onNight(page).getByLabel("Favorite color");
    await expect(errorField).toHaveAttribute("aria-invalid", "true");
    await expect(errorField).toHaveAttribute("aria-describedby", /.+/);
    const describedBy = await errorField.getAttribute("aria-describedby");
    const message = page.locator(`#${describedBy}`);
    await expect(message).toContainText("Pick a color");
  });

  test("shows a visible focus ring when tabbed to", async ({ page }) => {
    const field = onNight(page).getByLabel("Reading level");
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

  test("renders a real, sized <button> across its variants (link, icon-only, disabled, loading)", async ({
    page,
  }) => {
    const btn = onNight(page).getByRole("button", { name: "Start exploring" });
    await expect(btn).toHaveJSProperty("tagName", "BUTTON");
    await expect(btn).toHaveAttribute("type", "button");

    const box = await btn.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(56);

    const link = onNight(page).getByRole("link", {
      name: "Check system health",
    });
    await expect(link).toHaveJSProperty("tagName", "A");
    await expect(link).toHaveAttribute("href", "/api/health");

    await expect(
      onNight(page).getByRole("button", { name: "Search topics" })
    ).toBeVisible();

    await expect(
      onNight(page).getByRole("button", { name: "Can't click me" })
    ).toBeDisabled();

    const loading = onNight(page).getByRole("button", { name: "Charting…" });
    await expect(loading).toBeDisabled();
    await expect(loading).toHaveAttribute("aria-busy", "true");
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

test.describe("Spinner — accessibility contract", () => {
  const onNight = (page: import("@playwright/test").Page) =>
    page.getByTestId("spinner-night");

  test("a standing-alone spinner is a live status naming the wait; decorative ones expose no status role", async ({
    page,
  }) => {
    // role="status" is a live region (its content is announced, not its name),
    // carrying sr-only text so a screen reader hears *what* is loading. The
    // size/tint variants are aria-hidden, so only this one contributes a status.
    const status = onNight(page).getByRole("status");
    await expect(status).toHaveCount(1);
    await expect(status).toContainText("Loading your lesson");
  });
});

test.describe("Badge — contract", () => {
  const onNight = (page: import("@playwright/test").Page) =>
    page.getByTestId("badge-night");

  test("pairs a status word with its color, and hides a badge that mirrors an existing label", async ({
    page,
  }) => {
    // The word is the meaning — a screen reader reads it; color isn't the only
    // signal. (axe covers contrast globally; this asserts the word is present.)
    await expect(onNight(page).getByText("Yes!")).toBeVisible();

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

  test("enabled and icon-only buttons show the pointer cursor; disabled shows not-allowed", async ({
    page,
  }) => {
    const btn = onNight(page).getByRole("button", { name: "Start exploring" });
    expect(await cursorOf(btn)).toBe("pointer");

    const icon = onNight(page).getByRole("button", { name: "Search topics" });
    expect(await cursorOf(icon)).toBe("pointer");

    const disabled = onNight(page).getByRole("button", {
      name: "Can't click me",
    });
    expect(await cursorOf(disabled)).toBe("not-allowed");
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

  test("Heading renders the semantic level it's given, and Text renders body copy", async ({
    page,
  }) => {
    await expect(
      onNight(page).getByRole("heading", { level: 1, name: "Page title" })
    ).toBeVisible();
    await expect(
      onNight(page).getByRole("heading", { level: 3, name: "Subsection" })
    ).toBeVisible();
    await expect(onNight(page).getByText("Lead text introduces")).toBeVisible();
  });
});

test.describe("Icon — accessibility contract", () => {
  const onNight = (page: import("@playwright/test").Page) =>
    page.getByTestId("icon-night");

  test("labelled icons are exposed as named images; decorative icons are hidden", async ({
    page,
  }) => {
    await expect(
      onNight(page).getByRole("img", { name: "Favorite" }).first()
    ).toBeVisible();
    // Three labelled (sizes) + zero from the decorative example.
    await expect(
      onNight(page).getByRole("img", { name: "Favorite" })
    ).toHaveCount(3);
  });
});

test.describe("ProgressBar — accessibility contract", () => {
  const onNight = (page: import("@playwright/test").Page) =>
    page.getByTestId("progressbar-night");

  test("exposes the progressbar role with aria values, clamping an out-of-100 value to a percentage", async ({
    page,
  }) => {
    const bar = onNight(page).getByRole("progressbar", {
      name: "Reading-level calibration",
    });
    await expect(bar).toHaveAttribute("aria-valuenow", "45");
    await expect(bar).toHaveAttribute("aria-valuemin", "0");
    await expect(bar).toHaveAttribute("aria-valuemax", "100");

    // 7 / 12 → 58%.
    const xpBar = onNight(page).getByRole("progressbar", {
      name: "XP to next level",
    });
    await expect(xpBar).toHaveAttribute("aria-valuenow", "58");
  });
});

test.describe("Quiz — accessibility contract", () => {
  const region = (page: import("@playwright/test").Page) =>
    page.getByTestId("quiz-paper");

  test("choices are real, kid-sized buttons whose feedback pairs color with an icon + word", async ({
    page,
  }) => {
    const choice = region(page).getByRole("button", {
      name: "A quiet, unpicked choice",
    });
    await expect(choice).toHaveJSProperty("tagName", "BUTTON");
    const box = await choice.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(56);

    // The resolved states carry a status word, so meaning survives without
    // color (a11y floor: never color-only). Assert via the choice's accessible
    // name — that's what a screen reader announces.
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

  test("a node is a real, kid-sized button; locked nodes are disabled; the map is a real list; each state carries a word, not color alone", async ({
    page,
  }) => {
    const node = region(page).getByRole("button", {
      name: "Volcanoes Mastered",
    });
    await expect(node).toHaveJSProperty("tagName", "BUTTON");
    const box = await node.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(56);

    await expect(
      region(page).getByRole("button", { name: "Volcanoes Locked" })
    ).toBeDisabled();

    const list = region(page).getByRole("list");
    await expect(list).toBeVisible();
    // Four of the six sample nodes are active (explored/suggested) and shown
    // up front — two rows on the mobile layout — in DOM order (not purely
    // spatial); the rest are behind "Show more" / the mastered disclosure.
    await expect(list.getByRole("listitem")).toHaveCount(4);

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
    // WorldMap's order is randomized (see lib/map/nodeState.ts orderNodes), so
    // which of the 5 sample nodes lands as the 5th/hidden one varies run to
    // run — assert the reveal/hide behavior by count, not by a fixed title.
    const toggle = region(page).getByRole("button", {
      name: /show 1 more topic/i,
    });
    const list = region(page).getByRole("list");
    await expect(list.getByRole("listitem")).toHaveCount(4);
    await toggle.click();
    await expect(list.getByRole("listitem")).toHaveCount(5);
    await region(page)
      .getByRole("button", { name: /show fewer topics/i })
      .click();
    await expect(list.getByRole("listitem")).toHaveCount(4);
  });

  test("a node shows a visible focus ring when focused", async ({ page }) => {
    // Any of the always-visible-first-four nodes will do; ordering is
    // randomized, so don't pin this to a specific title (see above).
    const node = region(page)
      .getByRole("list")
      .getByRole("listitem")
      .first()
      .getByRole("button");
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

  test("XPBar, ExpeditionStamp, and RewardBurst expose a named progressbar, a labelled image, and a polite XP announcement", async ({
    page,
  }) => {
    // 70 XP → Level 2, half-way; the bar is a labelled progressbar, and the
    // count-up fill settles at 50 (deterministic, motion aside).
    const bar = region(page).getByRole("progressbar", {
      name: /Level 2:.*XP to the next level/,
    });
    await expect(bar).toHaveAttribute("aria-valuenow", "50");

    // The stamp carries the topic as its accessible name AND real "Master" text,
    // so mastery never reads by color/glow alone (a11y floor).
    await expect(
      region(page).getByRole("img", { name: "Volcanoes Master badge" })
    ).toBeVisible();
    await expect(
      region(page).getByText("Master", { exact: true })
    ).toBeVisible();

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
