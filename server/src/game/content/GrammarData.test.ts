import { test } from "node:test";
import assert from "node:assert";
import { ContentLoader } from "./ContentLoader";

test("grammar ids are unique and prerequisites resolve", () => {
  const grammar = new ContentLoader().load().grammar as Array<{ id: string; examples: string[]; prerequisiteGrammarIds?: string[] }>;
  const ids = new Set(grammar.map((topic) => topic.id));
  assert.strictEqual(ids.size, grammar.length);
  for (const topic of grammar) {
    assert.ok(topic.examples.length > 0);
    for (const prerequisite of topic.prerequisiteGrammarIds ?? []) assert.ok(ids.has(prerequisite), prerequisite);
  }
});
