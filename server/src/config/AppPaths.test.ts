import { test } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ensureAppDirectories, getAppPaths } from "./AppPaths";

test("AppPaths resolves and ensures app data directories", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "via-prima-paths-"));
  const paths = ensureAppDirectories(getAppPaths(root));
  assert.strictEqual(paths.databasePath, path.join(root, "via-prima.sqlite"));
  assert.ok(fs.existsSync(paths.backupsDir));
  assert.ok(fs.existsSync(paths.logsDir));
  assert.ok(fs.existsSync(paths.cacheDir));
});
