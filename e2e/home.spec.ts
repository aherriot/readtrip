import { expect, test } from "@playwright/test";

test("homepage renders the ReadTrip landing", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "ReadTrip" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: /check system health/i })
  ).toHaveAttribute("href", "/api/health");
});
