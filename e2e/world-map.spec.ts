import { expect, test, type Page } from "@playwright/test";
import { reachExplore, revealTopic } from "./helpers";

// The World map (docs/09 M4): the /play home is a personalized map of knowledge.
// A new explorer's map is seeded with curated starter topics as "suggested"
// nodes; exploring one lights it up as "explored" on return. Node state logic is
// unit-tested (lib/map/nodeState.test.ts) and the component a11y contract lives
// in e2e/design-system.spec.ts. Like the other loop specs this drives the
// offline (canned) path, so it needs a real Next server + DB but no live LLM.

// Sign in → add a child → calibrate → land on the /play world map.
async function reachMap(page: Page) {
  await reachExplore(page, {
    emailPrefix: "map",
    parentName: "Map Parent",
    childName: "Wren",
  });
}

test("a new map seeds suggested starter topics", async ({ page }) => {
  await reachMap(page);

  await expect(
    page.getByRole("heading", { name: /your world map/i })
  ).toBeVisible();
  // Curated starters are seeded as tappable "suggested" nodes. Tile order is
  // randomized, so Dinosaurs may sit behind "Show more" — reveal it first.
  await revealTopic(page, /dinosaurs tap to explore/i);
  await expect(
    page.getByRole("button", { name: /dinosaurs tap to explore/i })
  ).toBeVisible();
});

test("exploring a map node lights it up as explored and the map keeps offering new suggestions", async ({
  page,
}) => {
  await reachMap(page);

  // Tap the Dinosaurs node → the lesson streams for that known topic.
  await revealTopic(page, /dinosaurs tap to explore/i);
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
    page.getByRole("button", { name: /dinosaurs exploring/i })
  ).toBeVisible();

  // The map itself keeps growing with fresh suggestions once a topic is
  // explored (docs/05) — expand to see every tile and confirm at least one
  // non-dinosaur topic is still on offer, and dinosaurs isn't re-suggested.
  const toggle = page.getByRole("button", { name: /show \d+ more topics?/i });
  if (await toggle.isVisible()) await toggle.click();
  const suggested = page.getByRole("button", { name: /tap to explore/i });
  await expect(suggested.first()).toBeVisible();
  await expect(suggested.filter({ hasText: /dinosaurs/i })).toHaveCount(0);
});

test("dismissing a suggested topic permanently removes it from the map", async ({
  page,
}) => {
  await reachMap(page);

  await revealTopic(page, /dinosaurs tap to explore/i);
  await expect(
    page.getByRole("button", { name: /dinosaurs tap to explore/i })
  ).toBeVisible();

  await page.getByRole("button", { name: /dismiss dinosaurs/i }).click();
  await expect(
    page.getByRole("button", { name: /dinosaurs tap to explore/i })
  ).toBeHidden();

  // Permanent: a full reload must not bring it back onto the map at all.
  await page.reload();
  const toggle = page.getByRole("button", { name: /show \d+ more topics?/i });
  if (await toggle.isVisible()) await toggle.click();
  await expect(
    page.getByRole("button", { name: /dinosaurs tap to explore/i })
  ).toBeHidden();
});
