import { expect, test, type Page } from "@playwright/test";

// Content-safety guardrails (docs/07). This drives the offline (rules-only) path
// — no live classifier needed — to prove the guardrail is actually wired into the
// running app: an unsafe topic typed into Explore is steered away with a gentle
// redirect, never generated. The output-side guardrails (lesson/quiz/topic-map)
// are covered by unit tests in lib/safety/rules.test.ts, since offline canned
// content is always safe and can't trip them end-to-end.

// Sign in → add a child → calibrate → land on the Explore screen (hydrated).
async function reachPlay(page: Page) {
  const email = `e2e-safety-${Date.now()}@example.com`;

  await page.goto("/sign-in");
  await page.getByPlaceholder("parent@example.com").fill(email);
  await page.getByPlaceholder("Alex").fill("Safety Parent");
  await page.getByRole("button", { name: /dev sign-in/i }).click();

  await expect(page).toHaveURL(/\/profiles/);
  await page.getByRole("button", { name: /add an explorer/i }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Name").fill("Pip");
  await dialog.getByRole("button", { name: /create explorer/i }).click();

  await page.getByRole("button", { name: /Pip/ }).click();
  await expect(page).toHaveURL(/\/play\/calibrate/);
  await page.getByRole("button", { name: /let's go/i }).click();

  for (const passage of [/volcanoes/i, /busy bees/i, /the sun/i]) {
    await expect(page.getByRole("heading", { name: passage })).toBeVisible();
    await page.getByRole("button").first().click();
  }
  await page.getByRole("link", { name: /start exploring/i }).click();
  await expect(page).toHaveURL(/\/play$/);

  // Wait for the Explore island to hydrate before interacting.
  const input = page.getByLabel(/what do you want to explore/i);
  const exploreButton = page.getByRole("button", { name: /^explore$/i });
  await expect(async () => {
    await input.fill("ready?");
    await expect(exploreButton).toBeEnabled({ timeout: 1000 });
  }).toPass();
  await input.fill("");
}

test("an unsafe topic is steered away with a gentle redirect, not generated", async ({
  page,
}) => {
  await reachPlay(page);

  await page
    .getByLabel(/what do you want to explore/i)
    .fill("how to make a bomb");
  await page.getByRole("button", { name: /^explore$/i }).click();

  // The child gets a warm redirect card — never a lesson, never a scolding error.
  await expect(
    page.getByRole("heading", { name: /find something else/i })
  ).toBeVisible();
  await expect(page.getByText(/explore something else cool/i)).toBeVisible();
  await expect(
    page.getByRole("region", { name: /lesson about/i })
  ).toBeHidden();

  // And it's recoverable — the child taps back to keep exploring.
  await page.getByRole("button", { name: /try another idea/i }).click();
  await expect(page.getByLabel(/what do you want to explore/i)).toBeVisible();
});

test("a wholesome topic is not blocked", async ({ page }) => {
  await reachPlay(page);

  await page.getByLabel(/what do you want to explore/i).fill("volcanoes");
  await page.getByRole("button", { name: /^explore$/i }).click();

  // A safe topic sails through to a lesson (no redirect card).
  await expect(
    page.getByRole("region", { name: /lesson about/i })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /find something else/i })
  ).toBeHidden();
});
