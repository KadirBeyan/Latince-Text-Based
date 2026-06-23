import { test } from "node:test";
import assert from "node:assert";
import { ContentLoader } from "./ContentLoader";
import { ContentValidator } from "./ContentValidator";

test("Via Prima Stage 11 content loads and validates", () => {
  const loader = new ContentLoader();
  const content = loader.load();
  const campaign = content.campaigns.find((candidate) => candidate.id === "via-prima");
  assert.ok(campaign);
  assert.strictEqual(campaign.chapters.length, 9);
  const scenes = campaign.chapters.flatMap((chapter) => chapter.quests).flatMap((quest) => quest.scenes);
  assert.ok(scenes.length >= 180);
  assert.ok(scenes.length <= 250); // Increased limit as we added new village loop scenes
  assert.strictEqual(new Set(scenes.map((scene) => scene.id)).size, scenes.length);
  const validation = new ContentValidator().validate(content);
  assert.strictEqual(validation.ok, true, JSON.stringify(validation.errors, null, 2));
});

test("Via Prima chapter metadata includes requested learning structure", () => {
  const campaign = new ContentLoader().load().campaigns.find((candidate) => candidate.id === "via-prima");
  assert.ok(campaign);
  for (const chapter of campaign.chapters as any[]) {
    if (chapter.id === "vicus_prologue") continue; // Skip custom prologue chapter
    assert.ok(chapter.grammarFocus?.length > 0);
    assert.ok(chapter.vocabularyFocus?.length > 0);
    assert.ok(chapter.mainQuests?.length >= 3);
    assert.ok(chapter.sideQuests?.length >= 5);
    assert.ok(chapter.reviewQuests?.length >= 1);
  }
});

test("Via Prima dynamic quest templates include Stage 11 categories", () => {
  const content = new ContentLoader().load();
  const categories = new Set(content.questTemplates.map((template) => template.category));
  for (const category of ["chapter-review", "npc-favor", "location-rumor", "grammar-remediation", "vocabulary-practice"]) {
    assert.ok(categories.has(category as any), `Missing quest template category ${category}`);
  }
  const validation = new ContentValidator().validate(content);
  assert.strictEqual(validation.ok, true, JSON.stringify(validation.errors, null, 2));
});
