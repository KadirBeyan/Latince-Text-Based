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
import { VillageHub } from "../village/VillageHub";
import { ConversationStage } from "./conversation/ConversationStage";
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

  const LOCATION_SCENE_IDS = new Set([
    "vicus_001_home_morning",
    "vicus_002_village_path",
    "vicus_003_market_help",
    "vicus_004_field_edge",
    "vicus_005_teacher_corner",
    "vicus_006_veteran_bench",
    "vicus_007_scribe_table",
    "vicus_008_shrine"
  ]);

  const isVillageHubScene =
    gameState.currentChapter?.id === "vicus_prologue" &&
    !!gameState.villageLife &&
    LOCATION_SCENE_IDS.has(gameState.currentScene.id);

  if (isVillageHubScene) {
    return (
      <div className="game-screen">
        <SceneTransition>
          <VillageHub />
        </SceneTransition>
      </div>
    );
  }

  if (gameState.activeConversation) {
    return (
      <div className="game-screen">
        <SceneTransition>
          <ConversationStage />
        </SceneTransition>
      </div>
    );
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

