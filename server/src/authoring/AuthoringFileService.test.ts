import { test } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { AuthoringFileService } from "./AuthoringFileService";

test("AuthoringFileService resolves safe content paths and rejects traversal", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "via-prima-authoring-file-"));
  fs.mkdirSync(path.join(root, "data", "npcs"), { recursive: true });
  const service = new AuthoringFileService(root);
  assert.ok(service.resolveSafeContentPath("data/npcs/test.json").endsWith("data/npcs/test.json"));
  assert.throws(() => service.resolveSafeContentPath("data/npcs/../../package.json"), /allowed authoring root/);
  await service.writeJsonFileSafe("data/npcs/test.json", { id: "test", name: "Test" });
  assert.deepStrictEqual(await service.readJsonFileSafe("data/npcs/test.json"), { id: "test", name: "Test" });
  const backupPath = await service.createContentBackup("data/npcs/test.json");
  assert.ok(backupPath?.includes("data/.authoring-backups/"));
});
