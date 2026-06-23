import { test } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ensureAppDirectories, getAppPaths } from "../config/AppPaths";
import { SettingsService } from "./SettingsService";

test("SettingsService reads, writes, exports, and imports settings", () => {
  const paths = ensureAppDirectories(getAppPaths(fs.mkdtempSync(path.join(os.tmpdir(), "via-prima-settings-"))));
  const service = new SettingsService(paths);
  const settings = service.write({ ...service.read(), llm: { ...service.read().llm, model: "llama-test" } });
  assert.strictEqual(settings.llm.model, "llama-test");
  const exported = service.export();
  const imported = service.import(exported);
  assert.strictEqual(imported.llm.model, "llama-test");
});
