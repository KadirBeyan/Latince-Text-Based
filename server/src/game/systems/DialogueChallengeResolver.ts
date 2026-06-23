import type { DialogueResponseChallenge, PlayerSave, Scene } from "../types/gameTypes";
import type { LlmClient } from "../../llm/LlmClient";
import { evaluateDialogueResponse } from "../../latin/SemanticLatinEvaluator";
import { getSelectedIntentId } from "./SelectedIntentState";

export class DialogueChallengeResolver {
  challengeForScene(save: PlayerSave, scene: Scene): DialogueResponseChallenge | null {
    if (scene.dialogueChallenge) return scene.dialogueChallenge;
    if (scene.inputMode !== "hybrid-dialogue" || !scene.hybridDialogue) return null;
    const selectedIntentId = getSelectedIntentId(save, scene);
    if (!selectedIntentId) return null;
    const intent = scene.hybridDialogue.intents.find(i => i.id === selectedIntentId);
    if (!intent) return null;
    return {
      mode: "dialogue-response",
      speakerNpcId: scene.hybridDialogue.speakerNpcId,
      npcPromptLatin: scene.hybridDialogue.npcPromptLatin,
      npcPromptTr: scene.hybridDialogue.npcPromptTr,
      playerIntentTr: intent.labelTr,
      targetMeaningTr: intent.targetMeaningTr,
      canonicalAnswers: intent.canonicalAnswers,
      grammarFocusIds: intent.grammarFocusIds,
      vocabularyFocusIds: intent.vocabularyFocusIds,
      successNextSceneId: scene.successNextSceneId,
      failureNextSceneId: scene.failureNextSceneId,
      retryAllowed: true,
      maxAttempts: 3,
      evaluation: { allowEquivalentMeaning: true, allowWordOrderVariation: true, requireContextMatch: true, useLlmSemanticJudge: true, minimumConfidence: 0.5 },
    };
  }

  evaluate(save: PlayerSave, scene: Scene, challenge: DialogueResponseChallenge, text: string, llmClient?: LlmClient) {
    return evaluateDialogueResponse({
      answer: text,
      challenge,
      sceneContext: { sceneId: scene.id, titleTr: scene.title, locationId: scene.locationId, npcIds: scene.npcIds, previousDialogue: save.dialogueLog },
      playerContext: {
        level: save.level,
        assessmentLevel: save.assessmentProfile?.estimatedLevel || "A0",
        knownGrammarIds: save.masteryStates.filter(s => s.targetType === "grammar" && s.mastery >= 50).map(s => s.targetId),
        knownVocabularyIds: save.masteryStates.filter(s => s.targetType === "vocabulary" && s.mastery >= 50).map(s => s.targetId),
      },
      llmConfig: (llmClient as any)?.config,
    });
  }
}
