import { expect, test } from "@playwright/test";

test("homepage renders with stable metadata", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.ok()).toBeTruthy();

  await expect(page).toHaveTitle(/.+/);
  await expect(page.locator("body")).toBeVisible();
});

test("login page is marked noindex", async ({ page }) => {
  const response = await page.goto("/login");
  expect(response?.ok()).toBeTruthy();

  const robots = page.locator("meta[name='robots']");
  await expect(robots).toHaveAttribute("content", /noindex/i);
});
