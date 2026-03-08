import { test, expect } from "@playwright/test";

test.describe("Article List (/articles)", () => {
  test("renders article list page", async ({ page }) => {
    await page.goto("/articles");
    await expect(page).toHaveURL("/articles");
  });

  test("shows empty state when no articles exist", async ({ page }) => {
    await page.goto("/articles");
    // If DB is empty, should show some guidance — not an error page
    await expect(page.locator("body")).not.toContainText("500");
    await expect(page.locator("body")).not.toContainText("Internal Server Error");
  });

  test("does not show New Article button", async ({ page }) => {
    await page.goto("/articles");
    await expect(page.getByText("New Article")).not.toBeVisible();
  });
});

test.describe("Article Detail (/articles/[slug])", () => {
  test("shows 404 for non-existent slug", async ({ page }) => {
    await page.goto("/articles/this-slug-does-not-exist");
    await expect(page.locator("body")).toContainText("404");
  });
});
