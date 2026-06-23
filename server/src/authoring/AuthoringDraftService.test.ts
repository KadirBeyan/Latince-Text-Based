import { test } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import { AuthoringDraftService } from "./AuthoringDraftService";

test("AuthoringDraftService sanitizes draft and does not auto save", async () => {
  const before = fs.existsSync("data/.authoring-draft-test.json");
  const service = new AuthoringDraftService();
  const result = await service.generateDraft({ kind: "scene", chapterId: "village_first_days", locationId: "teacher_corner", grammarIds: ["greetings-basic"], vocabularyIds: ["vocab-salve"], promptTr: "A1 selamlama sahnesi" });
  assert.ok(result.sanitizedDraft);
  assert.strictEqual(fs.existsSync("data/.authoring-draft-test.json"), before);
});
