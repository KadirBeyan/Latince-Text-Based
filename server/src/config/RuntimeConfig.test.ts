import { test } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { getRuntimeConfig } from "./RuntimeConfig";

test("RuntimeConfig disables debug and editor writes in production", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "via-prima-runtime-"));
  process.env.VIA_PRIMA_APP_DATA_DIR = root;
  const config = getRuntimeConfig({ NODE_ENV: "production" });
  assert.strictEqual(config.enableDebugEndpoints, false);
  assert.strictEqual(config.enableEditorWrites, false);
  delete process.env.VIA_PRIMA_APP_DATA_DIR;
});

test("RuntimeConfig enables debug and editor writes in development", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "via-prima-runtime-"));
  process.env.VIA_PRIMA_APP_DATA_DIR = root;
  const config = getRuntimeConfig({ NODE_ENV: "development" });
  assert.strictEqual(config.enableDebugEndpoints, true);
  assert.strictEqual(config.enableEditorWrites, true);
  delete process.env.VIA_PRIMA_APP_DATA_DIR;
});
