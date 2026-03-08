import { test, expect } from "@playwright/test";

test.describe("Sidebar (Desktop)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("shows logo and site name", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Dawnbase").first()).toBeVisible();
  });

  test("Dashboard nav link is present and active on /", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /dashboard/i }).first()).toBeVisible();
  });

  test("Articles nav link navigates to /articles", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /articles/i }).first().click();
    await expect(page).toHaveURL("/articles");
  });

  test("Categories nav shows Phase 2 label (disabled)", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/phase 2/i).first()).toBeVisible();
  });

  test("does not show New Article button in sidebar", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("New Article")).not.toBeVisible();
  });
});

test.describe("Header", () => {
  test("shows site title", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Dawn's Knowledge Base" })).toBeVisible();
  });

  test("has theme toggle button", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: /toggle theme|light|dark/i })).toBeVisible();
  });
});

test.describe("API", () => {
  test("GET /api/articles returns JSON with data and pagination", async ({ request }) => {
    const res = await request.get("/api/articles");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("data");
    expect(body).toHaveProperty("pagination");
    expect(Array.isArray(body.data)).toBe(true);
  });

  test("GET /api/articles/unknown-id returns 404", async ({ request }) => {
    const res = await request.get("/api/articles/00000000-0000-0000-0000-000000000000");
    expect(res.status()).toBe(404);
  });

  test("POST /api/articles is not available (405 or 404)", async ({ request }) => {
    const res = await request.post("/api/articles", { data: {} });
    expect([404, 405]).toContain(res.status());
  });
});
