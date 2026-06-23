import { test } from "node:test";
import assert from "node:assert";
import { evaluateDialogueResponse } from "./SemanticLatinEvaluator";
import type { DialogueResponseChallenge } from "../game/types/DialogueChallengeTypes";

test("SemanticLatinEvaluator - empty answer guard", async () => {
  const challenge: DialogueResponseChallenge = {
    mode: "dialogue-response",
    playerIntentTr: "Kendini tanıt.",
    targetMeaningTr: "Ben Marcus'um.",
    canonicalAnswers: ["Ego sum Marcus."],
  };

  const result = await evaluateDialogueResponse({
    answer: "   ",
    challenge,
    sceneContext: { sceneId: "test" },
    playerContext: {},
  });

  assert.strictEqual(result.verdict, "wrong");
  assert.strictEqual(result.acceptedAsCorrect, false);
  assert.ok(result.errors.some(e => e.code === "EMPTY_ANSWER"));
});

test("SemanticLatinEvaluator - exact correct with macron/case/punctuation tolerance", async () => {
  const challenge: DialogueResponseChallenge = {
    mode: "dialogue-response",
    playerIntentTr: "Kendini tanıt.",
    targetMeaningTr: "Ben Marcus'um.",
    canonicalAnswers: ["Ego sum Marcus."],
  };

  const result = await evaluateDialogueResponse({
    answer: "ēgō sūm mārcūs!",
    challenge,
    sceneContext: { sceneId: "test" },
    playerContext: {},
  });

  assert.strictEqual(result.verdict, "exact_correct");
  assert.strictEqual(result.acceptedAsCorrect, true);
  assert.strictEqual(result.confidence, 1.0);
});

test("SemanticLatinEvaluator - accepted variants match", async () => {
  const challenge: DialogueResponseChallenge = {
    mode: "dialogue-response",
    playerIntentTr: "Kendini tanıt.",
    targetMeaningTr: "Ben Marcus'um.",
    canonicalAnswers: ["Ego sum Marcus."],
    acceptedVariants: ["Marcus sum."],
  };

  const result = await evaluateDialogueResponse({
    answer: "Marcus sum",
    challenge,
    sceneContext: { sceneId: "test" },
    playerContext: {},
  });

  assert.strictEqual(result.verdict, "equivalent_correct");
  assert.strictEqual(result.acceptedAsCorrect, true);
});

test("SemanticLatinEvaluator - rejected meanings check", async () => {
  const challenge: DialogueResponseChallenge = {
    mode: "dialogue-response",
    playerIntentTr: "Kendini tanıt.",
    targetMeaningTr: "Ben Marcus'um.",
    canonicalAnswers: ["Ego sum Marcus."],
    rejectedMeanings: [
      {
        meaningTr: "Sen Marcus'sun.",
        exampleLatin: "Tu es Marcus.",
        reasonTr: "Bu cümlede kendini tanıtman gerekiyor, 'Sen Marcus'sun' dedin.",
      },
    ],
  };

  const result = await evaluateDialogueResponse({
    answer: "Tu es Marcus.",
    challenge,
    sceneContext: { sceneId: "test" },
    playerContext: {},
  });

  assert.strictEqual(result.verdict, "context_wrong");
  assert.strictEqual(result.acceptedAsCorrect, false);
  assert.strictEqual(result.feedbackTr, "Bu cümlede kendini tanıtman gerekiyor, 'Sen Marcus'sun' dedin.");
});

test("SemanticLatinEvaluator - similarity near miss", async () => {
  const challenge: DialogueResponseChallenge = {
    mode: "dialogue-response",
    playerIntentTr: "Kendini tanıt.",
    targetMeaningTr: "Ben Marcus'um.",
    canonicalAnswers: ["Ego sum Marcus."],
  };

  const result = await evaluateDialogueResponse({
    answer: "Ego sum Marcusss.",
    challenge,
    sceneContext: { sceneId: "test" },
    playerContext: {},
  });

  assert.strictEqual(result.verdict, "near_miss");
  assert.strictEqual(result.acceptedAsCorrect, false);
  assert.ok(result.feedbackTr.includes("Ego sum Marcus."));
});

test("SemanticLatinEvaluator - accepts omitted subject and word-order equivalent", async () => {
  const challenge: DialogueResponseChallenge = {
    mode: "dialogue-response",
    playerIntentTr: "Kendini tanıt.",
    targetMeaningTr: "Ben Marcus'um.",
    canonicalAnswers: ["Ego sum Marcus."],
    evaluation: {
      allowEquivalentMeaning: true,
      allowWordOrderVariation: true,
      requireContextMatch: true,
      useLlmSemanticJudge: false,
      minimumConfidence: 0.5,
    },
  };
  const result = await evaluateDialogueResponse({
    answer: "Marcus sum.",
    challenge,
    sceneContext: { sceneId: "test" },
    playerContext: {},
  });
  assert.strictEqual(result.verdict, "equivalent_correct");
  assert.strictEqual(result.acceptedAsCorrect, true);
  assert.strictEqual(result.debug?.source, "morphology");
});

test("SemanticLatinEvaluator - separates grammar person mismatch", async () => {
  const challenge: DialogueResponseChallenge = {
    mode: "dialogue-response",
    playerIntentTr: "Kendini tanıt.",
    targetMeaningTr: "Ben Marcus'um.",
    canonicalAnswers: ["Ego sum Marcus."],
    evaluation: {
      allowEquivalentMeaning: true,
      allowWordOrderVariation: true,
      requireContextMatch: true,
      useLlmSemanticJudge: false,
      minimumConfidence: 0.5,
    },
  };
  const result = await evaluateDialogueResponse({
    answer: "Ego es Marcus.",
    challenge,
    sceneContext: { sceneId: "test" },
    playerContext: {},
  });
  assert.strictEqual(result.verdict, "grammar_wrong");
  assert.strictEqual(result.grammarOk, false);
  assert.ok(result.errors.some((error) => error.code === "PERSON_AGREEMENT"));
});

test("SemanticLatinEvaluator - detects contextual person mismatch without explicit rejectedMeaning", async () => {
  const challenge: DialogueResponseChallenge = {
    mode: "dialogue-response",
    playerIntentTr: "Kendini tanıt.",
    targetMeaningTr: "Ben Marcus'um.",
    canonicalAnswers: ["Ego sum Marcus."],
    evaluation: {
      allowEquivalentMeaning: true,
      allowWordOrderVariation: true,
      requireContextMatch: true,
      useLlmSemanticJudge: false,
      minimumConfidence: 0.5,
    },
  };
  const result = await evaluateDialogueResponse({
    answer: "Tu es Marcus.",
    challenge,
    sceneContext: { sceneId: "test" },
    playerContext: {},
  });
  assert.strictEqual(result.verdict, "context_wrong");
  assert.strictEqual(result.grammarOk, true);
  assert.strictEqual(result.contextOk, false);
});
