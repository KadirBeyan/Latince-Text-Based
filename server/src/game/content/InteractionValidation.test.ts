import { test } from "node:test";
import assert from "node:assert";
import { ContentLoader } from "./ContentLoader";
import { ContentValidator } from "./ContentValidator";
import type { LoadedContent } from "../types/contentTypes";

function fixture(): LoadedContent {
  const loader = new ContentLoader();
  return structuredClone(loader.load());
}

test("ContentValidator - validates interaction loop requirements", () => {
  const content = fixture();
  const scene = content.campaigns[0].chapters[0].quests[0].scenes[0];

  // Configure an invalid interaction model
  scene.interactionModel = {
    mode: "interaction-loop",
    intents: [
      {
        id: "intent_invalid",
        labelTr: "", // Missing label
        verb: "" as any, // Missing verb
        requiresLatin: true,
        targetMeaningTr: "", // Missing meaning for requiresLatin: true
        canonicalAnswers: [] // Missing canonical answers
      },
      {
        id: "intent_invalid_no_latin",
        labelTr: "İncele",
        verb: "inspect",
        requiresLatin: false
        // Missing resolution, effects, and nextSceneId
      }
    ]
  };

  const validator = new ContentValidator();
  const result = validator.validate(content);

  assert.ok(!result.ok);
  assert.ok(result.errors.some(e => e.code === "MISSING_INTENT_LABEL"));
  assert.ok(result.errors.some(e => e.code === "MISSING_INTENT_VERB"));
  assert.ok(result.errors.some(e => e.code === "MISSING_INTENT_MEANING"));
  assert.ok(result.errors.some(e => e.code === "MISSING_CANONICAL_ANSWERS"));
  assert.ok(result.errors.some(e => e.code === "MISSING_RESOLUTION_OR_EFFECT"));
});

test("ContentValidator - validates failure branch configuration", () => {
  const content = fixture();
  const scene = content.campaigns[0].chapters[0].quests[0].scenes[0];

  scene.interactionModel = {
    mode: "interaction-loop",
    intents: [
      {
        id: "intent_branch_error",
        labelTr: "Konuş",
        verb: "speak",
        requiresLatin: true,
        targetMeaningTr: "Selam.",
        canonicalAnswers: ["Salve."],
        failureBehavior: "branch",
        failureBranches: [] // Empty branches when behavior is branch
      }
    ]
  };

  const validator = new ContentValidator();
  const result = validator.validate(content);

  assert.ok(!result.ok);
  assert.ok(result.errors.some(e => e.code === "MISSING_FAILURE_BRANCH"));
});
