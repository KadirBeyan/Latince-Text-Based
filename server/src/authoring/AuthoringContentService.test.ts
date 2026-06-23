import { test } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { AuthoringContentService } from "./AuthoringContentService";
import { AuthoringFileService } from "./AuthoringFileService";
import { AuthoringValidationService } from "./AuthoringValidationService";

test("AuthoringContentService lists, saves, duplicates and deletes documents with backups", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "via-prima-authoring-content-"));
  fs.mkdirSync(path.join(root, "data", "npcs"), { recursive: true });
  fs.writeFileSync(path.join(root, "data", "npcs", "titus.json"), JSON.stringify({ id: "titus", name: "Titus", description: "NPC" }));
  const service = new AuthoringContentService(new AuthoringFileService(root), new AuthoringValidationService());
  const docs = await service.listDocuments("npc");
  assert.strictEqual(docs.length, 1);
  const saved = await service.saveDocument({ kind: "npc", path: docs[0].path, data: { id: "titus", name: "Titus", role: "teacher", description: "NPC" }, validateBeforeSave: true, createBackup: true });
  assert.strictEqual(saved.ok, true);
  assert.ok(saved.backupPath);
  const duplicate = await service.duplicateDocument({ kind: "npc", sourcePath: docs[0].path, newId: "titus_copy" });
  assert.strictEqual(duplicate.id, "titus_copy");
  const deleted = await service.deleteDocument({ kind: "npc", path: duplicate.path, createBackup: true });
  assert.strictEqual(deleted.ok, true);
});
