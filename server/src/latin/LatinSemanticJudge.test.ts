import { test } from "node:test";
import assert from "node:assert";
import { judgeWithLlm } from "./LatinSemanticJudge";
import type { LlmClient } from "../llm/LlmClient";
import type { DialogueResponseChallenge } from "../game/types/DialogueChallengeTypes";

class MockLlmClient implements Partial<LlmClient> {
  constructor(private readonly mockText: string) {}

  async chat() {
    return {
      text: this.mockText,
      raw: {},
    };
  }
}

test("LatinSemanticJudge - successful evaluation parsing", async () => {
  const mockResponse = JSON.stringify({
    verdict: "exact_correct",
    acceptedAsCorrect: true,
    confidence: 0.95,
    meaningMatches: true,
    grammarOk: true,
    contextOk: true,
    levelAppropriate: true,
    detectedMeaningTr: "Ben Marcus'um.",
    feedbackTr: "Tebrikler! Doğru cevap.",
    errors: [],
  });

  const challenge: DialogueResponseChallenge = {
    mode: "dialogue-response",
    playerIntentTr: "Kendini tanıt.",
    targetMeaningTr: "Ben Marcus'um.",
    canonicalAnswers: ["Ego sum Marcus."],
  };

  const result = await judgeWithLlm({
    answer: "Ego sum Marcus.",
    challenge,
    sceneContext: { sceneId: "test" },
    playerContext: {},
    llmClient: new MockLlmClient(mockResponse) as any,
  });

  assert.strictEqual(result.verdict, "exact_correct");
  assert.strictEqual(result.acceptedAsCorrect, true);
  assert.strictEqual(result.confidence, 0.95);
  assert.strictEqual(result.feedbackTr, "Tebrikler! Doğru cevap.");
});

test("LatinSemanticJudge - handles invalid JSON response and fallback values", async () => {
  const challenge: DialogueResponseChallenge = {
    mode: "dialogue-response",
    playerIntentTr: "Kendini tanıt.",
    targetMeaningTr: "Ben Marcus'um.",
    canonicalAnswers: ["Ego sum Marcus."],
  };

  await assert.rejects(async () => {
    await judgeWithLlm({
      answer: "Ego sum Marcus.",
      challenge,
      sceneContext: { sceneId: "test" },
      playerContext: {},
      llmClient: new MockLlmClient("not-a-json") as any,
    });
  });
});

test("LatinSemanticJudge - clamps confidence and enforces strictness", async () => {
  const mockResponse = JSON.stringify({
    verdict: "exact_correct",
    acceptedAsCorrect: true,
    confidence: 1.5, // invalid confidence > 1
    meaningMatches: true,
    grammarOk: true,
    contextOk: true,
    levelAppropriate: true,
    detectedMeaningTr: "Ben Marcus'um.",
    feedbackTr: "Tebrikler! Doğru cevap.",
    errors: [],
  });

  const challenge: DialogueResponseChallenge = {
    mode: "dialogue-response",
    playerIntentTr: "Kendini tanıt.",
    targetMeaningTr: "Ben Marcus'um.",
    canonicalAnswers: ["Ego sum Marcus."],
  };

  const result = await judgeWithLlm({
    answer: "Ego sum Marcus.",
    challenge,
    sceneContext: { sceneId: "test" },
    playerContext: {},
    llmClient: new MockLlmClient(mockResponse) as any,
  });

  // Confidence should be clamped to 1.0
  assert.strictEqual(result.confidence, 1.0);
  assert.strictEqual(result.acceptedAsCorrect, true);
});

test("LatinSemanticJudge - downgrades below minimumConfidence", async () => {
  const mockResponse = JSON.stringify({
    verdict: "exact_correct",
    acceptedAsCorrect: true,
    confidence: 0.3, // confidence below challenge minimum of 0.6
    meaningMatches: true,
    grammarOk: true,
    contextOk: true,
    levelAppropriate: true,
    detectedMeaningTr: "Ben Marcus'um.",
    feedbackTr: "Tebrikler! Doğru cevap.",
    errors: [],
  });

  const challenge: DialogueResponseChallenge = {
    mode: "dialogue-response",
    playerIntentTr: "Kendini tanıt.",
    targetMeaningTr: "Ben Marcus'um.",
    canonicalAnswers: ["Ego sum Marcus."],
    evaluation: {
      allowEquivalentMeaning: true,
      allowWordOrderVariation: true,
      requireContextMatch: true,
      useLlmSemanticJudge: true,
      minimumConfidence: 0.6,
    },
  };

  const result = await judgeWithLlm({
    answer: "Ego sum Marcus.",
    challenge,
    sceneContext: { sceneId: "test" },
    playerContext: {},
    llmClient: new MockLlmClient(mockResponse) as any,
  });

  // Should be downgraded to near_miss and acceptedAsCorrect set to false
  assert.strictEqual(result.verdict, "near_miss");
  assert.strictEqual(result.acceptedAsCorrect, false);
});
