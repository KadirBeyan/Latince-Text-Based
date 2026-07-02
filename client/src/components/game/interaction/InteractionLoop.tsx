import React, { useState, useEffect } from "react";
import { useGameStore } from "../../../stores/gameStore";
import type { InteractionIntent, InteractionResolution, FailureBranch } from "../../../types/gameTypes";
import { InteractionIntentList } from "./InteractionIntentList";
import { DialogueSequenceView } from "./DialogueSequenceView";
import { SelectedIntentPanel } from "./SelectedIntentPanel";
import { LatinActionComposer } from "./LatinActionComposer";
import { ObservationResultCard } from "./ObservationResultCard";
import { FailureBranchPanel } from "./FailureBranchPanel";
import { NextActionsPanel } from "./NextActionsPanel";

export const InteractionLoop: React.FC = () => {
  const { gameState, submitIntent, submitText, actionLoading, clearSelectedIntent } = useGameStore();

  const [acknowledged, setAcknowledged] = useState(false);
  const [lastEventId, setLastEventId] = useState<string | null>(null);

  const scene = gameState?.currentScene;
  const activeInteraction = gameState?.activeInteraction;

  // Track event updates to reset acknowledgement
  useEffect(() => {
    if (!gameState?.recentEvents) return;
    const resolvedEvents = gameState.recentEvents.filter(e => e.type === "INTENT_RESOLVED");
    if (resolvedEvents.length > 0) {
      const lastEvent = resolvedEvents[resolvedEvents.length - 1];
      if (lastEvent.id !== lastEventId) {
        setLastEventId(lastEvent.id);
        setAcknowledged(false); // Reset when a new interaction is resolved
      }
    }
  }, [gameState?.recentEvents, lastEventId]);

  if (!scene || (!scene.interactionModel && !scene.dialogueSequence)) {
    return null;
  }

  // 1. Determine active intents list
  let availableIntents: InteractionIntent[] = [];
  let isDialogueSequence = false;
  let activeTurnIndex = 0;

  // If there are temporary intents from a failure branch, display those instead
  if (activeInteraction?.tempOptions && activeInteraction.tempOptions.length > 0) {
    availableIntents = activeInteraction.tempOptions;
  } else if (scene.dialogueSequence) {
    isDialogueSequence = true;
    activeTurnIndex = activeInteraction?.activeTurnIndex ?? 0;
    const turn = scene.dialogueSequence.turns[activeTurnIndex];
    if (turn) {
      availableIntents = turn.intents || [];
    }
  } else if (scene.interactionModel) {
    availableIntents = scene.interactionModel.intents || [];
  }

  // Find currently selected intent
  const selectedIntentId = activeInteraction?.selectedIntentId;
  const selectedIntent = selectedIntentId
    ? availableIntents.find(i => i.id === selectedIntentId) ||
      scene.interactionModel?.intents.find(i => i.id === selectedIntentId) ||
      scene.dialogueSequence?.turns.flatMap(t => t.intents).find(i => i.id === selectedIntentId)
    : undefined;

  // Find the latest resolved intent event for presentation
  const resolvedEvents = gameState.recentEvents.filter(e => e.type === "INTENT_RESOLVED");
  const lastResolvedEvent = resolvedEvents.length > 0 ? resolvedEvents[resolvedEvents.length - 1] : null;

  // Check if we have an active failure branch to display
  let activeFailureBranch: FailureBranch | undefined = undefined;
  const lastPayload = lastResolvedEvent?.payload;
  if (lastResolvedEvent && lastPayload && lastPayload.acceptedAsCorrect === false) {
    const attemptedIntentId = lastPayload.intentId as string;
    const attemptedIntent = scene.interactionModel?.intents.find(i => i.id === attemptedIntentId) ||
                            scene.dialogueSequence?.turns.flatMap(t => t.intents).find(i => i.id === attemptedIntentId);
    
    if (attemptedIntent && attemptedIntent.failureBranches) {
      activeFailureBranch = attemptedIntent.failureBranches.find(
        (b: any) => b.verdict === lastPayload.verdict
      );
    }
  }

  // Check if we have an active successful resolution to display
  let activeResolution: InteractionResolution | undefined = undefined;
  if (
    lastResolvedEvent &&
    lastPayload &&
    !acknowledged &&
    (lastPayload.acceptedAsCorrect === true || lastPayload.requiresLatin === false)
  ) {
    activeResolution = lastPayload.resolution as InteractionResolution | undefined;
  }

  const handleSelectIntent = (intentId: string) => {
    void submitIntent(intentId);
  };

  const handleSubmitText = (text: string) => {
    void submitText(text);
  };

  return (
    <section className="parchment-card interaction-loop-card p-6 rounded-2xl space-y-6 animate-fadeIn">
      {/* 2. Show active dialogue context header if in dialogue sequence */}
      {isDialogueSequence && scene.dialogueSequence && (
        <DialogueSequenceView
          dialogueSequence={scene.dialogueSequence}
          activeTurnIndex={activeTurnIndex}
        />
      )}

      {/* 3. Handle Selected Intent State (Latin composer) */}
      {selectedIntent ? (
        <div className="space-y-4 animate-fadeIn">
          <SelectedIntentPanel
            intent={selectedIntent}
            onClear={clearSelectedIntent}
          />

          {/* Show failure state if user failed last answer and is retrying */}
          {activeFailureBranch && activeInteraction?.selectedIntentId === selectedIntentId && (
            <FailureBranchPanel
              branch={activeFailureBranch}
              onRetry={clearSelectedIntent} // Or simple clear selection
            />
          )}

          <LatinActionComposer
            intent={selectedIntent}
            onSubmitText={handleSubmitText}
            isLoading={actionLoading}
          />
        </div>
      ) : (
        /* 4. Default State: Show results/consequences or the list of choices */
        <div className="space-y-4">
          {/* Show successful resolution result if present and not acknowledged */}
          {activeResolution && (
            <div className="space-y-4 animate-fadeIn">
              <ObservationResultCard resolution={activeResolution} />
              
              {/* Present consequences and Continue button */}
              <NextActionsPanel
                consequences={activeResolution.consequences}
                onContinue={() => setAcknowledged(true)}
              />
            </div>
          )}

          {/* Show failed evaluation details if retry is NOT allowed but there are narrative consequences */}
          {activeFailureBranch && !activeInteraction?.selectedIntentId && (
            <FailureBranchPanel
              branch={activeFailureBranch}
              onSelectIntent={handleSelectIntent}
              onRetry={clearSelectedIntent}
              className="animate-fadeIn"
            />
          )}

          {/* Render the interaction list only when there's no active resolution showing, 
              or if the resolution is acknowledged, or if we have temporary options (from a branch) */}
          {(!activeResolution || acknowledged || (activeInteraction?.tempOptions && activeInteraction.tempOptions.length > 0)) && (
            <InteractionIntentList
              intents={availableIntents}
              actionLoading={actionLoading}
              onSelectIntent={handleSelectIntent}
              className="animate-fadeIn"
            />
          )}
        </div>
      )}
    </section>
  );
};
