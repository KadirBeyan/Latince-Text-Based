import { test } from "node:test";
import assert from "node:assert";
import { extractFirstJsonObject, repairCommonJsonIssues, safeJsonParse } from "./JsonRepair";

test("JsonRepair - extractFirstJsonObject", () => {
  const rawText = "Here is the response: {\"isCorrect\": true} Hope you like it.";
  assert.strictEqual(extractFirstJsonObject(rawText), '{"isCorrect": true}');

  assert.strictEqual(extractFirstJsonObject("no braces here"), null);
});

test("JsonRepair - repairCommonJsonIssues", () => {
  const fenced = "```json\n{\n  \"score\": 85\n}\n```";
  assert.strictEqual(repairCommonJsonIssues(fenced), '{\n  "score": 85\n}');

  const trailingComma = '{"tags": ["error", "spelling",], "val": 10,}';
  assert.strictEqual(repairCommonJsonIssues(trailingComma), '{"tags": ["error", "spelling"], "val": 10}');
});

test("JsonRepair - safeJsonParse", () => {
  // Perfect JSON
  const ok = safeJsonParse<{ ok: boolean }>('{"ok": true}');
  assert.ok(ok && ok.ok === true);

  // Malformed JSON with markdown blocks and trailing commas
  const malformed = 'Some conversational text ```json {"score": 90, "tags": ["a", "b",],} ```';
  const parsed = safeJsonParse<{ score: number; tags: string[] }>(malformed);
  assert.ok(parsed);
  assert.strictEqual(parsed.score, 90);
  assert.deepStrictEqual(parsed.tags, ["a", "b"]);

  // Completely invalid JSON
  assert.strictEqual(safeJsonParse("not a json"), null);
});
