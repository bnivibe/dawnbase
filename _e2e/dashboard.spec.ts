import { test, expect } from "@playwright/test";

test.describe("Dashboard (/)", () => {
  test("shows stat cards: Total Articles, Drafts, Published", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Total Articles")).toBeVisible();
    await expect(page.getByText("Drafts", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Published", { exact: true }).first()).toBeVisible();
  });

  test("does not show Create First Article button", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Create First Article")).not.toBeVisible();
  });

  test("does not show New Article button", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("New Article")).not.toBeVisible();
  });
});
