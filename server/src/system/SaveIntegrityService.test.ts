import { test } from "node:test";
import assert from "node:assert";
import { initDatabase, openDatabase } from "../db/database";
import { ContentLoader } from "../game/content/ContentLoader";
import { SaveIntegrityService } from "./SaveIntegrityService";

test("SaveIntegrityService detects corrupted JSON", () => {
  const db = openDatabase(":memory:");
  initDatabase(db);
  db.prepare("INSERT INTO saves (id, playerName, saveJson, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)").run("bad", "Marcus", "{", "2026-01-01", "2026-01-01");
  const service = new SaveIntegrityService(db, new ContentLoader());
  const report = service.checkSaveIntegrity("bad");
  assert.strictEqual(report.ok, false);
  assert.ok(report.issues.some((issue) => issue.severity === "error"));
});
