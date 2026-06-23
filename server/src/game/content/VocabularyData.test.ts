import { test } from "node:test";
import assert from "node:assert";
import { ContentLoader } from "./ContentLoader";

test("vocabulary ids are unique and required fields are present", () => {
  const vocabulary = new ContentLoader().load().vocabulary;
  assert.ok(vocabulary.length >= 250);
  assert.strictEqual(new Set(vocabulary.map((item) => item.id)).size, vocabulary.length);
  for (const item of vocabulary) {
    assert.ok(item.id);
    assert.ok(item.latin);
    assert.ok(item.turkish);
    assert.ok(item.pos);
    assert.ok(Array.isArray(item.principalParts));
  }
});
