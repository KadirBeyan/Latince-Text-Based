import React, { useState, useEffect } from "react";
import { useGameStore } from "../../../stores/gameStore";
import { NpcSpeechBubble } from "./NpcSpeechBubble";
import { DialogueIntentCard } from "./DialogueIntentCard";
import { DialogueResponseComposer } from "./DialogueResponseComposer";
import { SemanticFeedbackCard } from "./SemanticFeedbackCard";
import { ChoicePanel } from "../ChoicePanel";

export function DialogueStage() {
  const { gameState, submitText, requestHint, actionLoading } = useGameStore();

  if (!gameState || !gameState.currentScene) {
    return null;
  }

  const scene = gameState.currentScene;
  const dialogueChallenge = scene.dialogueChallenge;
  const hybridDialogue = scene.hybridDialogue;

  // Check if intent is selected in hybrid-dialogue mode
  const legacySelectedIntentId = gameState.narrativeFlags?.[`selected_intent_${scene.id}`] as string | undefined;
  const selectedIntentId = gameState.activeInteraction?.sceneId === scene.id
    ? gameState.activeInteraction.selectedIntentId ?? legacySelectedIntentId
    : legacySelectedIntentId;
  const isHybridWithoutIntent = scene.inputMode === "hybrid-dialogue" && !selectedIntentId;

  // Find selected intent details
  const selectedIntent = hybridDialogue?.intents.find(i => i.id === selectedIntentId);

  // Extract challenge configuration
  const challenge = dialogueChallenge || (selectedIntent && hybridDialogue ? {
    mode: "dialogue-response" as const,
    speakerNpcId: hybridDialogue.speakerNpcId,
    npcPromptLatin: hybridDialogue.npcPromptLatin,
    npcPromptTr: hybridDialogue.npcPromptTr,
    playerIntentTr: selectedIntent.labelTr,
    targetMeaningTr: selectedIntent.targetMeaningTr,
    grammarFocusIds: selectedIntent.grammarFocusIds,
    vocabularyFocusIds: selectedIntent.vocabularyFocusIds,
    retryAllowed: true,
    maxAttempts: 3
  } : null);

  // Check if we have a recent dialogue evaluation event
  const lastEvent = [...(gameState.recentEvents ?? [])].reverse().find(e => e.type === "DIALOGUE_RESPONSE_EVALUATED");
  const hasFeedback = lastEvent && lastEvent.payload?.sceneId === scene.id;
  const evaluation = hasFeedback ? lastEvent.payload : null;

  // Show Composer or Feedback card
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (evaluation) {
      setShowFeedback(true);
    } else {
      setShowFeedback(false);
    }
  }, [evaluation, scene.id]);

  function handleSend(text: string) {
    void submitText(text);
  }

  function handleRetry() {
    setShowFeedback(false);
  }

  function handleContinue() {
    setShowFeedback(false);
  }

  if (isHybridWithoutIntent) {
    return (
      <div className="dialogue-stage">
        {hybridDialogue?.npcPromptLatin && (
          <NpcSpeechBubble
            npcId={hybridDialogue.speakerNpcId}
            latinText={hybridDialogue.npcPromptLatin}
            trText={hybridDialogue.npcPromptTr}
          />
        )}
        <div className="dialogue-intent-instruction panel-card">
          <p>Konuşma niyetini seçerek NPC'ye ne söylemek istediğini belirle.</p>
        </div>
        <ChoicePanel />
      </div>
    );
  }

  if (!challenge) {
    return null;
  }

  return (
    <div className="dialogue-stage">
      {challenge.npcPromptLatin && (
        <NpcSpeechBubble
          npcId={challenge.speakerNpcId}
          latinText={challenge.npcPromptLatin}
          trText={challenge.npcPromptTr}
        />
      )}

      <DialogueIntentCard
        intentTr={challenge.playerIntentTr}
        targetMeaningTr={challenge.targetMeaningTr}
        grammarFocusIds={challenge.grammarFocusIds}
        vocabularyFocusIds={challenge.vocabularyFocusIds}
      />

      {showFeedback && evaluation ? (
        <SemanticFeedbackCard
          evaluation={evaluation as any}
          onContinue={handleContinue}
          onRetry={handleRetry}
          retryAllowed={challenge.retryAllowed !== false}
        />
      ) : (
        <DialogueResponseComposer
          onSend={handleSend}
          onHint={() => void requestHint()}
          loading={actionLoading}
        />
      )}
    </div>
  );
}
