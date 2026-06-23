import { test } from "node:test";
import assert from "node:assert";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

test("Migration Script - executes suggest-interaction-migration script successfully", () => {
  const reportPath = path.resolve(process.cwd(), "docs", "reports", "interaction-migration-suggestions.md");

  // Remove existing report if any to ensure clean test
  if (fs.existsSync(reportPath)) {
    fs.unlinkSync(reportPath);
  }

  // Run suggest-interaction-migration script using tsx
  try {
    execSync("npx tsx scripts/suggest-interaction-migration.ts", {
      cwd: process.cwd(),
      env: { ...process.env, PAGER: "cat" }
    });
  } catch (error: any) {
    assert.fail(`Migration script execution failed: ${error.message}`);
  }

  // Verify the report was created and contains expected headers
  assert.ok(fs.existsSync(reportPath), "Migration report should be generated");
  const reportContent = fs.readFileSync(reportPath, "utf8");
  assert.ok(reportContent.includes("# Interaction Loop Migration Suggestions Report"), "Report should contain the main title");
  assert.ok(reportContent.includes("Total Suggested Migrations"), "Report should contain total suggested migrations count summary");
});
