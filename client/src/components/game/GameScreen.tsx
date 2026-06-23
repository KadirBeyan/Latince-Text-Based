import { useGameStore } from "../../stores/gameStore";
import { ChoicePanel } from "./ChoicePanel";
import { DialogueLog } from "./DialogueLog";
import { FeedbackPanel } from "./FeedbackPanel";
import { LatinInput } from "./LatinInput";
import { ObjectiveCard } from "./ObjectiveCard";
import { ScenePanel } from "./ScenePanel";
import { DialogueStage } from "./dialogue/DialogueStage";
import { DialogueTransitionFeedback } from "./dialogue/DialogueTransitionFeedback";
import { SceneTransition } from "../cinematic/SceneTransition";
import { InteractionLoop } from "./interaction/InteractionLoop";
import {
  RevisitNotice,
  AmbientActionPanel,
  NpcMemoryReactionCard,
  SceneMemoryBadges,
  LivingSceneStatus
} from "./living/LivingScenePanels";

export function GameScreen() {
  const { gameState } = useGameStore();
  if (!gameState) {
    return null;
  }

  const mode = gameState.currentScene.inputMode;
  const hasInteraction = !!(gameState.currentScene.interactionModel || gameState.currentScene.dialogueSequence);
  
  const isDialogueMode = !hasInteraction && (mode === "dialogue-response" || mode === "hybrid-dialogue");
  const showChoices = !hasInteraction && !isDialogueMode && (mode === "choice" || mode === "hybrid") && gameState.availableChoices.length > 0;
  const showText = !hasInteraction && !isDialogueMode && (mode === "text" || mode === "hybrid");
  const showDialogue = gameState.dialogueLog.length > 0;

  return (
    <div className="game-screen">
      <SceneTransition>
        <RevisitNotice />
        <ScenePanel />
        <SceneMemoryBadges />
        <NpcMemoryReactionCard />
        <ObjectiveCard compact />
        <DialogueTransitionFeedback />
        {hasInteraction && <InteractionLoop />}
        {isDialogueMode && <DialogueStage />}
        {showText ? <LatinInput /> : null}
        {showChoices ? <ChoicePanel /> : null}
        <AmbientActionPanel />
        {!hasInteraction && !isDialogueMode && <FeedbackPanel />}
        {showDialogue ? <DialogueLog /> : null}
        <LivingSceneStatus />
      </SceneTransition>
    </div>
  );
}
