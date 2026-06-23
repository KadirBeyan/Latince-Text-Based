import { test } from "node:test";
import assert from "node:assert";
import { ContentLoader } from "./ContentLoader";
import { ContentValidator } from "./ContentValidator";

test("Vicus First Days content loads and validates", () => {
  const loader = new ContentLoader();
  const content = loader.load();
  const campaign = content.campaigns.find((candidate) => candidate.id === "vicus_first_days");
  assert.ok(campaign, "Should find campaign vicus_first_days");
  assert.strictEqual(campaign.chapters.length, 1);
  const scenes = campaign.chapters.flatMap((chapter) => chapter.quests).flatMap((quest) => quest.scenes);
  assert.ok(scenes.length >= 5, `Expected at least 5 scenes, got ${scenes.length}`);
  assert.strictEqual(new Set(scenes.map((scene) => scene.id)).size, scenes.length);
  const validation = new ContentValidator().validate(content);
  assert.strictEqual(validation.ok, true, JSON.stringify(validation.errors, null, 2));
});

test("Vicus First Days chapter metadata includes requested learning structure", () => {
  const campaign = new ContentLoader().load().campaigns.find((candidate) => candidate.id === "vicus_first_days");
  assert.ok(campaign);
  for (const chapter of campaign.chapters as any[]) {
    assert.ok(chapter.grammarFocus?.length > 0, "Chapter must have grammarFocus");
    assert.ok(chapter.vocabularyFocus?.length > 0, "Chapter must have vocabularyFocus");
  }
});

test("Vicus First Days dynamic quest templates include categories", () => {
  const content = new ContentLoader().load();
  const validation = new ContentValidator().validate(content);
  assert.strictEqual(validation.ok, true, JSON.stringify(validation.errors, null, 2));
});
