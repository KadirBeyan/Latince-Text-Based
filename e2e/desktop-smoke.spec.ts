import { expect, test } from "@playwright/test";

test("system smoke, performance, backup, and cache endpoints respond", async ({ request }) => {
  const base = "http://127.0.0.1:3016";
  const health = await request.get(`${base}/api/health`);
  expect(health.ok()).toBeTruthy();
  const smoke = await request.get(`${base}/api/system/smoke`);
  expect(smoke.ok()).toBeTruthy();
  expect((await smoke.json()).ok).toBeTruthy();
  const backup = await request.post(`${base}/api/system/backup/create`);
  expect(backup.status()).toBe(201);
  const backups = await request.get(`${base}/api/system/backup/list`);
  expect((await backups.json()).length).toBeGreaterThan(0);
  expect((await request.get(`${base}/api/system/cache/stats`)).ok()).toBeTruthy();
  expect((await request.get(`${base}/api/system/performance`)).ok()).toBeTruthy();
});
