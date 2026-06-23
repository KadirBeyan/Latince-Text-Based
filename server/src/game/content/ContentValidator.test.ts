import { test } from "node:test";
import assert from "node:assert";
import { ContentLoader } from "./ContentLoader";
import { ContentValidator } from "./ContentValidator";
import type { LoadedContent } from "../types/contentTypes";

function fixture(): LoadedContent { const loader = new ContentLoader(); return structuredClone(loader.load()); }

test("ContentValidator checks grammar and vocabulary references", () => {
  const content = fixture(); const scene = content.campaigns[0].chapters[0].quests[0].scenes[0];
  scene.learningFocus = { grammarIds: ["missing-grammar"], vocabularyIds: ["missing-word"], skillIds: ["latin_basics"], difficulty: "intro" };
  const result = new ContentValidator().validate(content);
  assert.ok(result.errors.some(i => i.code === "UNKNOWN_GRAMMAR"));
  assert.ok(result.errors.some(i => i.code === "UNKNOWN_VOCABULARY"));
});

test("ContentValidator warns about unreachable scenes and errors on invalid nextSceneId", () => {
  const content = fixture(); const quest = content.campaigns[0].chapters[0].quests[0];
  quest.scenes.push({ ...structuredClone(quest.scenes[0]), id: "orphan", choices: [], onEnterEvents: [] });
  quest.scenes[0].choices[0].nextSceneId = "missing-scene";
  const result = new ContentValidator().validate(content);
  assert.ok(result.warnings.some(i => i.code === "UNREACHABLE_SCENE" && i.refId === "orphan"));
  assert.ok(result.errors.some(i => i.code === "INVALID_NEXT_SCENE"));
});
