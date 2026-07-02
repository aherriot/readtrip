import { expect, test } from "@playwright/test";

// The observability dashboard (docs/09 M6) is a parent-only area: middleware.ts
// gates /dashboard the same way it gates /profiles. The happy-path test needs a
// database (the dev-credentials provider upserts a parent User), which CI
// provides via an ephemeral Neon branch.

test("unauthenticated /dashboard redirects to sign-in", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/sign-in/);
});

test("a signed-in parent reaches the dashboard from profiles", async ({
  page,
}) => {
  // Fresh parent with zero activity — the dashboard shows its empty state.
  const email = `e2e-dash-${Date.now()}@example.com`;

  await page.goto("/sign-in");
  await page.getByPlaceholder("parent@example.com").fill(email);
  await page.getByPlaceholder("Alex").fill("Test Parent");
  await page.getByRole("button", { name: /dev sign-in/i }).click();
  await expect(page).toHaveURL(/\/profiles/);

  // Navigate to the dashboard via the header link.
  await page.getByRole("link", { name: /usage & cost/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(
    page.getByRole("heading", { name: /usage & cost/i })
  ).toBeVisible();

  // With no logged calls yet, the empty state is shown (not the stat grid).
  await expect(
    page.getByRole("heading", { name: /no activity yet/i })
  ).toBeVisible();

  // And the back link returns to profiles.
  await page
    .getByRole("link", { name: /profiles/i })
    .first()
    .click();
  await expect(page).toHaveURL(/\/profiles/);
});
