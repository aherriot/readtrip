import { expect, test, type Page } from "@playwright/test";
import { reachExplore } from "./helpers";

// Content-safety guardrails (docs/07). This drives the offline (rules-only) path
// — no live classifier needed — to prove the guardrail is actually wired into the
// running app: an unsafe topic typed into Explore is steered away with a gentle
// redirect, never generated. The output-side guardrails (lesson/quiz/topic-map)
// are covered by unit tests in lib/safety/rules.test.ts, since offline canned
// content is always safe and can't trip them end-to-end.

// Sign in → add a child → calibrate → land on the Explore screen (hydrated).
async function reachPlay(page: Page) {
  await reachExplore(page, {
    emailPrefix: "safety",
    parentName: "Safety Parent",
    childName: "Pip",
  });
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
