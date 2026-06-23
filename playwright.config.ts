import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  use: { baseURL: "http://127.0.0.1:5174", trace: "retain-on-failure", screenshot: "only-on-failure" },
  webServer: [
    {
      command: "npm run dev",
      url: "http://127.0.0.1:3016/api/health",
      env: { PORT: "3016", VIA_PRIMA_APP_DATA_DIR: "/tmp/via-prima-e2e-app-data", VIA_PRIMA_ENABLE_MODEL_SCAN: "0" },
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      command: "npm --prefix client run dev -- --host 127.0.0.1 --port 5174",
      url: "http://127.0.0.1:5174",
      env: { VITE_API_BASE: "http://127.0.0.1:3016" },
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
  ],
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } }],
});
