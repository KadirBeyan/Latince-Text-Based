import { expect, test } from "@playwright/test";

test("LLM disabled mode and model discovery stay usable", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("via-prima:auto-resume-disabled", "true"));
  await page.goto("/");
  await page.getByText("LLM ayarları").click();
  const llmToggle = page.getByLabel("LLM kullan");
  if (await llmToggle.isChecked()) await llmToggle.uncheck();
  await expect(page.getByText("LLM kapalı. Oyun deterministic engine ile çalışıyor.")).toBeVisible();
  await page.getByRole("button", { name: "Modelleri Tara" }).click();
  await expect(page.getByRole("button", { name: "Modelleri Tara" })).toBeEnabled({ timeout: 15_000 });
  await llmToggle.check();
  await page.locator("label").filter({ hasText: /^Model/ }).locator("select, input").first().fill("").catch(async () => {
    await page.locator("label").filter({ hasText: /^Model/ }).locator("select").selectOption("");
  });
  await page.getByRole("button", { name: "Bağlantıyı Test Et" }).click();
  await expect(page.getByText("provider, baseUrl, and model are required.", { exact: true })).toBeVisible();
});
