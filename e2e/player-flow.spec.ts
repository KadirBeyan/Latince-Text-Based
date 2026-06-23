import { expect, test } from "@playwright/test";

test("new player can start, act, receive feedback, and reload the save", async ({ page }) => {
  const playerName = `Beta ${Date.now()}`;
  await page.addInitScript(() => localStorage.setItem("via-prima:auto-resume-disabled", "true"));
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Via Prima", exact: true, level: 1 })).toBeVisible();
  await page.getByLabel("Oyuncu adı").fill(playerName);
  await page.getByRole("button", { name: "Yeni Yolculuk Başlat" }).click();
  await expect(page.getByText("Kayıtlar yoklanıyor...")).toBeHidden();

  const choice = page.locator(".choice-button").first();
  if (await choice.isVisible()) await choice.click();
  const answer = page.getByLabel("Latince cevap");
  if (await answer.isVisible()) {
    await answer.fill("Salve");
    await page.getByRole("button", { name: "Gönder" }).click();
    await expect(page.getByText(/BENE DIXISTI|ITERUM TENTA|OBSERVATIO/)).toBeVisible();
  }

  await page.getByRole("button", { name: "Ana menüye dön" }).click();
  await expect(page.getByText("Kayıtlı oyunlar")).toBeVisible();
  const ownSave = page.getByRole("article").filter({ hasText: playerName });
  await ownSave.getByRole("button", { name: "Devam Et" }).click();
  await expect(page.getByRole("button", { name: "Ana menüye dön" })).toBeVisible();
});
