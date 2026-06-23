import { test } from "node:test";
import assert from "node:assert";
import { evaluateTextChallenge } from "./LatinEvaluator";

const EXPECTED_ANSWERS = ["Salve.", "Salve magister.", "Salve, magister."];

test("LatinEvaluator - exact matches", async () => {
  const result = await evaluateTextChallenge({
    playerAnswer: "Salve, magister.",
    expectedAnswers: EXPECTED_ANSWERS,
    prompt: "Greeting",
    sceneId: "scene_1",
    questId: "quest_1",
    playerLevel: 1,
    unlockedSkills: [],
  });

  assert.strictEqual(result.isCorrect, true);
  assert.strictEqual(result.score, 100);
  assert.strictEqual(result.mode, "exact");
});

test("LatinEvaluator - high similarity matches (correct)", async () => {
  // spelling deviation "salve magistee" vs "salve magister" (distance 1, length 14, similarity 13/14 = ~0.928)
  const result = await evaluateTextChallenge({
    playerAnswer: "salve magistee",
    expectedAnswers: EXPECTED_ANSWERS,
    prompt: "Greeting",
    sceneId: "scene_1",
    questId: "quest_1",
    playerLevel: 1,
    unlockedSkills: [],
  });

  assert.strictEqual(result.isCorrect, true);
  assert.ok(result.score >= 85 && result.score <= 95);
  assert.strictEqual(result.mode, "similarity");
  assert.strictEqual(result.correctedLatin, "Salve magister.");
});

test("LatinEvaluator - near miss similarity matches (incorrect)", async () => {
  // spelling deviation "salve magist" vs "salve magister" (distance 2, length 14, similarity 12/14 = ~0.857)
  const result = await evaluateTextChallenge({
    playerAnswer: "salve magist",
    expectedAnswers: EXPECTED_ANSWERS,
    prompt: "Greeting",
    sceneId: "scene_1",
    questId: "quest_1",
    playerLevel: 1,
    unlockedSkills: [],
  });

  assert.strictEqual(result.isCorrect, false);
  assert.ok(result.score >= 50 && result.score <= 75);
  assert.strictEqual(result.mode, "similarity");
  assert.strictEqual(result.correctedLatin, "Salve magister.");
});

test("LatinEvaluator - fallback matches", async () => {
  const result = await evaluateTextChallenge({
    playerAnswer: "something completely different",
    expectedAnswers: EXPECTED_ANSWERS,
    prompt: "Greeting",
    sceneId: "scene_1",
    questId: "quest_1",
    playerLevel: 1,
    unlockedSkills: [],
  });

  assert.strictEqual(result.isCorrect, false);
  assert.ok(result.score < 40);
  assert.strictEqual(result.mode, "fallback");
  assert.strictEqual(result.correctedLatin, "Salve.");
});
