import { test } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ensureAppDirectories, getAppPaths } from "../config/AppPaths";
import { initDatabase, openDatabase } from "../db/database";
import { BackupService } from "./BackupService";

test("BackupService creates, lists, and restores with safety backup", () => {
  const paths = ensureAppDirectories(getAppPaths(fs.mkdtempSync(path.join(os.tmpdir(), "via-prima-backup-"))));
  const db = openDatabase(":memory:");
  initDatabase(db);
  db.prepare("INSERT INTO saves (id, playerName, saveJson, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)").run("save-1", "Marcus", "{}", "2026-01-01", "2026-01-01");
  const service = new BackupService(db, paths);
  const backup = service.createBackup();
  assert.ok(service.listBackups().some((item) => item.id === backup.id));
  db.prepare("DELETE FROM saves").run();
  const result = service.restoreBackup(backup.id);
  assert.strictEqual(result.restoredSaves, 1);
  assert.ok(fs.existsSync(result.safetyBackup));
});

test("BackupService rejects invalid backup payload", () => {
  const paths = ensureAppDirectories(getAppPaths(fs.mkdtempSync(path.join(os.tmpdir(), "via-prima-backup-"))));
  const db = openDatabase(":memory:");
  initDatabase(db);
  const service = new BackupService(db, paths);
  assert.throws(() => service.restoreFullData({ saves: [] }), /Unsupported backup format/);
});
