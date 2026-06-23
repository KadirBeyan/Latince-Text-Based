import { expect, test } from "@playwright/test";

test("authoring tree, validation, graph, and preview surfaces open", async ({ page, request }) => {
  const response = await request.post("http://127.0.0.1:3016/api/game/new", { data: { playerName: `Author ${Date.now()}`, campaignId: "vicus_first_days" } });
  const state = await response.json() as { saveId: string };
  await page.addInitScript((saveId) => {
    localStorage.setItem("via-prima:last-save-id", saveId);
    localStorage.removeItem("via-prima:auto-resume-disabled");
  }, state.saveId);
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Authoring" })).toBeVisible();
  await page.getByRole("button", { name: "Authoring" }).click();
  await expect(page.getByRole("heading", { name: "Via Prima Content QA" })).toBeVisible();
  const tree = page.getByRole("navigation", { name: "Authoring content tree" });
  await expect(tree.getByRole("button").first()).toBeVisible({ timeout: 15_000 });
  const sceneGroup = tree.locator(".authoring-tree-group").filter({ has: page.getByRole("heading", { name: /Scenes/ }) });
  await sceneGroup.getByRole("button").first().click();
  await expect(page.getByRole("button", { name: "Validate" }).first()).toBeEnabled({ timeout: 20_000 });
  await page.getByRole("button", { name: "Validate" }).first().click();
  await page.getByRole("button", { name: "Visual Graph", exact: true }).last().click();
  await expect(page.getByText(/Graph|Scene/i).first()).toBeVisible();
  await page.getByRole("button", { name: "Preview", exact: true }).last().click();
  await expect(page.getByRole("main").getByRole("heading", { name: "Playtest v2" })).toBeVisible();
});
