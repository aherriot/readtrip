import { expect, test, type Page } from "@playwright/test";

// The World map (docs/09 M4): the /play home is a personalized map of knowledge.
// A new explorer's map is seeded with curated starter topics as "suggested"
// nodes; exploring one lights it up as "explored" on return. Node state logic is
// unit-tested (lib/map/nodeState.test.ts) and the component a11y contract lives
// in e2e/design-system.spec.ts. Like the other loop specs this drives the
// offline (canned) path, so it needs a real Next server + DB but no live LLM.

// Sign in → add a child → calibrate → land on the /play world map.
async function reachMap(page: Page) {
  const email = `e2e-map-${Date.now()}@example.com`;

  await page.goto("/sign-in");
  await page.getByPlaceholder("parent@example.com").fill(email);
  await page.getByPlaceholder("Alex").fill("Map Parent");
  await page.getByRole("button", { name: /dev sign-in/i }).click();

  await expect(page).toHaveURL(/\/profiles/);
  await page.getByRole("button", { name: /add an explorer/i }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Name").fill("Wren");
  await dialog.getByRole("button", { name: /create explorer/i }).click();

  await page.getByRole("button", { name: /Wren/ }).click();
  await expect(page).toHaveURL(/\/play\/calibrate/);
  await page.getByRole("button", { name: /let's go/i }).click();

  for (const passage of [/volcanoes/i, /busy bees/i, /the sun/i]) {
    await expect(page.getByRole("heading", { name: passage })).toBeVisible();
    await page.getByRole("button").first().click();
  }
  await page.getByRole("link", { name: /start exploring/i }).click();
  await expect(page).toHaveURL(/\/play$/);

  // Wait for the Explore island to hydrate before interacting.
  await expect(async () => {
    await page.getByLabel(/what do you want to explore/i).fill("ready?");
    await expect(page.getByRole("button", { name: /^explore$/i })).toBeEnabled({
      timeout: 1000,
    });
  }).toPass();
  await page.getByLabel(/what do you want to explore/i).fill("");
}

test("a new map seeds suggested starter topics", async ({ page }) => {
  await reachMap(page);

  await expect(
    page.getByRole("heading", { name: /your world map/i })
  ).toBeVisible();
  // Curated starters are seeded as tappable "suggested" nodes.
  await expect(
    page.getByRole("button", { name: /dinosaurs tap to explore/i })
  ).toBeVisible();
  // The seeded map already *is* the diverse starters, so the separate
  // "something new" section is redundant here and stays hidden.
  await expect(
    page.getByRole("heading", { name: /something new/i })
  ).toBeHidden();
});

test("exploring a map node lights it up as explored on return", async ({
  page,
}) => {
  await reachMap(page);

  // Tap the Dinosaurs node → the lesson streams for that known topic.
  await page.getByRole("button", { name: /dinosaurs tap to explore/i }).click();
  await expect(
    page.getByRole("region", { name: /lesson about dinosaurs/i })
  ).toBeVisible();

  // Play the canned quiz through to the Steer result.
  await page.getByRole("button", { name: /start the quiz/i }).click();
  await page.getByRole("button", { name: /^dinosaurs$/i }).click();
  await page.getByRole("button", { name: /next question/i }).click();
  await page
    .getByRole("button", { name: /reading and asking questions/i })
    .click();
  await page.getByRole("button", { name: /finish/i }).click();
  await expect(page.getByText(/on the first try/i)).toBeVisible();

  // Steer back to the map — Dinosaurs is now lit as explored (the node write
  // happens server-side at quiz time, so this is deterministic after a refresh).
  await page.getByRole("button", { name: /explore something new/i }).click();
  await expect(
    page.getByRole("button", { name: /dinosaurs explored/i })
  ).toBeVisible();

  // Now that the map has narrowed to explored/suggested topics, a separate
  // "something new" section offers fresh, unrelated starters for breadth —
  // and never re-lists what's already on the map.
  await expect(
    page.getByRole("heading", { name: /something new/i })
  ).toBeVisible();
  const different = page.getByRole("group", {
    name: /something new/i,
  });
  await expect(different.getByRole("button").first()).toBeVisible();
  await expect(
    different.getByRole("button", { name: /dinosaurs/i })
  ).toBeHidden();
});
