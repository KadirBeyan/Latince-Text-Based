import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const port = 3015;
const appDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "via-prima-smoke-"));
const server = spawn(process.execPath, ["--import", "tsx", "server/src/index.ts"], {
  cwd: process.cwd(),
  env: { ...process.env, PORT: String(port), VIA_PRIMA_APP_DATA_DIR: appDataDir, VIA_PRIMA_ENABLE_MODEL_SCAN: "0" },
  stdio: "ignore",
});

void main();

async function main(): Promise<void> {
  try {
    await waitFor(`http://127.0.0.1:${port}/api/health`);
    const smoke = await fetchJson<{ ok: boolean; checks: Array<{ name: string; ok: boolean; message?: string }> }>(`http://127.0.0.1:${port}/api/system/smoke`);
    const perf = await fetchJson<{ contentStats: unknown; databaseStats: unknown }>(`http://127.0.0.1:${port}/api/system/performance`);
    console.log(`Smoke: ${smoke.ok ? "PASS" : "FAIL"}`);
    for (const check of smoke.checks) console.log(`${check.ok ? "PASS" : "FAIL"} ${check.name}${check.message ? ` - ${check.message}` : ""}`);
    console.log(`Performance endpoint: ${perf.contentStats && perf.databaseStats ? "PASS" : "FAIL"}`);
    if (!smoke.ok) process.exitCode = 1;
  } finally {
    server.kill("SIGTERM");
    fs.rmSync(appDataDir, { recursive: true, force: true });
  }
}

async function waitFor(url: string): Promise<void> {
  for (let attempt = 0; attempt < 60; attempt++) {
    try { if ((await fetch(url)).ok) return; } catch { /* server is still starting */ }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Smoke server did not become ready.");
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const body = await response.json() as T;
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}: ${JSON.stringify(body)}`);
  return body;
}
